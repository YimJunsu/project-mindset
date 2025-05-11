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
public class WorkoutPost {
    private Long postId;
    private Long userId;                // 유저(FK)
    private String title;               // 제목
    private String content;             // 내용
    private String workoutCategory;    // 운동종류
    private String imageUrl;           // 이미지 URL
    private int viewCount;             // 조회수
    private int likeCount;             // 좋아요수
    private LocalDateTime createdAt;    // 생성일
    private LocalDateTime updatedAt;    // 수정일
}
