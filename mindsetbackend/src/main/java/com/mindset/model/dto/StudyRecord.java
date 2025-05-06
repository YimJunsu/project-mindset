package com.mindset.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyRecord {
    private long recordId; // 공부 기록 PK
    private long userId; // 사용자 FK
    private String subject; // 과목
    private int duration; // 공부 시간 (분 단위)
    private LocalDateTime startTime; // 시작 시간
    private LocalDateTime endTime; // 종료 시간
    private String memo; // 공부 메모
    private LocalDateTime createdAt; // 생성일
}
