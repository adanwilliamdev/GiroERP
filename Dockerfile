# ============================================
# ESTÁGIO DE BUILD
# ============================================
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# 1. Copiar arquivos essenciais primeiro
COPY backend/pom.xml .
COPY backend/mvnw .

# 2. Dar permissão de execução para o mvnw
RUN chmod +x mvnw

# 3. Baixar dependências (cache)
RUN ./mvnw dependency:go-offline -B || true

# 4. Copiar o resto do código
COPY backend/ .

# 5. Compilar
RUN ./mvnw package -DskipTests

# ============================================
# IMAGEM FINAL
# ============================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

RUN addgroup -S giroerp && adduser -S giroerp -G giroerp
USER giroerp

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]