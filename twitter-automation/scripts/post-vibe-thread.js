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
const imagePath = '/root/.openclaw/workspace/vibe_coding_thread.png';
const mediaId = await rw.v1.uploadMedia(imagePath);
console.log('✅ Image uploaded:', mediaId);

const tweets = [
  "🧵 THREAD: 10 Vibe-Coded Projects Making SERIOUS Money\n\nFrom $0 to $456K ARR in 45 days...\n\nReal people. Real AI. Real revenue. 👇",
  "1/ Stoppr — $12K/month\n\nFrench quant trader @david_attisaas cloned an addiction app.\n\nTarget: French women quitting sugar\nTime: 5 months\nTech: Cursor\n\nLesson: Clone what works, change the niche",
  "2/ Plinq — $456K ARR in 45 days\n\nNon-coder Sabrine Matos built a women's safety app with @lovable_dev\n\nUsers: 25,000+ women\nMission: Background checks to prevent violence\n\nLesson: No-code + passion = impact",
  "3/ Aura — $15K MRR in 30 days\n\nMeng To built \"Cursor for design\"\n\nUsers: 21,700\nTech: Claude 4\nResult: Replaced Figma for his team\n\nLesson: Build tools you need yourself",
  "4/ TrendFeed — $10K MRR in 1 month\n\n@sebastianvolkis built an AI content tool in 4 days\n\nRevenue: $12K first month\nTech: Next.js + Claude\n\nLesson: Speed beats perfection",
  "5/ Flight Simulator — $87K/month\n\n@levelsio built an MMO flight sim in 3 HOURS\n\nUsers: 320,000 in 17 days\nRevenue: Pure ad money\n\nLesson: Viral + fast build = $$$",
  "6/ Sarah's Scheduler — $15K/month\n\nEx-marketing manager built a social media tool\n\nCustomers: 525\nTech: Cursor\nTime to $15K: 6 months\n\nLesson: Solve your own problem",
  "7/ Marcus' Micro-SaaS Portfolio — $8,400/month\n\nSide hustle king runs 3 apps:\n• Color tool: $4,180/mo\n• Logo mockups: $2,755/mo\n• Font pairing: $1,470/mo\n\nLesson: Many small bets > one big bet",
  "8/ Lisa's Course Empire — $25K/month\n\nEx-teacher learned vibe coding in 3 months, then taught it\n\nRevenue streams:\n• Course: $17,395/mo\n• Templates: $4,850/mo\n• Coaching: $3,000/mo\n\nLesson: Sell the shovel",
  "9/ Solo Email SaaS — $12,500 MRR\n\nUnknown founder, insane efficiency:\n\nBuild cost: $400\nMonthly cost: $150\nTime to $10K: 8 months\n\nLesson: Lean + AI = profitable fast",
  "10/ The Pattern:\n\n✅ Build in days, not months\n✅ Solve real problems\n✅ Use AI (Cursor, Claude, Lovable)\n✅ Start lean ($50-400)\n✅ Iterate fast\n\nWhich one inspires you most?",
  "The barriers are gone.\n\nYou don't need:\n❌ Computer science degree\n❌ $100K funding\n❌ 6-month dev cycles\n❌ A team of engineers\n\nYou need:\n✅ A problem to solve\n✅ AI tools\n✅ 4 days\n\nSource: Multiple indie hacker case studies"
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
