# Production Dockerfile for mymadagascartrip
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies  
RUN npm ci

# Copy source code
COPY . .

# Build frontend (Vite)
RUN npm run vite build

# Build server (TypeScript)
RUN npx tsc -p tsconfig.server.json || npx tsc server/index.ts --outDir dist --esModuleInterop --module NodeNext --moduleResolution NodeNext --target ES2020 --skipLibCheck

# Create server.js for production
RUN echo 'import express from "express"; import path from "path"; import { fileURLToPath } from "url"; const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename); const app = express(); const PORT = process.env.PORT || 5000; app.use(express.static(path.join(__dirname, "public"))); app.get("/health", (req, res) => res.json({status:"ok",timestamp:new Date().toISOString()})); app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html"))); app.listen(PORT, "0.0.0.0", () => console.log("Server on port " + PORT));' > dist/server.js

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Start the server
CMD ["node", "dist/server.js"]
