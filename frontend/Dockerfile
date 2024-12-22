# Build stage
FROM node:16-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:latest

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80 