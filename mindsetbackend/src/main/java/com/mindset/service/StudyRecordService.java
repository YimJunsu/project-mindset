package com.mindset.service;

import com.mindset.mapper.StudyRecordMapper;
import com.mindset.model.dto.StudyRecord;
import com.mindset.model.request.StudyRecordRequest;
import com.mindset.model.response.StudyRecordResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyRecordService {

    private final StudyRecordMapper studyRecordMapper;

    public StudyRecordResponse createStudyRecord(StudyRecordRequest studyRecordRequest) {
        StudyRecord record = StudyRecord.builder()
                .userId(studyRecordRequest.getUserId())
                .subject(studyRecordRequest.getSubject())
                .duration(studyRecordRequest.getDuration())
                .startTime(studyRecordRequest.getStartTime())
                .endTime(studyRecordRequest.getEndTime())
                .memo(studyRecordRequest.getMemo())
                .createdAt(studyRecordRequest.getCreatedAt() != null
                        ? studyRecordRequest.getCreatedAt()
                        : LocalDateTime.now()) // createdAt이 null이면 현재 시간으로 대체
                .build();

        studyRecordMapper.createStudyRecord(record);
        return StudyRecordResponse.builder().studyRecord(record).build();
    }


    public List<StudyRecordResponse> getStudyRecordsByUser(Long userId) {
        return studyRecordMapper.findAllByUserId(userId)
                .stream()
                .map(record -> StudyRecordResponse.builder().studyRecord(record).build())
                .collect(Collectors.toList());
    }

    public StudyRecordResponse getStudyRecord(Long recordId) {
        StudyRecord record = studyRecordMapper.findByRecordId(recordId);
        return StudyRecordResponse.builder().studyRecord(record).build();
    }

    public void deleteStudyRecord(Long recordId) {
        studyRecordMapper.deleteStudyRecord(recordId);
    }
}
