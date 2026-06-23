FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copiar arquivos do Maven da pasta backend
COPY backend/mvnw .
COPY backend/.mvn .mvn
COPY backend/pom.xml .

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copiar código fonte
COPY backend/src src
RUN ./mvnw package -DskipTests

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