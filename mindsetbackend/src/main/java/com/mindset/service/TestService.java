package com.mindset.service;

import com.mindset.mapper.TestMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class TestService {
    @Autowired private TestMapper testMapper;

    public Map<String, String> testConnection() {
        // MyBatis 매퍼를 통해 DB 연결 테스트
        return testMapper.testConnection();
    }
}
