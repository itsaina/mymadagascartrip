#!/bin/bash
# Cron script pour 2424.mg - à exécuter tous les jours à 7h30
export TELEGRAM_BOT_TOKEN="7643862787:AAHnkCjgpJX7eW2hHtbJqqftVpZbUe_vY00"
export TELEGRAM_CHAT_ID="7342903080"

cd /root/.openclaw/workspace/scripts
python3 news_2424.py 2>&1 | tee -a /var/log/2424-news.log
