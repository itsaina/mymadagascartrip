import { TwitterApi } from 'twitter-api-v2';
import 'dotenv/config';

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

const rw = client.readWrite;

const tweets = [
  '1/ Stablecoins aren\'t about crypto.\n\nThey\'re about banking the unbanked without asking permission. A teenager in Nigeria can hold USD in her phone wallet while her local bank charges 20% fees. That\'s the real use case.',
  '2/ The $180B stablecoin market is just the beginning.\n\n90% of cross-border payments in emerging markets already touch stablecoins. Not Bitcoin. Not Ethereum. USDC and USDT. Boring, stable, predictable.',
  '3/ Governments hate them because they can\'t control them.\n\nA CBDC gives the state power to freeze your money instantly. A stablecoin gives you exit. That\'s why the fight is existential.',
  '4/ The next billion users won\'t buy crypto.\n\nThey\'ll earn in stablecoins. Freelancers in Argentina, Kenya, Philippines already do. No volatility. No bank account needed. Just a phone.',
  'I\'m building tools to track this shift.\n\n→ cbdresources.com for the global stablecoin flow map\n→ DM open for fintech founders in emerging markets\n\nWhat stablecoin question should I break down next?'
];

let replyTo = '2029878296708796542';

for (let i = 0; i < tweets.length; i++) {
  const tweet = await rw.v2.reply(tweets[i], replyTo);
  console.log(`Tweet ${i + 2} posted, ID: ${tweet.data.id}`);
  replyTo = tweet.data.id;
  await new Promise(r => setTimeout(r, 2000));
}

console.log('Thread complete!');
