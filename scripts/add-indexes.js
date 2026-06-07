const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const dbUrl = envContent.split('\n').find(line => line.startsWith('DATABASE_URL=')).split('=')[1];

async function main() {
  const pool = new Pool({ 
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('Creating pg_trgm extension...');
    await pool.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
    console.log('✓ Extension created');
    
    console.log('Creating trigram index on site_addr_1...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_properties_addr_trgm ON properties 
      USING GIN (site_addr_1 gin_trgm_ops);
    `);
    console.log('✓ Trigram index created');
    
    console.log('Creating composite index on (site_addr_1, city)...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_properties_addr_city ON properties 
      (site_addr_1, city);
    `);
    console.log('✓ Composite index created');
    
    console.log('\nAll indexes created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
