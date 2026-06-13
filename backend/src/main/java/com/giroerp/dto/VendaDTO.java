package com.giroerp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendaDTO {
    private Long id;
    private String numero;
    private Long clienteId;
    private String clienteNome;
    private Long usuarioId;
    private String usuarioNome;
    private List<ItemVendaDTO> itens;
    private LocalDateTime dataVenda;
    private BigDecimal subtotal;
    private BigDecimal desconto;
    private BigDecimal total;
    private String status;
    private LocalDateTime createdAt;
}