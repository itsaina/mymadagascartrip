# Railway - Stack Cible Stable & Meilleures Pratiques

**Date:** 15 mars 2026  
**Objectif:** Architecture stable, scalable et maintenable sur Railway

---

## 🎯 STACK IDEALE RECOMMANDÉE

### Frontend
| Technologie | Recommandation | Pourquoi |
|-------------|----------------|----------|
| **Framework** | Next.js 14+ (App Router) | SSR, SSG, API routes intégrées |
| **Styling** | Tailwind CSS | Utility-first, purge automatique |
| **UI Components** | shadcn/ui | Composants accessible, customisable |
| **Animation** | Framer Motion | Performances, simple |
| **Font** | Inter (Google Fonts) | Optimisée, lisible |

### Backend/API
| Technologie | Recommandation | Pourquoi |
|-------------|----------------|----------|
| **Runtime** | Node.js 20 LTS | Stable, support long terme |
| **Framework** | Next.js API Routes ou Express | Simplicité Railway |
| **Validation** | Zod | Type-safe validation |
| **Auth** | NextAuth.js ou Lucia | Railway-compatible |

### Base de Données
| Option | Cas d'usage | Avantages |
|--------|-------------|-----------|
| **PostgreSQL** (Railway) | App standard | Géré par Railway, backups auto |
| **Supabase** | Real-time, auth intégrée | Alternative externe |
| **Prisma** | ORM | Type-safe, migrations |
| **Drizzle** | ORM léger | SQL-like, performant |

### Cache & Queue
| Service | Usage | Configuration Railway |
|---------|-------|----------------------|
| **Redis** (Railway) | Sessions, cache, rate limiting | `railway add --database redis` |
| **Bull/BullMQ** | Job queues | Worker service séparé |

### Storage
| Type | Solution | Notes |
|------|----------|-------|
| **Fichiers statiques** | Railway (public/) | Limité, rebuild à chaque déploiement |
| **Uploads utilisateur** | AWS S3 / Cloudflare R2 | Nécessite clés API |
| **Railway Volumes** | Persistance disk | Attaché à un service |

---

## 📁 STRUCTURE DE PROJET

```
my-app/
├── app/                    # Next.js 14 App Router
│   ├── (routes)/           # Groupes de routes
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── custom/             # Vos composants
├── lib/
│   ├── db.ts               # Database config
│   ├── utils.ts            # Utilities
│   └── env.ts              # Environment validation
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
├── .env.example            # Template env vars
├── Dockerfile              # Production build
├── railway.json            # Railway config
├── next.config.js          # Next.js config
└── package.json
```

---

## 🔧 CONFIGURATION RAILWAY

### railway.json (Nixpacks)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "next start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Dockerfile (Alternative)
```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true, // Railway requirement
  },
  // Healthcheck endpoint
  async rewrites() {
    return [
      {
        source: '/health',
        destination: '/api/health',
      },
    ];
  },
}

module.exports = nextConfig
```

---

## 🗄️ BASE DE DONNÉES - BEST PRACTICES

### PostgreSQL (Railway)

**Création:**
```bash
railway add --database postgres
```

**Configuration:**
```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Schema Prisma minimal:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Migrations:**
```bash
# Local
npx prisma migrate dev --name init

# Deploy production
npx prisma migrate deploy
```

### Redis (Railway)

**Création:**
```bash
railway add --database redis
```

**Configuration:**
```typescript
// lib/redis.ts
import Redis from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL!, {
  retryStrategy: (times) => Math.min(times * 50, 2000),
})
```

**Cas d'usage:**
- Sessions (express-session avec connect-redis)
- Rate limiting
- Cache API
- Job queues (Bull)

---

## 🚀 DÉPLOIEMENT - WORKFLOW

### 1. Environnements

```bash
# Production (main)
railway environment production

# Staging
railway environment new staging

