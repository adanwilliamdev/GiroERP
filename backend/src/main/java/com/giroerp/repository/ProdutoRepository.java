package com.giroerp.repository;

import com.giroerp.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findByCodigo(String codigo);
    Page<Produto> findByNomeContainingIgnoreCase(String nome, Pageable pageable);
    List<Produto> findByCategoria(String categoria);
    List<Produto> findByAtivoTrue();
}