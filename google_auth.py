#!/usr/bin/env python3
"""
Script pour authentifier Google Calendar avec client ID personnalisé
"""
import json
import urllib.parse
import urllib.request
import webbrowser
import http.server
import socketserver
import threading

# Tes credentials
CLIENT_ID = "506037711857-jjq75mb4uu7pfjlj7bhnoe9vgoc8mbka.apps.googleusercontent.com"
CLIENT_SECRET = "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"
REDIRECT_URI = "http://localhost:8080/callback"
SCOPES = "https://www.googleapis.com/auth/calendar"

def get_auth_url():
    """Génère l'URL d'authentification"""
    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "scope": SCOPES,
        "response_type": "code",
        "access_type": "offline",
        "prompt": "consent"
    }
    return f"https://accounts.google.com/o/oauth2/auth?{urllib.parse.urlencode(params)}"

def exchange_code_for_token(code):
    """Échange le code contre un token"""
    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=urllib.parse.urlencode(data).encode(),
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

if __name__ == "__main__":
    auth_url = get_auth_url()
    print(f"\nOuvre ce lien dans ton navigateur:\n{auth_url}\n")
    print("Après autorisation, copie le code de l'URL et colle-le ici.")
    
    code = input("\nCode: ").strip()
    
    if code:
        tokens = exchange_code_for_token(code)
        print(f"\n✅ Authentification réussie!")
        print(f"\nAccess Token: {tokens.get('access_token', 'N/A')[:50]}...")
        print(f"Refresh Token: {tokens.get('refresh_token', 'N/A')[:50]}...")
        
        # Sauvegarder
        with open("/root/.openclaw/workspace/google_tokens.json", "w") as f:
            json.dump(tokens, f, indent=2)
        print("\nTokens sauvegardés dans google_tokens.json")
