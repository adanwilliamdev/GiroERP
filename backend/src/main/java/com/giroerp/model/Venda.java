package com.giroerp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vendas")
public class Venda {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String numero;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ItemVenda> itens = new ArrayList<>();
    
    private LocalDateTime dataVenda;
    
    private BigDecimal subtotal;
    
    @Builder.Default
    private BigDecimal desconto = BigDecimal.ZERO;
    
    private BigDecimal total;
    
    @Builder.Default
    private String status = "PENDENTE";
    
    // Campos de pagamento
    @Column(name = "forma_pagamento")
    private String formaPagamento;
    
    @Column(name = "numero_parcelas")
    private Integer numeroParcelas;
    
    @Column(name = "valor_entrada")
    private BigDecimal valorEntrada;
    
    @Column(name = "valor_parcela")
    private BigDecimal valorParcela;
    
    @Column(name = "bandeira_cartao")
    private String bandeiraCartao;
    
    @Column(name = "ultimos_digitos")
    private String ultimosDigitos;
    
    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        dataVenda = LocalDateTime.now();
        if (desconto == null) desconto = BigDecimal.ZERO;
        if (status == null) status = "PENDENTE";
    }
}