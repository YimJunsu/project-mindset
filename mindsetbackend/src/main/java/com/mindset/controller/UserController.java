package com.mindset.controller;

import com.mindset.model.dto.User;
import com.mindset.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 전체 회원 조회
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // 이메일로 회원 조회
    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    // 회원 가입
    @PostMapping
    public void createUser(@RequestBody User user) {
        userService.createUser(user);
    }

    // 회원 정보 수정
    @PutMapping
    public void updateUser(@RequestBody User user) {
        userService.updateUser(user);
    }

    // 회원 삭제
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
    }
}
