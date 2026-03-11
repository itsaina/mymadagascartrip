#!/bin/bash
# Vérification du système de tweets

echo "=== Vérification Twitter Automation ==="
echo "Date: $(date)"
echo "CWD: $(pwd)"
echo ""

cd /root/.openclaw/workspace/twitter-automation/scripts

echo "1. Vérification du fichier .env:"
if [ -f .env ]; then
    echo "   ✅ .env trouvé"
    echo "   Variables: $(grep -c '=' .env)"
else
    echo "   ❌ .env MANQUANT"
fi

echo ""
echo "2. Vérification des calendriers:"
for i in 0 1 2 3 4 5 6; do
    date=$(date -d "+$i days" +%Y-%m-%d)
    if [ -f "calendar/$date.json" ]; then
        count=$(grep -c '"sent": false' "calendar/$date.json" 2>/dev/null || echo 0)
        echo "   ✅ $date ($count tweets en attente)"
    else
        echo "   ❌ $date MANQUANT"
    fi
done

echo ""
echo "3. Derniers tweets envoyés:"
tail -3 sent-tweets.json 2>/dev/null | grep sentAt || echo "   Aucun"

echo ""
echo "4. Test de connexion API:"
node -e "
const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();
const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});
client.v2.me().then(u => console.log('   ✅ Connecté en tant que:', u.data.username))
  .catch(e => console.log('   ❌ Erreur:', e.message));
" 2>&1