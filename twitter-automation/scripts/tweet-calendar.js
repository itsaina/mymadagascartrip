// tweet-calendar.js - Vérifie et envoie les tweets programmés
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le répertoire courant du fichier
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger le .env explicitement depuis le répertoire du script
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: log si les variables sont chargées
if (!process.env.API_KEY) {
  console.error('❌ ERREUR: Variables d\'environnement non chargées!');
  console.error('CWD:', process.cwd());
  console.error('__dirname:', __dirname);
  process.exit(1);
}

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

const rw = client.readWrite;

// Fichier pour tracker les tweets déjà envoyés (éviter les doublons)
const SENT_LOG = path.join(__dirname, 'sent-tweets.json');

function loadSentTweets() {
  try {
    return JSON.parse(fs.readFileSync(SENT_LOG, 'utf8'));
  } catch {
    return [];
  }
}

function saveSentTweet(id) {
  const sent = loadSentTweets();
  sent.push({ id, sentAt: new Date().toISOString() });
  fs.writeFileSync(SENT_LOG, JSON.stringify(sent, null, 2));
}

function getTodayDate() {
  // Utiliser le fuseau horaire de Madagascar (GMT+3)
  const madagascarTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Indian/Antananarivo' }));
  return madagascarTime.toISOString().split('T')[0]; // YYYY-MM-DD
}

function getCurrentHour() {
  const now = new Date();
  // Convertir en heure d'Antananarivo (GMT+3)
  const madagascarTime = new Date(now.toLocaleString('en-US', { timeZone: 'Indian/Antananarivo' }));
  return madagascarTime.getHours();
}

async function sendTweet(text) {
  try {
    const posted = await rw.v2.tweet(text);
    console.log(`✅ Tweet envoyé: ID ${posted.data.id}`);
    saveSentTweet(posted.data.id);
    return true;
  } catch (err) {
    console.error(`❌ Erreur: ${err.message}`);
    return false;
  }
}

async function checkAndSendTweets() {
  const today = getTodayDate();
  const currentHour = getCurrentHour();
  const sentTweets = loadSentTweets();
  
  // Charger le calendrier du jour (chemin absolu)
  const calendarPath = path.join(__dirname, 'calendar', `${today}.json`);
  
  if (!fs.existsSync(calendarPath)) {
    console.log(`Pas de calendrier pour ${today}`);
    return;
  }
  
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
  
  // Chercher un tweet programmé pour cette heure
  const tweetToSend = calendar.tweets.find(t => {
    const tweetHour = parseInt(t.time.split(':')[0]);
    return tweetHour === currentHour && !t.sent;
  });
  
  if (!tweetToSend) {
    console.log(`Pas de tweet programmé pour ${currentHour}h`);
    return;
  }
  
  // Vérifier si déjà envoyé (par contenu)
  const alreadySent = sentTweets.some(s => 
    new Date(s.sentAt).toISOString().split('T')[0] === today &&
    s.id.includes(tweetToSend.text.substring(0, 20))
  );
  
  if (alreadySent) {
    console.log('Tweet déjà envoyé aujourd\'hui');
    return;
  }
  
  console.log(`Envoi du tweet prévu à ${tweetToSend.time}...`);
  const success = await sendTweet(tweetToSend.text);
  
  if (success) {
    // Marquer comme envoyé dans le calendrier
    tweetToSend.sent = true;
    fs.writeFileSync(calendarPath, JSON.stringify(calendar, null, 2));
    console.log(`✅ Calendrier mis à jour: ${tweetToSend.time} marqué comme envoyé`);
  }
}

checkAndSendTweets().catch(console.error);
