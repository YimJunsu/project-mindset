package com.mindset.controller;

import com.mindset.model.dto.Todolist;
import com.mindset.model.request.TodolistRequest;
import com.mindset.model.response.TodolistResponse;
import com.mindset.service.TodolistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todo")
@RequiredArgsConstructor
public class TodolistController {

    private final TodolistService todolistService;

    // 생성
    @PostMapping("/save")
    public TodolistResponse createTodolist(@RequestBody TodolistRequest todolistRequest) {
        return todolistService.createTodolist(todolistRequest);
    }

    // 유저아이디에 해당하는 todo 전체 조회
    @GetMapping("/{userId}")
    public List<Todolist> getTodolistByUser(@PathVariable Long userId){
        return todolistService.getTodolistByUesr(userId);
    }

    // 상세보기
    @GetMapping("/detail/{todoId}")
    public Todolist getTodolist(@PathVariable Long todoId){
        return todolistService.getTodolist(todoId);
    }

    // 상태 업데이트
    @PutMapping("/status/{todoId}")
    public void updateTodolistStatus(@RequestBody TodolistRequest todolistRequest) {
        todolistService.updateTodolistStatus(todolistRequest);
    }

    // 삭제
    @DeleteMapping("/{todoId}")
    public void deleteTodolist(@PathVariable Long todoId){
        todolistService.deleteTodolist(todoId);
    }
}
