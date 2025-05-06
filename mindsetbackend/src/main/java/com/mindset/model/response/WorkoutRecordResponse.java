package com.mindset.model.response;

import com.mindset.model.dto.WorkoutRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutRecordResponse {
    private WorkoutRecord workoutRecord;
}
