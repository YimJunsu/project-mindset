package com.mindset.service;

import com.mindset.mapper.MemoMapper;
import com.mindset.model.dto.Memo;
import com.mindset.model.request.MemoRequest;
import com.mindset.model.response.MemoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemoService {

    private final MemoMapper memoMapper;

    // 최대 허용 메모 수 상수
    private static final int MAX_MEMOS_PER_USER = 2;

    // 전체 조회
    public List<MemoResponse> getMemoByUser(Long userId){
        List<Memo> memos = memoMapper.findAllByUserId(userId);
        List<MemoResponse> responses = new ArrayList<>();

        for (Memo memo : memos) {
            responses.add(new MemoResponse(memo));
        }

        return responses;
    }

    // 상세 보기
    public MemoResponse getMemo(Long memoId){
        Memo memo = memoMapper.findByMemoId(memoId);
        return new MemoResponse(memo); // 변환
    }

    // 생성 (메모 수 제한 추가)
    public MemoResponse createMemo(MemoRequest memoRequest){
        // 현재 사용자의 메모 수 확인
        List<Memo> userMemos = memoMapper.findAllByUserId(memoRequest.getUserId());

        // 메모 수가 MAX_MEMOS_PER_USER(2개)를 초과하는지 확인
        if (userMemos.size() >= MAX_MEMOS_PER_USER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "메모는 최대 " + MAX_MEMOS_PER_USER + "개까지만 생성할 수 있습니다.");
        }

        // 제한에 걸리지 않으면 메모 생성 진행
        Memo memo = new Memo();
        memo.setUserId(memoRequest.getUserId());
        memo.setTitle(memoRequest.getTitle());
        memo.setContent(memoRequest.getContent());
        memo.setCategory(memoRequest.getCategory());
        memoMapper.createMemo(memo);
        return MemoResponse.builder()
                .memo(memo)
                .build();
    }

    // 수정
    public MemoResponse updateMemo(MemoRequest memoRequest){
        // 기존 메모 정보 가져오기
        Memo existingMemo = memoMapper.findByMemoId(memoRequest.getMemoId());

        // 새 정보로 업데이트
        existingMemo.setTitle(memoRequest.getTitle());
        existingMemo.setContent(memoRequest.getContent());
        existingMemo.setCategory(memoRequest.getCategory());

        // 데이터베이스 업데이트
        memoMapper.updateMemo(existingMemo);

        // 업데이트된 메모 반환
        return new MemoResponse(existingMemo);
    }

    // 삭제
    public void deleteMemo(Long memoId){
        memoMapper.deleteMemo(memoId);
    }

    // 사용자의 메모 개수 반환 (추가 기능)
    public int countUserMemos(Long userId) {
        List<Memo> userMemos = memoMapper.findAllByUserId(userId);
        return userMemos.size();
    }
}