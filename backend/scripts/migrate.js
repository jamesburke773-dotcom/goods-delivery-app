const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();
const sql = fs.readFileSync(path.join(__dirname,'..','migrations','001_init.sql'),'utf8');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
(async ()=> {
  try {
    await pool.query(sql);
    console.log('Migrations applied.');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
})();
