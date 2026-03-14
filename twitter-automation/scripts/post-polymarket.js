import { TwitterApi } from 'twitter-api-v2';
import 'dotenv/config';
import fs from 'fs';

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

const rw = client.readWrite;

// Upload image first
const imagePath = '/root/.openclaw/workspace/polymarket_thread_600x335.png';
const mediaId = await rw.v1.uploadMedia(imagePath);
console.log('✅ Image uploaded:', mediaId);

// First tweet with image
const tweets = [
  "🧵 THREAD: The 5 Most Improbable Polymarket Bets (Where People Actually Put REAL Money)\n\nFrom Jesus to aliens to CZ getting hit by a banana... 👇",
  "1/ Jesus Christ Returns in 2025 ⛪\n\nProbably the bet with the longest odds.\n\nTraders betting on the Second Coming... or not.\n\n→ Probability: ~1%",
  "2/ The Earth is Flat 🌍\n\n$1,277 volume on this \"scientific\" question.\n\nAnswer: No (Earth is apparently an ellipsoid)\n\n→ Probability: 0% (resolved)",
  "3/ Aliens vs Bitcoin $200K 👽\n\nPolymarket gives 6% chance to aliens,\nbut only 5% to BTC hitting $200K in 2025.\n\nExtraterrestrials are more likely than a Bitcoin pump...\n\n→ Volume: $4M",
  "4/ Trump Smokes with Joe Rogan 🚬\n\nNearly $200,000 wagered on this encounter.\n\nResult: Trump came, but without the joint.\n\n→ Probability: 0% (resolved NO)",
  "5/ Someone Throws Object at CZ in 2026 🍌\n\n79% chance someone throws something at CZ during a crypto event.\n\nThe market worries after his pardon...\n\n→ Volume: Strong",
  "Which of these bets is the most improbable according to you? 😂\n\nPrediction markets have officially gone mad.\n\nSource: Polymarket"
];

// Post first tweet with media
let firstTweet = await rw.v2.tweet({
  text: tweets[0],
  media: { media_ids: [mediaId] }
});
console.log('✅ Tweet 1 posted:', firstTweet.data.id);

let replyTo = firstTweet.data.id;

// Post replies
for (let i = 1; i < tweets.length; i++) {
  const tweet = await rw.v2.reply(tweets[i], replyTo);
  console.log(`✅ Tweet ${i + 1} posted:`, tweet.data.id);
  replyTo = tweet.data.id;
  await new Promise(r => setTimeout(r, 2000));
}

console.log('\n🎉 Thread complete!');
console.log(`🔗 https://twitter.com/itsaina207/status/${replyTo}`);
