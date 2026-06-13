package com.giroerp.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {

    private Long id;

    @NotBlank(message = "Username é obrigatório")
    @Size(min = 3, max = 50, message = "Username deve ter entre 3 e 50 caracteres")
    private String username;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
    private String password;

    @NotBlank(message = "Role é obrigatória")
    @Pattern(regexp = "ADMIN|USER|MANAGER", message = "Role inválida")
    private String role;

    private Boolean ativo;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}