package com.mindset.controller;

import com.mindset.model.request.MemoRequest;
import com.mindset.model.response.MemoResponse;
import com.mindset.service.MemoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/memo")
@RequiredArgsConstructor
public class MemoController {

    private final MemoService memoService;

    // 전체 조회
    @GetMapping("/{userId}")
    public List<MemoResponse> getMemoByUser(@PathVariable Long userId){
        return memoService.getMemoByUser(userId);
    }

    // 상세 보기
    @GetMapping("/detail/{memoId}")
    public MemoResponse getMemo(@PathVariable Long memoId){
        return memoService.getMemo(memoId);
    }

    // 사용자 메모 개수 확인 (추가)
    @GetMapping("/count/{userId}")
    public ResponseEntity<Map<String, Object>> getMemoCount(@PathVariable Long userId) {
        int count = memoService.countUserMemos(userId);
        boolean canCreate = count < 2; // 2개 미만일 때만 생성 가능

        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        response.put("canCreate", canCreate);
        response.put("limit", 2); // 최대 제한 수

        return ResponseEntity.ok(response);
    }

    // 생성 (에러 핸들링 추가)
    @PostMapping("/save")
    public ResponseEntity<?> createMemo(@RequestBody MemoRequest memoRequest){
        try {
            MemoResponse response = memoService.createMemo(memoRequest);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    // 수정
    @PutMapping("/update/{memoId}")
    public MemoResponse updateMemo(@PathVariable Long memoId, @RequestBody MemoRequest memoRequest){
        // 경로의 memoId를 요청 객체에 설정
        memoRequest.setMemoId(memoId);
        return memoService.updateMemo(memoRequest);
    }

    // 삭제
    @DeleteMapping("/{memoId}")
    public void deleteMemo(@PathVariable Long memoId){
        memoService.deleteMemo(memoId);
    }

    // 예외 처리 (글로벌 예외 처리로 대체 가능)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getReason());
        return ResponseEntity.status(ex.getStatusCode()).body(errorResponse);
    }
}