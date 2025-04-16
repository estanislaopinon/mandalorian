# Usar una imagen base de Node.js
FROM node:16

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Instalar explícitamente rollup-linux-x64-gnu si es necesario
RUN npm install @rollup/rollup-linux-x64-gnu --no-save || true

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto 
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]