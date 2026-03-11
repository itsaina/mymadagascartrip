#!/usr/bin/env python3
"""
Script de récupération RSS 2424.mg
Génère un fichier de sortie avec les news formatées
"""
import feedparser
from datetime import datetime
import os

RSS_URL = "https://2424.mg/feed/"
OUTPUT_FILE = "/tmp/news_2424_output.txt"

try:
    feed = feedparser.parse(RSS_URL)
    entries = feed.entries[:5]
    
    if not entries:
        message = "📰 Aucune news aujourd'hui sur 2424.mg"
    else:
        message = "📰 **2424.mg - Récap du jour**\n\n"
        for i, entry in enumerate(entries, 1):
            title = entry.get('title', 'Sans titre')
            link = entry.get('link', '')
            # Nettoyer le lien des paramètres UTM
            if '?' in link:
                link = link.split('?')[0]
            message += f"{i}. **{title}**\n   👉 {link}\n\n"
        
        message += "_Source: 2424.mg_"
    
    # Sauvegarder dans le fichier
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(message)
    
    print(f"✅ News récupérées et sauvegardées dans {OUTPUT_FILE}")
    print(message)
    
except Exception as e:
    error_msg = f"❌ Erreur: {str(e)}"
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(error_msg)
    print(error_msg)
