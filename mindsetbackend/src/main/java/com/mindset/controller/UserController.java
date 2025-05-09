package com.mindset.controller;

import com.mindset.model.dto.User;
import com.mindset.model.request.ProfileUpdateRequest;
import com.mindset.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 현재 로그인한 사용자 정보 조회
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        log.info("현재 사용자 정보 요청 - 인증 이름: {}", email);

        // 이메일로 사용자 조회
        Optional<User> userByEmail = userService.findByEmail(email);

        // 이메일로 찾지 못한 경우 ID로 조회 시도 (소셜 로그인 사용자의 경우)
        if (userByEmail.isEmpty()) {
            log.info("이메일로 사용자를 찾지 못함. 소셜 로그인 사용자인지 확인: {}", email);

            // 데이터베이스에 저장된 모든 사용자 중에서 유사한 사용자를 찾아봅니다
            // 이 부분은 실제 프로덕션 환경에서는 성능 이슈가 있을 수 있으므로 주의해야 합니다
            User user = userService.findAllUsers().stream()
                    .filter(u -> u.getOauthProviderId() != null && email.contains(u.getOauthProviderId()))
                    .findFirst()
                    .orElseThrow(() -> {
                        log.error("사용자를 찾을 수 없음: {}", email);
                        return new RuntimeException("사용자를 찾을 수 없습니다.");
                    });

            log.info("소셜 로그인 사용자 찾음: {}, 제공자: {}", user.getEmail(), user.getOauthProvider());

            // 비밀번호 정보는 응답에서 제외
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }

        User user = userByEmail.get();
        log.info("사용자 찾음: {}", user.getEmail());

        // 비밀번호 정보는 응답에서 제외
        user.setPassword(null);

        return ResponseEntity.ok(user);
    }

    /**
     * 프로필 업데이트
     */
    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(@ModelAttribute ProfileUpdateRequest updateRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        log.info("프로필 업데이트 요청: {}", email);

        User updatedUser = userService.updateUser(updateRequest, email);

        // 비밀번호 정보는 응답에서 제외
        updatedUser.setPassword(null);

        return ResponseEntity.ok(updatedUser);
    }

    /**
     * 프로필 이미지 업로드
     */
    @PostMapping("/me/profile-image")
    public ResponseEntity<User> uploadProfileImage(@RequestParam("file") MultipartFile file) throws IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        log.info("프로필 이미지 업로드 요청: {}", email);

        User user = userService.uploadProfileImage(file, email);

        // 비밀번호 정보는 응답에서 제외
        user.setPassword(null);

        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(Principal principal) {
        String userIdentifier = principal.getName();
        log.info("계정 삭제 요청: {}", userIdentifier);

        try {
            userService.deleteUser(userIdentifier);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("계정 삭제 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}