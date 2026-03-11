#!/bin/bash
# Script wrapper pour récupérer et envoyer les news 2424.mg

LOG_FILE="/var/log/2424-news.log"
OUTPUT_FILE="/tmp/news_2424_output.txt"
BOT_TOKEN="8351522562:AAF-SAHvrftPUvLa5VsZJBvS28ZTDxkOdg0"
CHAT_ID="7342903080"

echo "[$(date)] Début récupération 2424.mg..." | tee -a $LOG_FILE

# Récupérer les news
cd /root/.openclaw/workspace/scripts
python3 news_2424.py 2>&1 | tee -a $LOG_FILE

# Vérifier si le fichier existe
if [ -f "$OUTPUT_FILE" ]; then
    # Lire le contenu
    MESSAGE=$(cat "$OUTPUT_FILE")
    
    # Envoyer via Telegram
    curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
        -H "Content-Type: application/json" \
        -d "{\"chat_id\":\"$CHAT_ID\",\"text\":$(echo "$MESSAGE" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'),\"parse_mode\":\"Markdown\",\"disable_web_page_preview\":true}" 2>&1 | tee -a $LOG_FILE
    
    echo "" | tee -a $LOG_FILE
    echo "[$(date)] ✅ Terminé" | tee -a $LOG_FILE
else
    echo "[$(date)] ❌ Fichier de sortie non trouvé" | tee -a $LOG_FILE
    exit 1
fi
