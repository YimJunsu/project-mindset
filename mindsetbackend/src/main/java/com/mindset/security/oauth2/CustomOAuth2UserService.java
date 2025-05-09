package com.mindset.security.oauth2;

import java.util.Collections;
import java.util.Map;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // OAuth2 제공자 (kakao, naver 등)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.info("OAuth2 제공자: {}", registrationId);

        return processOAuth2User(registrationId, oAuth2User);
    }

    private CustomOAuth2User processOAuth2User(String provider, OAuth2User oAuth2User) {
        if ("kakao".equals(provider)) {
            return processKakaoUser(oAuth2User);
        } else if ("naver".equals(provider)) {
            return processNaverUser(oAuth2User);
        }

        throw new OAuth2AuthenticationException("지원하지 않는 OAuth2 제공자: " + provider);
    }

    @SuppressWarnings("unchecked")
    private CustomOAuth2User processKakaoUser(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> kakaoProfile = (Map<String, Object>) kakaoAccount.get("profile");

        String id = attributes.get("id").toString();
        String email = (String) kakaoAccount.getOrDefault("email", id + "@kakao.com");
        String nickname = (String) kakaoProfile.get("nickname");

        // 프로필 이미지 URL 추출
        String profileImage = null;
        if (kakaoProfile.containsKey("profile_image_url")) {
            profileImage = (String) kakaoProfile.get("profile_image_url");
        }

        log.info("카카오 사용자 정보 - ID: {}, Email: {}, Nickname: {}, ProfileImage: {}",
                id, email, nickname, profileImage);

        return CustomOAuth2User.builder()
                .id(id)
                .email(email)
                .nickname(nickname)
                .provider("KAKAO")
                .profileImage(profileImage) // 프로필 이미지 URL 설정
                .attributes(attributes)
                .authorities(Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")))
                .build();
    }

    private CustomOAuth2User processNaverUser(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");

        String id = (String) response.get("id");
        String email = (String) response.get("email");
        String nickname = (String) response.get("nickname");

        // 프로필 이미지 URL 추출
        String profileImage = null;
        if (response.containsKey("profile_image")) {
            profileImage = (String) response.get("profile_image");
        }

        log.info("네이버 사용자 정보 - ID: {}, Email: {}, Nickname: {}, ProfileImage: {}",
                id, email, nickname, profileImage);

        return CustomOAuth2User.builder()
                .id(id)
                .email(email)
                .nickname(nickname)
                .provider("NAVER")
                .profileImage(profileImage) // 프로필 이미지 URL 설정
                .attributes(attributes)
                .authorities(Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")))
                .build();
    }
}