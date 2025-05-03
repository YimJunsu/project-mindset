package com.mindset.config;

import com.mindset.security.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 인증 매니저 빈 등록
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * 보안 필터 체인 설정
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authz -> authz
                        // 회원가입, 로그인, cheerup, 공개 리소스는 모두 접근 허용
                        .requestMatchers("/api/auth/**", "/api/cheerup/**", "/api/oauth2/**", "/", "/error").permitAll()
                        // 공개 기능
                        .requestMatchers("/api/todos/public/**", "/api/timer/public/**").permitAll()
                        // /api/users는 USER 역할을 가진 사용자만 접근 가능
                        .requestMatchers("/api/users/**").hasRole("USER")
                        // 나머지는 인증만 되면 접근 가능
                        .anyRequest().authenticated()
                );

        // JWT 필터 추가
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        // CORS 설정 (WebConfig에서 관리)
        http.cors(cors -> {});

        return http.build();
    }
}