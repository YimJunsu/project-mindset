package com.mindset.model.response;

import com.mindset.model.dto.WorkoutPost;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutPostListResponse {
    private List<WorkoutPostResponse> posts;  // WorkoutPost에서 WorkoutPostResponse로 변경
    private boolean hasNext;    // 다음 페이지 존재 여부
    private Long lastPostId;    // 현재 페이지의 마지막 게시글 ID

    // 기존 필드도 유지 (하위 호환성)
    private int totalPages;
    private int currentPage;
    private int totalItems;
}