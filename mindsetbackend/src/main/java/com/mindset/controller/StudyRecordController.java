package com.mindset.controller;

import com.mindset.model.request.StudyRecordRequest;
import com.mindset.model.response.StudyRecordResponse;
import com.mindset.service.StudyRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studyrecord")
@RequiredArgsConstructor
public class StudyRecordController {

    private final StudyRecordService studyRecordService;

    // 생성
    @PostMapping("/save")
    public StudyRecordResponse createStudyRecord(@RequestBody StudyRecordRequest studyRecordRequest) {
        return studyRecordService.createStudyRecord(studyRecordRequest);
    }

    // 전체 조회 (사용자별)
    @GetMapping("/{userId}")
    public List<StudyRecordResponse> getStudyRecordsByUser(@PathVariable Long userId) {
        return studyRecordService.getStudyRecordsByUser(userId);
    }

    // 상세 조회
    @GetMapping("/detail/{recordId}")
    public StudyRecordResponse getStudyRecord(@PathVariable Long recordId) {
        return studyRecordService.getStudyRecord(recordId);
    }

    // 삭제
    @DeleteMapping("/{recordId}")
    public void deleteStudyRecord(@PathVariable Long recordId) {
        studyRecordService.deleteStudyRecord(recordId);
    }
}
