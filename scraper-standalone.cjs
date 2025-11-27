/**
 * Florida Property Scraper - Standalone Version
 * 
 * Generates realistic property data for Central Florida
 * Exports to JSON and CSV files (no database required)
 * 
 * Usage:
 *   node scraper-standalone.cjs
 *   node scraper-standalone.cjs --city="Orlando" --limit=50
 */

const fs = require('fs');

// Central Florida cities
const CITIES = [
  'Orlando', 'Tampa', 'Daytona Beach', 'St. Petersburg', 'Clearwater',
  'Lakeland', 'Kissimmee', 'Port Orange', 'Sanford', 'Oviedo',
  'Winter Park', 'Altamonte Springs', 'Deltona', 'Palm Coast', 'Titusville'
];

// Generate realistic property data
function generateProperties(city, count = 10) {
  const properties = [];
  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'];
  const streets = ['Main St', 'Oak Ave', 'Palm Dr', 'Lake View Blvd', 'Sunset Way', 'Beach Rd', 'Pine St', 'Maple Ave'];
  const agents = [
    { name: 'John Smith', phone: '(407) 555-0101', email: 'john.smith@realty.com', broker: 'Keller Williams' },
    { name: 'Sarah Johnson', phone: '(407) 555-0102', email: 'sarah.j@remax.com', broker: 'RE/MAX' },
    { name: 'Mike Davis', phone: '(407) 555-0103', email: 'mdavis@century21.com', broker: 'Century 21' },
    { name: 'Emily Brown', phone: '(407) 555-0104', email: 'ebrown@coldwell.com', broker: 'Coldwell Banker' }
  ];
  
  for (let i = 0; i < count; i++) {
    const beds = 2 + Math.floor(Math.random() * 4);
    const baths = 1 + Math.floor(Math.random() * 3) + (Math.random() > 0.5 ? 0.5 : 0);
    const sqft = 1000 + Math.floor(Math.random() * 2500);
    const price = Math.floor((sqft * (150 + Math.random() * 150)) / 1000) * 1000;
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const propertyId = `ZPID${Math.floor(Math.random() * 100000000)}`;
    
    properties.push({
      propertyId,
      mlsId: `MLS${Math.floor(Math.random() * 1000000)}`,
      streetAddress: `${100 + Math.floor(Math.random() * 9900)} ${streets[Math.floor(Math.random() * streets.length)]}`,
      city,
      state: 'FL',
      zipCode: `${32700 + Math.floor(Math.random() * 1000)}`,
      latitude: (28.5 + Math.random() * 0.5).toFixed(6),
      longitude: (-81.4 + Math.random() * 0.5).toFixed(6),
      price,
      bedrooms: beds,
      bathrooms: baths,
      sqft,
      lotSize: Math.floor(sqft * (2 + Math.random() * 3)),
      yearBuilt: 1980 + Math.floor(Math.random() * 44),
      propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
      listingStatus: 'FOR_SALE',
      daysOnMarket: Math.floor(Math.random() * 90),
      hoaFee: Math.random() > 0.5 ? Math.floor(Math.random() * 300) + 50 : null,
      images: [
        `https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80`,
        `https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80`,
        `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80`,
        `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80`
      ],
      thumbnailUrl: `https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80`,
      description: `Beautiful ${beds} bedroom, ${baths} bathroom ${propertyTypes[Math.floor(Math.random() * propertyTypes.length)].toLowerCase()} in ${city}. This stunning property features ${sqft} sq ft of living space with modern amenities, updated kitchen, and spacious living areas. Great location close to schools, shopping, and entertainment. ${Math.random() > 0.5 ? 'Recently renovated with new appliances and flooring.' : 'Move-in ready with excellent curb appeal.'} Perfect for ${beds >= 4 ? 'large families' : 'first-time buyers or investors'}.`,
      agentName: agent.name,
      agentPhone: agent.phone,
      agentEmail: agent.email,
      brokerName: agent.broker,
      zestimate: Math.floor(price * (0.95 + Math.random() * 0.1)),
      rentZestimate: Math.floor(price * 0.006),
      priceHistory: [
        { date: '2024-11-01', price: price, event: 'Listed for sale' },
        { date: '2024-10-15', price: Math.floor(price * 1.05), event: 'Price change' }
      ],
      taxHistory: [
        { year: 2024, value: Math.floor(price * 0.85), tax: Math.floor(price * 0.012) },
        { year: 2023, value: Math.floor(price * 0.82), tax: Math.floor(price * 0.011) }
      ],
      schools: [
        { name: `${city} Elementary School`, rating: 7 + Math.floor(Math.random() * 3), distance: 0.5 + Math.random() * 2, grades: 'K-5' },
        { name: `${city} Middle School`, rating: 6 + Math.floor(Math.random() * 4), distance: 1 + Math.random() * 3, grades: '6-8' },
        { name: `${city} High School`, rating: 7 + Math.floor(Math.random() * 3), distance: 2 + Math.random() * 4, grades: '9-12' }
      ],
      scrapedAt: new Date().toISOString(),
      dataSource: 'sample-generator',
      isActive: true
    });
  }
  
  return properties;
}

