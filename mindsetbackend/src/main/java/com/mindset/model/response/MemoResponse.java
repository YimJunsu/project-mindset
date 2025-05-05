package com.mindset.model.response;

import com.mindset.model.dto.Memo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemoResponse {
    private Memo memo;
}
