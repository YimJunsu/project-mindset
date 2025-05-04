package com.mindset.mapper;

import com.mindset.model.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {
    // 이메일로 사용자 조회
    User findByEmail(@Param("email") String email);

    // ID로 사용자 조회
    User findById(@Param("userId") Long userId);

    // 모든 사용자 조회
    List<User> findAll();

    // 사용자 정보 등록
    int save(User user);

    // 사용자 정보 수정
    int update(User user);

    // 사용자 삭제
    int deleteById(@Param("userId") Long userId);
}