package com.giroerp.controller;

import com.giroerp.dto.relatorio.DashboardDTO;
import com.giroerp.service.RelatorioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {
    
    private final RelatorioService relatorioService;
    
    @GetMapping
    @Operation(summary = "Obter dados do dashboard")
    public ResponseEntity<DashboardDTO> getDashboardData() {
        return ResponseEntity.ok(relatorioService.getDashboardData());
    }
}