import React, {useEffect, useState} from 'react';
import axios from 'axios';
export default function App(){
const [districts,setDistricts] = useState([]);
const [sel,setSel] = useState('');
const [summary,setSummary] = useState(null);
useEffect(()=>{ axios.get('/api/v1/districts?state=UP').then(r=>setDistricts(r.data)).catch(()=>setDistricts([])); },[]);
useEffect(()=>{ if(!sel) return; axios.get(`/api/v1/summary/district/${sel}`).then(r=>setSummary(r.data)).catch(()=>setSummary(null)); },[sel]);
return (
<div style={{fontFamily:'system-ui',padding:20,maxWidth:720,margin:'0 auto'}}>
<h1 style={{fontSize:22}}>MGNREGA — District Insight</h1>
<div>
<label style={{display:'block',marginBottom:8}}>Choose District</label>
<select value={sel} onChange={e=>setSel(e.target.value)} style={{fontSize:18,padding:8}}>
<option value="">-- Select --</option>
{districts.map(d=> <option key={d.code} value={d.code}>{d.name}</option>)}
</select>
</div>
{summary && (
<div style={{marginTop:20}}>
<h2 style={{fontSize:20}}>{summary.districtName}</h2>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
<div style={{padding:12,borderRadius:8,background:'#f3f3f3'}}>
<div style={{fontSize:12}}>Beneficiaries</div>
<div style={{fontSize:20,fontWeight:700}}>{summary.recent[0]?.total_beneficiaries || '-'}</div>
</div>
<div style={{padding:12,borderRadius:8,background:'#f3f3f3'}}>
<div style={{fontSize:12}}>Funds (₹)</div>
<div style={{fontSize:20,fontWeight:700}}>{summary.recent[0]?.funds_spent || '-'}</div>
</div>
<div style={{padding:12,borderRadius:8,background:'#f3f3f3'}}>
<div style={{fontSize:12}}>Works</div>
<div style={{fontSize:20,fontWeight:700}}>{summary.recent[0]?.works_completed || '-'}</div>
</div>
</div>
<div style={{marginTop:12}}>
<button onClick={async ()=>{
const r = await axios.get(`/api/v1/tts/district/${sel}`);
alert(r.data);
}} style={{padding:10,fontSize:16}}>🔊 Listen</button>
</div>
</div>
)}
</div>
);
}