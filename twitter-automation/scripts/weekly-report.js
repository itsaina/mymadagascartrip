import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";
import fs from "fs";
import path from "path";

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

const rw = client.readWrite;

// Récupérer les métriques d'un tweet par ID
async function getTweetMetrics(tweetId) {
  try {
    const tweet = await rw.v2.singleTweet(tweetId, {
      "tweet.fields": ["created_at", "public_metrics", "text"],
    });
    return {
      id: tweet.data.id,
      text: tweet.data.text,
      created_at: tweet.data.created_at,
      metrics: tweet.data.public_metrics,
    };
  } catch (error) {
    console.error(`Erreur récupération tweet ${tweetId}:`, error.message);
    return null;
  }
}

// Récupérer les métriques de tous les tweets envoyés cette semaine
export async function getWeeklyMetrics() {
  const sentTweetsPath = path.join(process.cwd(), "sent-tweets.json");
  
  if (!fs.existsSync(sentTweetsPath)) {
    console.log("Aucun tweet envoyé trouvé.");
    return [];
  }
  
  const sentTweets = JSON.parse(fs.readFileSync(sentTweetsPath, "utf-8"));
  
  // Filtrer les tweets de cette semaine (7 derniers jours)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const weeklyTweets = sentTweets.filter(t => {
    const tweetDate = new Date(t.sentAt);
    return tweetDate >= oneWeekAgo;
  });
  
  console.log(`📊 Récupération des métriques pour ${weeklyTweets.length} tweets de la semaine...`);
  
  // Récupérer les métriques pour chaque tweet
  const metrics = [];
  for (const tweet of weeklyTweets) {
    const data = await getTweetMetrics(tweet.id);
    if (data) {
      metrics.push(data);
    }
    // Attendre un peu pour respecter les rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return metrics;
}

// Générer le rapport hebdomadaire
export async function generateWeeklyReport() {
  const metrics = await getWeeklyMetrics();
  
  if (metrics.length === 0) {
    return "📊 Aucun tweet envoyé cette semaine.";
  }
  
  // Calculer les totaux
  const totalLikes = metrics.reduce((sum, t) => sum + (t.metrics?.like_count || 0), 0);
  const totalRetweets = metrics.reduce((sum, t) => sum + (t.metrics?.retweet_count || 0), 0);
  const totalReplies = metrics.reduce((sum, t) => sum + (t.metrics?.reply_count || 0), 0);
  const totalImpressions = metrics.reduce((sum, t) => sum + (t.metrics?.impression_count || 0), 0);
  
  // Trier par likes (top performers)
  const sortedByLikes = [...metrics].sort((a, b) => 
    (b.metrics?.like_count || 0) - (a.metrics?.like_count || 0)
  );
  
  const topTweets = sortedByLikes.slice(0, 3);
  const flopTweets = sortedByLikes.slice(-3).reverse();
  
  // Générer le rapport
  let report = "📈 **Rapport Twitter Hebdomadaire**\n\n";
  report += `**Période:** 7 derniers jours\n`;
  report += `**Tweets publiés:** ${metrics.length}\n\n`;
  
  report += "**📊 Stats globales**\n";
  report += `• Vues (impressions): ${totalImpressions.toLocaleString()}\n`;
  report += `• Likes: ${totalLikes.toLocaleString()}\n`;
  report += `• Retweets: ${totalRetweets.toLocaleString()}\n`;
  report += `• Réponses: ${totalReplies.toLocaleString()}\n\n`;
  
  if (metrics.length > 0) {
    const avgLikes = (totalLikes / metrics.length).toFixed(1);
    const avgImpressions = (totalImpressions / metrics.length).toFixed(0);
    report += `**Moyennes par tweet:**\n`;
    report += `• ${avgLikes} likes • ${parseInt(avgImpressions).toLocaleString()} vues\n\n`;
  }
  
  report += "**🏆 Top performers**\n";
  topTweets.forEach((t, i) => {
    const likes = t.metrics?.like_count || 0;
    const views = t.metrics?.impression_count || 0;
    const retweets = t.metrics?.retweet_count || 0;
    const bookmarks = t.metrics?.bookmark_count || 0;
    // Texte complet mais formaté proprement
    const text = t.text.replace(/\n/g, ' ');
    report += `${i+1}. **${likes}❤️ ${views}👁️ ${retweets}🔄 ${bookmarks}📌**\n`;
    report += `   📝 ${text}\n\n`;
  });
  
  report += "**📉 Moins performants**\n";
  flopTweets.forEach((t, i) => {
    const likes = t.metrics?.like_count || 0;
    const views = t.metrics?.impression_count || 0;
    const retweets = t.metrics?.retweet_count || 0;
    const bookmarks = t.metrics?.bookmark_count || 0;
    const text = t.text.replace(/\n/g, ' ');
    report += `${i+1}. **${likes}❤️ ${views}👁️ ${retweets}🔄 ${bookmarks}📌**\n`;
    report += `   📝 ${text}\n\n`;
  });
  
  return report;
}

// Main pour exécution CLI
async function main() {
  const report = await generateWeeklyReport();
  console.log(report);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
