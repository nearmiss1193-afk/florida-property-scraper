# Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites

- Vercel account (free tier available)
- GitHub account (optional, for automatic deployments)
- MySQL database (TiDB, PlanetScale, or any MySQL-compatible database)

### Step 1: Prepare Your Database

1. **Create a MySQL database** (choose one):
   - [TiDB Cloud](https://tidbcloud.com/) - Free tier available
   - [PlanetScale](https://planetscale.com/) - Free tier available
   - [Railway](https://railway.app/) - MySQL hosting
   - Your own MySQL server

2. **Get your connection string**:
   ```
   mysql://username:password@host:port/database
   ```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd florida-property-scraper
   vercel --prod
   ```

4. **Set environment variables**:
   ```bash
   vercel env add DATABASE_URL
   # Paste your database connection string
   
   vercel env add RAPIDAPI_KEY
   # Paste your RapidAPI key (optional)
   ```

#### Option B: Deploy via GitHub

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/florida-property-scraper.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables in project settings

3. **Configure environment variables** in Vercel dashboard:
   - `DATABASE_URL`: Your MySQL connection string
   - `RAPIDAPI_KEY`: Your RapidAPI key (optional)

### Step 3: Test Your Deployment

1. **Test the API endpoint**:
   ```bash
   curl "https://your-project.vercel.app/api/scrape?city=Orlando&limit=10"
   ```

2. **Expected response**:
   ```json
   {
     "success": true,
     "city": "Orlando",
     "count": 10,
     "properties": [...]
   }
   ```

### Step 4: Set Up Automated Scraping

#### Option A: Vercel Cron Jobs (Paid Plans Only)

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/scrape?city=Orlando&limit=100",
    "schedule": "0 0 * * *"
  }]
}
```

#### Option B: External Cron Service (Free)

1. **Use cron-job.org**:
   - Go to [cron-job.org](https://cron-job.org)
   - Create free account
   - Add new cron job:
     - URL: `https://your-project.vercel.app/api/scrape`
     - Schedule: Daily at midnight
     - Method: GET

2. **Use GitHub Actions** (if using GitHub):
   
   Create `.github/workflows/scrape.yml`:
   
   ```yaml
   name: Daily Property Scrape
   
   on:
     schedule:
       - cron: '0 0 * * *'  # Daily at midnight UTC
     workflow_dispatch:  # Manual trigger
   
   jobs:
     scrape:
       runs-on: ubuntu-latest
       steps:
         - name: Trigger scraper
           run: |
             curl "https://your-project.vercel.app/api/scrape?limit=100"
   ```

## Alternative Deployments

### Railway Deployment

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set environment variables**:
   ```bash
   railway variables set DATABASE_URL="mysql://..."
   railway variables set RAPIDAPI_KEY="your-key"
   ```

### Heroku Deployment

1. **Create `Procfile`**:
   ```
   worker: node index.js
   ```

2. **Deploy**:
   ```bash
   heroku create florida-property-scraper
   heroku config:set DATABASE_URL="mysql://..."
   heroku config:set RAPIDAPI_KEY="your-key"
   git push heroku main
   ```

3. **Schedule with Heroku Scheduler**:
   ```bash
   heroku addons:create scheduler:standard
   heroku addons:open scheduler
   # Add job: node index.js
   ```

### AWS Lambda Deployment

1. **Install Serverless Framework**:
   ```bash
   npm install -g serverless
   ```

2. **Create `serverless.yml`**:
   ```yaml
   service: florida-property-scraper
   
   provider:
     name: aws
     runtime: nodejs18.x
     environment:
       DATABASE_URL: ${env:DATABASE_URL}
       RAPIDAPI_KEY: ${env:RAPIDAPI_KEY}
   
   functions:
     scrape:
       handler: index.main
       events:
         - schedule: rate(1 day)
   ```

3. **Deploy**:
   ```bash
   serverless deploy
   ```

## Database Setup

### TiDB Cloud (Recommended - Free Tier)

1. Go to [tidbcloud.com](https://tidbcloud.com)
2. Create free account
3. Create new cluster (Serverless Tier - Free)
4. Get connection string from dashboard
5. Use in `DATABASE_URL` environment variable

### PlanetScale

1. Go to [planetscale.com](https://planetscale.com)
2. Create free account
3. Create new database
4. Create branch (main)
5. Get connection string
6. Use in `DATABASE_URL` environment variable

### Railway MySQL

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add MySQL plugin
4. Get connection string from variables tab
5. Use in `DATABASE_URL` environment variable

## Monitoring and Logs

### Vercel Logs

```bash
vercel logs --follow
```

### Check Deployment Status

```bash
vercel ls
```

### View Environment Variables

```bash
vercel env ls
```

## Troubleshooting

### Deployment fails

- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check Vercel build logs for errors

### API returns 500 error

- Check environment variables are set correctly
- Verify database connection string
- Check Vercel function logs

### Database connection fails

- Verify DATABASE_URL format
- Check database server allows external connections
- Verify SSL settings if required

## Cost Estimates

### Free Tier Limits

- **Vercel**: 100GB bandwidth, 100 hours function execution
- **TiDB Cloud**: 5GB storage, 50M row reads/month
- **PlanetScale**: 5GB storage, 1B row reads/month

### Estimated Monthly Costs (if exceeding free tier)

- **Vercel Pro**: $20/month (unlimited bandwidth)
- **TiDB Cloud**: Pay-as-you-go (typically $5-20/month)
- **PlanetScale**: $29/month (Scaler plan)

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use environment variables** for all secrets
3. **Rotate API keys** regularly
4. **Enable rate limiting** on your API endpoints
5. **Use HTTPS** for all connections
6. **Restrict database access** to specific IPs if possible

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Set up automated scraping
3. ✅ Monitor logs and performance
4. ✅ Integrate with main website
5. ✅ Set up alerts for failures

## Support

For deployment issues:
- Check [Vercel documentation](https://vercel.com/docs)
- Review [TiDB Cloud docs](https://docs.pingcap.com/tidbcloud/)
- Contact support: sokffa@gmail.com
