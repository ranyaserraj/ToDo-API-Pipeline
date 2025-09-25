# Dockerfile - Version ultra-légère
FROM node:18-alpine

# Copie des fichiers package
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]