# Best Practices — Technical Playbook

*What works. What doesn't. The distilled essence of wins.*

---

## Purpose

This file captures **successful technical patterns**, **approaches that delivered**, and **lessons worth repeating**. It's not a generic tutorial—it's *our* playbook, built from actual experience.

---

## Architecture & Design

### Database Design
| Pattern | Context | Result |
|---------|---------|--------|
| Start with PostgreSQL | Default choice unless specific NoSQL needs | Reliable, scalable, great ecosystem |
| UUID primary keys | When data might merge across systems | Avoids collision, enables distributed architecture |
| `created_at` + `updated_at` timestamps | Every table | Essential for debugging and audit trails |
| Soft deletes (deleted_at) | User-facing data | Recovery from accidents > storage savings |

### API Design
| Pattern | Context | Result |
|---------|---------|--------|
| REST for CRUD | Standard data operations | Predictable, well-understood |
| GraphQL for complex queries | Frontend needs flexible data | Reduces over-fetching, frontend autonomy |
| Webhooks for async notifications | External integrations | Decoupled, resilient architecture |
| Version in URL (`/v1/`, `/v2/`) | Public APIs | Clean evolution without breaking changes |

---

## Development Workflow

### Git Strategy
```
main          → production-ready
  ↓
develop       → integration branch
  ↓
feature/*     → isolated work
  ↓
hotfix/*      → urgent production fixes
```

**Rules that work:**
- Never push directly to `main`
- Pull requests = code review mandatory
- Squash merge for clean history on features
- Tag releases with semantic versioning (`v1.2.3`)

### Code Organization
```
project/
├── src/              → Source code only
├── tests/            → All tests mirror src structure
├── docs/             → Documentation
├── scripts/          → Automation scripts
├── config/           → Environment configs
└── README.md         → Entry point
```

---

## Deployment & DevOps

### Railway (Our Cloud Platform)
| Practice | Why It Works |
|----------|--------------|
| One service per logical unit | Easier scaling, independent deploys |
| Environment variables for secrets | No secrets in code, rotatable |
| `railway up --detach` for CI/CD | Non-blocking deployments |
| `railway logs -f` for debugging | Real-time visibility |

### Docker Best Practices
```dockerfile
# ✅ Multi-stage builds
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["node", "server.js"]
```

**Key principles:**
- Use specific versions, never `latest`
- Minimize layers (combine RUN commands)
- `.dockerignore` is essential
- Health checks in production

---

## Security

### Secrets Management
| Approach | Use Case | Status |
|----------|----------|--------|
| Environment variables | Local dev, Railway | ✅ Standard |
| GitHub Secrets | CI/CD workflows | ✅ Standard |
| 1Password/Vault | Team shared secrets | ✅ Recommended |
| Hardcoded in code | Never | ❌ Forbidden |

### API Security Checklist
- [ ] Rate limiting (prevent abuse)
- [ ] Input validation (never trust client)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (sanitize output)
- [ ] CORS configured correctly (not `*` in production)
- [ ] Authentication on all non-public endpoints
- [ ] HTTPS only (redirect HTTP)

---

## Automation & Tooling

### OpenClaw Integrations That Work
| Tool | Use Case | Pattern |
|------|----------|---------|
| **Cron jobs** | Scheduled tasks | Isolated sessions, agentTurn payload |
| **Web search** | Research, fact-checking | Brave API, filter by freshness |
| **Browser control** | UI automation, screenshots | Chrome extension relay |
| **Sub-agents** | Parallel tasks | Spawn with timeout, don't poll loop |

### Cron Job Best Practices
```json
{
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Clear task instructions here"
  },
  "delivery": {
    "mode": "announce"
  }
}
```

**Avoid:**
- ❌ Putting "Cron:" prefixes in task messages
- ❌ Using `sessionTarget: main` for routine tasks
- ❌ Polling sub-agents in tight loops

### Cron Job Cleanup — How We Delete

**List all jobs:**
```bash
openclaw cron list
# or
curl -s "$OPENCLAW_GATEWAY_URL/cron" \
  -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" | jq
```

**Remove a specific job:**
```bash
openclaw cron remove --id <job-id>
# or
curl -X DELETE "$OPENCLAW_GATEWAY_URL/cron/<job-id>" \
  -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN"
```

**Bulk cleanup (all jobs):**
```bash
# Get all job IDs and delete them
openclaw cron list --json | jq -r '.[].id' | while read id; do
  openclaw cron remove --id "$id"
done
```

**Pattern: Cleanup After Prefix Error**
```bash
# When jobs have wrong prefix (e.g., "Cron: ..." in message)
# 1. List to see the mess
openclaw cron list

# 2. Remove malformed jobs
openclaw cron remove --id job-abc-123
openclaw cron remove --id job-def-456

# 3. Recreate clean
openclaw cron add \
  --name "Clean Reminder" \
  --schedule "0 9 * * *" \
  --message "Actual task instructions here" \
  --target isolated
```

---

## Problem Solving Patterns

### Debugging Hierarchy
1. **Check logs first** — always
2. **Reproduce locally** — isolate the environment
3. **Binary search** — comment out half, test, repeat
4. **Read the error carefully** — 80% of solutions are in the error message
5. **Search for similar issues** — GitHub issues, Stack Overflow, docs

### When Stuck
- ⏸️ Take a 5-minute break
- 📝 Write down what you know vs. what you assume
- 🎯 Reduce to the simplest failing case
- 🗣️ Explain it out loud (rubber duck debugging)

---

## Communication

### Documentation That Actually Helps
- **README.md**: What is this? How do I run it?
- **ARCHITECTURE.md**: Why was it built this way?
- **API.md**: Endpoint reference, examples
- **CHANGELOG.md**: What changed in each version?
- **TODO.md**: Known issues, future work

