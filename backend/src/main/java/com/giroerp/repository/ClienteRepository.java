package com.giroerp.repository;

import com.giroerp.model.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByCpfCnpj(String cpfCnpj);

    Optional<Cliente> findByEmail(String email);

    Page<Cliente> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    Page<Cliente> findByAtivoTrue(Pageable pageable);

    @Query("SELECT c FROM Cliente c WHERE c.cidade = :cidade")
    Page<Cliente> findByCidade(@Param("cidade") String cidade, Pageable pageable);

    boolean existsByCpfCnpj(String cpfCnpj);

    boolean existsByEmail(String email);
}