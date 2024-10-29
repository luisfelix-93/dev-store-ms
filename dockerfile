# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy the dependency files (package.json and package-lock.json)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile the NestJS project
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

# Definir diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Set working directory inside the container
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copiar o código compilado do estágio de build
COPY --from=builder /usr/src/app/dist ./dist

# Copy the .env file, if necessary (optional)
COPY .env .env

# Expose the port the service will run on
EXPOSE 6000 
# Command to run application
CMD ["node", "dist/main"]

