package com.giroerp.controller;

import com.giroerp.dto.ClienteDTO;
import com.giroerp.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {
    
    private final ClienteService clienteService;
    
    @PostMapping
    public ResponseEntity<ClienteDTO> create(@RequestBody ClienteDTO clienteDTO) {
        System.out.println("Recebendo requisição POST /api/clientes");
        System.out.println("Dados recebidos: " + clienteDTO);
        ClienteDTO saved = clienteService.create(clienteDTO);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping
    public ResponseEntity<Page<ClienteDTO>> findAll(Pageable pageable) {
        System.out.println("Recebendo requisição GET /api/clientes");
        return ResponseEntity.ok(clienteService.findAll(pageable));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.findById(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> update(@PathVariable Long id, @RequestBody ClienteDTO clienteDTO) {
        return ResponseEntity.ok(clienteService.update(id, clienteDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clienteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}