// Main function
async function main() {
  console.log('🏠 Florida Property Scraper - Standalone');
  console.log('=========================================\n');
  
  // Parse CLI arguments
  const args = process.argv.slice(2);
  const cityArg = args.find(arg => arg.startsWith('--city='));
  const limitArg = args.find(arg => arg.startsWith('--limit='));
  
  const cities = cityArg ? [cityArg.split('=')[1].replace(/"/g, '')] : CITIES;
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 10;
  
  console.log(`📍 Cities: ${cities.join(', ')}`);
  console.log(`📊 Properties per city: ${limit}\n`);
  
  const allProperties = [];
  
  for (const city of cities) {
    console.log(`🔍 Generating properties for ${city}...`);
    const properties = generateProperties(city, limit);
    allProperties.push(...properties);
    console.log(`✅ Generated ${properties.length} properties\n`);
  }
  
  // Export to JSON
  const timestamp = new Date().toISOString().split('T')[0];
  const jsonFile = `properties-${timestamp}.json`;
  fs.writeFileSync(jsonFile, JSON.stringify(allProperties, null, 2));
  console.log(`📄 Exported to ${jsonFile}`);
  
  // Export to CSV
  const csvFile = `properties-${timestamp}.csv`;
  const csvHeader = 'Property ID,MLS ID,Address,City,State,ZIP,Price,Beds,Baths,SqFt,Type,Year,Status,Agent,Phone,Broker\n';
  const csvRows = allProperties.map(p => 
    `"${p.propertyId}","${p.mlsId}","${p.streetAddress}","${p.city}","${p.state}","${p.zipCode}",${p.price},${p.bedrooms},${p.bathrooms},${p.sqft},"${p.propertyType}",${p.yearBuilt},"${p.listingStatus}","${p.agentName}","${p.agentPhone}","${p.brokerName}"`
  ).join('\n');
  fs.writeFileSync(csvFile, csvHeader + csvRows);
  console.log(`📄 Exported to ${csvFile}`);
  
  // Summary
  console.log('\n📊 Summary:');
  console.log(`   Total properties: ${allProperties.length}`);
  console.log(`   Cities covered: ${cities.length}`);
  console.log(`   Average price: $${Math.floor(allProperties.reduce((sum, p) => sum + p.price, 0) / allProperties.length).toLocaleString()}`);
  console.log(`   Price range: $${Math.min(...allProperties.map(p => p.price)).toLocaleString()} - $${Math.max(...allProperties.map(p => p.price)).toLocaleString()}`);
  console.log('\n✅ Scraping complete!');
}

main().catch(console.error);

// Export for Vercel API
module.exports = { generateProperties };
