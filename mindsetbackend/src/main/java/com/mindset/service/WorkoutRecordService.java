package com.mindset.service;

import com.mindset.mapper.WorkoutRecordMapper;
import com.mindset.model.dto.WorkoutRecord;
import com.mindset.model.request.WorkoutRecordRequest;
import com.mindset.model.response.WorkoutRecordResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutRecordService {

    private final WorkoutRecordMapper workRecordMapper;

    // 생성
    public WorkoutRecordResponse createWorkRecord(WorkoutRecordRequest workoutRecordRequest) {
        // WorkoutRecord 객체 생성
        WorkoutRecord workoutRecord = new WorkoutRecord();

        // workoutRecordRequest에서 값을 가져와 workoutRecord에 설정
        workoutRecord.setUserId(workoutRecordRequest.getUserId());
        workoutRecord.setWorkoutType(workoutRecordRequest.getWorkoutType());
        workoutRecord.setDuration(workoutRecordRequest.getDuration());
        workoutRecord.setCalories(workoutRecordRequest.getCalories());
        workoutRecord.setWorkoutDate(workoutRecordRequest.getWorkoutDate());
        workoutRecord.setMemo(workoutRecordRequest.getMemo());
        workoutRecord.setCreatedAt(LocalDateTime.now()); // 생성 시간을 현재 시간으로 설정

        // DB에 데이터 저장
        workRecordMapper.createWorkRecord(workoutRecord);

        // 응답 생성
        return WorkoutRecordResponse.builder()
                .workoutRecord(workoutRecord)
                .build();
    }

    // 전체 조회
    public List<WorkoutRecordResponse> getWorkRecordByUser(Long userId){
        List<WorkoutRecord> workoutRecordList = workRecordMapper.findAllByUserId(userId);
        List<WorkoutRecordResponse> workoutRecordResponses = new ArrayList<>();

        for(WorkoutRecord workoutRecord : workoutRecordList) {
            workoutRecordResponses.add(new WorkoutRecordResponse(workoutRecord));
        }
        return workoutRecordResponses;
    }

    // 상세 보기
    public WorkoutRecordResponse getWorkRecord(Long recordId){
        WorkoutRecord workoutRecord = workRecordMapper.findByWorkRecordId(recordId);
        return new WorkoutRecordResponse(workoutRecord);
    }

    // 삭제
    public void deleteWorkRecord(Long recordId){
        workRecordMapper.deleteWorkRecord(recordId);
    }
}