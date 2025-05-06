package com.mindset.mapper;

import com.mindset.model.dto.WorkoutRecord;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WorkoutRecordMapper {
    void createWorkRecord(WorkoutRecord workoutRecord);

    List<WorkoutRecord> findAllByUserId(Long userId);

    WorkoutRecord findByWorkRecordId(Long recordId);

    public void deleteWorkRecord(Long recordId);


}
