package com.mindset.controller;

import com.mindset.model.request.LoginRequest;
import com.mindset.model.request.SignupRequest;
import com.mindset.model.dto.User;
import com.mindset.model.response.AuthResponse;
import com.mindset.service.AuthService;
import com.mindset.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 인증 관련 요청을 처리하는 컨트롤러
 * 로그인, 회원가입 등의 인증 처리를 담당
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    @Autowired
    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    /**
     * 회원가입 처리
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest signupRequest) {
        // UserDto로 변환
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setPassword(signupRequest.getPassword());
        user.setNickname(signupRequest.getNickname());
        user.setGender(signupRequest.getGender());
        user.setPhone(signupRequest.getPhone());
        user.setAddress(signupRequest.getAddress());
        user.setAddressDetail(signupRequest.getAddressDetail());
        user.setPostCode(signupRequest.getPostCode());
        user.setProfileImage(signupRequest.getProfileImage());

        // 회원가입 처리 및 JWT 토큰 발급
        AuthResponse authResponse = authService.signup(user);

        return ResponseEntity.ok(authResponse);
    }

    /**
     * 로그인 처리
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        // 로그인 처리 및 JWT 토큰 발급
        AuthResponse authResponse = authService.login(loginRequest.getEmail(), loginRequest.getPassword());

        return ResponseEntity.ok(authResponse);
    }
}