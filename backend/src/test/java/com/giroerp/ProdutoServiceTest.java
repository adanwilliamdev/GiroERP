package com.giroerp;

import com.giroerp.dto.ProdutoDTO;
import com.giroerp.service.ProdutoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ProdutoServiceTest {

    @Autowired
    private ProdutoService produtoService;

    @Test
    void shouldCreateProduto() {
        ProdutoDTO produtoDTO = ProdutoDTO.builder()
                .codigo("TEST001")
                .nome("Produto Teste")
                .descricao("Descrição do produto teste")
                .preco(BigDecimal.valueOf(99.90))
                .estoque(10)
                .categoria("Teste")
                .ativo(true)
                .build();

        ProdutoDTO saved = produtoService.create(produtoDTO);

        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCodigo()).isEqualTo("TEST001");
        assertThat(saved.getNome()).isEqualTo("Produto Teste");
    }

    @Test
    void shouldFindProdutoById() {
        ProdutoDTO produtoDTO = ProdutoDTO.builder()
                .codigo("TEST002")
                .nome("Produto Teste 2")
                .preco(BigDecimal.valueOf(49.90))
                .estoque(5)
                .build();

        ProdutoDTO saved = produtoService.create(produtoDTO);
        ProdutoDTO found = produtoService.findById(saved.getId());

        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(saved.getId());
    }
}