# Feature branches (PR previews automatiques)
```

### 2. Variables d'Environnement

**Obligatoires:**
```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="random-secret"
NEXTAUTH_URL="https://your-app.up.railway.app"

# API Keys (si externes)
OPENAI_API_KEY="..."
```

**Via CLI:**
```bash
railway variable set DATABASE_URL="$(railway variables get DATABASE_URL --json | jq -r .value)"
```

### 3. Healthcheck

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
}
```

### 4. CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          
      - name: Deploy to Railway
        uses: railway/deploy-action@v3
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 📊 MONITORING & LOGS

### Logs
```bash
# Suivi en temps réel
railway logs -f

# Logs spécifiques
railway logs --service web -n 100

# Logs de build
railway logs --build
```

### Métriques (Dashboard)
- CPU/Memory usage
- Network traffic
- Disk usage
- Request latency

### Alertes
- Configurer webhooks pour les erreurs
- Thresholds CPU/Memory

---

## 🔒 SÉCURITÉ

### Variables Sensibles
✅ **Faire:**
- Utiliser `railway variable set` (chiffré)
- Jamais commit les .env
- Rotations régulières des tokens

❌ **Ne pas faire:**
- Committer DATABASE_URL
- Logger les secrets
- Exposer les clés API côté client

### HTTPS
- Automatique avec Railway domains
- Custom domains avec SSL auto

### CORS
```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: process.env.FRONTEND_URL },
      ],
    },
  ]
}
```

---

## 💰 OPTIMISATION COÛTS

### Free Tier Limits
- 500 execution hours/month
- 1 GB RAM
- 1 GB disk

### Stratégies
1. **Services légers** - Éviter les gros containers
2. **Scale to zero** - Pas utilisé = pas facturé
3. **Volumétrie** - Cleanup régulier
4. **Caches** - Réduire les requêtes DB

### Scaling
```bash
# Vertical (CPU/RAM)
railway scale --service web --replicas 2

# Horizontal (plus d'instances)
# Via dashboard ou API
```

---

## 🐛 DEBUGGING

### Erreurs communes

**"Application Error" / Crash:**
```bash
# Vérifier les logs
railway logs

# SSH pour debug
railway ssh
# puis: cat /app/logs
```

**"Build failed":**
```bash
railway logs --build
# Vérifier: package.json scripts, Node version
```

**"Cannot find module":**
- Vérifier `npm install` dans le build
- Vérifier Dockerfile COPY

### Commandes Debug
```bash
# Shell dans le conteneur
railway shell

# Vérifier les variables
railway variables

# Redéployer proprement
railway down && railway up
```

---

## 📋 CHECKLIST PRÉ-DÉPLOIEMENT

- [ ] `railway.json` configuré
- [ ] Variables d'environnement définies
- [ ] `DATABASE_URL` pointe vers Railway Postgres
- [ ] Healthcheck endpoint (`/api/health`)
- [ ] Migrations Prisma prêtes
- [ ] `.gitignore` contient .env
- [ ] next.config.js avec `output: 'standalone'`
- [ ] Dockerfile testé localement (optionnel)
- [ ] Logs de build sans erreur

---

## 🚀 EXEMPLE DE PROJET COMPLET

```bash
# 1. Créer projet
npx create-next-app@latest my-app --typescript --tailwind --app

# 2. Ajouter shadcn
npx shadcn@latest init

# 3. Ajouter Prisma
npm install prisma @prisma/client
npx prisma init

# 4. Configurer Railway
# railway.json, next.config.js, Dockerfile

# 5. Créer healthcheck
# app/api/health/route.ts

# 6. Commit et push
git init && git add . && git commit -m "Init"

# 7. Déployer sur Railway
railway init
railway up
```

---

## 🔗 RESSOURCES

- **Documentation Railway:** https://docs.railway.com
- **Templates:** https://railway.app/templates
- **GraphQL Playground:** https://railway.app/graphiql
- **Discord:** https://discord.gg/railway

---

*Stack recommandée pour production stable sur Railway*
