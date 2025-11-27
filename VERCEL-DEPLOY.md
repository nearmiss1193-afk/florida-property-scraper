# Deploy Florida Property Scraper to Vercel

## Quick Deploy (5 minutes)

### Step 1: Import to Vercel

1. Go to **https://vercel.com/new**
2. Sign in with GitHub
3. Click **"Import Git Repository"**
4. Find and select: **`nearmiss1193-afk/florida-property-scraper`**
5. Click **"Import"**

### Step 2: Configure Project

- **Project Name**: `florida-property-scraper` (or your choice)
- **Framework Preset**: Other
- **Root Directory**: `./`
- **Build Command**: Leave empty (serverless functions don't need build)
- **Output Directory**: Leave empty

### Step 3: Environment Variables (Optional)

No environment variables required! The scraper works standalone.

If you want database integration later, add:
```
DATABASE_URL=your_mysql_connection_string
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for deployment
3. You'll get a URL like: `https://florida-property-scraper.vercel.app`

## API Endpoints

Once deployed, you can use these endpoints:

### Get Properties for One City
```
GET https://your-project.vercel.app/api/scrape-v2?city=Orlando&limit=50
```

**Parameters:**
- `city` - City name (Orlando, Tampa, etc.)
- `limit` - Number of properties (default: 10, max: 200)
- `format` - Response format (`json` or `csv`, default: json)

**Example:**
```bash
curl "https://florida-property-scraper.vercel.app/api/scrape-v2?city=Orlando&limit=20"
```

### Get Properties for All Cities
```
GET https://your-project.vercel.app/api/scrape-v2?all=true&limit=10
```

**Example:**
```bash
curl "https://florida-property-scraper.vercel.app/api/scrape-v2?all=true&limit=5"
```

### Get CSV Export
```
GET https://your-project.vercel.app/api/scrape-v2?city=Tampa&limit=100&format=csv
```

## Response Format

### JSON Response
```json
{
  "success": true,
  "count": 50,
  "city": "Orlando",
  "properties": [
    {
      "propertyId": "ZPID12345678",
      "mlsId": "MLS987654",
      "streetAddress": "123 Main St",
      "city": "Orlando",
      "state": "FL",
      "zipCode": "32801",
      "price": 450000,
      "bedrooms": 3,
      "bathrooms": 2.5,
      "sqft": 2100,
      "propertyType": "Single Family",
      "yearBuilt": 2005,
      "listingStatus": "FOR_SALE",
      "agentName": "John Smith",
      "agentPhone": "(407) 555-0101",
      "brokerName": "Keller Williams",
      "images": ["https://..."],
      "description": "Beautiful 3 bedroom...",
      "latitude": "28.538336",
      "longitude": "-81.379234",
      "zestimate": 465000,
      "schools": [...]
    }
  ]
}
```

## Integration with Your Website

### Option 1: Direct API Calls
Call the Vercel endpoint from your website:

```javascript
const response = await fetch('https://florida-property-scraper.vercel.app/api/scrape-v2?city=Orlando&limit=100');
const data = await response.json();
console.log(`Found ${data.count} properties`);
```

### Option 2: Scheduled Imports
Set up a cron job to import data daily:

1. Go to Vercel Dashboard → Your Project → Settings → Cron Jobs
2. Add a new cron job:
   - **Schedule**: `0 2 * * *` (runs at 2 AM daily)
   - **Path**: `/api/scrape-v2?all=true&limit=100`

### Option 3: Manual Downloads
Download CSV files and import to your database:

```bash
curl "https://florida-property-scraper.vercel.app/api/scrape-v2?all=true&limit=200&format=csv" > properties.csv
```

## Monitoring

View logs and analytics in Vercel Dashboard:
- **Deployments**: See deployment history
- **Functions**: Monitor API performance
- **Analytics**: Track API usage

## Troubleshooting

### Error: "Module not found"
- Make sure `scraper-standalone.cjs` is in the repository
- Check that `api/scrape-v2.js` has correct require path

### Error: "Function timeout"
- Reduce the `limit` parameter (max 200 per request)
- Split large requests into multiple smaller ones

### No data returned
- Check the API endpoint URL is correct
- Verify query parameters are properly formatted

## Next Steps

1. **Add Real Data Sources**: Integrate with actual real estate APIs
2. **Database Integration**: Save scraped data to MySQL/PostgreSQL
3. **Caching**: Add Redis caching for faster responses
4. **Rate Limiting**: Implement rate limits to prevent abuse

## Support

- GitHub: https://github.com/nearmiss1193-afk/florida-property-scraper
- Issues: https://github.com/nearmiss1193-afk/florida-property-scraper/issues
