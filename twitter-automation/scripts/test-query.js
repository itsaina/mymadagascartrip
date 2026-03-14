import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

async function getUserLatestTweet(username) {
  try {
    const user = await client.v2.userByUsername(username);
    if (!user.data) {
      console.log("User not found");
      return;
    }
    
    console.log(`👤 User: @${user.data.username} (ID: ${user.data.id})`);
    console.log(`📛 Name: ${user.data.name}`);
    
    const tweets = await client.v2.userTimeline(user.data.id, {
      max_results: 5,
      "tweet.fields": ["created_at", "public_metrics", "text"],
    });
    
    console.log(`\n📊 Latest tweets from @${username}:\n`);
    
    // Twitter API v2 returns data in tweets.data.data
    const tweetsData = tweets.data?.data || [];
    
    if (tweetsData.length === 0) {
      console.log("No tweets found");
      return;
    }
    
    for (const tweet of tweetsData) {
      const metrics = tweet.public_metrics || {};
      console.log(`📝 Tweet ID: ${tweet.id}`);
      console.log(`📅 Date: ${tweet.created_at}`);
      console.log(`💬 Text: ${tweet.text.substring(0, 100)}${tweet.text.length > 100 ? '...' : ''}`);
      console.log(`❤️ Likes: ${metrics.like_count || 0}`);
      console.log(`🔄 Retweets: ${metrics.retweet_count || 0}`);
      console.log(`💬 Replies: ${metrics.reply_count || 0}`);
      console.log(`👁️ Views: ${metrics.impression_count || 'N/A (needs higher tier)'}`);
      console.log(`📌 Bookmarks: ${metrics.bookmark_count || 0}`);
      console.log(`─`.repeat(50));
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
  }
}

getUserLatestTweet("minchoi");
