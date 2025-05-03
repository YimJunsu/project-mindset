package com.mindset.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 인증 응답 데이터를 담는 DTO 클래스
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;           // JWT 토큰
    private Long userId;            // 사용자 ID
    private String email;           // 사용자 이메일
    private String nickname;        // 사용자 닉네임
    private String profileImage;    // 프로필 이미지 URL
    private String role;            // 권한 역할
}