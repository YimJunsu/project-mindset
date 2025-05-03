package com.mindset.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.token-validity-in-seconds}")
    private long tokenValidityInMilliseconds;

    // JWT 생성
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)  // 사용자 이메일을 subject로 설정
                .setIssuedAt(new Date())  // 토큰 발행 시간
                .setExpiration(new Date(System.currentTimeMillis() + tokenValidityInMilliseconds)) // 만료 시간
                .signWith(SignatureAlgorithm.HS256, secretKey)  // 서명에 secretKey 사용
                .compact();
    }

    // JWT에서 사용자 정보 추출
    public String getUsernameFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getSubject();
    }

    // JWT에서 클레임 추출
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)  // Spring Security 6.1에서는 `parser`에서 `parserBuilder`로 변경됨
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // JWT 토큰 유효성 검증
    public boolean isTokenExpired(String token) {
        Date expiration = getClaimsFromToken(token).getExpiration();
        return expiration.before(new Date());
    }

    // JWT 토큰 검증
    public boolean validateToken(String token, String email) {
        return (email.equals(getUsernameFromToken(token)) && !isTokenExpired(token));
    }
}
