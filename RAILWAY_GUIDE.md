# RAILWAY_GUIDE.md

Guide complet d'utilisation Railway pour Mr. Aina

---

## Qu'est-ce que Railway ?

Railway = Platform-as-a-Service (PaaS) pour déployer des applications sans gérer de serveur.

**Avantages vs Dokku:**
- ✅ Infrastructure gérée (pas de maintenance serveur)
- ✅ Auto-scaling
- ✅ Base de données intégrées (PostgreSQL, Redis, MongoDB)
- ✅ SSL automatique
- ✅ Déploiement GitOps (push = deploy)
- ✅ Logs temps réel
- ✅ Variables d'environnement UI

---

## Installation Railway CLI

```bash
npm install -g @railway/cli
railway --version
```

**Authentification:**
```bash
railway login
# Ouvre le navigateur pour connexion OAuth
```

---

## MCP Railway Server (NOUVEAU - Intelligence Artificielle)

Le **Railway MCP Server** permet à Kimi (moi) de gérer ton infrastructure Railway via langage naturel.

**Installation:**
```bash
npm install -g @railway/mcp-server
```

**Configuration:** `/root/.openclaw/mcp.json`
```json
{
  "mcpServers": {
    "railway": {
      "command": "npx",
      "args": ["-y", "@railway/mcp-server@latest"],
      "env": {
        "RAILWAY_API_TOKEN": "${RAILWAY_API_TOKEN}"
      }
    }
  }
}
```

**Obtenir un token API:**
1. Va sur https://railway.app/dashboard
2. Compte (avatar) → Settings → Tokens
3. Générer un nouveau token
4. Copier la valeur

---

## Capacités MCP (Ce que je peux faire pour toi)

### 1. Gestion des Projets
```
"Crée un projet Railway appelé mon-app"
"Liste tous mes projets Railway"
"Supprime le projet old-app"
"Montre-moi les détails du projet mon-app"
```

### 2. Déploiement de Services
```
"Déploie mon repo GitHub itsaina/mon-app sur Railway"
"Crée un service à partir de l'image Docker node:18"
"Redémarre le service backend"
"Montre-moi les logs du service frontend"
```

### 3. Variables d'Environnement
```
"Ajoute la variable DATABASE_URL avec cette valeur"
"Met à jour API_KEY avec la nouvelle clé"
"Liste toutes les variables du projet"
"Supprime la variable OLD_TOKEN"
```

### 4. Bases de Données
```
"Ajoute une base PostgreSQL à mon projet"
"Crée une instance Redis pour le cache"
"Donne-moi l'URL de connexion PostgreSQL"
"Configure MongoDB pour mon app"
```

### 5. Déploiements & Rollback
```
"Déploie la dernière version de main"
"Fais un rollback du déploiement précédent"
"Montre-moi l'historique des déploiements"
"Annule le déploiement en cours"
```

### 6. Monitoring
```
"Quelles sont les métriques CPU/RAM de mon service ?"
"Affiche les logs en temps réel"
"Configure une alerte si CPU > 80%"
"Y a-t-il des erreurs dans les logs ?"
```

### 7. Domaines & SSL
```
"Ajoute le domaine custom monsite.com"
"Configure SSL pour www.monsite.com"
"Vérifie si le domaine est bien configuré"
```

---

## Workflow de déploiement (CLI)

### 1. Initialiser un projet

```bash
cd /mon-projet
railway init
# ou
railway init --name mon-app
```

### 2. Lier un projet existant

```bash
railway link
# Liste les projets disponibles
# Sélectionner avec flèches
```

### 3. Configurer les variables d'environnement

```bash
# Via CLI
railway variables set DATABASE_URL="postgresql://..."
railway variables set API_KEY="sk-..."

# Via fichier .env
railway variables --file .env
```

### 4. Déployer

```bash
railway up
# Équivalent à : git push + build + deploy
```

---

## Commandes CLI essentielles

| Commande | Description |
|----------|-------------|
| `railway up` | Déployer l'application |
| `railway logs` | Logs temps réel (-f pour follow) |
| `railway logs --tail 100` | Dernières 100 lignes |
| `railway status` | Statut du service |
| `railway open` | Ouvrir l'URL dans le navigateur |
| `railway open --dashboard` | Ouvrir le dashboard Railway |
| `railway run npm start` | Exécuter une commande |
| `railway shell` | Shell dans le container |

---

## Bases de données

**Créer une DB PostgreSQL:**
```bash
railway add --database postgres
# Crée et connecte automatiquement
```

**Créer Redis:**
```bash
railway add --database redis
```

**Voir les variables de connexion:**
```bash
railway variables
# DATABASE_URL, REDIS_URL automatiquement créées
```

---

## Configuration avancée

### railway.toml (optionnel)

```toml
[build]
builder = "NIXPACKS"  # ou DOCKERFILE
buildCommand = "npm run build"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
numReplicas = 2
```

### Dockerfile support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Railway détecte automatiquement le Dockerfile.

---

## Intégration GitHub

**Setup:**
1. Dashboard Railway → Project Settings
2. GitHub Repo → Connecter
3. Branch : main
4. Auto-deploy : ON

**Résultat:**
- Push sur main → Déploiement auto
- PR → Preview environment

---

## Monitoring

**Dashboard:** https://railway.app/dashboard

**Métriques disponibles:**
- CPU usage
- Memory usage
- Disk usage
- Network I/O
- Request logs

**Alertes:**
- Configurable via dashboard
- Webhooks disponibles

---

## Pricing (2024)

| Plan | Prix | Ressources |
|------|------|------------|
| Starter | Gratuit | 500h/mois, 1GB RAM, partagé |
| Developer | $5/mois | Illimité, 8GB RAM dédié |
| Team | $20/mois | Multi-utilisateurs, prio support |

**Note:** Le plan Starter suffit pour la plupart des projets perso.

---

## Troubleshooting

**Build échoue:**
```bash
railway logs --build
# Voir les logs de build
```

**Service ne démarre pas:**
```bash
railway logs
# Voir les erreurs au runtime
```

**Redémarrer:**
```bash
railway up --detach
# Force redeploy
```

**Supprimer un projet:**
```bash
railway delete
# ou via dashboard
```

---

## Exemple: Déployer l'app "hello"

```bash
# 1. Aller dans le projet
cd /root/.openclaw/workspace/hello

# 2. Initialiser
railway init --name hello-app

# 3. Vérifier (Dockerfile existe déjà)
cat Dockerfile

# 4. Déployer
railway up

# 5. Voir l'URL
railway open
```

**Résultat:** App accessible sur `https://hello-app.up.railway.app`

---

## Alternatives Railway

| Service | Différence |
|---------|-----------|
| **Vercel** | Frontend-first (Next.js, React) |
| **Netlify** | Frontend + JAMstack |
| **Render** | Similaire à Railway, moins cher |
| **Fly.io** | Edge computing, plus technique |
| **Heroku** | Cher, legacy mais stable |

**Choix:** Railway = meilleur ratio simplicité/prix pour full-stack.

---

## Resources

- Docs: https://docs.railway.app/
- MCP Docs: https://docs.railway.com/ai/mcp-server
- Discord: https://discord.gg/railway
- GitHub: https://github.com/railwayapp/cli
- GitHub MCP: https://github.com/railwayapp/railway-mcp-server
- Templates: https://railway.app/templates

---

*Guide créé le 2026-03-07 - Omni*
*MCP Railway configuré et prêt à l'emploi*
