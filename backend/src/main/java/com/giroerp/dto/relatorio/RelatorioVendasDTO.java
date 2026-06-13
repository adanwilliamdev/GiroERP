package com.giroerp.dto.relatorio;

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
public class RelatorioVendasDTO {
    private LocalDateTime periodoInicio;
    private LocalDateTime periodoFim;
    private BigDecimal totalVendas;
    private Long quantidadeVendas;
    private BigDecimal ticketMedio;
    private List<Object[]> vendasPorDia;
}