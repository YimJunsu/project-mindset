package com.mindset.controller;

import com.mindset.model.dto.Cheerup;
import com.mindset.service.CheerupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cheerup")
public class CheerupController {

    @Autowired
    private CheerupService cheerupService;

    @GetMapping("/random")
    public ResponseEntity<Cheerup> getRandomCheerup() {
        Cheerup cheerup = cheerupService.getRandomCheerup(); // 무작위 명언 가져오기
        if (cheerup == null) {
            return ResponseEntity.notFound().build(); // 만약 명언이 없다면 404 상태 코드 반환
        }
        return ResponseEntity.ok(cheerup); // 200 OK 상태 코드와 함께 cheerup 객체 반환
    }
}
