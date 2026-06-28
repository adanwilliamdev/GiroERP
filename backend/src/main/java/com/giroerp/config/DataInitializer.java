package com.giroerp.config;

import com.giroerp.model.Role;
import com.giroerp.model.Usuario;
import com.giroerp.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            try {
                createAdminUser();
            } catch (Exception e) {
                System.out.println("⚠️ Aguardando criação das tabelas...");
                System.out.println("   O sistema vai criar as tabelas automaticamente.");
                System.out.println("   O admin será criado na próxima execução.");
                e.printStackTrace();
            }
        };
    }

    @Transactional
    public void createAdminUser() {
        try {
            // Verificar se já existe admin
            boolean adminExists = usuarioRepository.existsByUsername("admin");

            if (!adminExists) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setEmail("admin@giroerp.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setNome("Administrador");
                admin.setAtivo(true);

                usuarioRepository.save(admin);
                System.out.println("✅ Admin criado com sucesso!");
                System.out.println("   Username: admin");
                System.out.println("   Senha: admin123");
                System.out.println("   Email: admin@giroerp.com");
            } else {
                System.out.println("ℹ️ Admin já existe no sistema.");
            }
        } catch (Exception e) {
            System.out.println("❌ Erro ao criar admin: " + e.getMessage());
        }
    }
}