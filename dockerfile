# Etapa 1: Construcción
FROM node:20.11.1-alpine AS builder

WORKDIR /app

# Copiar los archivos necesarios
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . ./

# Construir la aplicación Next.js para producción
RUN npm run build

# Etapa 2: Servidor de producción
FROM node:20.11.1-alpine AS production

WORKDIR /app

# Copiar los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Establecer variables de entorno necesarias (ajústalas según tu configuración)
ENV NODE_ENV=production
ENV PORT=3000

# Exponer el puerto del frontend
EXPOSE 3000

# Ejecutar Next.js en modo producción
CMD ["npm", "start"]
