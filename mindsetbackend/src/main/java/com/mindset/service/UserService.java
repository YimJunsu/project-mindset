package com.mindset.service;

import com.mindset.mapper.UserMapper;
import com.mindset.model.request.ProfileUpdateRequest;
import com.mindset.model.dto.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserMapper userMapper;

    /**
     * 이메일로 사용자 조회
     */
    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(userMapper.findByEmail(email));
    }

    /**
     * 사용자 ID로 사용자 조회
     */
    public Optional<User> findById(Long userId) {
        return Optional.ofNullable(userMapper.findById(userId));
    }

    /**
     * 사용자 등록 (회원가입)
     */
    @Transactional
    public User createUser(User user) {
        // 이메일 중복 확인
        if (userMapper.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("이미 사용 중인 이메일입니다: " + user.getEmail());
        }

        // 프로필 이미지가 없으면 기본 이미지 설정
        if (user.getProfileImage() == null || user.getProfileImage().isEmpty()) {
            user.setProfileImage("default.png");
        }

        // 사용자 저장
        userMapper.save(user);

        return user;
    }

    /**
     * 사용자 정보 업데이트
     */
    @Transactional
    public User updateUser(ProfileUpdateRequest updateRequest, String email) {
        User user = userMapper.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email);
        }

        // 업데이트할 정보 설정
        user.setNickname(updateRequest.getNickname());
        user.setPhone(updateRequest.getPhone());
        user.setAddress(updateRequest.getAddress());
        user.setAddressDetail(updateRequest.getAddressDetail());
        user.setPostCode(updateRequest.getPostCode());

        // 업데이트 실행
        userMapper.update(user);

        return user;
    }

    /**
     * 사용자 계정 삭제
     */
    @Transactional
    public void deleteUser(String email) {
        User user = userMapper.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email);
        }

        userMapper.deleteById(user.getUserId());
    }

    /**
     * Spring Security 인증용 사용자 상세정보 조회
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
}