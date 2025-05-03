package com.mindset.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.Map;

@Mapper
public interface TestMapper {

    @Select("SELECT 'Backend connection successful' AS message, 'OK' AS status")
    Map<String, String> testConnection();

}
