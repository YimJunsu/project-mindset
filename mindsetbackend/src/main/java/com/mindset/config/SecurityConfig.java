package com.mindset.config;

import com.mindset.security.JwtRequestFilter;
import com.mindset.security.oauth2.CustomOAuth2UserService;
import com.mindset.security.oauth2.OAuth2SuccessHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private OAuth2SuccessHandler oAuth2SuccessHandler;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder; // PasswordConfig에서 주입받음

    /**
     * 인증 매니저 빈 등록
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * 인증 관리자 설정
     */
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }

    /**
     * 보안 필터 체인 설정
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authz -> authz
                        // 회원가입, 로그인, cheerup, 공개 리소스는 모두 접근 허용
                        .requestMatchers("/api/auth/**", "/api/cheerup/**", "/api/oauth2/**", "/oauth2/authorization/**",
                                "/login/oauth2/code/**", "/", "/error").permitAll()
                        // 공개 기능
                        .requestMatchers("/api/timer/public/**").permitAll()
                        // 사용자 프로필 API
                        .requestMatchers("/api/users/**").hasRole("USER")
                        // 다른 보호된 API들
                        .requestMatchers("/api/todo/**", "/api/memo/**",
                                "/api/studyrecord/**", "/api/workrecord/**").hasRole("USER")
                        // 나머지는 인증만 되면 접근 가능
                        .anyRequest().authenticated()
                )
                // OAuth2 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authorization -> authorization
                                .baseUri("/oauth2/authorization"))
                        .redirectionEndpoint(redirection -> redirection
                                .baseUri("/login/oauth2/code/*"))
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                );

        // JWT 필터 추가
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        // CORS 설정 (WebConfig에서 관리)
        http.cors(cors -> {});

        return http.build();
    }
}