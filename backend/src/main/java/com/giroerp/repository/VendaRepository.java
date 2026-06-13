package com.giroerp.repository;

import com.giroerp.model.Venda;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {

    Page<Venda> findByStatus(String status, Pageable pageable);

    Page<Venda> findByClienteId(Long clienteId, Pageable pageable);

    Page<Venda> findByUsuarioId(Long usuarioId, Pageable pageable);

    @Query("SELECT v FROM Venda v WHERE v.dataVenda BETWEEN :startDate AND :endDate")
    Page<Venda> findVendasByPeriodo(@Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate,
                                    Pageable pageable);

    @Query("SELECT SUM(v.total) FROM Venda v WHERE v.status = 'CONCLUIDA' AND v.dataVenda BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalVendasByPeriodo(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(v) FROM Venda v WHERE v.status = 'CONCLUIDA' AND v.dataVenda BETWEEN :startDate AND :endDate")
    Long countVendasByPeriodo(@Param("startDate") LocalDateTime startDate,
                              @Param("endDate") LocalDateTime endDate);

    @Query("SELECT v.status, COUNT(v) FROM Venda v GROUP BY v.status")
    List<Object[]> countVendasByStatus();

    @Query("SELECT FUNCTION('DATE', v.dataVenda) as data, SUM(v.total) as total " +
            "FROM Venda v WHERE v.status = 'CONCLUIDA' AND v.dataVenda BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('DATE', v.dataVenda) ORDER BY data")
    List<Object[]> getDailySalesReport(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);
}