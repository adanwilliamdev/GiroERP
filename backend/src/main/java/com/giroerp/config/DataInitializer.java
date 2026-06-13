package com.giroerp.config;

import com.giroerp.model.Usuario;
import com.giroerp.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            Usuario admin = Usuario.builder()
                .username("admin")
                .email("admin@giroerp.com")
                .password(passwordEncoder.encode("admin123"))
                .nome("Administrador")
                .role(Usuario.Role.ADMIN)
                .ativo(true)
                .build();
            usuarioRepository.save(admin);
            System.out.println("✅ Usuário admin criado com sucesso!");
        }
    }
}