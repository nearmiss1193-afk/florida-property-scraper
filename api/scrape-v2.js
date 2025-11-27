/**
 * Vercel Serverless Function - Property Scraper API
 * 
 * GET /api/scrape-v2?city=Orlando&limit=50
 * GET /api/scrape-v2?all=true&limit=10
 */

const { generateProperties } = require('../scraper-standalone.cjs');

const CITIES = [
  'Orlando', 'Tampa', 'Daytona Beach', 'St. Petersburg', 'Clearwater',
  'Lakeland', 'Kissimmee', 'Port Orange', 'Sanford', 'Oviedo',
  'Winter Park', 'Altamonte Springs', 'Deltona', 'Palm Coast', 'Titusville'
];

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { city, limit = '10', all, format = 'json' } = req.query;
    const maxProperties = parseInt(limit) || 10;
    
    let properties = [];
    
    if (all === 'true') {
      // Generate for all cities
      for (const cityName of CITIES) {
        properties.push(...generateProperties(cityName, maxProperties));
      }
    } else if (city) {
      // Generate for specific city
      properties = generateProperties(city, maxProperties);
    } else {
      return res.status(400).json({
        error: 'Missing parameter',
        usage: {
          single: '/api/scrape-v2?city=Orlando&limit=50',
          all: '/api/scrape-v2?all=true&limit=10'
        }
      });
    }
    
    // Return CSV or JSON
    if (format === 'csv') {
      const csvHeader = 'Property ID,MLS ID,Address,City,State,ZIP,Price,Beds,Baths,SqFt,Type,Year,Status\n';
      const csvRows = properties.map(p => 
        `"${p.propertyId}","${p.mlsId}","${p.streetAddress}","${p.city}","${p.state}","${p.zipCode}",${p.price},${p.bedrooms},${p.bathrooms},${p.sqft},"${p.propertyType}",${p.yearBuilt},"${p.listingStatus}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="properties-${city || 'all'}.csv"`);
      return res.status(200).send(csvHeader + csvRows);
    }
    
    return res.status(200).json({
      success: true,
      count: properties.length,
      city: city || 'all',
      properties
    });
    
  } catch (error) {
    console.error('Scraper error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
