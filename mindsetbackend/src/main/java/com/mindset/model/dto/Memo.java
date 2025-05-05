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
public class Memo {
    private Long memoId;        // 메모 ID
    private Long userId;        // 유저(작성자)FK
    private String title;       // 제목
    private String content;     // 내용
    private String category;    // 카테고리
    private LocalDateTime createdAt;
}
