package com.mindset.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TodolistRequest {
    private Long todoId;    // Todo ID (업데이트 또는 삭제 시 필요)
    private Long userId;    // 사용자의 ID
    private String content; // Todo 내용 (업데이트 시 사용)
    private Boolean isCompleted; // 완료 여부
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
}
