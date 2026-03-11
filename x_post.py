#!/usr/bin/env python3
"""
Script X (Twitter) avec requests-oauthlib
"""
import json
from requests_oauthlib import OAuth1Session

# Credentials mis à jour
API_KEY = "eFkOH3ADGUZtdUYeEp1bC1axh"
API_SECRET = "uneXMxKSreORGEoraq2nu4yXcNmCbq99nHqKBWTISFydUCDert"
ACCESS_TOKEN = "84575997-prjHNkupuTEJZnbaYfgyedVSD8N8HecWxhywXJrHn"
ACCESS_TOKEN_SECRET = "ImFGUnjeketZYCKxbRKv1SXsuQHup4eqKb48hLPqlYok9"

# Créer session OAuth1
oauth = OAuth1Session(
    API_KEY,
    client_secret=API_SECRET,
    resource_owner_key=ACCESS_TOKEN,
    resource_owner_secret=ACCESS_TOKEN_SECRET
)

def post_tweet(text):
    """Publie un tweet"""
    url = "https://api.twitter.com/2/tweets"
    payload = {"text": text}
    
    response = oauth.post(url, json=payload)
    
    if response.status_code == 201:
        print("✅ Tweet publié !")
        return response.json()
    else:
        print(f"❌ Erreur {response.status_code}")
        return response.json()

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        text = " ".join(sys.argv[1:])
        result = post_tweet(text)
        print(json.dumps(result, indent=2))
    else:
        print("Usage: python3 x_post.py 'Votre tweet'")
