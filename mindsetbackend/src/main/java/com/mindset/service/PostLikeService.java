package com.mindset.service;

import com.mindset.mapper.PostLikeMapper;
import com.mindset.mapper.WorkoutPostMapper;
import com.mindset.model.dto.PostLike;
import com.mindset.model.request.PostLikeRequest;
import com.mindset.model.response.PostLikeResponse;
import com.mindset.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostLikeService {

    private final PostLikeMapper postLikeMapper;
    private final WorkoutPostMapper workoutPostMapper;
    private final SecurityUtils securityUtils; // 주입 추가

    // 좋아요 토글 (추가 또는 취소)
    public PostLikeResponse toggleLike(PostLikeRequest request) {
        Long postId = request.getPostId();
        Long userId = securityUtils.getCurrentUserId();

        // 게시글 존재 확인
        if (workoutPostMapper.findWorkoutPostById(postId) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");
        }

        boolean exists = postLikeMapper.existsByPostIdAndUserId(postId, userId);

        if (exists) {
            // 이미 좋아요가 있으면 취소
            postLikeMapper.deletePostLike(postId, userId);
            workoutPostMapper.decrementLikeCount(postId);

            return PostLikeResponse.builder()
                    .success(true)
                    .likeCount(workoutPostMapper.findWorkoutPostById(postId).getLikeCount())
                    .isLiked(false)
                    .build();
        } else {
            // 좋아요가 없으면 추가
            PostLike postLike = PostLike.builder()
                    .postId(postId)
                    .userId(userId)
                    .createdAt(LocalDateTime.now())
                    .build();

            postLikeMapper.createPostLike(postLike);
            workoutPostMapper.incrementLikeCount(postId);

            return PostLikeResponse.builder()
                    .success(true)
                    .likeCount(workoutPostMapper.findWorkoutPostById(postId).getLikeCount())
                    .isLiked(true)
                    .build();
        }
    }

    // 게시글의 좋아요 상태 확인
    public PostLikeResponse getLikeStatus(Long postId) {
        Long userId = securityUtils.getCurrentUserId();

        // 게시글 존재 확인
        if (workoutPostMapper.findWorkoutPostById(postId) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");
        }

        // 좋아요 상태 확인
        boolean isLiked = postLikeMapper.existsByPostIdAndUserId(postId, userId);

        // 현재 좋아요 수 조회
        int likeCount = workoutPostMapper.findWorkoutPostById(postId).getLikeCount();

        return PostLikeResponse.builder()
                .success(true)
                .likeCount(likeCount)
                .isLiked(isLiked)
                .build();
    }

    // 게시글에 좋아요 누른 사용자 목록 조회
    public List<PostLike> getLikedUsers(Long postId) {
        // 게시글 존재 확인
        if (workoutPostMapper.findWorkoutPostById(postId) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");
        }

        return postLikeMapper.findAllByPostId(postId);
    }

    // 특정 사용자가 좋아요 눌렀는지 확인 (내부 사용)
    public boolean checkUserLiked(Long postId, Long userId) {
        return postLikeMapper.existsByPostIdAndUserId(postId, userId);
    }
}