package com.mindset.mapper;

import com.mindset.model.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    // 사용자 조회
    User findByEmail(String email);
    User findById(Long userId);
    User findByOAuth(@Param("provider") String provider, @Param("providerId") String providerId);
    List<User> findAll();

    // 사용자 저장
    int save(User user);
    int saveOAuthUser(User user);

    // 사용자 수정
    int update(User user);
    int updateOAuthInfo(User user);

    // 사용자 삭제
    int deleteById(Long userId);
}