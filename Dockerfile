# ============================================
# ESTÁGIO DE BUILD
# ============================================
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copiar TUDO da pasta backend para dentro do container
COPY backend/ .

# Dar permissão de execução para o Maven Wrapper
RUN chmod +x mvnw

# Baixar dependências (usando o mvnw que está na pasta backend)
RUN ./mvnw dependency:go-offline -B

# Compilar o projeto (pula testes para acelerar)
RUN ./mvnw package -DskipTests

# ============================================
# ESTÁGIO DE EXECUÇÃO
# ============================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar o JAR gerado no estágio de build
COPY --from=build /app/target/*.jar app.jar

# Criar usuário não-root para segurança
RUN addgroup -S giroerp && adduser -S giroerp -G giroerp
USER giroerp

# Porta da aplicação
EXPOSE 8080

# Health check para o Render
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/health || exit 1

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]