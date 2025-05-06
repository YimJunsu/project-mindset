package com.mindset.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutRecord {
    private long recordId; // 운동 기록 PK
    private long userId; // 사용자 FK
    private String workoutType; // 운동 종류
    private int duration; // 운동 시간 (분 단위)
    private int calories; // 소모된 칼로리 양
    private LocalDate workoutDate; // 운동한 날짜
    private String memo; // 운동 메모
    private LocalDateTime createdAt; // 생성일
}
