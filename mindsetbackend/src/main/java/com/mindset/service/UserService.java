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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

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
     * OAuth 제공자와 제공자 ID로 사용자 조회
     */
    public Optional<User> findByOAuth(String provider, String providerId) {
        return Optional.ofNullable(userMapper.findByOAuth(provider, providerId));
    }

    /**
     * 모든 사용자 조회 (관리자 기능 또는 내부 사용)
     */
    public List<User> findAllUsers() {
        return userMapper.findAll();
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
     * OAuth 사용자 생성
     */
    @Transactional
    public User createOAuthUser(User user) {
        // 이메일 중복 확인
        User existingUser = userMapper.findByEmail(user.getEmail());
        if (existingUser != null) {
            // 이미 존재하는 사용자인 경우 OAuth 정보 업데이트
            log.info("기존 계정에 OAuth 정보 연결: {}", user.getEmail());
            existingUser.setOauthProvider(user.getOauthProvider());
            existingUser.setOauthProviderId(user.getOauthProviderId());
            if (user.getProfileImage() != null && !user.getProfileImage().isEmpty()) {
                existingUser.setProfileImage(user.getProfileImage());
            }
            userMapper.updateOAuthInfo(existingUser);
            return existingUser;
        }

        // OAuth 사용자용 더미 비밀번호 설정 (NULL이면 안됨)
        String dummyPassword = "OAUTH_USER_" + System.currentTimeMillis();
        String encodedPassword = passwordEncoder.encode(dummyPassword);
        user.setPassword(encodedPassword);

        log.debug("OAuth 사용자 생성 - 비밀번호 설정: {}, 인코딩된 비밀번호 길이: {}",
                dummyPassword, encodedPassword.length());

        // 기본값 설정
        if (user.getGender() == null) {
            user.setGender("N");
        }

        // 빈 문자열로 기본값 설정 (NULL이면 안됨)
        if (user.getPhone() == null) user.setPhone("");
        if (user.getAddress() == null) user.setAddress("");
        if (user.getAddressDetail() == null) user.setAddressDetail("");
        if (user.getPostCode() == null) user.setPostCode("");

        // 프로필 이미지가 없으면 기본 이미지 설정
        if (user.getProfileImage() == null || user.getProfileImage().isEmpty()) {
            user.setProfileImage("default.png");
        }

        // 기본 역할 설정 (없는 경우)
        if (user.getRole() == null) {
            user.setRole("ROLE_USER");
        }

        // 사용자 저장 전 모든 필드 로깅
        log.info("OAuth 사용자 생성 시도 - 이메일: {}, 비밀번호 null?: {}, 닉네임: {}, 성별: {}, 전화번호: {}, 주소: {}, 상세주소: {}, 우편번호: {}, 프로필이미지: {}, 역할: {}, OAuth제공자: {}, OAuth제공자ID: {}",
                user.getEmail(),
                user.getPassword() == null,
                user.getNickname(),
                user.getGender(),
                user.getPhone(),
                user.getAddress(),
                user.getAddressDetail(),
                user.getPostCode(),
                user.getProfileImage(),
                user.getRole(),
                user.getOauthProvider(),
                user.getOauthProviderId());

        // 사용자 저장
        try {
            int result = userMapper.saveOAuthUser(user);
            log.info("OAuth 사용자 생성 완료: {}, 결과: {}", user.getEmail(), result);
        } catch (Exception e) {
            log.error("OAuth 사용자 생성 실패: {}", e.getMessage(), e);
            throw e;
        }

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
     * OAuth 사용자 정보 업데이트 (User 객체 버전)
     */
    @Transactional
    public User updateOAuthUser(User user) {
        userMapper.updateOAuthInfo(user);
        log.info("OAuth 사용자 정보 업데이트 완료: {}", user.getEmail());
        return user;
    }

    /**
     * OAuth 사용자 정보 업데이트 (개별 파라미터 버전)
     */
    @Transactional
    public User updateOAuthUser(Long userId, String nickname, String provider, String providerId) {
        User user = findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));

        // 닉네임 업데이트 (변경된 경우에만)
        if (nickname != null && !nickname.equals(user.getNickname())) {
            user.setNickname(nickname);
        }

        // OAuth 제공자 정보 업데이트
        user.setOauthProvider(provider);
        user.setOauthProviderId(providerId);

        // 업데이트 실행
        userMapper.updateOAuthInfo(user);

        return user;
    }



    /**
     * 프로필 이미지 업로드
     */
    @Transactional
    public User uploadProfileImage(MultipartFile file, String email) throws IOException {
        User user = userMapper.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email);
        }

        // 파일 저장 경로
        String uploadDir = "uploads/profile-images";
        File uploadPath = new File(uploadDir);

        if (!uploadPath.exists()) {
            uploadPath.mkdirs();
        }

        // 원본 파일명에서 확장자 추출
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // 파일명 생성 (사용자 ID + 타임스탬프 + 확장자)
        String fileName = user.getUserId() + "_" + System.currentTimeMillis() + fileExtension;
        String filePath = uploadDir + "/" + fileName;

        // 파일 저장
        File dest = new File(uploadPath.getAbsolutePath() + "/" + fileName);
        file.transferTo(dest);

        // 사용자 프로필 이미지 경로 업데이트
        user.setProfileImage(fileName);
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