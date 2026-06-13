package com.giroerp;

import com.giroerp.dto.ClienteDTO;
import com.giroerp.service.ClienteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ClienteServiceTest {

    @Autowired
    private ClienteService clienteService;

    @Test
    void shouldCreateCliente() {
        ClienteDTO clienteDTO = ClienteDTO.builder()
                .nome("Cliente Teste")
                .cpfCnpj("123.456.789-00")
                .email("teste@email.com")
                .telefone("(11) 99999-9999")
                .cidade("São Paulo")
                .estado("SP")
                .ativo(true)
                .build();

        ClienteDTO saved = clienteService.create(clienteDTO);

        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getNome()).isEqualTo("Cliente Teste");
        assertThat(saved.getEmail()).isEqualTo("teste@email.com");
    }

    @Test
    void shouldFindClienteById() {
        ClienteDTO clienteDTO = ClienteDTO.builder()
                .nome("Cliente Teste 2")
                .cpfCnpj("987.654.321-00")
                .build();

        ClienteDTO saved = clienteService.create(clienteDTO);
        ClienteDTO found = clienteService.findById(saved.getId());

        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(saved.getId());
    }
}