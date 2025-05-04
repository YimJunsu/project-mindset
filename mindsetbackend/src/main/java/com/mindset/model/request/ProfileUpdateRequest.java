package com.mindset.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    private String nickname;       // 닉네임
    private String phone;          // 전화번호
    private String address;        // 기본 주소
    private String addressDetail;  // 상세 주소
    private String postCode;       // 우편번호
}
