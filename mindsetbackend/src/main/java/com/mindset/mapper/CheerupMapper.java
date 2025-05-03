package com.mindset.mapper;

import com.mindset.model.dto.Cheerup;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CheerupMapper {
    @Select(value = "SELECT * FROM cheerup ORDER BY RAND() LIMIT 1")
    Cheerup getRandomCheerup();
}
