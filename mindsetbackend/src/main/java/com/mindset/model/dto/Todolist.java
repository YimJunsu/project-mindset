package com.mindset.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Todolist {
    private Long todoId;
    private Long userId;                // 작성자
    private String content;             // 내용
    private Boolean isCompleted;        // 완료여부
    private LocalDateTime completedAt;  // 완료시간
    private LocalDateTime createdAt;    // 생성일
}
