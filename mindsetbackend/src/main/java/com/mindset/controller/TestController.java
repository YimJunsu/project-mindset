package com.mindset.controller;

import com.mindset.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Repository
@RequestMapping("/api/test")
public class TestController {
    @Autowired private TestService testService;
    /**
     * 백엔드 연결 테스트 API
     * @return 연결 상태 메시지를 포함한 맵
     */
    @GetMapping
    public Map<String, String> testConnection() {
        // 비즈니스 로직을 Service 계층에 위임
        return testService.testConnection();
    }
}
