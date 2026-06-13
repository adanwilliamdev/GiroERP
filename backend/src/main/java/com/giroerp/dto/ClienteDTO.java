package com.giroerp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {
    
    private Long id;
    private String nome;
    private String cpfCnpj;
    private String email;
    private String telefone;
    private String endereco;
    private String cidade;
    private String estado;
    private String cep;
    private Boolean ativo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}