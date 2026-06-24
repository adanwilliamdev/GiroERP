# ============================================
# ESTÁGIO DE BUILD
# ============================================
FROM node:20-alpine AS build
WORKDIR /app

# Copiar apenas os arquivos de dependência primeiro (cache)
COPY package*.json ./
RUN npm ci --only=production

# Copiar o resto do código
COPY . .

# Build da aplicação
RUN npm run build

# ============================================
# ESTÁGIO DE PRODUÇÃO (Nginx)
# ============================================
FROM nginx:alpine

# Copiar os arquivos buildados para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração do Nginx (se existir)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 3000
EXPOSE 3000

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]