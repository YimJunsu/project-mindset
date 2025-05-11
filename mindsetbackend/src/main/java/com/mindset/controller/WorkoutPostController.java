package com.mindset.controller;

import com.mindset.model.request.WorkoutPostRequest;
import com.mindset.model.response.WorkoutPostListResponse;
import com.mindset.model.response.WorkoutPostResponse;
import com.mindset.service.WorkoutPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/workoutpost")
@RequiredArgsConstructor
public class WorkoutPostController {
    private final WorkoutPostService workoutPostService;

    // 게시글 생성 (파일 업로드 포함)
    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WorkoutPostResponse> savePost(
            @RequestPart("post") WorkoutPostRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return ResponseEntity.ok(workoutPostService.savePost(request, file));
    }

    // 내가 쓴 게시글 목록
    @GetMapping("/user/{userId}")
    public ResponseEntity<WorkoutPostListResponse> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(required = false) Long lastPostId,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(workoutPostService.getUserPosts(userId, lastPostId, size));
    }

    // 게시글 전체 목록 (무한 스크롤)
    @GetMapping("/list")
    public ResponseEntity<WorkoutPostListResponse> getAllPosts(
            @RequestParam(required = false) Long lastPostId,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(workoutPostService.getAllPosts(lastPostId, size, category));
    }

    // 인기 게시글 목록 (좋아요 많은 순)
    @GetMapping("/popular")
    public ResponseEntity<WorkoutPostListResponse> getPopularPosts(
            @RequestParam(required = false) Long lastPostId,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(workoutPostService.getPopularPosts(lastPostId, size));
    }

    // 게시글 상세 조회 (조회수 증가 포함)
    @GetMapping("/detail/{postId}")
    public ResponseEntity<WorkoutPostResponse> getPostDetail(@PathVariable Long postId) {
        return ResponseEntity.ok(workoutPostService.getPostWithIncrementViewCount(postId));
    }

    // 게시글 수정
    @PutMapping(value = "/update/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WorkoutPostResponse> updatePost(
            @PathVariable Long postId,
            @RequestPart("post") WorkoutPostRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        request.setPostId(postId);
        return ResponseEntity.ok(workoutPostService.updatePost(request, file));
    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        workoutPostService.deletePost(postId);
        return ResponseEntity.ok().build();
    }
}