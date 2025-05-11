package com.mindset.model.response;

import com.mindset.model.dto.WorkoutPost;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutPostResponse {
    private WorkoutPost workoutPost;
    private String authorName;      // 작성자 이름
    private boolean likedByUser;    // 현재 사용자가 좋아요 눌렀는지 여부
}

