package com.giroerp.repository;

import com.giroerp.model.ItemVenda;
import com.giroerp.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {

    List<ItemVenda> findByVenda(Venda venda);

    List<ItemVenda> findByProdutoId(Long produtoId);

    @Query("SELECT i.produto.id, i.produto.nome, SUM(i.quantidade) as totalQuantidade, SUM(i.subtotal) as totalVendido " +
            "FROM ItemVenda i WHERE i.venda.status = 'CONCLUIDA' " +
            "GROUP BY i.produto.id, i.produto.nome ORDER BY totalQuantidade DESC")
    List<Object[]> getTopProdutosVendidos(@Param("limit") int limit);

    @Query("SELECT i.produto.categoria, SUM(i.quantidade) as totalVendido " +
            "FROM ItemVenda i WHERE i.venda.status = 'CONCLUIDA' " +
            "GROUP BY i.produto.categoria ORDER BY totalVendido DESC")
    List<Object[]> getVendasPorCategoria();
}