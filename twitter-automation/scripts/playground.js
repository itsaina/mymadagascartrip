import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

const rw = client.readWrite;

// READ — qui suis-je
export async function whoAmI() {
  const me = await rw.v2.me();
  console.log("👤 Moi :", me.data);
  return me.data;
}

// READ — derniers tweets
export async function readTimeline(maxResults = 5) {
  const me = await rw.v2.me();
  const timeline = await rw.v2.userTimeline(me.data.id, {
    max_results: maxResults,
    "tweet.fields": ["created_at", "text"],
  });
  console.log(`📖 Mes ${maxResults} derniers tweets :`);
  for (const tweet of timeline.data.data ?? []) {
    console.log(`  [${tweet.created_at}] ${tweet.text}`);
  }
}

// WRITE — poster un tweet
export async function postTweet(text) {
  const tweet = await rw.v2.tweet(text);
  console.log("✅ Tweet posté :", tweet.data);
  return tweet.data;
}

// Main function for CLI usage
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === "whoami") {
    await whoAmI();
  } else if (command === "timeline") {
    const count = parseInt(args[1]) || 5;
    await readTimeline(count);
  } else if (command === "post") {
    const text = args.slice(1).join(" ");
    if (!text) {
      console.error("Usage: node playground.js post <text>");
      process.exit(1);
    }
    await postTweet(text);
  } else {
    console.log("Usage:");
    console.log("  node playground.js whoami");
    console.log("  node playground.js timeline [count]");
    console.log("  node playground.js post <text>");
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
