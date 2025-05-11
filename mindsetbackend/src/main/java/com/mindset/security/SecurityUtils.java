package com.mindset.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.mindset.exception.NotAuthenticatedException;
import com.mindset.model.dto.User;
import com.mindset.security.oauth2.CustomOAuth2User;
import com.mindset.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserService userService;

    /**
     * 현재 인증된 사용자의 ID를 반환합니다.
     *
     * @return 현재 인증된 사용자의 ID
     * @throws NotAuthenticatedException 인증되지 않은 경우 발생
     */
    public Long getCurrentUserId() {
        User currentUser = getCurrentUser();
        return currentUser.getUserId();
    }

    /**
     * 현재 인증된 사용자 정보를 반환합니다.
     *
     * @return 현재 인증된 사용자 정보
     * @throws NotAuthenticatedException 인증되지 않은 경우 발생
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {
            throw new NotAuthenticatedException("인증된 사용자 정보가 없습니다.");
        }

        Object principal = authentication.getPrincipal();

        // OAuth2 인증인 경우
        if (principal instanceof CustomOAuth2User) {
            CustomOAuth2User oAuth2User = (CustomOAuth2User) principal;
            String email = oAuth2User.getEmail();
            log.debug("OAuth2 인증 사용자: {}", email);

            // UserService를 통해 이메일로 사용자 정보 조회
            return userService.findByEmail(email)
                    .orElseThrow(() -> new NotAuthenticatedException("OAuth2 사용자 정보를 찾을 수 없습니다: " + email));
        }

        // JWT 기반 인증인 경우 (UserDetails)
        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            String username = userDetails.getUsername();
            log.debug("JWT 인증 사용자: {}", username);

            // 1. 먼저 이메일로 조회 시도
            User user = userService.findByEmail(username).orElse(null);

            // 2. 이메일로 찾지 못한 경우, OAuth ID로 조회 시도
            if (user == null) {
                // KAKAO나 NAVER 등 모든 OAuth 제공자에 대해 조회
                user = userService.findByOAuth("KAKAO", username).orElse(null);
                if (user == null) {
                    user = userService.findByOAuth("NAVER", username).orElse(null);
                }
            }

            // 3. 그래도 찾지 못한 경우 모든 사용자를 조회하여 OAuth Provider ID로 필터링
            if (user == null) {
                user = userService.findAllUsers().stream()
                        .filter(u -> username.equals(u.getOauthProviderId()))
                        .findFirst()
                        .orElse(null);
            }

            if (user == null) {
                throw new NotAuthenticatedException("사용자 정보를 찾을 수 없습니다: " + username);
            }

            return user;
        }

        log.warn("지원하지 않는 인증 타입: {}", principal.getClass().getName());
        throw new NotAuthenticatedException("지원하지 않는 인증 방식입니다.");
    }
}