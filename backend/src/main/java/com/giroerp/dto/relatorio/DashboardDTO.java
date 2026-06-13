package com.giroerp.dto.relatorio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private BigDecimal totalVendasMes;
    private Long quantidadeVendasMes;
    private Long totalClientes;
    private Long totalProdutos;
    private List<Object[]> vendasPorStatus;
    private List<Object[]> topProdutos;
    private List<?> ultimasVendas;
}