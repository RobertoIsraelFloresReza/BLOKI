# Etapa 1: construcción de la aplicación
FROM node:22 AS builder
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Verificar que el build se completó correctamente
RUN ls -la dist && test -f dist/main.js

# Etapa 2: imagen de producción
FROM node:22-slim
WORKDIR /app

# Copiar archivos compilados y dependencias
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=4000

# Exponer puerto
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Ejecutar aplicación
CMD ["node", "dist/main.js"]
