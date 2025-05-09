package com.mindset.service;

import com.mindset.model.response.AuthResponse;
import com.mindset.model.dto.User;
import com.mindset.security.JwtTokenProvider;
import com.mindset.security.oauth2.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    /**
     * 회원가입 처리
     */
    @Transactional
    public User signup(User user) {
        // 비밀번호 암호화
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 기본 역할 설정
        user.setRole("ROLE_USER");

        // 사용자 등록
        return userService.createUser(user);
    }

    /**
     * 일반 로그인 처리
     */
    public AuthResponse login(String email, String password) {
        // 인증 처리
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        // JWT 토큰 생성
        String jwt = jwtTokenProvider.createToken(authentication);

        // 사용자 정보 조회
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 응답 생성
        return AuthResponse.builder()
                .token(jwt)
                .userId(user.getUserId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .role(user.getRole())
                .build();
    }

    /**
     * OAuth 로그인 성공 후 처리
     */
    @Transactional
    public AuthResponse loginOAuth(CustomOAuth2User oAuth2User, Authentication authentication) {
        // OAuth 정보로 사용자 조회 또는 생성
        User user = processOAuthUser(oAuth2User);

        // JWT 토큰 생성
        String jwt = jwtTokenProvider.createToken(authentication);

        // 응답 생성
        return AuthResponse.builder()
                .token(jwt)
                .userId(user.getUserId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .role(user.getRole())
                .build();
    }

    /**
     * OAuth 사용자 정보 처리
     */
    private User processOAuthUser(CustomOAuth2User oAuth2User) {
        String email = oAuth2User.getEmail();
        String nickname = oAuth2User.getNickname();
        String provider = oAuth2User.getProvider();
        String providerId = oAuth2User.getId();

        log.info("OAuth 사용자 정보 처리 - Email: {}, Provider: {}", email, provider);

        // 이메일로 사용자 조회
        return userService.findByEmail(email)
                .map(existingUser -> {
                    // 기존 사용자가 있으면 OAuth 정보 업데이트
                    log.info("기존 사용자 OAuth 정보 업데이트: {}", email);
                    return userService.updateOAuthUser(existingUser.getUserId(), nickname, provider, providerId);
                })
                .orElseGet(() -> {
                    // 새 사용자 생성
                    log.info("새 OAuth 사용자 생성: {}", email);
                    User newUser = User.builder()
                            .email(email)
                            .nickname(nickname)
                            .oauthProvider(provider)
                            .oauthProviderId(providerId)
                            .role("ROLE_USER")
                            .build();
                    return userService.createOAuthUser(newUser);
                });
    }
}