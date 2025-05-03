package com.mindset.service;

import com.mindset.mapper.UserMapper;
import com.mindset.model.dto.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 사용자 관련 서비스
 */
@Service
public class UserService implements UserDetailsService {

    private final UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    /**
     * 전체 사용자 목록 조회
     */
    public List<User> getAllUsers() {
        List<User> users = userMapper.findAll();
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 이메일로 사용자 조회
     */
    public User getUserByEmail(String email) {
        User user = userMapper.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email);
        }
        return convertToDto(user);
    }

    /**
     * 회원 가입
     */
    public User createUser(User userDto) {
        // 이메일 중복 확인
        User existingUser = userMapper.findByEmail(userDto.getEmail());
        if (existingUser != null) {
            throw new RuntimeException("이미 사용 중인 이메일입니다: " + userDto.getEmail());
        }

        User user = convertToEntity(userDto);
        userMapper.save(user);

        // 저장된 사용자 ID 설정
        userDto.setUserId(user.getUserId());
        return userDto;
    }

    /**
     * 회원 정보 수정
     */
    public void updateUser(User userDto) {
        User user = convertToEntity(userDto);
        userMapper.update(user);
    }

    /**
     * 회원 삭제
     */
    public void deleteUser(Long userId) {
        userMapper.deleteById(userId);
    }

    /**
     * 인증을 위한 사용자 정보 로드
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userMapper.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email);
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }

    /**
     * Entity를 DTO로 변환
     */
    private User convertToDto(User user) {
        User userDto = new User();
        userDto.setUserId(user.getUserId());
        userDto.setEmail(user.getEmail());
        // 보안상 비밀번호는 DTO에 포함하지 않음
        userDto.setNickname(user.getNickname());
        userDto.setGender(user.getGender());
        userDto.setPhone(user.getPhone());
        userDto.setAddress(user.getAddress());
        userDto.setAddressDetail(user.getAddressDetail());
        userDto.setPostCode(user.getPostCode());
        userDto.setProfileImage(user.getProfileImage());
        userDto.setRole(user.getRole());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setUpdatedAt(user.getUpdatedAt());
        return userDto;
    }

    /**
     * DTO를 Entity로 변환
     */
    private User convertToEntity(User userDto) {
        User user = new User();
        user.setUserId(userDto.getUserId());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setNickname(userDto.getNickname());
        user.setGender(userDto.getGender());
        user.setPhone(userDto.getPhone());
        user.setAddress(userDto.getAddress());
        user.setAddressDetail(userDto.getAddressDetail());
        user.setPostCode(userDto.getPostCode());
        user.setProfileImage(userDto.getProfileImage());
        user.setRole(userDto.getRole());
        return user;
    }
}