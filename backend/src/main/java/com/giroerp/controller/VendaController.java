package com.giroerp.controller;

import com.giroerp.dto.VendaDTO;
import com.giroerp.service.VendaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendas")
@RequiredArgsConstructor
public class VendaController {
    
    private final VendaService vendaService;
    
    @PostMapping
    public ResponseEntity<VendaDTO> create(@Valid @RequestBody VendaDTO vendaDTO) {
        System.out.println("Recebendo requisição POST /api/vendas");
        System.out.println("Dados recebidos: " + vendaDTO);
        VendaDTO saved = vendaService.create(vendaDTO);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping
    public ResponseEntity<?> findAll() {
        System.out.println("Recebendo requisição GET /api/vendas");
        return ResponseEntity.ok(vendaService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VendaDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(vendaService.findById(id));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<VendaDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(vendaService.updateStatus(id, status));
    }
}