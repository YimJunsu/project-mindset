package com.mindset.mapper;

import com.mindset.model.dto.PostLike;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PostLikeMapper {

    /**
     * 좋아요 추가
     */
    int createPostLike(PostLike postLike);

    /**
     * 게시글별 좋아요 조회
     */
    List<PostLike> findAllByPostId(Long postId);

    /**
     * 사용자별 좋아요 조회
     */
    List<PostLike> findAllByUserId(Long userId);

    /**
     * 좋아요 존재 여부 확인
     */
    boolean existsByPostIdAndUserId(
            @Param("postId") Long postId,
            @Param("userId") Long userId);

    /**
     * 좋아요 삭제
     */
    int deletePostLike(
            @Param("postId") Long postId,
            @Param("userId") Long userId);
}