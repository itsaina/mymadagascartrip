---
name: twitter-automation
description: Automate Twitter/X operations including posting tweets, reading timelines, and getting user info. Use when user wants to post to Twitter/X, read their timeline, get their profile info, or automate Twitter tasks. Requires OAuth 1.0a credentials (API Key, API Secret, Access Token, Access Token Secret).
---

# Twitter Automation

Automate Twitter/X posting and reading operations using the twitter-api-v2 library.

## Prerequisites

The following environment variables must be set:
- `API_KEY` - Twitter API Key
- `API_SECRET` - Twitter API Secret
- `ACCESS_TOKEN` - Twitter Access Token
- `ACCESS_TOKEN_SECRET` - Twitter Access Token Secret
- `BEARER_TOKEN` - Twitter Bearer Token (for read operations)

## Setup

1. Copy `.env.example` to `.env` and fill in your credentials
2. Install dependencies: `npm install`

## Available Operations

### Post a Tweet

```bash
cd scripts
node playground.js post "Your tweet text here"
```

### Read User Info

```bash
cd scripts
node playground.js whoami
```

### Read Timeline

```bash
cd scripts
node playground.js timeline [count]
```

Example with 10 tweets:
```bash
node playground.js timeline 10
```

## Programmatic Usage

Import and use the functions directly:

```javascript
import { whoAmI, readTimeline, postTweet } from "./playground.js";

// Get user info
const me = await whoAmI();

// Read last 5 tweets
await readTimeline(5);

// Post a tweet
await postTweet("Hello World!");
```

## API Limits

- Post: 300 tweets per 3 hours (standard), 2000 (elevated)
- Read timeline: 1500 requests per 15 minutes

## Troubleshooting

**401 Unauthorized**: Check that all credentials are correct and the app has "Read and Write" permissions.

**403 Forbidden**: The app may not have write permissions. Check app settings on developer.twitter.com.
