#!/bin/bash
# Deploy script for mymadagascartrip

echo "Déploiement de mymadagascartrip sur Railway..."
echo ""
echo "1. Connexion à Railway..."
railway login

echo ""
echo "2. Lien avec le projet..."
cd /root/.openclaw/workspace/mymadagascartrip
railway link --project e99e5128-796d-41c1-99b5-409ed2f24686

echo ""
echo "3. Déploiement..."
railway up

echo ""
echo "4. Génération du domaine..."
railway domain

echo ""
echo "Déploiement terminé !"
