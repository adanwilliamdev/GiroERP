package com.giroerp.controller;

import com.giroerp.dto.LoginRequest;
import com.giroerp.dto.LoginResponse;
import com.giroerp.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Endpoints de autenticação")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Autenticar usuário", description = "Realiza login e retorna token JWT")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}