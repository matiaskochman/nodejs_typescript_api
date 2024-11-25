# # Usar la imagen base de Node.js
# FROM node:18

# # Establecer el directorio de trabajo
# WORKDIR /app

# # Copiar archivos necesarios para instalar dependencias
# COPY package*.json ./

# # Instalar dependencias
# RUN npm install

# # Instalar TypeScript globalmente
# RUN npm install -g typescript

# # Copiar el resto de los archivos
# COPY . .

# # Compilar TypeScript a JavaScript
# RUN npm run build

# # Exponer el puerto
# EXPOSE 3000

# # Comando para iniciar la aplicación
# CMD ["npm", "start"]
