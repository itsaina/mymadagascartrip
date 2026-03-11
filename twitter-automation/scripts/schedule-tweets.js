import { TwitterApi } from 'twitter-api-v2';
import 'dotenv/config';

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

const rw = client.readWrite;

// Horaires en heure de San Francisco (PST, UTC-8)
// Format: YYYY-MM-DDTHH:00:00-08:00
const tweets = [
  {
    time: '2026-03-07T08:00:00-08:00',
    text: 'Breaking down the $221B stablecoin market:\n\n• 67% = DeFi/Trading (coinledger.io)\n• 15% = Remittances  \n• 10% = Inflation hedge\n• 5% = Merchant payments\n\nThe \'trading only\' narrative is wrong. 30% is already real-world usage.'
  },
  {
    time: '2026-03-07T10:00:00-08:00',
    text: "China's e-CNY hit 260M wallets (swp-berlin.org). Sounds huge?\n\nThat's ~18% of their population. After 3 years of pilot.\n\nAdoption curves are slower than announcements suggest."
  },
  {
    time: '2026-03-07T12:00:00-08:00',
    text: '$905B global remittances annually (worldbank.org).\n\nAverage cost: 6.35% (gpfi.org).\n\nStablecoins: <1%.\n\nOn a $200 transfer, that\'s $12 vs $2.\n\nScale matters.'
  },
  {
    time: '2026-03-07T14:00:00-08:00',
    text: "Nigeria's eNaira by numbers (rsisinternational.org):\n\n• Launched: Oct 2021\n• Adoption: 0.5% of population by end-2024\n• Wallets inactive: 98.5%\n\nFirst doesn't mean successful."
  },
  {
    time: '2026-03-07T16:00:00-08:00',
    text: 'USDT: $141B (63.9%)\nUSDC: $55B (24.9%)\nDAI: $7.8B (3.5%)\nAll others: <$2B each\n\nUSDT + USDC = 88.8% of market.\n\nDecentralization is a feature, not the product users want.'
  },
  {
    time: '2026-03-07T18:00:00-08:00',
    text: 'M-Pesa Kenya: 34M users (safaricom.co.ke), 300K agents, 1.5M merchants.\n\nFinancial inclusion: 84.8% of adults (centralbank.go.ke).\n\nNo blockchain. No CBDC. Just mobile + agents + trust.'
  },
  {
    time: '2026-03-07T20:00:00-08:00',
    text: "Teens share 3x more than adults on social apps.\n\nNot because they're addicted.\n\nBecause they still believe their voice matters.\n\nBuild for that belief."
  },
  {
    time: '2026-03-07T22:00:00-08:00',
    text: 'Sending $200 to Sub-Saharan Africa:\nAverage cost: 8.37% (resbank.co.za citing World Bank)\n\nHighest corridor: Senegal-Mali at 25.7%.\n\nStablecoins cut this to <1%.\n\nThe arbitrage is massive.'
  },
  {
    time: '2026-03-08T00:00:00-08:00',
    text: 'We killed 14 apps before TBH went viral.\n\nEach taught us one thing about user psychology.\n\nThe 15th combined them all.\n\nFailure is data. Collect it.'
  },
  {
    time: '2026-03-08T02:00:00-08:00',
    text: "Everyone building CBDCs studies China's e-CNY.\n\nFew study why Kenya's M-Pesa succeeded without blockchain.\n\nSometimes the lesson isn't the tech. It's the distribution."
  }
];

async function scheduleTweets() {
  console.log('Scheduling 10 tweets for March 7-8, 2026...\n');
  
  for (const tweet of tweets) {
    const scheduledTime = new Date(tweet.time);
    const now = new Date();
    const delay = scheduledTime - now;
    
    if (delay > 0) {
      console.log(`Scheduling tweet for ${tweet.time} (in ${Math.round(delay/1000/60)} minutes)`);
      console.log(`Content: ${tweet.text.substring(0, 50)}...\n`);
      
      // Wait until scheduled time
      await new Promise(r => setTimeout(r, delay));
      
      // Post tweet
      try {
        const posted = await rw.v2.tweet(tweet.text);
        console.log(`✅ Posted at ${new Date().toISOString()}: ID ${posted.data.id}`);
      } catch (err) {
        console.error(`❌ Failed to post: ${err.message}`);
      }
    } else {
      console.log(`Skipping tweet for ${tweet.time} - time already passed`);
    }
  }
  
  console.log('\nAll tweets scheduled and posted!');
}

scheduleTweets().catch(console.error);
