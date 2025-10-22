const { Pool } = require('pg');
const pool = new Pool({
user: process.env.PGUSER || 'mgn',
password: process.env.PGPASSWORD || 'mgnpass',
database: process.env.PGDATABASE || 'mgnrega',
host: process.env.PGHOST || 'db',
port: 5432
});
module.exports = { query: (text, params) => pool.query(text, params), pool };