package com.mindset.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    private String nickname;
    private String gender;
    private String phone;
    private String address;
    private String addressDetail;
    private String postCode;
    private MultipartFile profileImage; // 프로필 이미지 파일 (선택 사항)
}