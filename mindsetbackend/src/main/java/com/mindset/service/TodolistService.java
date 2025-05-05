package com.mindset.service;

import com.mindset.mapper.TodolistMapper;
import com.mindset.model.dto.Todolist;
import com.mindset.model.request.TodolistRequest;
import com.mindset.model.response.TodolistResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TodolistService {

    private final TodolistMapper todolistMapper;

    // 생성
    public TodolistResponse createTodolist(TodolistRequest todolistRequest){
        Todolist todolist = Todolist.builder()
                .userId(todolistRequest.getUserId())
                .content(todolistRequest.getContent())
                .isCompleted(todolistRequest.getIsCompleted() != null ? todolistRequest.getIsCompleted() : false)
                .createdAt(LocalDateTime.now())
                .build();

        todolistMapper.createTodolist(todolist);

        return new TodolistResponse(todolist);
    }

    // 전체 조회
    public List<Todolist> getTodolistByUesr(Long userId) {
        return todolistMapper.findAllByUserId(userId);
    }
    // 특정 조회
    public Todolist getTodolist(Long todoId){
        return todolistMapper.findTodolistById(todoId);
    }

    // 상태 수정
    public void updateTodolistStatus(TodolistRequest todolistRequest){
        Todolist todolist = todolistMapper.findTodolistById(todolistRequest.getTodoId());

        if (todolist != null) {
            todolist.setIsCompleted(todolistRequest.getIsCompleted());
            todolistMapper.updateTodolistStatus(todolistRequest.getTodoId(), todolistRequest.getIsCompleted());
        }
    }
    // 삭제
    public void deleteTodolist(Long todoId){
        todolistMapper.deleteTodolist(todoId);
    }
}
