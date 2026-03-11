# Railway Deployment - Méthode utilisée

## Architecture du déploiement

```
Code source (Dockerfile)
    ↓
railway up --service <service-id>
    ↓
Railway Cloud (Build + Deploy)
    ↓
URL publique : https://<service>-production.up.railway.app
```

## Étapes du déploiement

### 1. Créer le projet Railway (via API GraphQL)
```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer <WORKSPACE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { projectCreate(input: { name: \"<nom-projet>\" }) { id name } }"}'
```

### 2. Créer le service
```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer <WORKSPACE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { serviceCreate(input: { projectId: \"<project-id>\", name: \"<nom-service>\" }) { id name } }"}'
```

### 3. Créer un Project Token (pour le déploiement)
```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer <WORKSPACE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { projectTokenCreate(input: { projectId: \"<project-id>\", environmentId: \"<env-id>\", name: \"deploy-token\" }) }"}'
# Retourne le token à utiliser
```

### 4. Déployer avec Railway CLI
```bash
cd <dossier-projet>
export RAILWAY_TOKEN=<project-token>
railway up --service <service-id>
```

### 5. Générer le domaine
```bash
export RAILWAY_TOKEN=<project-token>
railway domain --service <service-id>
# Retourne: https://<service>-production.up.railway.app
```

## Configuration Dockerfile pour Railway

```dockerfile
FROM nginx:alpine

COPY . /usr/share/nginx/html/

# IMPORTANT: Railway injecte le port via la variable PORT
ENV PORT=80
EXPOSE 80

CMD sed -i "s/listen       80;/listen       ${PORT:-80};/g" /etc/nginx/conf.d/default.conf && nginx -g "daemon off;"
```

## Tokens utilisés

| Token | Usage | Scope |
|-------|-------|-------|
| Workspace Token | Créer projets/services | Tout le workspace |
| Project Token | Déployer (`railway up`) | Un projet spécifique |

## URLs Railway

- Dashboard: https://railway.com/dashboard
- API GraphQL: https://backboard.railway.com/graphql/v2
- Projet raphia-bag: https://railway.com/project/73ef10d5-31cc-4f5b-b43f-b026581dd361

## Exemple: Redéploiement rapide

```bash
cd /root/.openclaw/workspace/raphia-bag
export RAILWAY_TOKEN=486c3690-0576-46cc-b185-e51fb07797aa
railway up --service da18ceb6-cbe0-4caa-b3fb-15c611177e78
```

## Logs et monitoring

```bash
export RAILWAY_TOKEN=<token>
railway logs --service <service-id>
railway status
```

---
Documentation: https://docs.railway.com/guides/cli
API Reference: https://docs.railway.com/integrations/api
