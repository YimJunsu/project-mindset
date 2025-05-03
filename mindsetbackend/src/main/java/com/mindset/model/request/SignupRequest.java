package com.mindset.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 회원가입 요청 데이터를 담는 DTO 클래스
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    private String email;           // 이메일 (로그인 아이디)
    private String password;        // 비밀번호
    private String nickname;        // 닉네임
    private String gender;          // 성별 (M, F)
    private String phone;           // 전화번호
    private String address;         // 기본 주소
    private String addressDetail;   // 상세 주소
    private String postCode;        // 우편번호
    private String profileImage;    // 프로필 이미지 URL
}