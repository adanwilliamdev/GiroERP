package com.giroerp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "produtos")
public class Produto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String codigo;
    
    @Column(nullable = false)
    private String nome;
    
    private String descricao;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;
    
    @Column(nullable = false)
    private Integer estoque;
    
    @Column(name = "estoque_minimo")
    private Integer estoqueMinimo = 5; // Alerta quando estoque <= 5
    
    private String categoria;
    
    @Builder.Default
    private Boolean ativo = true;
    
    @Column(name = "imagem_url")
    private String imagemUrl;
    
    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (estoqueMinimo == null) estoqueMinimo = 5;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Método para verificar se está com estoque baixo
    public boolean isEstoqueBaixo() {
        return estoque <= estoqueMinimo;
    }
    
    public String getStatusEstoque() {
        if (estoque <= 0) return "ESGOTADO";
        if (estoque <= estoqueMinimo) return "BAIXO";
        return "NORMAL";
    }
}