# Multi-stage build for production deployment
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the widget
RUN npm run build:widget

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Add CORS headers
COPY docker/cors.conf /etc/nginx/conf.d/cors.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]