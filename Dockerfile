# Dockerfile
FROM node:20-slim

# Install system dependencies for Prisma/SQLite
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Generate Prisma client for the container environment
RUN npx prisma generate

# Expose Nuxt dev port
EXPOSE 3000

# Run in dev mode with hot-reload
CMD ["npm", "run", "dev"]
