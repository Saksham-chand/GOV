const express = require('express');
const cors = require('cors');
const db = require('./db');
const Redis = require('redis');
const fs = require('fs');


const app = express();
app.use(cors());
app.use(express.json());


const redis = Redis.createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });
redis.connect().catch(()=>console.warn('redis connect failed'));


app.get('/api/v1/districts', async (req,res)=>{
const state = (req.query.state || 'UP').toUpperCase();
const key = `districts:${state}`;
try{
const cached = await redis.get(key);
if(cached) return res.json(JSON.parse(cached));
}catch(e){}
const r = await db.query('SELECT district_code as code, name FROM districts WHERE state_code=$1 ORDER BY name', [state]);
await redis.setEx(key, 3600, JSON.stringify(r.rows));
res.json(r.rows);
});


app.get('/api/v1/summary/district/:code', async (req,res)=>{
const code = req.params.code.toUpperCase();
const key = `summary:${code}`;
try{
const cached = await redis.get(key);
if(cached) return res.json(JSON.parse(cached));
}catch(e){}
// find district
const d = await db.query('SELECT id, name FROM districts WHERE upper(district_code)=$1 LIMIT 1', [code]);
if(d.rowCount===0) return res.status(404).json({error:'District not found'});
const district = d.rows[0];
// get latest month
const m = await db.query(`SELECT year, month, total_beneficiaries, funds_spent, works_completed FROM metrics_monthly WHERE district_id=$1 ORDER BY year DESC, month DESC LIMIT 6`, [district.id]);
const summary = {
districtCode: code,
districtName: district.name,
recent: m.rows
};
try{ await redis.setEx(key, 3600, JSON.stringify(summary)); }catch(e){}
res.json(summary);
});


// Simple TTS stub: return pre-recorded or generate a small text
app.get('/api/v1/tts/district/:code', async (req,res)=>{
const code = req.params.code.toUpperCase();
const text = `This is a demo summary for district ${code}. Select district to see real data.`;
// For MVP we'll return a small text file with Content-Type audio/mpeg if you pre-generate.
res.type('text/plain').send(text);
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Backend listening on', PORT));