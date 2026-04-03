package com.universalpos.controller;

import com.universalpos.dto.request.LoginRequest;
import com.universalpos.dto.request.RegisterRequest;
import com.universalpos.dto.response.JwtResponse;
import com.universalpos.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refresh(@RequestHeader("Authorization") String token) {
        // Implementation for token refresh
        return ResponseEntity.ok(null);
    }
}