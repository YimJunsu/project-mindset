package com.mindset.model.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 사용자 데이터 전송 객체
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long userId;           // 사용자 ID
    private String email;          // 이메일 (로그인 아이디)
    private String password;       // 비밀번호 (요청 시에만 사용, 응답에는 포함되지 않음)
    private String nickname;       // 닉네임
    private String gender;         // 성별 (M, F)
    private String phone;          // 전화번호
    private String address;        // 기본 주소
    private String addressDetail;  // 상세 주소
    private String postCode;       // 우편번호
    private String profileImage;   // 프로필 이미지 URL
    private String role;           // 권한 역할
    private LocalDateTime createdAt;    // 계정 생성일
    private LocalDateTime updatedAt;    // 정보 수정일
}