FROM openjdk:21-jdk-slim AS build
WORKDIR /app

# Copiar arquivos do Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Baixar dependências (cache)
RUN ./mvnw dependency:go-offline -B

# Copiar código fonte e compilar
COPY src src
RUN ./mvnw package -DskipTests

# ============================================
# IMAGEM FINAL
# ============================================
FROM openjdk:21-jdk-slim
WORKDIR /app

# Copiar JAR da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Criar usuário não-root para segurança
RUN groupadd -r giroerp && useradd -r -g giroerp giroerp
USER giroerp

EXPOSE 8080

# Health check para o Render
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]