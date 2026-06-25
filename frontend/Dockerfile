# frontend/Dockerfile

# ============================================
# ESTÁGIO DE BUILD
# ============================================
FROM node:20-alpine AS build
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

# === RECEBER VARIÁVEIS DE AMBIENTE ===
ARG VITE_API_URL
ARG VITE_APP_NAME
ARG VITE_APP_VERSION

# Definir como ENV para o build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION

# Build
RUN npm run build

# ============================================
# ESTÁGIO DE PRODUÇÃO (NGINX)
# ============================================
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]