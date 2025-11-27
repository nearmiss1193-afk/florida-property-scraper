/**
 * Vercel Serverless Function for Property Scraping
 * 
 * Endpoint: /api/scrape
 * Method: GET
 * 
 * Query Parameters:
 *   - city: City name (optional, defaults to all cities)
 *   - format: Output format (json or csv, defaults to json)
 *   - limit: Max properties per city (defaults to 10)
 */

import { main, generateSampleProperties } from '../index.js';

export default async function handler(req, res) {
  try {
    const { city, format = 'json', limit = 10 } = req.query;
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    
    // For demo purposes, generate sample data
    const sampleCity = {
      name: city || 'Orlando',
      state: 'FL',
      zip: '32801'
    };
    
    const properties = generateSampleProperties(sampleCity, parseInt(limit));
    
    if (format === 'csv') {
      const headers = ['Address', 'City', 'State', 'ZIP', 'Price', 'Beds', 'Baths', 'SqFt', 'Type', 'Source'];
      const rows = properties.map(p => [
        p.address, p.city, p.state, p.zipCode, p.price,
        p.beds, p.baths, p.sqft, p.propertyType, p.source
      ]);
      
      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="properties-${sampleCity.name}.csv"`);
      res.status(200).send(csv);
    } else {
      res.status(200).json({
        success: true,
        city: sampleCity.name,
        count: properties.length,
        properties: properties
      });
    }
    
  } catch (error) {
    console.error('Scraper error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
