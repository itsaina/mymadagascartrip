#!/bin/bash
# Script pour récupérer les variables Railway
# Usage: ./get-railway-vars.sh [project-token]

PROJECT_TOKEN="${1:-486c3690-0576-46cc-b185-e51fb07797aa}"

echo "🔧 Configuration de Railway pour le projet raphia-bag..."

export RAILWAY_API_TOKEN="b65ef8a9-bb88-450b-be5a-656a2fdbfd63"

# Se déplacer dans le dossier du projet
cd /root/.openclaw/workspace/raphia-bag 2>/dev/null || cd .

# Link le projet
railway link --project 73ef10d5-31cc-4f5b-b43f-b026581dd361 --environment 91952724-2e5c-4aaf-9d0a-817690a9b9a5 --yes 2>/dev/null || true

echo "📋 Variables disponibles:"
railway variables

echo ""
echo "💡 Pour copier une valeur spécifique, utilisez:"
echo "   railway variables get DATABASE_URL"
echo ""
echo "📝 Pour exporter toutes les variables dans un fichier .env:"
echo "   railway variables > .env.railway"
