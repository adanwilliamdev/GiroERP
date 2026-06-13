# GiroERP - Backend

## Tecnologias
- Java 21
- Spring Boot 3.2
- Spring Security com JWT
- Spring Data JPA
- PostgreSQL
- Flyway Migrations

## Como executar

```bash
# Com Docker
docker-compose up -d

# Sem Docker (precisa do PostgreSQL instalado)
mvn clean install
mvn spring-boot:run