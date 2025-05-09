package com.mindset.security.oauth2;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.mindset.model.dto.User;
import com.mindset.security.JwtTokenProvider;
import com.mindset.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    // 클라이언트 리다이렉트 URL (프론트엔드에서 OAuth 콜백을 처리할 URL)
    private final String redirectUri = "http://localhost:5173/oauth/callback";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        log.info("OAuth2 로그인 성공: {}", authentication.getName());

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        // 사용자 정보 처리 (DB 저장 또는 업데이트)
        User user = saveOrUpdateUser(oAuth2User);

        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(authentication);

        log.debug("생성된 JWT 토큰: {}", token);
        log.debug("사용자 정보: ID={}, Email={}, OAuthProviderId={}",
                user.getUserId(), user.getEmail(), user.getOauthProviderId());

        // 닉네임과 이메일 URL 인코딩
        String encodedEmail = URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8.toString());
        String encodedNickname = URLEncoder.encode(user.getNickname(), StandardCharsets.UTF_8.toString());

        // 프론트엔드로 토큰과 함께 리다이렉트
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .queryParam("userId", user.getUserId())
                .queryParam("email", encodedEmail)
                .queryParam("nickname", encodedNickname)
                .build()
                .toUriString();

        log.info("리다이렉트 URL: {}", targetUrl);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private User saveOrUpdateUser(CustomOAuth2User oAuth2User) {
        // OAuth 제공자에서 가져온 정보로 사용자 생성 또는 업데이트
        String email = oAuth2User.getEmail();
        String nickname = oAuth2User.getNickname();
        String provider = oAuth2User.getProvider();
        String providerId = oAuth2User.getId();
        String profileImage = oAuth2User.getProfileImage(); // 프로필 이미지 URL (있을 경우)

        log.info("OAuth 사용자 정보 - Email: {}, Nickname: {}, ProviderId: {}",
                email, nickname, providerId);

        // 이메일로 사용자 조회
        return userService.findByEmail(email)
                .map(existingUser -> {
                    // 기존 사용자가 있으면 정보 업데이트
                    log.info("기존 사용자 업데이트: {}", email);
                    if (profileImage != null && !profileImage.isEmpty()) {
                        // 프로필 이미지가 있으면 업데이트
                        existingUser.setProfileImage(profileImage);
                    }
                    existingUser.setOauthProvider(provider);
                    existingUser.setOauthProviderId(providerId);
                    return userService.updateOAuthUser(existingUser);
                })
                .orElseGet(() -> {
                    // 새 사용자 생성
                    log.info("새 OAuth 사용자 생성: {}", email);
                    User newUser = User.builder()
                            .email(email)
                            .nickname(nickname)
                            // 비밀번호는 UserService에서 설정됨
                            .oauthProvider(provider)
                            .oauthProviderId(providerId)
                            .role("ROLE_USER")
                            .gender("N") // 성별 정보 없음
                            .profileImage(profileImage) // 프로필 이미지 설정
                            .build();
                    return userService.createOAuthUser(newUser);
                });
    }
}