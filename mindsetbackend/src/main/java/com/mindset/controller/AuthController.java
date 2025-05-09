package com.mindset.controller;

import com.mindset.model.response.AuthResponse;
import com.mindset.model.request.LoginRequest;
import com.mindset.model.request.SignupRequest;
import com.mindset.model.dto.User;
import com.mindset.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 회원가입 처리
     */
    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody SignupRequest signupRequest) {
        log.info("회원가입 요청: {}", signupRequest.getEmail());

        // SignupRequest를 User로 변환
        User user = User.builder()
                .email(signupRequest.getEmail())
                .password(signupRequest.getPassword())
                .nickname(signupRequest.getNickname())
                .gender(signupRequest.getGender())
                .phone(signupRequest.getPhone())
                .address(signupRequest.getAddress())
                .addressDetail(signupRequest.getAddressDetail())
                .postCode(signupRequest.getPostCode())
                .build();

        // 회원가입 처리
        User savedUser = authService.signup(user);

        // 비밀번호는 응답에서 제외
        savedUser.setPassword(null);

        return ResponseEntity.ok(savedUser);
    }

    /**
     * 로그인 처리
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        log.info("로그인 요청: {}", loginRequest.getEmail());

        // 로그인 처리 및 JWT 토큰 발급
        AuthResponse authResponse = authService.login(loginRequest.getEmail(), loginRequest.getPassword());

        return ResponseEntity.ok(authResponse);
    }

    // OAuth2 로그인 URL 엔드포인트
    @GetMapping("/oauth2/kakao/login")
    public ResponseEntity<String> getKakaoLoginUrl() {
        String loginUrl = "/oauth2/authorization/kakao";
        log.info("카카오 로그인 URL 요청: {}", loginUrl);
        return ResponseEntity.ok(loginUrl);
    }

    @GetMapping("/oauth2/naver/login")
    public ResponseEntity<String> getNaverLoginUrl() {
        String loginUrl = "/oauth2/authorization/naver";
        log.info("네이버 로그인 URL 요청: {}", loginUrl);
        return ResponseEntity.ok(loginUrl);
    }
}