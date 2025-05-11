package com.mindset.controller;

import com.mindset.model.dto.PostLike;
import com.mindset.model.request.PostLikeRequest;
import com.mindset.model.response.PostLikeResponse;
import com.mindset.service.PostLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post-likes")
@RequiredArgsConstructor
public class PostLikeController {
    private final PostLikeService postLikeService;

    // 좋아요 토글 (추가 또는 취소)
    @PostMapping
    public ResponseEntity<PostLikeResponse> toggleLike(@RequestBody PostLikeRequest request) {
        return ResponseEntity.ok(postLikeService.toggleLike(request));
    }

    // 게시글에 좋아요 누른 사용자 목록 조회
    @GetMapping("/users/{postId}")
    public ResponseEntity<List<PostLike>> getLikedUsers(@PathVariable Long postId) {
        return ResponseEntity.ok(postLikeService.getLikedUsers(postId));
    }

    // 특정 사용자가 좋아요 눌렀는지 확인
    @GetMapping("/status/{postId}")
    public ResponseEntity<PostLikeResponse> getLikeStatus(@PathVariable Long postId) {
        return ResponseEntity.ok(postLikeService.getLikeStatus(postId));
    }
}