package com.mindset.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// 좋아요
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostLike {
    private Long likeId;
    private Long postId;            // 게시판 (FK)
    private Long userId;            // 유저 (FK)
    private LocalDateTime createdAt;
    /*
    UNIQUE KEY post_id, user_id => 중복 좋아요 방지
     */
}
