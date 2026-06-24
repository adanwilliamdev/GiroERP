# ============================================
# ESTÁGIO DE BUILD (COM MAVEN OFICIAL)
# ============================================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar pom.xml e baixar dependências (com cache)
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fonte e compilar
COPY backend/src ./src
RUN mvn package -DskipTests

# ============================================
# IMAGEM FINAL
# ============================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar JAR da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Criar usuário não-root para segurança
RUN addgroup -S giroerp && adduser -S giroerp -G giroerp
USER giroerp

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]