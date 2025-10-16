const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();
(async ()=> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const pw = await bcrypt.hash('password123', 10);
  await pool.query('INSERT INTO users (role,name,email,password_hash) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING', ['admin','Admin','admin@example.com',pw]);
  await pool.query('INSERT INTO users (role,name,email,password_hash) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING', ['customer','Alice','alice@example.com',pw]);
  await pool.query('INSERT INTO users (role,name,email,password_hash) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING', ['courier','Bob','bob@example.com',pw]);
  console.log('Seed complete.');
  process.exit(0);
})();
