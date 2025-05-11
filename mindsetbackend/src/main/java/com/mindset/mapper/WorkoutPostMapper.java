package com.mindset.mapper;

import com.mindset.model.dto.WorkoutPost;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface WorkoutPostMapper {

    /**
     * 게시글 생성
     */
    int createWorkoutPost(WorkoutPost workoutPost);

    /**
     * 게시글 ID로 조회
     */
    WorkoutPost findWorkoutPostById(Long postId);

    /**
     * 모든 게시글 조회 (무한 스크롤, 커서 기반 페이징)
     */
    List<WorkoutPost> findAll(
            @Param("lastPostId") Long lastPostId,
            @Param("size") int size);

    /**
     * 카테고리별 게시글 조회 (무한 스크롤, 커서 기반 페이징)
     */
    List<WorkoutPost> findAllByCategory(
            @Param("lastPostId") Long lastPostId,
            @Param("size") int size,
            @Param("category") String category);

    /**
     * 사용자별 게시글 조회 (무한 스크롤, 커서 기반 페이징)
     */
    List<WorkoutPost> findAllByUserId(
            @Param("userId") Long userId,
            @Param("lastPostId") Long lastPostId,
            @Param("size") int size);

    /**
     * 인기 게시글 조회 (좋아요 순, 무한 스크롤, 커서 기반 페이징)
     */
    List<WorkoutPost> findPopularPosts(
            @Param("lastPostId") Long lastPostId,
            @Param("size") int size);

    /**
     * 게시글 수정
     */
    int updateWorkoutPost(WorkoutPost workoutPost);

    /**
     * 게시글 삭제
     */
    int deleteWorkoutPost(Long postId);

    /**
     * 조회수 증가
     */
    int incrementViewCount(Long postId);

    /**
     * 좋아요 수 증가
     */
    int incrementLikeCount(Long postId);

    /**
     * 좋아요 수 감소
     */
    int decrementLikeCount(Long postId);
}