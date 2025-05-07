package com.mindset.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutRecordRequest {
    private long workoutId;          // 운동 기록 PK (수정이나 삭제 시 필요)
    private long userId;            // 사용자 FK
    private String workoutType;     // 운동 종류 (예: "Running", "Cycling")
    private int duration;           // 운동 시간 (분 단위)
    private int calories;           // 소모된 칼로리 양
    private LocalDate workoutDate;  // 운동한 날짜
    private String memo;            // 운동 메모
    private LocalDateTime createdAt;// 운동 기록 생성일 (추가된 시간, 필요할 때)
}