### Code Comments
```javascript
// ✅ WHY, not WHAT
// Cache invalidation needed because external API has 5-min delay
const cache = new Map();

// ❌ Don't state the obvious
// Increment counter by 1
counter++;
```

---

## Railway — Optimal Approach

### Project Structure
```
project/
├── railway.toml          # Railway configuration
├── Dockerfile            # Multi-stage build
├── .env.example          # Template for env vars (no secrets)
├── src/
└── scripts/
    └── deploy.sh         # Custom deploy script
```

### Configuration Files

**railway.toml**
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = ""
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Deployment Workflow
| Step | Command | Why |
|------|---------|-----|
| 1. Link project | `railway link --project <id>` | One-time setup |
| 2. Set variables | `railway variable set KEY=value` | Secrets in env |
| 3. Deploy | `railway up --detach` | Non-blocking |
| 4. Verify | `railway logs -f` | Real-time monitoring |
| 5. Database | `railway connect` | Direct DB access |

### Database Pattern
```bash
# 1. Create PostgreSQL service via dashboard or CLI
railway add --database postgres

# 2. Link service in project
railway service --service <db-service-id>

# 3. Variables auto-injected:
# DATABASE_URL, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE

# 4. Local development with Railway env
railway run npm run dev
```

### Secrets Management
```bash
# NEVER commit this
.env
.env.local
.env.railway

# DO commit this
.env.example
```

**env.example**
```bash
DATABASE_URL=
API_KEY=
JWT_SECRET=
PORT=3000
```

---

## Success Stories

### Success: Cron Jobs Cleanup — Prefix Error Fix
**Context:** Cron jobs créés avec prefix "Cron:" par erreur dans le message  
**Problem:** Les tâches affichaient du texte interne au lieu des instructions réelles  
**Approach:**
```bash
# 1. Identifier les jobs malformés
openclaw cron list

# 2. Supprimer un par un (pas de bulk delete natif)
openclaw cron remove --id <job-id-1>
openclaw cron remove --id <job-id-2>
# ... répéter pour chaque job

# 3. Recréer proprement
openclaw cron add \
  --name "Twitter Auto-Poster" \
  --schedule "0 * * * *" \
  --message "Post scheduled tweets from queue" \
  --target isolated
```
**Result:** Jobs propres, messages sans préfixe parasite

---

### Success: Raphia Bag — E-commerce Static Site
**Context:** Site vitrine avec formulaire de contact  
**Stack:** HTML/CSS/JS vanilla + Nginx  
**Railway Setup:**
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**Approach:**
- Single container Nginx servant fichiers statiques
- Formulaire géré via service externe (Formspree)
- Aucune DB nécessaire  
**Result:** Déploiement en 30s, HTTPS auto, zéro maintenance

---

### Success: CV Aina — Portfolio dynamique
**Context:** Portfolio avec génération PDF et analytics  
**Stack:** Node.js + Express + Puppeteer  
**Railway Setup:**
```dockerfile
FROM node:18-slim
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    --no-install-recommends
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
CMD ["node", "server.js"]
```

**Approach:**
- Multi-stage build pour Puppeteer + Chromium
- Variables d'environnement pour paths Chrome
- Healthcheck endpoint `/health`  
**Result:** Génération PDF serveur fonctionnelle, cold start ~3s

---

### Success: Algoseo — PostgreSQL + API
**Context:** API REST avec base de données relationnelle  
**Stack:** Node.js + PostgreSQL + Prisma ORM  
**Railway Setup:**
```yaml
# railway.yaml (optionnel pour config avancée)
services:
  api:
    build:
      dockerfile: Dockerfile
    deploy:
      healthcheck:
        path: /api/health
        timeout: 60
  
  database:
    type: postgresql
    deploy:
      replicas: 1
```

**Approach:**
- Service PostgreSQL créé via Railway dashboard
- Migrations Prisma dans `railway.toml` post-deploy hook
- Connection pooling avec `@neondatabase/serverless`  
**Result:** API scalable, DB managée, backups automatiques

---

### Pattern: External API Wrapper
**Context:** Twitter API integration  
**Approach:** 
- Separate service layer from business logic
- Retry logic with exponential backoff
- Rate limit tracking in Redis  
**Result:** Zero downtime during API outages, graceful degradation

### Pattern: Database Migration Strategy
**Context:** Adding new columns to production PostgreSQL  
**Approach:**
1. Add nullable column (no lock)
2. Backfill data in batches
3. Add NOT NULL constraint
4. Add indexes separately  
**Result:** Zero-downtime migrations on millions of rows

---

## Anti-Patterns (Learned the Hard Way)

| Anti-Pattern | Why It Failed | Better Approach |
|--------------|---------------|-----------------|
| Monolithic commits | Impossible to review/revert | Small, focused commits |
| "I'll document later" | Never happens | Document as you build |
| Premature optimization | Wasted time on non-bottlenecks | Measure first, optimize second |
| Ignoring errors | Silent failures compound | Fail fast, fail loud |
| Copy-paste coding | Technical debt multiplies | Extract reusable components |

---

## Quick Reference

### Commands Worth Memorizing
```bash
# Find what's using a port
lsof -i :3000

# Kill process by port
kill $(lsof -t -i:3000)

# Search code recursively
grep -r "pattern" --include="*.js" .

# Git: Undo last commit, keep changes
git reset --soft HEAD~1

# Docker: Clean everything
docker system prune -a

# Railway: Connect to database
railway connect
```

---

*Last updated: 2026-03-13*

**Rule #1:** If it worked once, write it down. Future you will thank present you.
