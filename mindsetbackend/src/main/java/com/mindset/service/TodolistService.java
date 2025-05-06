package com.mindset.service;

import com.mindset.mapper.TodolistMapper;
import com.mindset.model.dto.Todolist;
import com.mindset.model.request.TodolistRequest;
import com.mindset.model.response.TodolistResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public List<TodolistResponse> getTodolistByUesr(Long userId) {
        List<Todolist> todolists = todolistMapper.findAllByUserId(userId);
        List<TodolistResponse> responses = new ArrayList<>();

        for(Todolist todolist : todolists){
            responses.add(new TodolistResponse(todolist));
        }
        return responses;
    }
    // 특정 조회
    public TodolistResponse getTodolist(Long todoId){
        Todolist todolist = todolistMapper.findTodolistById(todoId);
        return new TodolistResponse(todolist);
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
