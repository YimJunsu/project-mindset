package com.mindset.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 요청 URI 로깅 (디버깅용)
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        log.debug("JWT 필터 처리 - URI: {}, Method: {}", requestURI, method);

        // JWT 토큰 추출
        String jwt = resolveToken(request);

        // 토큰 검증 및 인증 설정
        if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
            try {
                Authentication authentication = jwtTokenProvider.getAuthentication(jwt);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("Security Context에 '{}' 인증 정보를 저장했습니다", authentication.getName());
            } catch (Exception e) {
                log.error("토큰 인증 처리 중 오류 발생: {}", e.getMessage());
                // SecurityContext 초기화 - 이 부분에서 원치 않는 리다이렉션이 발생할 수 있음
                SecurityContextHolder.clearContext();
            }
        } else {
            log.debug("유효한 JWT 토큰이 없습니다");
            // 중요: 인증 실패해도 다음 필터로 진행 (토큰이 없거나 유효하지 않을 경우 SecurityContext에 인증 정보가 없는 상태로 진행)
            // SecurityContextHolder.clearContext(); // 필요한 경우만 주석 해제
        }

        // 중요: 항상 다음 필터로 진행
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            log.debug("추출된 JWT 토큰: {}", token.substring(0, Math.min(10, token.length())) + "...");
            return token;
        }
        return null;
    }
}