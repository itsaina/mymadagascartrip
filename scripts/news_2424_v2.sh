#!/bin/bash
# Script de news 2424.mg avec envoi via OpenClaw

LOG_FILE="/var/log/2424-news.log"
RSS_URL="https://2424.mg/feed/"

# Récupérer le flux
echo "[$(date)] Récupération RSS..." | tee -a $LOG_FILE

# Parser avec Python et envoyer directement
python3 << 'EOF'
import feedparser
import requests
import sys

RSS_URL = "https://2424.mg/feed/"
BOT_TOKEN = "7643862787:AAHnkCjgpJX7eW2hHtbJqqftVpZbUe_vY00"
CHAT_ID = "7342903080"

try:
    feed = feedparser.parse(RSS_URL)
    entries = feed.entries[:5]
    
    if not entries:
        print("Aucune news")
        sys.exit(1)
    
    message = "📰 **2424.mg - Récap du jour**\n\n"
    for i, entry in enumerate(entries, 1):
        title = entry.get('title', 'Sans titre')
        link = entry.get('link', '')
        message += f"{i}. **{title}**\n   👉 {link}\n\n"
    
    message += "_Source: 2424.mg_"
    
    # Envoyer via API Telegram
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": message,
        "parse_mode": "Markdown",
        "disable_web_page_preview": True
    }
    
    response = requests.post(url, json=payload, timeout=30)
    if response.json().get('ok'):
        print("✅ Message envoyé avec succès")
    else:
        print(f"❌ Erreur: {response.text}")
        sys.exit(1)
        
except Exception as e:
    print(f"❌ Erreur: {e}")
    sys.exit(1)
EOF

RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[$(date)] ✅ Succès" | tee -a $LOG_FILE
else
    echo "[$(date)] ❌ Échec" | tee -a $LOG_FILE
fi

exit $RESULT
