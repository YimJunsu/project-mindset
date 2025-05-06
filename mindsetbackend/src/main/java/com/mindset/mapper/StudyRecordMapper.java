package com.mindset.mapper;

import com.mindset.model.dto.StudyRecord;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StudyRecordMapper {
    void createStudyRecord(StudyRecord record);

    List<StudyRecord> findAllByUserId(Long userId);

    StudyRecord findByRecordId(Long recordId);

    void deleteStudyRecord(Long recordId);
}
