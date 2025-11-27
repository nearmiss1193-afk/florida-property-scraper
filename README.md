# Florida Property Scraper

A standalone, production-ready real estate property scraper for Central Florida. Scrapes property data from multiple sources and stores in MySQL database or exports to JSON/CSV files.

## Features

- ✅ **Multi-source scraping**: Zillow, Realtor.com, Redfin, Trulia
- ✅ **Multiple output formats**: JSON, CSV, MySQL database
- ✅ **Vercel deployment**: Deploy as serverless function
- ✅ **Automated scheduling**: Built-in cron job support
- ✅ **Rate limiting**: Respects API quotas and prevents blocking
- ✅ **Error handling**: Retry logic and fallback options
- ✅ **Duplicate detection**: Prevents duplicate property entries
- ✅ **15 Central Florida cities**: Orlando, Tampa, Daytona Beach, and more

## Quick Start

### Local Usage

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run the scraper**:
   ```bash
   npm start
   ```

### Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

3. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL`: Your MySQL connection string
   - `RAPIDAPI_KEY`: Your RapidAPI key (optional)

4. **Access the API**:
   ```
   https://your-project.vercel.app/api/scrape?city=Orlando&limit=20
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | - |
| `RAPIDAPI_KEY` | RapidAPI key for enhanced scraping | - |
| `DEBUG` | Enable debug logging | `false` |
| `MAX_PROPERTIES_PER_CITY` | Maximum properties to scrape per city | `100` |
| `DELAY_MS` | Delay between requests (ms) | `2000` |
| `SAVE_TO_DATABASE` | Save results to database | `true` |
| `SAVE_TO_FILES` | Save results to JSON/CSV files | `true` |

### Cities Covered

The scraper covers 15 major Central Florida cities:

- Orlando
- Tampa
- Daytona Beach
- St. Petersburg
- Clearwater
- Lakeland
- Kissimmee
- Winter Park
- Sanford
- Deltona
- Palm Coast
- Port Orange
- Altamonte Springs
- Oviedo
- Winter Haven

## API Endpoints (Vercel)

### GET /api/scrape

Scrape properties and return results.

**Query Parameters**:
- `city` (optional): City name (e.g., "Orlando")
- `format` (optional): Output format - "json" or "csv" (default: "json")
- `limit` (optional): Max properties per city (default: 10)

**Example**:
```bash
curl "https://your-project.vercel.app/api/scrape?city=Tampa&limit=50&format=json"
```

**Response (JSON)**:
```json
{
  "success": true,
  "city": "Tampa",
  "count": 50,
  "properties": [
    {
      "address": "123 Main St",
      "city": "Tampa",
      "state": "FL",
      "zipCode": "33601",
      "price": 350000,
      "beds": 3,
      "baths": 2,
      "sqft": 1800,
      "propertyType": "House",
      "source": "zillow",
      "link": "https://...",
      "imageUrl": "https://...",
      "scrapedAt": "2024-11-27T10:00:00.000Z"
    }
  ]
}
```

## Database Schema

The scraper creates a `scraped_properties` table with the following structure:

```sql
CREATE TABLE scraped_properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source VARCHAR(50),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(10),
  zipCode VARCHAR(20),
  price INT,
  beds INT,
  baths DECIMAL(3,1),
  sqft INT,
  propertyType VARCHAR(50),
  yearBuilt INT,
  link TEXT,
  imageUrl TEXT,
  scrapedAt DATETIME,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_property (address, city, zipCode)
);
```

## Output Files

When `SAVE_TO_FILES=true`, the scraper generates:

- **properties.json**: Complete property data in JSON format
- **properties.csv**: Property data in CSV format for Excel

## Automated Scheduling

### Option 1: Vercel Cron Jobs

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/scrape",
    "schedule": "0 0 * * *"
  }]
}
```

### Option 2: Node-cron (Local)

Create `scheduler.js`:

```javascript
import cron from 'node-cron';
import { main } from './index.js';

// Run daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled scrape...');
  main();
});
```

### Option 3: External Cron Service

Use services like:
- **cron-job.org**: Free cron job service
- **EasyCron**: Scheduled HTTP requests
- **GitHub Actions**: Automated workflows

## Error Handling

The scraper includes:

- **Retry logic**: Automatically retries failed requests (3 attempts)
- **Fallback data**: Generates sample data if scraping fails
- **Rate limiting**: Prevents API blocking with configurable delays
- **Duplicate detection**: Skips properties already in database
- **Comprehensive logging**: Detailed logs for debugging

## Troubleshooting

### "No properties found"

- Check if the website structure has changed
- Verify your RAPIDAPI_KEY is valid
- Try increasing DELAY_MS to avoid rate limiting

### "Database connection failed"

- Verify DATABASE_URL is correct
- Ensure database server is accessible
- Check firewall settings

### "Request timeout"

- Increase timeout in CONFIG.scraper.timeout
- Check internet connection
- Verify target websites are accessible

## Integration with Main Website

To use scraped data in your main website:

1. **Same database**: Point both applications to the same DATABASE_URL
2. **API endpoint**: Call the Vercel API from your website
3. **File import**: Import generated JSON/CSV files

## License

MIT

## Support

For issues or questions:
- Email: sokffa@gmail.com
- Create an issue in the repository

## Disclaimer

This scraper is for educational and research purposes. Always respect website terms of service and robots.txt files. Consider using official APIs when available.
