package com.mindset.mapper;

import com.mindset.model.dto.Todolist;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TodolistMapper {

    void createTodolist(Todolist todolist);

    List<Todolist> findAllByUserId(Long userId);

    Todolist findTodolistById(Long todoId);

    void updateTodolistStatus(Long todoId, Boolean isCompleted);

    void deleteTodolist(Long todoId);
}
