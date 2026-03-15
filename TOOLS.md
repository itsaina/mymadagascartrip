# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

---

## GitHub - Repository Access

**Username:** @itsaina  
**Token:** `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`  
**Scope:** repo (private + public)  

### Configuration

**Fichier token:** `/root/.openclaw/workspace/.env.github`

```bash
# Activer le token
export GITHUB_TOKEN="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"

# Git credentials automatiques
git config --global credential.helper store
echo "https://itsaina207:${GITHUB_TOKEN}@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials
```

### Commandes utiles

```bash
# Cloner un repo
export GITHUB_TOKEN="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"
git clone https://itsaina207:${GITHUB_TOKEN}@github.com/OWNER/REPO.git

# API GitHub
curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user/repos | jq '.[].name'

# Lister mes repos
curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user/repos
```

### Repos publics actuels
- (à compléter quand on en aura)

---

## Table des matières

1. [GitHub - Repository Access](#github---repository-access)
2. [Railway - Déploiement Cloud](#railway---déploiement-cloud)
3. [Twitter/X - Automatisation](#twitterx---automatisation)
4. [Trello - Gestion de projet](#trello---gestion-de-projet)
5. [Browser/Chrome - Automation](#browserchrome---automation)
6. [Skills Locaux](#skills-locaux)
7. [Autres configurations](#autres-configurations)

---

## Railway - Déploiement Cloud

**API Token:** `fd072d28-099f-405f-a2eb-beaa52dd63b7`

### API GraphQL

**Endpoint:** `https://backboard.railway.com/graphql/v2`

**Headers:**
```
Authorization: Bearer fd072d28-099f-405f-a2eb-beaa52dd63b7
Content-Type: application/json
```

### Mutations clés

**Créer un projet:**
```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { projectCreate(input: { name: \"project-name\" }) { id } }"}'
```

**Créer un service avec GitHub:**
```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { serviceCreate(input: { projectId: \"project-id\", name: \"service-name\", source: { repo: \"username/repo\" } }) { id name } }"
  }'
```

**Déployer un service:**
```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { serviceInstanceDeployV2(serviceId: \"service-id\", environmentId: \"env-id\") }"
  }'
```

**Lister les projets:**
```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { projects { edges { node { id name } } } }"}'
```

### Limitations API

⚠️ **Important:** Le token API ne peut pas déployer depuis GitHub sans autorisation OAuth préalable via l'interface web.

### Documentation complète
- Fichier: `/root/.openclaw/workspace/RAILWAY_API.md`
- Docs officielles: https://docs.railway.com/integrations/api

---

## Railway - Déploiement Cloud

**CLI Connecté :** ✅ Aina R (aina.fournier@gmail.com)  
**Version CLI :** 4.31.0

> ⚠️ **Note :** Les anciens tokens (raphia-bag, cv-aina) sont expirés. Le CLI utilise maintenant l'authentification directe (token stocké dans `~/.railway/config.json`).

### Tokens Railway

| Token | Valeur | Type | Statut |
|-------|--------|------|--------|
| **Project Token** | `fd072d28-099f-405f-a2eb-beaa52dd63b7` | Project | ✅ Actif |
| ~~raphia-bag~~ | ~~`486c3690-0576-46cc-b185-e51fb07797aa`~~ | ~~Project~~ | ❌ Expiré |
| ~~cv-aina~~ | ~~`148d38df-1a0a-46c7-93e1-e6c854011a77`~~ | ~~Project~~ | ❌ Expiré |
| ~~Workspace Token~~ | ~~`b65ef8a9-bb88-450b-be5a-656a2fdbfd63`~~ | ~~Compte~~ | ❌ Expiré |

### Projets actifs

| Projet | ID | Services | Status |
|--------|-----|----------|--------|
| **algoseo** | `cb74bf85-77c4-4ec4-b155-48ebd5b9051b` | PostgreSQL ✅ | ✅ DB créée |
| **formation-ia-appliquee** | `a18e1210-0f7f-4444-ab59-2805604b2528` | - | - |

### Lister les projets via API

```bash
export RAILWAY_API_TOKEN="fd072d28-099f-405f-a2eb-beaa52dd63b7"

curl -s -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { projects { edges { node { id name } } } }"}' | jq '.data.projects.edges[].node'
```

### Railway CLI - Commandes complètes

**Utilisateur connecté :** Aina R (aina.fournier@gmail.com)

#### 🔐 Authentication
```bash
railway login                    # Login avec navigateur
railway login --browserless      # Login sans navigateur (code + lien)
railway logout                   # Déconnexion
railway whoami                   # Utilisateur connecté
```

#### 📁 Project Management
```bash
railway init                     # Créer un nouveau projet
railway link                     # Lier à un projet existant
railway link --project <id>      # Lier à un projet spécifique
railway unlink                   # Délier le dossier courant
railway list                     # Lister tous les projets
railway status                   # Info du projet courant
railway open                     # Ouvrir dans le navigateur
```

#### 🚀 Deployment
```bash
railway up                       # Déployer le dossier courant
railway up --detach              # Déployer sans logs temps réel
railway up --service <id>        # Déployer un service spécifique
railway deploy --template postgres  # Déployer un template
railway redeploy                 # Redéployer
railway restart                  # Redémarrer un service
railway down                     # Supprimer le dernier déploiement
```

#### ⚙️ Services
```bash
railway add                      # Ajouter un service (interactif)
railway add --database postgres  # Ajouter PostgreSQL
railway add --repo user/repo     # Ajouter depuis GitHub
railway service                  # Lier un service
railway service --service <id>   # Lier un service spécifique
railway scale                    # Scaler un service
railway delete                   # Supprimer un projet
```

#### 🔧 Variables
```bash
railway variable list            # Lister les variables
railway variable get <KEY>       # Voir une variable
railway variable set KEY=value   # Définir une variable
railway variable delete KEY      # Supprimer une variable
```

#### 🌍 Environments
```bash
railway environment              # Changer d'environnement (interactif)
railway environment new staging  # Créer un nouvel environnement
railway environment delete dev   # Supprimer un environnement
```

#### 💻 Local Development
```bash
railway run npm start            # Lancer avec les variables Railway
railway run python app.py        # Lancer Python avec env vars
railway shell                    # Shell avec variables Railway
railway dev                      # Lancer localement avec Docker
```

#### 📊 Logs & Debugging
```bash
railway logs                     # Logs temps réel
railway logs --build             # Logs de build
railway logs -n 100              # Dernières 100 lignes
railway logs --service <id>      # Logs d'un service
railway ssh                      # SSH dans le container
railway connect                  # Shell dans la base de données
```

#### 🌐 Networking
```bash
railway domain                   # Générer un domaine Railway
railway domain example.com       # Ajouter un domaine custom
```

#### 💾 Volumes
```bash
railway volume list              # Lister les volumes
railway volume add               # Ajouter un volume
railway volume delete            # Supprimer un volume
```

#### 🧩 Fonctions (Railway Functions)
```bash
railway functions list           # Lister les fonctions
railway functions new            # Créer une fonction
railway functions push           # Pousser les changements
```

#### 🛠️ Global Options
```bash
-s, --service <id>               # Cibler un service
-e, --environment <id>           # Cibler un environnement
--json                           # Sortie JSON
-y, --yes                        # Skip confirmation
-h, --help                       # Aide
-V, --version                    # Version
```

### Exemples rapides

```bash
# Déployer le projet courant
railway up

# Voir les variables (avec le secret DATABASE_URL)
railway variable list

# Logs en temps réel
railway logs -f

# Se connecter à la DB Postgres
railway connect

# Lancer en local avec les env vars
railway run npm run dev
```

### Algoseo - Configuration

**Projet lié :** `/tmp` (ou créer un dossier dédié)

```bash
# Lier le projet
cd /tmp
railway link --project cb74bf85-77c4-4ec4-b155-48ebd5b9051b

# Lier le service PostgreSQL
railway service 6adff3b2-4886-4a9a-aa34-0b86e5cd298f

# Voir les variables DB
railway variable list

# Se connecter à la DB
railway connect
```

**Service PostgreSQL :**
- **Nom :** Postgres-Iep3
- **ID :** `6adff3b2-4886-4a9a-aa34-0b86e5cd298f`
- **Variables :** DATABASE_URL, PGHOST, PGPORT, etc.
- **Fichier config :** `/root/.openclaw/workspace/algoseo/.env.railway`

### Dockerfile Railway (nginx)

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html/
ENV PORT=80
EXPOSE 80
CMD sed -i "s/listen       80;/listen       ${PORT:-80};/g" /etc/nginx/conf.d/default.conf && nginx -g "daemon off;"
```

---

### MCP Server Configuration

**Fichier :** `/root/.openclaw/mcp.json`

```json
{
  "mcpServers": {
    "railway": {
      "command": "npx",
      "args": ["-y", "@railway/mcp-server@latest"],
      "env": {
        "RAILWAY_API_TOKEN": "fd072d28-099f-405f-a2eb-beaa52dd63b7"
      }
    }
  }
}
```

**Note :** Le MCP Railway est aussi dans `/root/.openclaw/openclaw.json`

### Kimi API Configuration

**Fichier :** `/root/.openclaw/openclaw.json`

```json
"env": {
  "KIMI_API_KEY": "sk-kimi-I2WpBrgv6cEhbsqYXrXMxumXB9geiRMofoiDmezLyouvFQo3ujn92ZhvJcKaFrvb",
  "KIMI_PLUGIN_API_KEY": "sk-kimi-I2WpBrgv6cEhbsqYXrXMxumXB9geiRMofoiDmezLyouvFQo3ujn92ZhvJcKaFrvb"
}
```

---

## Twitter/X - Automatisation

**Compte :** @itsaina207  
**Localisation :** `/root/.openclaw/workspace/twitter-automation/`

### Tokens API Twitter

Fichier : `/root/.openclaw/workspace/twitter-automation/scripts/.env`

| Variable | Valeur |
|----------|--------|
| API_KEY | `xa9t3NVSBVAEbroNtGIPlX657` |
| API_SECRET | `VLeXdu1N2QuGGAHPLLKtcucvPb1zHVfts803uPO6F1CELkMfHj` |
| ACCESS_TOKEN | `84575997-pPjmv2tWW9iSqwri05t3wF6gwGFZ7M7cFNSJHNnxh` |
| ACCESS_TOKEN_SECRET | `C8tuJrmGdFkCPpYKShiLrdzZUwsrTo9rQ79rfRMwUbetc` |
| BEARER_TOKEN | `AAAAAAAAAAAAAAAAAAAAADdH8AEAAAAAswMzspUxF3Zfu3U9qt8V%2BOyE8n4%3Dnyprz23pVCavIywCo2rPXG8AWQSMZNyhUklcQVotSl2mEYbzAQ` |

### Architecture

```
Cron (toutes les heures)
    ↓
tweet-calendar.js
    ↓
calendar/YYYY-MM-DD.json → Poste le tweet programmé
```

### Fichiers clés

- `tweet-calendar.js` - Script d'envoi automatique
- `calendar/2026-03-08.json` - Tweets du jour (10 tweets/jour)
- `sent-tweets.json` - Logs des tweets envoyés

### Architecture du système

```
Cron (toutes les heures à XX:00)
    ↓
tweet-calendar.js (vérifie l'heure actuelle)
    ↓
calendar/YYYY-MM-DD.json → Envoie le tweet programmé → Marque "sent": true
```

**Fichier :** `/root/.openclaw/workspace/twitter-automation/scripts/tweet-calendar.js`

### Cron Job Configuration

**Nom :** `Twitter Auto-Poster (Calendrier)`  
**Schedule :** `0 * * * *` (toutes les heures)  
**Timezone :** `Indian/Antananarivo` (GMT+3)  
**Statut :** ✅ Actif

**Action :** Exécute `node tweet-calendar.js` qui consulte le calendrier du jour et poste le tweet prévu pour l'heure actuelle.

### Calendriers créés (6 jours)

| Date | Fichier | Tweets | Thèmes |
|------|---------|--------|--------|
| 2026-03-08 | `2026-03-08.json` | 10 | Viral Growth, Stablecoins, CBDC, DeFi, Web3, Crypto Macro |
| 2026-03-09 | `2026-03-09.json` | 10 | Viral Growth, Stablecoins, CBDC, DeFi, Web3, Crypto Macro |
| 2026-03-10 | `2026-03-10.json` | 10 | Viral Growth, Stablecoins, CBDC, DeFi, Web3, Crypto Macro |
| 2026-03-11 | `2026-03-11.json` | 10 | Viral Growth, Stablecoins, CBDC, DeFi, Web3, Crypto Macro |
| 2026-03-12 | `2026-03-12.json` | 10 | Viral Growth, Stablecoins, CBDC, DeFi, Web3, Crypto Macro |
| 2026-03-13 | `2026-03-13.json` | 10 | Viral Growth, Stablecoins, CBDC, DeFi, Web3, Crypto Macro |

**Localisation :** `/root/.openclaw/workspace/twitter-automation/scripts/calendar/`

### Structure d'un calendrier

```json
{
  "date": "2026-03-08",
  "tweets": [
    {
      "time": "08:00",
      "text": "Tweet content...",
      "theme": "Viral Growth",
      "sent": false
    }
  ]
}
```

### Commandes de gestion

```bash
cd /root/.openclaw/workspace/twitter-automation/scripts

# Poster un tweet
node playground.js post "Mon message"

# Voir profil
node playground.js whoami

# Timeline
node playground.js timeline 10
```

### Calendriers créés

| Date | Tweets | Statut |
|------|--------|--------|
| 2026-03-08 | 10 | ✅ Actif |
| 2026-03-09 | 10 | ✅ Prêt |
| 2026-03-10 | 10 | ✅ Prêt |
| 2026-03-11 | 10 | ✅ Prêt |
| 2026-03-12 | 10 | ✅ Prêt |
| 2026-03-13 | 10 | ✅ Prêt |

---

## Trello - Gestion de projet ✅ CONFIGURÉ

**Skill :** `/root/.openclaw/skills/trello/SKILL.md`  
**Statut :** ✅ Configuré et opérationnel

### Tokens Trello

```bash
export TRELLO_API_KEY="2a36cde48b43b264efbb3cf729ba2e6a"
export TRELLO_TOKEN="ATTAd8ef44fede4a55e0ff1e6c95dd7954691fdd5ae80b865a5f61b182a523369bacDD38B4BA"
```

**Fichier :** `/root/.openclaw/workspace/.env` ou `/root/.openclaw/workspace/.env.trello`

### Compte connecté

| Info | Valeur |
|------|--------|
| **Nom** | RAHERIMANANTSOA |
| **Username** | @aina94 |
| **Boards** | 2 tableaux (Global + Mon tableau Trello) |

### Tableaux

| Nom | ID | URL |
|-----|-----|-----|
| **Global** | `69ad851bc2ec83e42c1ff4ff` | https://trello.com/b/3d1a6IRG |
| Mon tableau Trello | `69aaec8a926083209f4fffac` | https://trello.com/b/rxtC6rlR |

### Labels configurés

| Label | Couleur |
|-------|---------|
| CBDC Project Manager | Vert |
| Get-trained.xyz | Bleu |

### Commandes utiles

```bash
# Lister les boards
curl -s "https://api.trello.com/1/members/me/boards?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" | jq '.[] | {name, id}'

# Lister les listes d'un board
curl -s "https://api.trello.com/1/boards/{boardId}/lists?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" | jq '.[] | {name, id}'

# Créer une carte
curl -s -X POST "https://api.trello.com/1/cards?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" \
  -d "idList={listId}" \
  -d "name=Titre de la carte" \
  -d "desc=Description"

# Déplacer une carte
curl -s -X PUT "https://api.trello.com/1/cards/{cardId}?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN" \
  -d "idList={newListId}"
```

---

## Browser/Chrome - Automation

**Configuration :** `/root/.openclaw/openclaw.json`

### Configuration actuelle

```json
"browser": {
  "executablePath": "/usr/bin/google-chrome",
  "headless": true,
  "noSandbox": true,
  "defaultProfile": "openclaw"
}
```

### Ports utilisés

| Service | Port | Statut |
|---------|------|--------|
| Chrome (OpenClaw) | 18800 | ✅ Configuré |
| Gateway | 18789 | ✅ Actif |

### Commandes browser

```bash
# Capture d'écran
curl http://localhost:18800/screenshot?url=https://example.com

# Statut du browser
curl http://localhost:18800/status

# Utilisation via OpenClaw
openclaw browser open https://itsaina.com
```

---

## Skills Locaux

**Dossier :** `/root/.openclaw/skills/`

| Skill | Chemin | Description |
|-------|--------|-------------|
| trello | `/root/.openclaw/skills/trello/` | Gestion Trello |
| channels-setup | `/root/.openclaw/skills/channels-setup/` | Setup IM channels |
| self-improving-agent | `/root/.openclaw/skills/self-improving-agent/` | Capture d'erreurs |

### Skills système

**Dossier :** `/usr/lib/node_modules/openclaw/skills/`

| Skill | Description |
|-------|-------------|
| feishu-doc | Documents Feishu |
| feishu-drive | Stockage Feishu |
| feishu-perm | Permissions Feishu |
| feishu-wiki | Wiki Feishu |
| healthcheck | Sécurité système |
| himalaya | Emails IMAP/SMTP |
| openai-whisper | Speech-to-text |
| skill-creator | Création de skills |
| tmux | Sessions tmux |
| video-frames | Extraction vidéo |
| weather | Météo |

---

## Autres configurations

### Telegram (Channel)

- **Bot :** Configuré dans `openclaw.json`
- **Chat ID :** `7342903080`
- **Surface :** Direct message

### Gateway OpenClaw

- **Port :** 18789
- **Mode :** local
- **Auth :** Token-based

### Cron Jobs actifs

| Nom | Schedule | Description |
|-----|----------|-------------|
| Twitter Auto-Poster | `0 * * * *` | Envoie les tweets programmés |
| Récap Twitter Soir | `0 20 * * *` | Bilan quotidien |
| Rappel Apex Hackathon | `35 7 * * *` | Deadline 24 mars 2026 |

### Workspace projects

| Projet | Chemin | URL déployée |
|--------|--------|--------------|
| raphia-bag | `/workspace/raphia-bag/` | https://raphia-web-production.up.railway.app |
| cv-aina | `/workspace/cv-aina/` | https://cv-web-production.up.railway.app |
| twitter-automation | `/workspace/twitter-automation/` | - |
| mymadagascartrip | `/root/.openclaw/workspace/mymadagascartrip/` | https://mymadagascartrip-web-mymadagascartrip.up.railway.app |

---

## Quick Reference

### Lister les projets Railway

```bash
export RAILWAY_API_TOKEN="fd072d28-099f-405f-a2eb-beaa52dd63b7"

curl -s -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { projects { edges { node { id name } } } }"}' | jq '.data.projects.edges[].node'
```

### Envoyer un tweet manuel

```bash
cd /root/.openclaw/workspace/twitter-automation/scripts
node playground.js post "Mon tweet ici"
```

---

## Variables d'environnement courantes

```bash
# Railway (token actif)
export RAILWAY_API_TOKEN="fd072d28-099f-405f-a2eb-beaa52dd63b7"

# Twitter (dans le dossier twitter-automation/scripts/.env)
export API_KEY="xa9t3NVSBVAEbroNtGIPlX657"
export API_SECRET="VLeXdu1N2QuGGAHPLLKtcucvPb1zHVfts803uPO6F1CELkMfHj"
export ACCESS_TOKEN="84575997-pPjmv2tWW9iSqwri05t3wF6gwGFZ7M7cFNSJHNnxh"
export ACCESS_TOKEN_SECRET="C8tuJrmGdFkCPpYKShiLrdzZUwsrTo9rQ79rfRMwUbetc"
export BEARER_TOKEN="AAAAAAAAAAAAAAAAAAAAADdH8AEAAAAAswMzspUxF3Zfu3U9qt8V%2BOyE8n4%3Dnyprz23pVCavIywCo2rPXG8AWQSMZNyhUklcQVotSl2mEYbzAQ"

# Trello (à configurer)
export TRELLO_API_KEY=""
export TRELLO_TOKEN=""
```

---

## Notes

- **Tokens sensibles** : Ne jamais commiter les fichiers `.env`
- **Railway** : Utilise toujours `PORT` environnement variable
- **Twitter** : Limite 300 tweets / 3h
- **Trello** : 300 requêtes / 10s par API key

---

*Dernière mise à jour : 10/03/2026*
