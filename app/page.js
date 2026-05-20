'use client';
import { useState } from 'react';

const initialClients = [
  { id:1, first:'Margaret', last:'Holloway', email:'margaret@email.com', phone:'(865) 555-0120', dest:'Amalfi Coast, Italy', style:'Leisure / Relaxation', depart:'2026-08-10', ret:'2026-08-22', travelers:2, budget:'$7,000', notes:'Prefers boutique hotels, no cruises', status:'active' },
  { id:2, first:'Derek', last:'Fontaine', email:'derek@email.com', phone:'(615) 555-0188', dest:'Japan', style:'Cultural / Historical', depart:'2026-09-05', ret:'2026-09-18', travelers:2, budget:'$6,500', notes:'First time in Asia', status:'quote' },
  { id:3, first:'Sylvia', last:'Chen', email:'sylvia@email.com', phone:'(423) 555-0144', dest:'Greece & Turkey', style:'Foodie / Culinary', depart:'2026-10-01', ret:'2026-10-12', travelers:4, budget:'$5,000', notes:'Anniversary trip', status:'new' },
  { id:4, first:'Marcus', last:'Webb', email:'marcus@email.com', phone:'(865) 555-0166', dest:'Patagonia', style:'Adventure / Active', depart:'2026-11-15', ret:'2026-11-28', travelers:2, budget:'$8,000', notes:'Hiking, camping, remote', status:'active' },
];

const initialQuotes = [
  { clientId:1, lines:[{desc:'Flights',amt:2400},{desc:'Hotels (12 nights)',amt:4800},{desc:'Planning fee',amt:500}], status:'sent' },
  { clientId:2, lines:[{desc:'Flights',amt:1900},{desc:'Hotels (13 nights)',amt:3900},{desc:'Planning fee',amt:500}], status:'draft' },
];

const STATUS_LABELS = { new:'New', active:'Active', quote:'Quote Sent', closed:'Closed', pending:'Pending' };
const STATUS_COLORS = {
  new: { bg:'#FBF4E0', color:'#7A5E1A' },
  active: { bg:'#D6EAFA', color:'#1A4F82' },
  quote: { bg:'#EEF2FF', color:'#4338CA' },
  closed: { bg:'#F3F4F6', color:'#6B7280' },
  pending: { bg:'#FEF3C7', color:'#92400E' },
};

