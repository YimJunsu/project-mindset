package com.mindset.controller;

import com.mindset.model.request.ProfileUpdateRequest;
import com.mindset.model.dto.User;
import com.mindset.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 내 프로필 정보 조회
     */
    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("프로필 조회 요청: {}", userDetails.getUsername());

        return userService.findByEmail(userDetails.getUsername())
                .map(user -> {
                    // 비밀번호는 응답에서 제외
                    user.setPassword(null);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 프로필 정보 수정
     */
    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProfileUpdateRequest updateRequest) {
        log.info("프로필 업데이트 요청: {}", userDetails.getUsername());

        try {
            User updatedUser = userService.updateUser(updateRequest, userDetails.getUsername());

            // 비밀번호는 응답에서 제외
            updatedUser.setPassword(null);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            log.error("프로필 업데이트 중 오류 발생:", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 회원 탈퇴
     */
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("계정 삭제 요청: {}", userDetails.getUsername());

        try {
            userService.deleteUser(userDetails.getUsername());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("계정 삭제 중 오류 발생:", e);
            return ResponseEntity.badRequest().build();
        }
    }
}