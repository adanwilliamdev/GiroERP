# Dockerfile atualizado (use este!)
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copiar arquivos do Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Baixar dependências
RUN ./mvnw dependency:go-offline -B

# Copiar código fonte e compilar
COPY src src
RUN ./mvnw package -DskipTests

# ============================================
# IMAGEM FINAL (mais leve)
# ============================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar JAR da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Criar usuário não-root para segurança
RUN addgroup -S giroerp && adduser -S giroerp -G giroerp
USER giroerp

EXPOSE 8080

# Health check para o Render
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]