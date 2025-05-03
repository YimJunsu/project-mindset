package com.mindset.mapper;

import com.mindset.model.dto.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {

    // 회원 전체 조회
    List<User> findAll();

    // 이메일로 회원 조회
    User findByEmail(String email);

    // 회원 등록
    void save(User user);

    // 회원 수정
    void update(User user);

    // 회원 삭제
    void deleteById(Long userId);
}
