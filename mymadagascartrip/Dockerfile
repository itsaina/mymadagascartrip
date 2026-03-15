# Production Dockerfile for mymadagascartrip
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies  
RUN npm ci

# Copy pre-built dist folder
COPY dist ./dist

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Start the server
CMD ["node", "dist/server.js"]
