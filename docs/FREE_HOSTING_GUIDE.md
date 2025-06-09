
# Free Cloud Hosting Guide for Warehouse API

## Current Hosting (Supabase Edge Functions)
Your API is already hosted on Supabase Edge Functions at:
```
https://ntctmdwxyjnxconnsirk.supabase.co/functions/v1/warehouse-api
```

## Alternative Free Hosting Options

### 1. Vercel (Recommended)
**Pros:** Great for serverless functions, automatic deployments
**Limits:** 100GB bandwidth/month, 12 serverless functions

#### Setup Steps:
1. Create account at [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Convert edge function to Vercel API routes:

```javascript
// api/warehouse-api/[...slug].js
export default async function handler(req, res) {
  // Your existing edge function code here
  // Convert Deno APIs to Node.js APIs
}
```

4. Deploy automatically on git push

### 2. Netlify Functions
**Pros:** Easy deployment, good free tier
**Limits:** 125,000 function calls/month, 10 second timeout

#### Setup Steps:
1. Create account at [netlify.com](https://netlify.com)
2. Create `netlify/functions/` directory
3. Convert edge function to Netlify format:

```javascript
// netlify/functions/warehouse-api.js
exports.handler = async (event, context) => {
  // Your API logic here
}
```

### 3. Railway
**Pros:** Easy Docker deployment, PostgreSQL included
**Limits:** $5 credit monthly (usually enough for small apps)

#### Setup Steps:
1. Create account at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Railway automatically deploys

### 4. Render
**Pros:** Free PostgreSQL, automatic deployments
**Limits:** Apps sleep after 15 minutes of inactivity

#### Setup Steps:
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Choose free plan

### 5. Heroku (Limited Free Tier)
**Note:** Heroku ended free tier but offers student credits

### 6. Google Cloud Run
**Pros:** 2 million requests/month free
**Limits:** Requires credit card for verification

#### Setup Steps:
1. Enable Cloud Run API
2. Create Dockerfile:

```dockerfile
FROM denoland/deno:1.30.0
WORKDIR /app
COPY . .
RUN deno cache --import-map=import_map.json src/deps.ts
EXPOSE 8080
CMD ["run", "--allow-net", "--allow-env", "src/main.ts"]
```

3. Deploy with `gcloud run deploy`

### 7. AWS Lambda (Free Tier)
**Pros:** 1 million requests/month free
**Limits:** Complex setup, cold starts

## Recommended Migration Path

### Option A: Stay with Supabase (Recommended)
- Your current setup is already optimal
- Supabase Edge Functions are serverless and scalable
- Integrated with your database
- No migration needed

### Option B: Migrate to Vercel
1. Export your project to GitHub
2. Create Vercel account
3. Import GitHub repository
4. Convert edge function to API routes
5. Update frontend API calls to new endpoint

### Option C: Containerize for Multiple Platforms
Create a Docker container that can run on Railway, Render, or Google Cloud Run:

```dockerfile
FROM denoland/deno:1.30.0
WORKDIR /app
COPY supabase/functions/warehouse-api .
RUN deno cache index.ts
EXPOSE 8080
CMD ["run", "--allow-net", "--allow-env", "--port=8080", "index.ts"]
```

## Cost Comparison (Monthly)

| Platform | Free Tier | Paid Start |
|----------|-----------|------------|
| Supabase | 500MB DB, 2GB bandwidth | $25/month |
| Vercel | 100GB bandwidth | $20/month |
| Netlify | 125K function calls | $19/month |
| Railway | $5 credit | $5/month |
| Render | 750 hours | $7/month |
| Google Cloud | 2M requests | Pay per use |

## Monitoring & Analytics

### Free Monitoring Tools:
- **UptimeRobot** - Uptime monitoring
- **LogRocket** - Error tracking
- **Google Analytics** - Usage analytics
- **Supabase Analytics** - Built-in metrics

## Security Considerations

### Environment Variables:
- Store API keys securely
- Use platform-specific secret management
- Never commit secrets to Git

### Rate Limiting:
```javascript
// Add to your API
const rateLimit = new Map();
const limit = 100; // requests per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }
  
  const requests = rateLimit.get(ip);
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= limit) {
    return false; // Rate limited
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return true;
}
```

## Conclusion

**Recommendation:** Keep using Supabase Edge Functions as they're already providing excellent hosting for your API. If you need to migrate, Vercel or Railway would be the best alternatives for your use case.