function fmtDate(d) {
  if (!d) return '—';
  const [y,m,day] = d.split('-');
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${mo[+m-1]} ${+day}`;
}

function initials(c) { return c.first[0] + c.last[0]; }

function Badge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.closed;
  return (
    <span style={{ display:'inline-block', padding:'3px 9px', borderRadius:20, fontSize:11, fontWeight:500, background:s.bg, color:s.color }}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function App() {
  const [view, setView] = useState('dashboard');
  const [clients, setClients] = useState(initialClients);
  const [quotes, setQuotes] = useState(initialQuotes);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [nextId, setNextId] = useState(5);

  // intake form state
  const [form, setForm] = useState({ first:'', last:'', email:'', phone:'', dest:'', style:'Leisure / Relaxation', depart:'', ret:'', travelers:'', budget:'', notes:'' });

  // quote builder state
  const [qClientId, setQClientId] = useState(1);
  const [qLines, setQLines] = useState([{ desc:'', amt:'' }]);

  // ai state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState([]);
  const [aiError, setAiError] = useState('');

  const showView = (v) => { setView(v); if (v !== 'client-detail') setSelectedClient(null); };
  const openClient = (c) => { setSelectedClient(c); setActiveTab('overview'); setAiHistory([]); setAiPrompt(''); setAiError(''); setView('client-detail'); };

  const qTotal = qLines.reduce((s, l) => s + (parseFloat(l.amt) || 0), 0);

  const submitIntake = () => {
    if (!form.first || !form.last) return alert('Please enter client name.');
    const newClient = { ...form, id: nextId, travelers: form.travelers || 2, dest: form.dest || '—', budget: form.budget || '—', status: 'new' };
    setClients(prev => [...prev, newClient]);
    setNextId(n => n + 1);
    setForm({ first:'', last:'', email:'', phone:'', dest:'', style:'Leisure / Relaxation', depart:'', ret:'', travelers:'', budget:'', notes:'' });
    showView('clients');
  };

  const saveQuote = () => {
    const lines = qLines.filter(l => l.desc).map(l => ({ desc: l.desc, amt: parseFloat(l.amt) || 0 }));
    setQuotes(prev => {
      const i = prev.findIndex(q => q.clientId === qClientId);
      if (i >= 0) { const n = [...prev]; n[i] = { clientId: qClientId, lines, status: 'draft' }; return n; }
      return [...prev, { clientId: qClientId, lines, status: 'draft' }];
    });
    alert('Quote saved!');
  };

  const markSent = () => {
    setQuotes(prev => prev.map(q => q.clientId === qClientId ? { ...q, status: 'sent' } : q));
    alert('Quote marked as sent!');
  };

  const quickPrompt = (type) => {
    if (!selectedClient) return;
    const c = selectedClient;
    const prompts = {
      destination: `Suggest 3 specific destination options for ${c.first} ${c.last}. Style: ${c.style}, budget: ${c.budget}/person, trip: ${fmtDate(c.depart)}–${fmtDate(c.ret)}, ${c.travelers} travelers. Notes: ${c.notes||'none'}. Give a 2-3 sentence pitch for each with key highlights.`,
      itinerary: `Draft a day-by-day itinerary for ${c.first} ${c.last} visiting ${c.dest}. Trip: ${fmtDate(c.depart)}–${fmtDate(c.ret)}, ${c.travelers} travelers, ${c.style} style, budget ${c.budget}/person. Notes: ${c.notes||'none'}. Be specific with neighborhoods, timing, and activities.`,
      hotels: `Recommend 3 specific hotels in ${c.dest} for ${c.first} ${c.last}. Budget: ${c.budget}/person, ${c.travelers} travelers, ${c.style} style. Notes: ${c.notes||'none'}. Include name, why it fits, and approximate nightly rate.`,
      restaurants: `Recommend the best restaurants in ${c.dest} for ${c.first} ${c.last}. Style: ${c.style}. Notes: ${c.notes||'none'}. Give 5 specific picks with a one-line description and what to order.`,
      hidden: `Share insider tips and hidden gems for ${c.dest} that most tourists miss. Client style: ${c.style}. Notes: ${c.notes||'none'}. Focus on authentic, memorable experiences.`,
      packing: `Create a packing list for ${c.first} ${c.last}'s trip to ${c.dest}, ${fmtDate(c.depart)}–${fmtDate(c.ret)}, ${c.style} trip with ${c.travelers} travelers.`,
    };
    setAiPrompt(prompts[type] || '');
  };

  const runAI = async () => {
    if (!aiPrompt.trim() || !selectedClient) return;
    setAiLoading(true);
    setAiError('');
    const promptText = aiPrompt;
    setAiPrompt('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client: selectedClient, prompt: promptText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiHistory(prev => [{ q: promptText, a: data.text }, ...prev]);
    } catch (e) {
      setAiError('Error connecting to AI. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const clientQuote = selectedClient ? quotes.find(q => q.clientId === selectedClient.id) : null;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #F5F9FF; color: #1E2D3D; min-height: 100vh; font-size: 14px; }
        .app { display: flex; min-height: 100vh; }
        .sidebar { width: 230px; min-width: 230px; background: linear-gradient(175deg, #1A4F82 0%, #2C6FAC 55%, #4A90D9 100%); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
        .sidebar-logo { padding: 28px 20px 22px; border-bottom: 1px solid rgba(255,255,255,0.2); }
        .wordmark { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; color: #fff; line-height: 1.2; display: block; }
        .tagline { font-size: 11px; color: #fff; opacity: 0.85; letter-spacing: 0.04em; margin-top: 5px; font-style: italic; font-family: 'Playfair Display', serif; display: block; }
        .sidebar-nav { padding: 18px 14px; flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 8px; cursor: pointer; color: #fff; font-size: 14px; font-weight: 500; margin-bottom: 4px; transition: background 0.15s; border: none; background: transparent; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
        .nav-item:hover { background: rgba(255,255,255,0.18); }
        .nav-item.active { background: rgba(255,255,255,0.25); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.25); }
        .nav-item i { font-size: 18px; width: 20px; text-align: center; }
        .main { flex: 1; overflow-y: auto; background: #F5F9FF; }
        .topbar { background: #fff; border-bottom: 1px solid rgba(74,144,217,0.15); padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; }
        .topbar-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 500; }
        .btn { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; padding: 7px 16px; border-radius: 7px; cursor: pointer; border: 1px solid rgba(74,144,217,0.15); background: #fff; color: #1E2D3D; transition: all 0.15s; }
        .btn:hover { background: #EEF7FF; border-color: #4A90D9; }
        .btn-primary { background: #4A90D9; color: #fff; border-color: #4A90D9; }
        .btn-primary:hover { background: #2C6FAC; }
        .btn-gold { background: #C8A84B; color: #fff; border-color: #C8A84B; }
        .btn-gold:hover { background: #b5933c; }
        .btn-ai { background: linear-gradient(135deg, #1A4F82, #4A90D9); color: #fff; border: none; display: flex; align-items: center; gap: 7px; }
        .btn-ai:hover { background: linear-gradient(135deg, #2C6FAC, #5ba0e9); }
        .content { padding: 28px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
        .stat-card { background: #fff; border: 1px solid rgba(74,144,217,0.15); border-radius: 10px; padding: 18px; }
        .stat-label { font-size: 11px; color: #6B8299; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .stat-value { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 500; }
        .stat-sub { font-size: 11px; color: #2C6FAC; margin-top: 4px; }
        .panel { background: #fff; border: 1px solid rgba(74,144,217,0.15); border-radius: 10px; overflow: hidden; }
        .panel-header { padding: 16px 20px; border-bottom: 1px solid rgba(74,144,217,0.15); display: flex; align-items: center; justify-content: space-between; }
        .panel-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 500; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { padding: 10px 20px; text-align: left; font-size: 11px; font-weight: 500; color: #6B8299; text-transform: uppercase; letter-spacing: 0.07em; border-bottom: 1px solid rgba(74,144,217,0.15); background: #EEF7FF; }
        td { padding: 12px 20px; border-bottom: 1px solid rgba(74,144,217,0.15); vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #EEF7FF; cursor: pointer; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label { font-size: 12px; font-weight: 500; color: #6B8299; text-transform: uppercase; letter-spacing: 0.07em; }
        input, select, textarea { font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 9px 12px; border: 1px solid rgba(74,144,217,0.2); border-radius: 7px; background: #fff; color: #1E2D3D; outline: none; transition: border-color 0.15s; width: 100%; }
        input:focus, select:focus, textarea:focus { border-color: #4A90D9; box-shadow: 0 0 0 3px rgba(74,144,217,0.1); }
        textarea { resize: vertical; min-height: 80px; }
        .detail-hero { background: linear-gradient(135deg, #1A4F82 0%, #4A90D9 100%); color: #fff; padding: 24px 28px; display: flex; align-items: center; gap: 18px; }
        .avatar { width: 52px; height: 52px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 20px; }
        .tabs { display: flex; border-bottom: 1px solid rgba(74,144,217,0.15); padding: 0 28px; background: #fff; }
        .tab { padding: 12px 18px; font-size: 13px; font-weight: 500; color: #6B8299; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
        .tab:hover { color: #1E2D3D; }
        .tab.active { color: #2C6FAC; border-bottom-color: #4A90D9; }
        .tab-content { padding: 24px 28px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid rgba(74,144,217,0.1); font-size: 13px; }
        .info-row:last-child { border-bottom: none; }
        .info-key { color: #6B8299; }
        .back-btn { background: none; border: none; cursor: pointer; color: #2C6FAC; font-size: 13px; font-weight: 500; padding: 0; display: flex; align-items: center; gap: 5px; margin-bottom: 20px; font-family: 'DM Sans', sans-serif; }
        .back-btn:hover { color: #4A90D9; }
        .ai-banner { display: flex; align-items: center; gap: 10px; background: #EEF7FF; border: 1px solid rgba(74,144,217,0.25); border-radius: 9px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #1A4F82; }
        .ai-context-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .ai-context-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B8299; margin-bottom: 3px; }
        .ai-context-value { font-weight: 500; font-size: 13px; }
        .ai-quick-btns { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .ai-quick-btn { font-family: 'DM Sans', sans-serif; font-size: 12px; padding: 6px 13px; border-radius: 20px; cursor: pointer; border: 1px solid rgba(74,144,217,0.2); background: #fff; color: #2C6FAC; transition: all 0.15s; }
        .ai-quick-btn:hover { background: #EEF7FF; border-color: #4A90D9; }
        .ai-prompt-row { display: flex; gap: 10px; align-items: flex-start; }
        .ai-prompt-row textarea { flex: 1; min-height: 70px; }
        .ai-history-entry { margin-bottom: 20px; }
        .ai-history-q { font-size: 12px; font-weight: 500; color: #6B8299; margin-bottom: 6px; }
        .ai-history-a { background: #fff; border: 1px solid rgba(74,144,217,0.15); border-radius: 8px; padding: 14px 16px; font-size: 13px; line-height: 1.75; white-space: pre-wrap; }
        .ai-error { background: #FEF3F3; border: 1px solid rgba(226,75,74,0.2); border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #A32D2D; margin-top: 12px; }
        .loading-text { color: #6B8299; font-style: italic; font-size: 13px; padding: 16px 0; }
        .quote-total { font-family: 'Playfair Display', serif; font-size: 22px; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(74,144,217,0.15); color: #1A4F82; }
        .empty { text-align: center; padding: 40px; color: #6B8299; font-size: 13px; }
        .admin-badge { background: linear-gradient(135deg, #1A4F82, #4A90D9); color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 20px; letter-spacing: 0.05em; }
        .section-gap { margin-top: 16px; }
        .quote-line-row { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
      `}</style>

      <div className="app">
        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="sidebar-logo">
            <span className="wordmark">Led by the Lambs</span>
            <span className="tagline">Your dream adventure awaits.</span>
          </div>
          <div className="sidebar-nav">
            {[
              { id:'dashboard', icon:'ti-layout-dashboard', label:'Dashboard' },
              { id:'clients', icon:'ti-users', label:'Clients' },
              { id:'intake', icon:'ti-clipboard-plus', label:'New Request' },
              { id:'quotes', icon:'ti-receipt', label:'Quotes' },
            ].map(n => (
              <button key={n.id} className={`nav-item ${view === n.id ? 'active' : ''}`} onClick={() => showView(n.id)}>
                <i className={`ti ${n.icon}`} />
                <span style={{ color:'#fff' }}>{n.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="main">

          {/* DASHBOARD */}
          {view === 'dashboard' && (
            <>
              <div className="topbar">
                <div className="topbar-title">Dashboard</div>
                <button className="btn btn-primary" onClick={() => showView('intake')}>+ New Request</button>
              </div>
              <div className="content">
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-label">Active Clients</div><div className="stat-value">{clients.filter(c=>c.status==='active').length}</div><div className="stat-sub">↑ 2 this month</div></div>
                  <div className="stat-card"><div className="stat-label">Open Quotes</div><div className="stat-value">{quotes.length}</div><div className="stat-sub">$18,400 pipeline</div></div>
                  <div className="stat-card"><div className="stat-label">Trips Planned</div><div className="stat-value">7</div><div className="stat-sub">2 upcoming</div></div>
                  <div className="stat-card"><div className="stat-label">Revenue</div><div className="stat-value">$6,200</div><div className="stat-sub">Since launch</div></div>
                </div>
                <div className="panel">
                  <div className="panel-header"><div className="panel-title">Recent Requests</div><button className="btn" onClick={() => showView('clients')}>View all</button></div>
                  <table>
                    <thead><tr><th>Client</th><th>Destination</th><th>Travel Dates</th><th>Budget</th><th>Status</th><th></th></tr></thead>
                    <tbody>{clients.slice().reverse().slice(0,4).map(c => (
                      <tr key={c.id} onClick={() => openClient(c)}>
                        <td><strong>{c.first} {c.last}</strong><br/><span style={{fontSize:11,color:'#6B8299'}}>{c.email}</span></td>
                        <td>{c.dest}</td><td>{fmtDate(c.depart)} – {fmtDate(c.ret)}</td><td>{c.budget}</td>
                        <td><Badge status={c.status} /></td>
                        <td><button className="btn" onClick={e=>{e.stopPropagation();openClient(c);}}>View</button></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* CLIENTS */}
          {view === 'clients' && (
            <>
              <div className="topbar">
                <div className="topbar-title">Clients</div>
                <button className="btn btn-primary" onClick={() => showView('intake')}>+ New Request</button>
              </div>
              <div className="content">
                <div className="panel">
                  <table>
                    <thead><tr><th>Client</th><th>Destination</th><th>Travel Dates</th><th>Budget</th><th>Status</th><th></th></tr></thead>
                    <tbody>{clients.map(c => (
                      <tr key={c.id} onClick={() => openClient(c)}>
                        <td><strong>{c.first} {c.last}</strong><br/><span style={{fontSize:11,color:'#6B8299'}}>{c.email}</span></td>
                        <td>{c.dest}</td><td>{fmtDate(c.depart)} – {fmtDate(c.ret)}</td><td>{c.budget}</td>
                        <td><Badge status={c.status} /></td>
                        <td><button className="btn" onClick={e=>{e.stopPropagation();openClient(c);}}>View</button></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* CLIENT DETAIL */}
          {view === 'client-detail' && selectedClient && (() => {
            const c = selectedClient;
            const nights = c.depart && c.ret ? Math.round((new Date(c.ret)-new Date(c.depart))/(1000*60*60*24)) : '—';
            return (
              <>
                <div className="detail-hero">
                  <div className="avatar">{initials(c)}</div>
                  <div>
                    <div style={{fontFamily:'Playfair Display, serif', fontSize:22, fontWeight:500}}>{c.first} {c.last}</div>
                    <div style={{fontSize:12, color:'rgba(255,255,255,0.7)', marginTop:3}}>{c.email} · {c.phone}</div>
                  </div>
                </div>
                <div className="tabs">
                  {['overview','quote','notes','ai'].map(t => (
                    <div key={t} className={`tab ${activeTab===t?'active':''}`} onClick={() => setActiveTab(t)}>
                      {t === 'ai' && <i className="ti ti-sparkles" style={{fontSize:14,color:'#4A90D9'}} />}
                      {t === 'overview' ? 'Overview' : t === 'quote' ? 'Quote' : t === 'notes' ? 'Notes' : 'AI Planner'}
                      {t === 'ai' && <span className="admin-badge">Admin</span>}
                    </div>
                  ))}
                </div>

                {activeTab === 'overview' && (
                  <div className="tab-content">
                    <button className="back-btn" onClick={() => showView('clients')}>← Back to clients</button>
                    <div className="two-col">
                      <div className="panel">
                        <div className="panel-header"><div className="panel-title">Trip Details</div></div>
                        <div style={{padding:'0 20px'}}>
                          {[['Destination',c.dest],['Style',c.style],['Departure',fmtDate(c.depart)],['Return',fmtDate(c.ret)],['Travelers',c.travelers],['Budget',c.budget],['Status', <Badge status={c.status} />]].map(([k,v],i) => (
                            <div key={i} className="info-row"><span className="info-key">{k}</span><span>{v}</span></div>
                          ))}
                        </div>
                      </div>
                      <div className="panel">
                        <div className="panel-header"><div className="panel-title">Contact Info</div></div>
                        <div style={{padding:'0 20px'}}>
                          {[['First name',c.first],['Last name',c.last],['Email',c.email],['Phone',c.phone]].map(([k,v],i) => (
                            <div key={i} className="info-row"><span className="info-key">{k}</span><span>{v}</span></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'quote' && (
                  <div className="tab-content">
                    <button className="back-btn" onClick={() => showView('clients')}>← Back to clients</button>
                    {clientQuote ? (
                      <div className="panel">
                        <div className="panel-header">
                          <div className="panel-title">Quote for {c.first} {c.last}</div>
                          <Badge status={clientQuote.status === 'sent' ? 'active' : 'pending'} />
                        </div>
                        <div style={{padding:'16px 20px'}}>
                          {clientQuote.lines.map((l,i) => <div key={i} className="info-row"><span>{l.desc}</span><span>${l.amt.toLocaleString()}</span></div>)}
                          <div className="quote-total">Total: ${clientQuote.lines.reduce((s,l)=>s+l.amt,0).toLocaleString()}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="empty">No quote yet. <button className="btn btn-primary" style={{marginLeft:8}} onClick={() => showView('quotes')}>Build one →</button></div>
                    )}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="tab-content">
                    <button className="back-btn" onClick={() => showView('clients')}>← Back to clients</button>
                    <div className="panel">
                      <div className="panel-header"><div className="panel-title">Notes</div></div>
                      <div style={{padding:'16px 20px'}}>
                        <textarea style={{width:'100%', minHeight:120}} placeholder="Add notes about this client or trip…" defaultValue={c.notes} />
                        <button className="btn btn-primary" style={{marginTop:10}}>Save notes</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="tab-content">
                    <button className="back-btn" onClick={() => showView('clients')}>← Back to clients</button>
                    <div className="ai-banner">
                      <i className="ti ti-lock" style={{fontSize:18}} />
                      <span>This tab is <strong>admin only</strong> — your planning workspace, not visible to clients.</span>
                    </div>
                    <div className="panel" style={{marginBottom:20}}>
                      <div className="panel-header">
                        <div className="panel-title">Client Context</div>
                        <span style={{fontSize:12,color:'#6B8299'}}>Auto-filled from profile</span>
                      </div>
                      <div style={{padding:'14px 20px'}}>
                        <div className="ai-context-grid">
                          {[['Client',`${c.first} ${c.last}`],['Destination',c.dest],['Style',c.style],['Dates',`${fmtDate(c.depart)} – ${fmtDate(c.ret)}`],['Nights',nights],['Travelers',`${c.travelers} people`],['Budget',`${c.budget} / person`]].map(([k,v],i) => (
                            <div key={i}><div className="ai-context-label">{k}</div><div className="ai-context-value">{v}</div></div>
                          ))}
                          <div style={{gridColumn:'1/-1'}}><div className="ai-context-label">Notes</div><div className="ai-context-value">{c.notes||'—'}</div></div>
                        </div>
                      </div>
                    </div>
                    <div className="panel">
                      <div className="panel-header"><div className="panel-title">Ask the Planner</div></div>
                      <div style={{padding:20}}>
                        <div className="ai-quick-btns">
                          {[['destination','✈️ Suggest destinations'],['itinerary','🗓 Draft itinerary'],['hotels','🏨 Recommend hotels'],['restaurants','🍽 Best restaurants'],['hidden','💎 Hidden gems'],['packing','🎒 Packing list']].map(([type,label]) => (
                            <button key={type} className="ai-quick-btn" onClick={() => quickPrompt(type)}>{label}</button>
                          ))}
                        </div>
                        <div className="ai-prompt-row">
                          <textarea placeholder="Ask anything about this client's trip…" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) runAI(); }} />
                          <button className="btn btn-ai" onClick={runAI} disabled={aiLoading} style={{whiteSpace:'nowrap',padding:'9px 18px'}}>
                            <i className="ti ti-sparkles" /> {aiLoading ? 'Thinking…' : 'Ask AI'}
                          </button>
                        </div>
                        <div style={{fontSize:11,color:'#6B8299',marginTop:6}}>Tip: Cmd+Enter to submit</div>
                        {aiError && <div className="ai-error">{aiError}</div>}
                        {aiLoading && <div className="loading-text">Planning in progress…</div>}
                        {aiHistory.length > 0 && (
                          <div style={{marginTop:24}}>
                            {aiHistory.map((entry, i) => (
                              <div key={i} className="ai-history-entry">
                                <div className="ai-history-q"><i className="ti ti-message-circle" style={{fontSize:13}} /> {entry.q.length > 80 ? entry.q.slice(0,80)+'…' : entry.q}</div>
                                <div className="ai-history-a">{entry.a}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {/* INTAKE */}
          {view === 'intake' && (
            <>
              <div className="topbar"><div className="topbar-title">New Trip Request</div></div>
              <div className="content">
                <div className="panel">
                  <div className="panel-header"><div className="panel-title">Client Information</div></div>
                  <div style={{padding:20}}>
                    <div className="form-grid">
                      {[['first','First Name','Jane'],['last','Last Name','Doe'],['email','Email','jane@email.com'],['phone','Phone','(555) 000-0000']].map(([field,label,ph]) => (
                        <div key={field} className="form-group">
                          <label className="form-label">{label}</label>
                          <input type={field==='email'?'email':'text'} placeholder={ph} value={form[field]} onChange={e => setForm(f=>({...f,[field]:e.target.value}))} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="panel section-gap">
                  <div className="panel-header"><div className="panel-title">Trip Details</div></div>
                  <div style={{padding:20}}>
                    <div className="form-grid">
                      <div className="form-group"><label className="form-label">Destination(s)</label><input placeholder="Italy, France…" value={form.dest} onChange={e=>setForm(f=>({...f,dest:e.target.value}))} /></div>
                      <div className="form-group"><label className="form-label">Trip Style</label>
                        <select value={form.style} onChange={e=>setForm(f=>({...f,style:e.target.value}))}>
                          {['Leisure / Relaxation','Adventure / Active','Cultural / Historical','Foodie / Culinary','Honeymoon / Romance','Family','Group / Corporate'].map(s=><option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="form-group"><label className="form-label">Departure Date</label><input type="date" value={form.depart} onChange={e=>setForm(f=>({...f,depart:e.target.value}))} /></div>
                      <div className="form-group"><label className="form-label">Return Date</label><input type="date" value={form.ret} onChange={e=>setForm(f=>({...f,ret:e.target.value}))} /></div>
                      <div className="form-group"><label className="form-label">Travelers</label><input type="number" min="1" placeholder="2" value={form.travelers} onChange={e=>setForm(f=>({...f,travelers:e.target.value}))} /></div>
                      <div className="form-group"><label className="form-label">Budget (per person)</label><input placeholder="$5,000" value={form.budget} onChange={e=>setForm(f=>({...f,budget:e.target.value}))} /></div>
                      <div className="form-group full"><label className="form-label">Special Requests / Notes</label><textarea placeholder="Dietary restrictions, must-see experiences…" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} /></div>
                    </div>
                    <div style={{marginTop:16,display:'flex',gap:10}}>
                      <button className="btn btn-primary" onClick={submitIntake}>Save Client Request</button>
                      <button className="btn" onClick={() => setForm({first:'',last:'',email:'',phone:'',dest:'',style:'Leisure / Relaxation',depart:'',ret:'',travelers:'',budget:'',notes:''})}>Clear</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* QUOTES */}
          {view === 'quotes' && (
            <>
              <div className="topbar"><div className="topbar-title">Quotes & Invoicing</div></div>
              <div className="content">
                <div className="two-col">
                  <div className="panel">
                    <div className="panel-header"><div className="panel-title">Build a Quote</div></div>
                    <div style={{padding:20}}>
                      <div className="form-group" style={{marginBottom:14}}>
                        <label className="form-label">Client</label>
                        <select value={qClientId} onChange={e=>setQClientId(+e.target.value)}>
                          {clients.map(c=><option key={c.id} value={c.id}>{c.first} {c.last}</option>)}
                        </select>
                      </div>
                      {qLines.map((line,i) => (
                        <div key={i} className="quote-line-row">
                          <input placeholder="Line item" value={line.desc} onChange={e=>{const n=[...qLines];n[i]={...n[i],desc:e.target.value};setQLines(n);}} style={{flex:2}} />
                          <input placeholder="$0" value={line.amt} onChange={e=>{const n=[...qLines];n[i]={...n[i],amt:e.target.value};setQLines(n);}} style={{flex:1}} />
                          {qLines.length > 1 && <button className="btn" style={{padding:'7px 10px'}} onClick={()=>setQLines(qLines.filter((_,j)=>j!==i))}>✕</button>}
                        </div>
                      ))}
                      <button className="btn" style={{marginTop:6}} onClick={()=>setQLines([...qLines,{desc:'',amt:''}])}>+ Add line</button>
                      <div className="quote-total">Total: ${Math.round(qTotal).toLocaleString()}</div>
                      <div style={{marginTop:16,display:'flex',gap:10}}>
                        <button className="btn btn-primary" onClick={saveQuote}>Save Quote</button>
                        <button className="btn btn-gold" onClick={markSent}>Mark as Sent</button>
                      </div>
                    </div>
                  </div>
                  <div className="panel">
                    <div className="panel-header"><div className="panel-title">Saved Quotes</div></div>
                    <table>
                      <thead><tr><th>Client</th><th>Amount</th><th>Status</th></tr></thead>
                      <tbody>{quotes.length ? quotes.map((q,i) => {
                        const c = clients.find(x=>x.id===q.clientId);
                        const total = q.lines.reduce((s,l)=>s+l.amt,0);
                        return <tr key={i}><td>{c?`${c.first} ${c.last}`:'Unknown'}</td><td>${total.toLocaleString()}</td><td><Badge status={q.status==='sent'?'active':'pending'} /></td></tr>;
                      }) : <tr><td colSpan={3} className="empty">No quotes yet</td></tr>}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
