# Etapa 1: build con Node 20 LTS
FROM node:20 AS build
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir el frontend (Vite genera la carpeta dist/)
RUN npm run build

# Etapa 2: servir con Nginx
FROM nginx:alpine
# Copiar el build al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Nginx arranca automáticamente con la imagen base