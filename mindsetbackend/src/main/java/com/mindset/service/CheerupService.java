package com.mindset.service;

import com.mindset.mapper.CheerupMapper;
import com.mindset.model.dto.Cheerup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CheerupService {
    @Autowired private CheerupMapper cheerupMapper;

    public Cheerup getRandomCheerup(){
        return cheerupMapper.getRandomCheerup();
    }
}
