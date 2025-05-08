package com.mindset.mapper;

import com.mindset.model.dto.Memo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MemoMapper {

    List<Memo> findAllByUserId(Long userId);

    Memo findByMemoId(Long memoId);

    void createMemo(Memo memo);

    void updateMemo(Memo memo);

    void deleteMemo(Long memoId);
}
