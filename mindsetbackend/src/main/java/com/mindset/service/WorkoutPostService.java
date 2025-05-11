package com.mindset.service;

import com.mindset.mapper.WorkoutPostMapper;
import com.mindset.mapper.UserMapper;
import com.mindset.model.dto.WorkoutPost;
import com.mindset.model.dto.User;
import com.mindset.model.request.WorkoutPostRequest;
import com.mindset.model.response.WorkoutPostListResponse;
import com.mindset.model.response.WorkoutPostResponse;
import com.mindset.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkoutPostService {

    private final WorkoutPostMapper workoutPostMapper;
    private final UserMapper userMapper;
    private final PostLikeService postLikeService;
    private final SecurityUtils securityUtils;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.workoutpost-dir}")
    private String workoutPostDir;

    // 파일 저장 처리 메소드 (동일하게 유지)
    private String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // 저장 디렉토리 생성
            String directory = uploadDir + File.separator + workoutPostDir;
            Path directoryPath = Paths.get(directory);
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }

            // 파일명 생성 (UUID 사용)
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String savedFilename = UUID.randomUUID().toString() + extension;

            // 파일 저장
            Path filePath = Paths.get(directory + File.separator + savedFilename);
            Files.write(filePath, file.getBytes());

            // 파일 URL 반환
            return workoutPostDir + "/" + savedFilename;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장 중 오류가 발생했습니다.", e);
        }
    }

    // 게시글 생성
    public WorkoutPostResponse savePost(WorkoutPostRequest request, MultipartFile file) {
        // 현재 로그인한 사용자 정보 가져오기
        User currentUser = securityUtils.getCurrentUser();

        // 파일 저장 처리
        String imageUrl = saveFile(file);

        // 게시글 정보 생성
        WorkoutPost workoutPost = WorkoutPost.builder()
                .userId(currentUser.getUserId())
                .title(request.getTitle())
                .content(request.getContent())
                .workoutCategory(request.getWorkoutCategory())
                .imageUrl(imageUrl)
                .viewCount(0)
                .likeCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // DB에 저장
        workoutPostMapper.createWorkoutPost(workoutPost);

        // 응답 생성 (좋아요 상태는 새 게시글이므로 false)
        return WorkoutPostResponse.builder()
                .workoutPost(workoutPost)
                .authorName(currentUser.getNickname()) // 현재 사용자의 닉네임 사용
                .likedByUser(false)
                .build();
    }

    // 게시글 상세 조회 (조회수 증가)
    public WorkoutPostResponse getPostWithIncrementViewCount(Long postId) {
        // 게시글 조회
        WorkoutPost workoutPost = workoutPostMapper.findWorkoutPostById(postId);
        if (workoutPost == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");
        }

        // 조회수 증가
        workoutPostMapper.incrementViewCount(postId);
        workoutPost.setViewCount(workoutPost.getViewCount() + 1);

        // 작성자 정보 조회
        User author = userMapper.findById(workoutPost.getUserId());
        String authorName = (author != null) ? author.getNickname() : "알 수 없음";

        // 현재 사용자의 좋아요 상태 확인
        Long currentUserId = securityUtils.getCurrentUserId();
        boolean likedByUser = postLikeService.checkUserLiked(postId, currentUserId);

        return WorkoutPostResponse.builder()
                .workoutPost(workoutPost)
                .authorName(authorName)
                .likedByUser(likedByUser)
                .build();
    }

    // 게시글 수정
    public WorkoutPostResponse updatePost(WorkoutPostRequest request, MultipartFile file) {
        // 기존 게시글 조회
        WorkoutPost existingPost = workoutPostMapper.findWorkoutPostById(request.getPostId());
        if (existingPost == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");
        }

        // 작성자 확인 (권한 체크)
        Long currentUserId = securityUtils.getCurrentUserId();
        if (!existingPost.getUserId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "게시글 수정 권한이 없습니다.");
        }

        // 파일이 있으면 새로 저장
        String imageUrl = existingPost.getImageUrl();
        if (file != null && !file.isEmpty()) {
            imageUrl = saveFile(file);
        }

        // 게시글 정보 업데이트
        WorkoutPost updatedPost = WorkoutPost.builder()
                .postId(request.getPostId())
                .userId(existingPost.getUserId())
                .title(request.getTitle())
                .content(request.getContent())
                .workoutCategory(request.getWorkoutCategory())
                .imageUrl(imageUrl)
                .viewCount(existingPost.getViewCount())
                .likeCount(existingPost.getLikeCount())
                .createdAt(existingPost.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        // DB 업데이트
        workoutPostMapper.updateWorkoutPost(updatedPost);

        // 작성자 정보 조회
        User author = userMapper.findById(updatedPost.getUserId());
        String authorName = (author != null) ? author.getNickname() : "알 수 없음";

        // 좋아요 상태 확인
        boolean likedByUser = postLikeService.checkUserLiked(request.getPostId(), currentUserId);

        return WorkoutPostResponse.builder()
                .workoutPost(updatedPost)
                .authorName(authorName)
                .likedByUser(likedByUser)
                .build();
    }

    // 게시글 삭제
    public void deletePost(Long postId) {
        // 기존 게시글 조회
        WorkoutPost existingPost = workoutPostMapper.findWorkoutPostById(postId);
        if (existingPost == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");
        }

        // 작성자 확인 (권한 체크)
        Long currentUserId = securityUtils.getCurrentUserId();
        if (!existingPost.getUserId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "게시글 삭제 권한이 없습니다.");
        }

        // 게시글 삭제
        workoutPostMapper.deleteWorkoutPost(postId);
    }

    // 전체 게시글 목록 조회 (무한 스크롤)
    public WorkoutPostListResponse getAllPosts(Long lastPostId, int size, String category) {
        // 다음 페이지 확인을 위해 size+1개 요청
        int adjustedSize = size + 1;

        // 마지막 게시글 ID 기준으로 조회
        List<WorkoutPost> posts;
        if (category != null && !category.isEmpty()) {
            posts = workoutPostMapper.findAllByCategory(lastPostId, adjustedSize, category);
        } else {
            posts = workoutPostMapper.findAll(lastPostId, adjustedSize);
        }

        // 결과가 없는 경우
        if (posts.isEmpty()) {
            return WorkoutPostListResponse.builder()
                    .posts(new ArrayList<>())
                    .hasNext(false)
                    .lastPostId(lastPostId)
                    .totalPages(0)
                    .currentPage(0)
                    .totalItems(0)
                    .build();
        }

        // 다음 페이지 확인
        boolean hasNext = posts.size() > size;

        // 요청한 size보다 많은 결과가 있으면 마지막 항목 제거
        if (hasNext) {
            posts = posts.subList(0, size);
        }

        // 마지막 게시글 ID 추출
        Long newLastPostId = posts.isEmpty() ? lastPostId : posts.get(posts.size() - 1).getPostId();

        // WorkoutPostResponse 객체로 변환
        List<WorkoutPostResponse> responseList = new ArrayList<>();
        Long currentUserId = null;
        try {
            currentUserId = securityUtils.getCurrentUserId();
        } catch (Exception e) {
            // 로그인하지 않은 경우 무시
        }

        for (WorkoutPost post : posts) {
            User author = userMapper.findById(post.getUserId());
            String authorName = (author != null) ? author.getNickname() : "알 수 없음";

            boolean likedByUser = false;
            if (currentUserId != null) {
                likedByUser = postLikeService.checkUserLiked(post.getPostId(), currentUserId);
            }

            responseList.add(WorkoutPostResponse.builder()
                    .workoutPost(post)
                    .authorName(authorName)
                    .likedByUser(likedByUser)
                    .build());
        }

        return WorkoutPostListResponse.builder()
                .posts(responseList)  // WorkoutPostResponse 객체 리스트로 변경
                .hasNext(hasNext)
                .lastPostId(newLastPostId)
                .totalPages(0) // 무한 스크롤에서는 불필요
                .currentPage(0) // 무한 스크롤에서는 불필요
                .totalItems(responseList.size())
                .build();
    }

    // 인기 게시글 목록 조회 (좋아요 많은 순)
    public WorkoutPostListResponse getPopularPosts(Long lastPostId, int size) {
        // 다음 페이지 확인을 위해 size+1개 요청
        int adjustedSize = size + 1;

        // 좋아요 순으로 정렬하여 조회
        List<WorkoutPost> posts = workoutPostMapper.findPopularPosts(lastPostId, adjustedSize);

        // 결과가 없는 경우
        if (posts.isEmpty()) {
            return WorkoutPostListResponse.builder()
                    .posts(new ArrayList<>())
                    .hasNext(false)
                    .lastPostId(lastPostId)
                    .totalPages(0)
                    .currentPage(0)
                    .totalItems(0)
                    .build();
        }

        // 다음 페이지 확인
        boolean hasNext = posts.size() > size;

        // 요청한 size보다 많은 결과가 있으면 마지막 항목 제거
        if (hasNext) {
            posts = posts.subList(0, size);
        }

        // 마지막 게시글 ID 추출
        Long newLastPostId = posts.isEmpty() ? lastPostId : posts.get(posts.size() - 1).getPostId();

        // WorkoutPostResponse 객체로 변환
        List<WorkoutPostResponse> responseList = new ArrayList<>();
        Long currentUserId = null;
        try {
            currentUserId = securityUtils.getCurrentUserId();
        } catch (Exception e) {
            // 로그인하지 않은 경우 무시
        }

        for (WorkoutPost post : posts) {
            User author = userMapper.findById(post.getUserId());
            String authorName = (author != null) ? author.getNickname() : "알 수 없음";

            boolean likedByUser = false;
            if (currentUserId != null) {
                likedByUser = postLikeService.checkUserLiked(post.getPostId(), currentUserId);
            }

            responseList.add(WorkoutPostResponse.builder()
                    .workoutPost(post)
                    .authorName(authorName)
                    .likedByUser(likedByUser)
                    .build());
        }

        return WorkoutPostListResponse.builder()
                .posts(responseList)  // WorkoutPostResponse 객체 리스트로 변경
                .hasNext(hasNext)
                .lastPostId(newLastPostId)
                .totalPages(0)
                .currentPage(0)
                .totalItems(responseList.size())
                .build();
    }

    // 내가 쓴 게시글 목록 조회
    public WorkoutPostListResponse getUserPosts(Long userId, Long lastPostId, int size) {
        // 요청한 사용자 ID가 없으면 현재 로그인한 사용자 ID 사용
        if (userId == null) {
            userId = securityUtils.getCurrentUserId();
        }

        // 다음 페이지 확인을 위해 size+1개 요청
        int adjustedSize = size + 1;

        // 특정 사용자의 게시글 조회
        List<WorkoutPost> posts = workoutPostMapper.findAllByUserId(userId, lastPostId, adjustedSize);

        // 결과가 없는 경우
        if (posts.isEmpty()) {
            return WorkoutPostListResponse.builder()
                    .posts(new ArrayList<>())
                    .hasNext(false)
                    .lastPostId(lastPostId)
                    .totalPages(0)
                    .currentPage(0)
                    .totalItems(0)
                    .build();
        }

        // 다음 페이지 확인
        boolean hasNext = posts.size() > size;

        // 요청한 size보다 많은 결과가 있으면 마지막 항목 제거
        if (hasNext) {
            posts = posts.subList(0, size);
        }

        // 마지막 게시글 ID 추출
        Long newLastPostId = posts.isEmpty() ? lastPostId : posts.get(posts.size() - 1).getPostId();

        // WorkoutPostResponse 객체로 변환
        List<WorkoutPostResponse> responseList = new ArrayList<>();
        Long currentUserId = securityUtils.getCurrentUserId();

        for (WorkoutPost post : posts) {
            User author = userMapper.findById(post.getUserId());
            String authorName = (author != null) ? author.getNickname() : "알 수 없음";

            boolean likedByUser = postLikeService.checkUserLiked(post.getPostId(), currentUserId);

            responseList.add(WorkoutPostResponse.builder()
                    .workoutPost(post)
                    .authorName(authorName)
                    .likedByUser(likedByUser)
                    .build());
        }

        return WorkoutPostListResponse.builder()
                .posts(responseList)  // WorkoutPostResponse 객체 리스트로 변경
                .hasNext(hasNext)
                .lastPostId(newLastPostId)
                .totalPages(0)
                .currentPage(0)
                .totalItems(responseList.size())
                .build();
    }
}