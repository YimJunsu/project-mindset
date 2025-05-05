package com.mindset.controller;

import com.mindset.model.request.MemoRequest;
import com.mindset.model.response.MemoResponse;
import com.mindset.service.MemoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // 생성
    @PostMapping("/save")
    public MemoResponse createMemo(@RequestBody  MemoRequest memoRequest){
        return memoService.createMemo(memoRequest);
    }

    // 수정은 없음.
    // 삭제
    @DeleteMapping("/{memoId}")
    public void deleteMemo(@PathVariable Long memoId){
        memoService.deleteMemo(memoId);
    }
}
