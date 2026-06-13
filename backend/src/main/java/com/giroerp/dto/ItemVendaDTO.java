package com.giroerp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemVendaDTO {
    private Long id;
    private Long produtoId;
    private String produtoNome;
    private String produtoCodigo;
    private Integer quantidade;
    private BigDecimal precoUnitario;
    private BigDecimal subtotal;
}