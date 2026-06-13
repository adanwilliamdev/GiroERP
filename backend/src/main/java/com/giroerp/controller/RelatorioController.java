package com.giroerp.controller;

import com.giroerp.dto.relatorio.RelatorioVendasDTO;
import com.giroerp.service.RelatorioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/relatorios")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class RelatorioController {
    
    private final RelatorioService relatorioService;
    
    @GetMapping("/vendas")
    @Operation(summary = "Gerar relatório de vendas")
    public ResponseEntity<RelatorioVendasDTO> getRelatorioVendas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return ResponseEntity.ok(relatorioService.getRelatorioVendas(inicio, fim));
    }
}