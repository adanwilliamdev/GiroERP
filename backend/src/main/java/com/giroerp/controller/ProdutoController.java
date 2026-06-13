package com.giroerp.controller;

import com.giroerp.dto.ProdutoDTO;
import com.giroerp.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class ProdutoController {

    private final ProdutoService produtoService;

    @PostMapping
    @Operation(summary = "Criar produto")
    public ResponseEntity<ProdutoDTO> create(@Valid @RequestBody ProdutoDTO produtoDTO) {
        return ResponseEntity.ok(produtoService.create(produtoDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar produto por ID")
    public ResponseEntity<ProdutoDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.findById(id));
    }

    @GetMapping
    @Operation(summary = "Listar produtos")
    public ResponseEntity<Page<ProdutoDTO>> findAll(Pageable pageable) {
        return ResponseEntity.ok(produtoService.findAll(pageable));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar produto")
    public ResponseEntity<ProdutoDTO> update(@PathVariable Long id, @Valid @RequestBody ProdutoDTO produtoDTO) {
        return ResponseEntity.ok(produtoService.update(id, produtoDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar produto")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produtoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}