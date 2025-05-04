package com.mindset.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class FileService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${file.profile-image-dir:profile-images}")
    private String profileImageDir;

    /**
     * 프로필 이미지 저장
     */
    public String saveProfileImage(MultipartFile file, Long userId) throws IOException {
        // 업로드 디렉토리 생성
        String directory = uploadDir + File.separator + profileImageDir;
        Path directoryPath = Paths.get(directory);
        if (!Files.exists(directoryPath)) {
            Files.createDirectories(directoryPath);
        }

        // 원본 파일명에서 확장자 추출
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // 고유한 파일명 생성 (사용자 ID + UUID + 확장자)
        String newFileName = userId + "_" + UUID.randomUUID().toString() + extension;
        String filePath = directory + File.separator + newFileName;

        // 파일 저장
        file.transferTo(new File(filePath));

        // 파일 접근 URL 반환 (상대 경로)
        return profileImageDir + "/" + newFileName;
    }

    /**
     * 기존 파일 삭제
     */
    public boolean deleteFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return false;
        }

        Path path = Paths.get(uploadDir + File.separator + filePath);
        try {
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            log.error("파일 삭제 실패: {}", e.getMessage());
            return false;
        }
    }
}