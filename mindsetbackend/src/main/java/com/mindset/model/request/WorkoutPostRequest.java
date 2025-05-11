package com.mindset.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutPostRequest {
    private Long postId;            // 수정 시에만 사용 (null이면 새 글)
    private String title;           // 제목
    private String content;         // 내용
    private String workoutCategory; // 운동종류
    private String imageUrl;        // 이미지 URL
}
