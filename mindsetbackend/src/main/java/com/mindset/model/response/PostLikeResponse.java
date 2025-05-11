package com.mindset.model.response;

import com.mindset.model.dto.PostLike;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostLikeResponse {
    private boolean success;        // 좋아요 처리 성공 여부
    private int likeCount;          // 업데이트된 좋아요 수
    private boolean isLiked;        // 현재 좋아요 상태 (true: 좋아요 누름, false: 좋아요 취소)
}