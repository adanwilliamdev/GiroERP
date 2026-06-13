package com.giroerp.service;

import com.giroerp.dto.relatorio.DashboardDTO;
import com.giroerp.dto.relatorio.RelatorioVendasDTO;
import com.giroerp.model.Venda;
import com.giroerp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RelatorioService {
    
    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;
    private final ClienteRepository clienteRepository;
    private final ItemVendaRepository itemVendaRepository;
    
    public DashboardDTO getDashboardData() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0);
        
        BigDecimal totalVendasMes = vendaRepository.sumTotalVendasByPeriodo(startOfMonth, now);
        Long quantidadeVendasMes = vendaRepository.countVendasByPeriodo(startOfMonth, now);
        Long totalClientes = clienteRepository.count();
        Long totalProdutos = produtoRepository.count();
        
        return DashboardDTO.builder()
            .totalVendasMes(totalVendasMes != null ? totalVendasMes : BigDecimal.ZERO)
            .quantidadeVendasMes(quantidadeVendasMes != null ? quantidadeVendasMes : 0L)
            .totalClientes(totalClientes)
            .totalProdutos(totalProdutos)
            .vendasPorStatus(vendaRepository.countVendasByStatus())
            .topProdutos(getTopProdutos())
            .ultimasVendas(getUltimasVendas())
            .build();
    }
    
    private List<Object[]> getTopProdutos() {
        return itemVendaRepository.getTopProdutosVendidos(10);
    }
    
    private List<Venda> getUltimasVendas() {
        return vendaRepository.findAll(org.springframework.data.domain.PageRequest.of(0, 10))
            .getContent();
    }
    
    public RelatorioVendasDTO getRelatorioVendas(LocalDateTime inicio, LocalDateTime fim) {
        BigDecimal totalVendas = vendaRepository.sumTotalVendasByPeriodo(inicio, fim);
        Long totalVendasCount = vendaRepository.countVendasByPeriodo(inicio, fim);
        BigDecimal ticketMedio = totalVendasCount > 0 ? 
            totalVendas.divide(BigDecimal.valueOf(totalVendasCount)) : BigDecimal.ZERO;
        
        return RelatorioVendasDTO.builder()
            .periodoInicio(inicio)
            .periodoFim(fim)
            .totalVendas(totalVendas != null ? totalVendas : BigDecimal.ZERO)
            .quantidadeVendas(totalVendasCount != null ? totalVendasCount : 0L)
            .ticketMedio(ticketMedio)
            .vendasPorDia(vendaRepository.getDailySalesReport(inicio, fim))
            .build();
    }
}