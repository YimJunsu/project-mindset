package com.mindset.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemoRequest {
    private long memoId;        // 메모 아이디 - 삭제시 사용
    private long userId;
    private String title;       // 메모 제목
    private String content;     // 메모 내용
    private String category;    // 메모 카테고리
}
