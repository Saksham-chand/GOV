const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const { Pool } = require('pg');
const pool = new Pool({ user: process.env.PGUSER, password: process.env.PGPASSWORD, database: process.env.PGDATABASE, host: process.env.PGHOST, port: 5432 });


async function run(){
const districts = await pool.query("SELECT id, district_code FROM districts WHERE state_code='UP'");
for(const d of districts.rows){
try{
// NOTE: Use real data.gov API endpoint and API key in production. Here we generate mock data.
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth()+1;
const payload = { beneficiaries: Math.floor(Math.random()*100000), funds: Math.floor(Math.random()*1000000), works: Math.floor(Math.random()*500) };
await pool.query(`INSERT INTO metrics_monthly(district_id, year, month, total_beneficiaries, funds_spent, works_completed, raw) VALUES($1,$2,$3,$4,$5,$6,$7)`, [d.id, year, month, payload.beneficiaries, payload.funds, payload.works, JSON.stringify(payload)]);
console.log('Inserted for', d.district_code);
}catch(err){ console.error('err', err.message); }
}
await pool.end();
}
run().catch(e=>{console.error(e); process.exit(1)});