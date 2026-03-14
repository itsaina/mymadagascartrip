// catchup-tweets.js - Envoie tous les tweets manqués du jour
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

if (!process.env.API_KEY) {
  console.error('❌ ERREUR: Variables d\'environnement non chargées!');
  process.exit(1);
}

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

const rw = client.readWrite;
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
  const madagascarTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Indian/Antananarivo' }));
  return madagascarTime.toISOString().split('T')[0];
}

function getCurrentHour() {
  const madagascarTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Indian/Antananarivo' }));
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

async function catchUpTweets() {
  const today = getTodayDate();
  const currentHour = getCurrentHour();
  const sentTweets = loadSentTweets();
  
  const calendarPath = path.join(__dirname, 'calendar', `${today}.json`);
  
  if (!fs.existsSync(calendarPath)) {
    console.log(`Pas de calendrier pour ${today}`);
    return;
  }
  
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
  
  // Trouver tous les tweets non envoyés dont l'heure est passée
  const missedTweets = calendar.tweets.filter(t => {
    const tweetHour = parseInt(t.time.split(':')[0]);
    return tweetHour <= currentHour && !t.sent;
  });
  
  if (missedTweets.length === 0) {
    console.log('Aucun tweet manqué à rattraper');
    return;
  }
  
  console.log(`📊 ${missedTweets.length} tweet(s) à rattraper`);
  
  for (const tweet of missedTweets) {
    console.log(`⏳ Envoi du tweet prévu à ${tweet.time}...`);
    const success = await sendTweet(tweet.text);
    
    if (success) {
      tweet.sent = true;
      fs.writeFileSync(calendarPath, JSON.stringify(calendar, null, 2));
      console.log(`✅ Tweet ${tweet.time} envoyé`);
      // Attendre 5 secondes entre chaque tweet
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  
  console.log('🏁 Rattrapage terminé');
}

catchUpTweets().catch(console.error);
