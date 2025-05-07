package com.mindset.controller;

import com.mindset.model.request.WorkoutRecordRequest;
import com.mindset.model.response.WorkoutRecordResponse;
import com.mindset.service.WorkoutRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workoutrecord")
@RequiredArgsConstructor
public class WorkoutRecordController {
    private final WorkoutRecordService workRecordService;
    // 생성
    @PostMapping("/save")
    public WorkoutRecordResponse createWorkRecord(@RequestBody WorkoutRecordRequest workoutRecordRequest){
        return workRecordService.createWorkRecord(workoutRecordRequest);
    }
    // 전체 조회
    @GetMapping("/{userId}")
    public List<WorkoutRecordResponse> getWorkRecordByUser(@PathVariable Long userId){
        return workRecordService.getWorkRecordByUser(userId);
    }
    // 상세 보기
    @GetMapping("/detail/{workoutId}")
    public WorkoutRecordResponse getWorkRecord(@PathVariable Long workoutId){
        return workRecordService.getWorkRecord(workoutId);
    }
    // 수정은 없음.
    // 삭제
    @DeleteMapping("/{workoutId}")
    public void deleteWorkRecord(@PathVariable Long workoutId){
        workRecordService.deleteWorkRecord(workoutId);
    }
}
