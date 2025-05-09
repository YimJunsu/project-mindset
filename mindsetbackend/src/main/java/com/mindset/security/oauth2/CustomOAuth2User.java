package com.mindset.security.oauth2;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

// OAuth2 유저 커스텀
@Data
@Builder
@AllArgsConstructor
public class CustomOAuth2User implements OAuth2User {
    private final String id;
    private final String email;
    private final String nickname;
    private final String provider;
    private final String profileImage; // 추가: 프로필 이미지 URL
    private final Map<String, Object> attributes;
    private final Collection<? extends GrantedAuthority> authorities;

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getName() {
        return id;
    }
}