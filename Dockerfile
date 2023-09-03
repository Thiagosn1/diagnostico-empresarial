# Imagem base
FROM node:latest

# Diretório de trabalho
WORKDIR /app

# Copiando arquivos package.json e package-lock.json
COPY package*.json ./

# Instalando dependências
RUN npm install

# Copiando o código do projeto
COPY . .

# Expondo a porta em que o aplicativo será executado
EXPOSE 4200

# Inicializando o aplicativo
CMD ["npm", "start"]
