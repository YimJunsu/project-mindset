package com.mindset.service;

import com.mindset.mapper.MemoMapper;
import com.mindset.model.dto.Memo;
import com.mindset.model.request.MemoRequest;
import com.mindset.model.response.MemoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemoService {

    private final MemoMapper memoMapper;

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

    // 생성
    public MemoResponse createMemo(MemoRequest memoRequest){
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
    // 삭제
    public void deleteMemo(Long memoId){
        memoMapper.deleteMemo(memoId);
    }
}
