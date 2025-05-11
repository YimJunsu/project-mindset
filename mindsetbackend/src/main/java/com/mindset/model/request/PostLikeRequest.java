package com.mindset.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostLikeRequest {
    private Long postId;  // 좋아요를 누를 게시글 ID
    // userId는 서버에서 인증 정보에서 얻기
}