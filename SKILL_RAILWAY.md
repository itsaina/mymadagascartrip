# Railway Deployment Skill

Quick reference for deploying projects to Railway using the API.

## Prerequisites

```bash
export RAILWAY_API_TOKEN="fd072d28-099f-405f-a2eb-beaa52dd63b7"
```

## Authentication

### SSH Key for GitHub (already configured)

**Key location:** `~/.ssh/id_ed25519`

**Fingerprint:** `SHA256:yLzKZZWbqwiiYJo9BmiVyoZ6r4SEDabK81AsAfG4pXM`

**Test:** `ssh -T git@github.com`

**Config:** `~/.ssh/config`
```
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  StrictHostKeyChecking no
```

## Common Operations

### 1. Create Project

```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { projectCreate(input: { name: \"project-name\" }) { id name } }"}'
```

### 2. Create Service from GitHub

```bash
PROJECT_ID="your-project-id"

curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"mutation { serviceCreate(input: { projectId: \\\"$PROJECT_ID\\\", name: \\\"web-service\\\", source: { repo: \\\"itsaina/REPO_NAME\\\" } }) { id name } }\"}"
```

### 3. Deploy Service

```bash
SERVICE_ID="your-service-id"
ENV_ID="your-env-id"  # Usually 'production' environment

curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"mutation { serviceInstanceDeployV2(serviceId: \\\"$SERVICE_ID\\\", environmentId: \\\"$ENV_ID\\\") }\"}"
```

### 4. Check Deployment Status

```bash
SERVICE_ID="your-service-id"

curl -s -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"query { service(id: \\\"$SERVICE_ID\\\") { id name deployments(first: 1) { edges { node { id status createdAt } } } } }\"}" | jq '.'
```

### 5. Set Environment Variable

```bash
PROJECT_ID="your-project-id"
SERVICE_ID="your-service-id"
ENV_ID="your-env-id"

curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"mutation { variableUpsert(input: { projectId: \\\"$PROJECT_ID\\\", environmentId: \\\"$ENV_ID\\\", serviceId: \\\"$SERVICE_ID\\\", name: \\\"VAR_NAME\\\", value: \\\"VAR_VALUE\\\" }) }\"}"
```

### 6. Delete Service

```bash
SERVICE_ID="your-service-id"

curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"mutation { serviceDelete(id: \\\"$SERVICE_ID\\\") }\"}"
```

## Workflow Complete Example

```bash
# 1. Create project
export RAILWAY_API_TOKEN="fd072d28-099f-405f-a2eb-beaa52dd63b7"

PROJECT=$(curl -s -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { projectCreate(input: { name: \"my-app\" }) { id name } }"}' | jq -r '.data.projectCreate.id')

# 2. Get environment (usually auto-created)
ENV_ID=$(curl -s -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"query { project(id: \\\"$PROJECT\\\") { environments { edges { node { id name } } } } }\"}" | jq -r '.data.project.environments.edges[0].node.id')

# 3. Create service from GitHub
SERVICE=$(curl -s -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"mutation { serviceCreate(input: { projectId: \\\"$PROJECT\\\", name: \\\"web\\\", source: { repo: \\\"itsaina/my-app\\\" } }) { id name } }\"}" | jq -r '.data.serviceCreate.id')

# 4. Deploy
DEPLOY=$(curl -s -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"mutation { serviceInstanceDeployV2(serviceId: \\\"$SERVICE\\\", environmentId: \\\"$ENV_ID\\\") }\"}" | jq -r '.data.serviceInstanceDeployV2')

echo "Project: $PROJECT"
echo "Service: $SERVICE"
echo "Deploy ID: $DEPLOY"
```

## Troubleshooting

### Deployment Status Values
- `INITIALIZING` - Starting up
- `BUILDING` - Building Docker image
- `DEPLOYING` - Deploying to infrastructure
- `SUCCESS` - Deployed successfully
- `CRASHED` - Application crashed
- `FAILED` - Build/deployment failed

### Common Issues

1. **"Repository not found or is not accessible"**
   - Make repo public temporarily
   - Or use Railway web UI to connect private repo

2. **"Bad credentials" on Git push**
   - SSH key is configured at `~/.ssh/id_ed25519`
   - Use `git remote set-url origin git@github.com:itsaina/REPO.git`

3. **Application crashes after deploy**
   - Check `railway.json` startCommand
   - Verify Dockerfile CMD
   - Check environment variables

## Project IDs Reference

| Projet | ID | Statut |
|---------|-----|--------|
| algoseo | `cb74bf85-77c4-4ec4-b155-48ebd5b9051b` | Active |
| cbdc-ressources | `ad17a3dd-3bf2-41f5-a659-9ca854a525dc` | Active |
| formation-ia-appliquee | `a18e1210-0f7f-4444-ab59-2805604b2528` | Active |

## Links

- Dashboard: https://railway.app/dashboard
- API Docs: https://docs.railway.com/integrations/api
