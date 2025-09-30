#!/usr/bin/env bash
# bootstrap.sh — macOS/Linux/WSL. For Windows, run in Git Bash.
set -euo pipefail

APP_NAME="happy-paws"
echo "▶ Creating Vite React app: $APP_NAME"
npm create vite@latest "$APP_NAME" -- --template react >/dev/null

cd "$APP_NAME"

echo "▶ Installing dependencies"
npm i react-router-dom
npm i -D @vitejs/plugin-react vite

echo "▶ Writing project files"

# package.json
cat > package.json <<'EOF'
{
  "name": "pet-daycare-site",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.8"
  }
}
EOF

# vite.config.js
cat > vite.config.js <<'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: 'dist' }
});
EOF

# index.html
cat > index.html <<'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Happy Paws – Pet Day Care & Boarding</title>
    <meta name="description" content="Indoor/outdoor splash parks, boarding, grooming, training, and more for your best friend."/>
    <link rel="icon" href="/logo.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# public assets
mkdir -p public
cat > public/logo.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="Happy Paws Logo">
  <circle cx="64" cy="64" r="62" fill="#fff" stroke="#111" stroke-width="4"/>
  <circle cx="40" cy="48" r="10" fill="#111"/>
  <circle cx="88" cy="48" r="10" fill="#111"/>
  <circle cx="52" cy="28" r="8" fill="#111"/>
  <circle cx="76" cy="28" r="8" fill="#111"/>
  <path d="M40 82c10 12 38 12 48 0" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"/>
</svg>
EOF

# styles
mkdir -p src
cat > src/styles.css <<'EOF'
:root {
  --bg: #ffffff;
  --text: #111;
  --muted: #6b7280;
  --brand: #2563eb;
  --brand-600: #1d4ed8;
  --surface: #f6f7fb;
  --border: #e5e7eb;
  --danger: #ef4444;
  --ok: #16a34a;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: var(--text); background: var(--bg); }
a { color: inherit; text-decoration: none; }
button { font: inherit; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }

.header { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--border); }
.header-inner { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; }
.brand { display: flex; align-items: center; gap: 10px; }
.brand img { width: 36px; height: 36px; }
.brand-name { font-weight: 800; }
.nav { display: none; gap: 16px; align-items: center; }
.cta { background: var(--brand); color: #fff; border: 0; padding: 10px 14px; border-radius: 10px; cursor: pointer; }
.cta:hover { background: var(--brand-600); }
.hamburger { display: inline-flex; background: #fff; border: 1px solid var(--border); padding: 8px; border-radius: 10px; cursor: pointer; }
.drawer { position: fixed; inset: 0 0 0 auto; width: 80%; max-width: 360px; background: #fff; box-shadow: -10px 0 30px rgba(0,0,0,0.15); transform: translateX(100%); transition: transform .25s ease; z-index: 60; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.drawer.open { transform: translateX(0); }
.drawer a { padding: 10px 8px; border-radius: 8px; }
.drawer a:hover { background: var(--surface); }
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 55; }

@media (min-width: 960px) {
  .nav { display: flex; }
  .hamburger { display: none; }
  .drawer, .overlay { display: none; }
}

.main-grid {
  display: grid;
  grid-template-columns: 260px minmax(0,1fr) 320px;
  gap: 18px;
  padding: 18px 0 48px;
}
@media (max-width: 1199px) {
  .main-grid { grid-template-columns: 220px minmax(0,1fr); }
  .chat { display: none; }
}
@media (max-width: 800px) {
  .main-grid { grid-template-columns: 1fr; }
}

.card { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 16px; }
.muted { color: var(--muted); }
.section-title { font-size: 20px; font-weight: 800; margin: 8px 0 12px; }
.page-title { font-size: 26px; font-weight: 900; margin: 10px 0 16px; }

.aside { position: sticky; top: 76px; align-self: start; }
.aside .link { display: block; padding: 8px 10px; border-radius: 10px; color: #374151; }
.aside .link.active, .aside .link:hover { background: var(--surface); color: var(--text); }

.chat { position: sticky; top: 76px; align-self: start; height: calc(100vh - 120px); display: flex; flex-direction: column; }
.chat-log { flex: 1; overflow: auto; border: 1px solid var(--border); border-radius: 12px; padding: 10px; background: #fff; }
.msg { margin: 8px 0; padding: 10px 12px; border-radius: 12px; max-width: 85%; }
.msg.user { background: var(--surface); align-self: flex-end; }
.msg.bot { background: #fff; border: 1px solid var(--border); align-self: flex-start; }
.chat-input { display: flex; gap: 8px; margin-top: 10px; }
.chat-input input { flex: 1; padding: 10px 12px; border: 1px solid var(--border); border-radius: 10px; }
.chat-input button { padding: 10px 14px; border-radius: 10px; border: 0; background: var(--brand); color: #fff; cursor: pointer; }
.chat-input button:disabled { opacity: .6; cursor: not-allowed; }

.slider { position: relative; overflow: hidden; border-radius: 14px; }
.slides { display: flex; transition: transform .4s ease; }
.slide { min-width: 100%; max-height: 420px; display: grid; place-items: center; background: #ddd; }
.slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
.slider-controls { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 999px; background: rgba(255,255,255,.65); border: 1px solid rgba(0,0,0,.2); }
.dot.active { background: var(--brand); }

.grid { display: grid; gap: 12px; }
.grid.cols-2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
.grid.cols-3 { grid-template-columns: repeat(3, minmax(0,1fr)); }
@media (max-width: 800px) {
  .grid.cols-2, .grid.cols-3 { grid-template-columns: 1fr; }
}
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { border-bottom: 1px solid var(--border); padding: 10px; text-align: left; }

.footer { border-top: 1px solid var(--border); padding: 28px 0; margin-top: 40px; color: #6b7280; font-size: 14px; }
EOF

# main.jsx
cat > src/main.jsx <<'EOF'
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
EOF

# app + components + pages + crm
mkdir -p src/components src/pages src/crm

cat > src/App.jsx <<'EOF'
import { Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { CRMProvider } from './crm/CRMProvider.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Training from './pages/Training.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Jobs from './pages/Jobs.jsx';
import Privacy from './pages/Privacy.jsx';
import Credits from './pages/Credits.jsx';
import Admin from './pages/Admin.jsx';
import Sidebar from './components/Sidebar.jsx';
import Chatbot from './components/Chatbot.jsx';

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header" role="banner">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="Home">
          <img src="/logo.svg" alt="" />
          <span className="brand-name">Happy Paws</span>
        </a>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/training">Training</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          <a href="/privacy">Privacy</a>
          <a href="/credits">Credits</a>
        </nav>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <a className="cta" href="/contact#reservations">Book Now</a>
          <button className="hamburger" aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(true)}>
            ☰
          </button>
        </div>
      </div>
      {open && <div className="overlay" onClick={()=>setOpen(false)} aria-hidden="true"></div>}
      <div className={`drawer ${open ? 'open':''}`} role="dialog" aria-modal="true" aria-label="Mobile menu">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <strong>Menu</strong>
          <button className="hamburger" aria-label="Close menu" onClick={()=>setOpen(false)}>✕</button>
        </div>
        <a href="/" onClick={()=>setOpen(false)}>Home</a>
        <a href="/services" onClick={()=>setOpen(false)}>Services</a>
        <a href="/training" onClick={()=>setOpen(false)}>Training</a>
        <a href="/about" onClick={()=>setOpen(false)}>About</a>
        <a href="/contact" onClick={()=>setOpen(false)}>Contact</a>
        <a href="/jobs" onClick={()=>setOpen(false)}>Jobs</a>
        <a href="/admin" onClick={()=>setOpen(false)}>Admin</a>
        <a href="/privacy" onClick={()=>setOpen(false)}>Privacy</a>
        <a href="/credits" onClick={()=>setOpen(false)}>Site Credits</a>
        <a className="cta" href="/contact#reservations" onClick={()=>setOpen(false)}>Book Now</a>
      </div>
    </header>
  );
}

function Layout({ children, sections }) {
  return (
    <div className="container">
      <div className="main-grid">
        <aside className="aside">
          <div className="card">
            <div className="section-title">On this page</div>
            <Sidebar sections={sections}/>
          </div>
        </aside>
        <main>{children}</main>
        <aside className="chat">
          <div className="card" style={{height:'100%', display:'flex', flexDirection:'column'}}>
            <div className="section-title">Ask Happy Paws</div>
            <Chatbot/>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CRMProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Layout sections={[
          {id:'intro', label:'Intro'},
          {id:'mission', label:'Mission'},
          {id:'quicklinks', label:'Quick Links'}
        ]}><Home/></Layout>}/>
        <Route path="/services" element={<Layout sections={[
          {id:'splash', label:'Splash Parks'},
          {id:'overnight', label:'Overnight Stays'},
          {id:'day', label:'Day Options'},
          {id:'bathing', label:'Self Bathing'},
          {id:'birthday', label:'Birthday Parties'},
          {id:'social', label:'Social Areas & 16 Tap'},
          {id:'events', label:'Events'},
          {id:'grooming', label:'Full Service Grooming'}
        ]}><Services/></Layout>}/>
        <Route path="/training" element={<Layout sections={[
          {id:'group', label:'Group Obedience'},
          {id:'sport', label:'Sport/AKC/Fun'},
          {id:'puppy', label:'Puppy University'},
          {id:'private', label:'Private Lessons'},
          {id:'staytrain', label:'Stay-N-Train / Day-Train'},
          {id:'trainers', label:'Meet Trainers & Reviews'}
        ]}><Training/></Layout>}/>
        <Route path="/about" element={<Layout sections={[
          {id:'team', label:'Management Team'},
          {id:'reviews', label:'Reviews'},
          {id:'different', label:"How We're Different"},
          {id:'gallery', label:'Photo Gallery'},
          {id:'mission', label:'Our Mission'},
          {id:'faqs', label:'FAQs'}
        ]}><About/></Layout>}/>
        <Route path="/contact" element={<Layout sections={[
          {id:'contact', label:'Contact Us'},
          {id:'reservations', label:'Reservations'}
        ]}><Contact/></Layout>}/>
        <Route path="/jobs" element={<Layout sections={[
          {id:'careers', label:'Careers'}
        ]}><Jobs/></Layout>}/>
        <Route path="/privacy" element={<Layout sections={[
          {id:'privacy', label:'Privacy Policy'}
        ]}><Privacy/></Layout>}/>
        <Route path="/credits" element={<Layout sections={[
          {id:'credits', label:'Site Credits'}
        ]}><Credits/></Layout>}/>
        <Route path="/admin" element={<div className="container" style={{padding:'20px 0'}}><Admin/></div>} />
        <Route path="*" element={<div className="container" style={{padding:'40px 0'}}><h1>404</h1><p>Page not found.</p></div>} />
      </Routes>
      <footer className="footer">
        <div className="container">&copy; {new Date().getFullYear()} Happy Paws. All rights reserved.</div>
      </footer>
    </CRMProvider>
  );
}
EOF

cat > src/components/Sidebar.jsx <<'EOF'
import { useEffect, useState } from 'react';

export default function Sidebar({ sections }) {
  const [active, setActive] = useState(sections?.[0]?.id);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 1]});
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page">
      {sections.map(s => (
        <a key={s.id} href={`#${s.id}`} className={`link ${active===s.id?'active':''}`}>{s.label}</a>
      ))}
      <hr style={{margin:'10px 0'}}/>
      <a className="link" href="#">Back to top ↑</a>
    </nav>
  );
}
EOF

cat > src/components/Slider.jsx <<'EOF'
import { useEffect, useRef, useState } from 'react';

export default function Slider({ images=[], interval=4500 }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const count = images.length || 1;

  useEffect(() => {
    const id = setInterval(()=>setIdx(i => (i+1) % count), interval);
    timer.current = id;
    return () => clearInterval(id);
  }, [count, interval]);

  const go = (i) => setIdx(i);
  const pause = () => timer.current && clearInterval(timer.current);

  return (
    <div className="slider" onMouseEnter={pause}>
      <div className="slides" style={{transform:`translateX(-${idx*100}%)`}}>
        {(images.length?images:[{url:'https://images.unsplash.com/photo-1548199973-03cce0bbc87b'}]).map((img, i)=>(
          <div className="slide" key={i} aria-hidden={i!==idx}>
            <img src={typeof img==='string'?img:img.url} alt={img.alt || 'Pet facility photo'} loading="eager"/>
          </div>
        ))}
      </div>
      <div className="slider-controls" aria-label="Slide controls">
        {Array.from({length: count}).map((_,i)=>(
          <button key={i} className={`dot ${i===idx?'active':''}`} aria-label={`Go to slide ${i+1}`} onClick={()=>go(i)} />
        ))}
      </div>
    </div>
  );
}
EOF

cat > src/components/Chatbot.jsx <<'EOF'
import { useEffect, useRef, useState } from 'react';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [log, setLog] = useState([{ role:'bot', text:'Hi! Ask me about services, reservations, or hours.' }]);
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); }, [log]);

  async function send() {
    if (!input.trim()) return;
    const user = { role:'user', text: input.trim() };
    setLog(l => [...l, user]);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/.netlify/functions/chatbot', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: user.text })
      });
      const data = await res.json();
      setLog(l => [...l, { role:'bot', text: data.reply || 'Sorry, I did not understand.' }]);
    } catch (e) {
      setLog(l => [...l, { role:'bot', text: 'Network issue. Try again.' }]);
    } finally { setBusy(false); }
  }

  function onKey(e){ if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } }

  return (
    <>
      <div className="chat-log" role="log" aria-live="polite">
        {log.map((m,i)=>(
          <div key={i} className={`msg ${m.role==='user'?'user':'bot'}`}>{m.text}</div>
        ))}
        <div ref={endRef}/>
      </div>
      <div className="chat-input">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your question…" onKeyDown={onKey} aria-label="Chat input"/>
        <button onClick={send} disabled={busy}>{busy?'…':'Send'}</button>
      </div>
    </>
  );
}
EOF

cat > src/pages/Home.jsx <<'EOF'
import Slider from '../components/Slider.jsx';
import { useCRM } from '../crm/CRMProvider.jsx';

export default function Home() {
  const { data } = useCRM();
  return (
    <div>
      <section id="intro" className="card">
        <h1 className="page-title">Welcome to {data.site.name}</h1>
        <Slider images={data.home.heroImages}/>
        <p className="muted" style={{marginTop:12}}>{data.home.mission}</p>
      </section>

      <section id="mission" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Mission Teasers</h2>
        <div className="grid cols-3">
          {data.home.missionTeasers.map((m,i)=>(
            <a key={i} className="card" href={m.link}>
              <h3 style={{margin:'4px 0'}}>{m.title}</h3>
              <p className="muted">{m.excerpt}</p>
            </a>
          ))}
        </div>
      </section>

      <section id="quicklinks" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Quick Links</h2>
        <div className="grid cols-3">
          {data.home.quickLinks.map((q,i)=>(
            <a key={i} className="card" href={q.href}>{q.label}</a>
          ))}
        </div>
      </section>
    </div>
  );
}
EOF

cat > src/pages/Services.jsx <<'EOF'
import { useCRM } from '../crm/CRMProvider.jsx';

function Block({ id, title, body }) {
  return (
    <section id={id} className="card" style={{marginTop:12}}>
      <h2 className="section-title">{title}</h2>
      <p className="muted">{body}</p>
    </section>
  );
}

export default function Services() {
  const { data } = useCRM();
  const find = (key) => data.services.find(s=>s.id===key);
  return (
    <div>
      <h1 className="page-title">Services</h1>
      {['splash','overnight','day','bathing','birthday','social','events','grooming'].map(k=>{
        const item = find(k);
        return <Block key={k} id={item.id} title={item.title} body={item.description}/>
      })}
    </div>
  );
}
EOF

cat > src/pages/Training.jsx <<'EOF'
import { useCRM } from '../crm/CRMProvider.jsx';

export default function Training() {
  const { data } = useCRM();
  const id = (k) => data.training.find(s=>s.id===k);
  return (
    <div>
      <h1 className="page-title">Training</h1>
      {['group','sport','puppy','private','staytrain','trainers'].map(k=>{
        const item = id(k);
        return (
          <section key={k} id={item.id} className="card" style={{marginTop:12}}>
            <h2 className="section-title">{item.title}</h2>
            <p className="muted">{item.description}</p>
          </section>
        );
      })}
    </div>
  );
}
EOF

cat > src/pages/About.jsx <<'EOF'
import { useCRM } from '../crm/CRMProvider.jsx';

export default function About() {
  const { data } = useCRM();
  return (
    <div>
      <h1 className="page-title">About</h1>

      <section id="team" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Management Team</h2>
        <div className="grid cols-2">
          {data.about.team.map((m,i)=>(
            <div key={i} className="card">
              <strong>{m.name}</strong><div className="muted">{m.role}</div>
              <p style={{marginTop:6}}>{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="reviews" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Reviews</h2>
        <ul>
          {data.about.reviews.map((r,i)=>(<li key={i}>"{r.text}" — <span className="muted">{r.name}</span></li>))}
        </ul>
      </section>

      <section id="different" className="card" style={{marginTop:12}}>
        <h2 className="section-title">How We're Different</h2>
        <ul>{data.about.different.map((d,i)=>(<li key={i}>{d}</li>))}</ul>
      </section>

      <section id="gallery" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Photo Gallery</h2>
        <div className="grid cols-3">
          {data.about.gallery.map((g,i)=>(<img key={i} src={g} alt={`Gallery ${i+1}`} style={{width:'100%', borderRadius:12}}/>))}
        </div>
      </section>

      <section id="mission" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Our Mission</h2>
        <p className="muted">{data.about.mission}</p>
      </section>

      <section id="faqs" className="card" style={{marginTop:12}}>
        <h2 className="section-title">FAQs</h2>
        <table className="table">
          <tbody>
            {data.about.faqs.map((f,i)=>(
              <tr key={i}><th style={{width:'40%'}}>{f.q}</th><td>{f.a}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
EOF

cat > src/pages/Contact.jsx <<'EOF'
import { useCRM } from '../crm/CRMProvider.jsx';

export default function Contact() {
  const { data } = useCRM();
  return (
    <div>
      <h1 className="page-title">Contact</h1>

      <section id="contact" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Contact Us</h2>
        <p className="muted">{data.contact.general}</p>
        <p><strong>Phone:</strong> {data.site.phone} &nbsp; • &nbsp; <strong>Email:</strong> <a href={`mailto:${data.site.email}`}>{data.site.email}</a></p>

        <form name="contact" method="POST" data-netlify="true" className="grid cols-2" style={{marginTop:12}}>
          <input type="hidden" name="form-name" value="contact"/>
          <input required name="name" placeholder="Your name"/>
          <input required type="email" name="email" placeholder="Email"/>
          <input name="phone" placeholder="Phone"/>
          <input name="dog" placeholder="Dog's name"/>
          <textarea name="message" placeholder="How can we help?" rows="4" style={{gridColumn:'1/-1'}}></textarea>
          <button className="cta" type="submit" style={{gridColumn:'1/-1'}}>Send</button>
        </form>
      </section>

      <section id="reservations" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Reservations</h2>
        <p className="muted">{data.contact.reservations}</p>
        <form name="reservations" method="POST" data-netlify="true" className="grid cols-2" style={{marginTop:12}}>
          <input type="hidden" name="form-name" value="reservations"/>
          <input required name="name" placeholder="Your name"/>
          <input required type="email" name="email" placeholder="Email"/>
          <input name="dates" placeholder="Preferred dates"/>
          <select name="service" defaultValue="">
            <option value="" disabled>Service</option>
            {['Overnight Stays','Day Options','Grooming','Training'].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <textarea name="notes" placeholder="Notes" rows="4" style={{gridColumn:'1/-1'}}></textarea>
          <button className="cta" type="submit" style={{gridColumn:'1/-1'}}>Request Booking</button>
        </form>
      </section>
    </div>
  );
}
EOF

cat > src/pages/Jobs.jsx <<'EOF'
import { useCRM } from '../crm/CRMProvider.jsx';

export default function Jobs() {
  const { data } = useCRM();
  return (
    <div>
      <h1 className="page-title">Careers</h1>
      <section id="careers" className="card">
        <p className="muted">{data.jobs.intro}</p>
        <div className="grid cols-2" style={{marginTop:12}}>
          {data.jobs.positions.map((p,i)=>(
            <div key={i} className="card">
              <h3 style={{margin:'6px 0'}}>{p.title}</h3>
              <p className="muted">{p.description}</p>
              <a className="cta" href={p.applyLink || '#'}>Apply</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
EOF

cat > src/pages/Privacy.jsx <<'EOF'
import { useCRM } from '../crm/CRMProvider.jsx';

export default function Privacy() {
  const { data } = useCRM();
  return (
    <div>
      <section id="privacy" className="card">
        <h1 className="page-title">Privacy Policy</h1>
        <p className="muted" style={{whiteSpace:'pre-wrap'}}>{data.policies.privacy}</p>
      </section>
    </div>
  );
}
EOF

cat > src/pages/Credits.jsx <<'EOF'
import { useCRM } from '../crm/CRMProvider.jsx';

export default function Credits() {
  const { data } = useCRM();
  return (
    <div>
      <section id="credits" className="card">
        <h1 className="page-title">Site Credits</h1>
        <p className="muted">{data.credits.text}</p>
      </section>
    </div>
  );
}
EOF

cat > src/pages/Admin.jsx <<'EOF'
import { useState } from 'react';
import { useCRM } from '../crm/CRMProvider.jsx';

function Section({ title, children }) {
  return <div className="card" style={{marginTop:12}}>
    <h2 className="section-title">{title}</h2>
    {children}
  </div>;
}

export default function Admin() {
  const { data, setData, reset, export: exportJson, import: importJson } = useCRM();
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');

  const expected = import.meta.env.VITE_ADMIN_PASS || 'admin123';

  function login(e){ e.preventDefault(); if (pass === expected) setAuthed(true); else alert('Incorrect password'); }
  function update(path, value) {
    setData(prev => {
      const copy = structuredClone(prev);
      const segs = path.split('.');
      let cur = copy;
      for (let i=0;i<segs.length-1;i++) cur = cur[segs[i]];
      cur[segs.at(-1)] = value;
      return copy;
    });
  }

  if (!authed) {
    return <form onSubmit={login} className="card" style={{maxWidth:420, margin:'40px auto'}}>
      <h1 className="page-title">Admin Login</h1>
      <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%', padding:10, border:'1px solid var(--border)', borderRadius:10}}/>
      <button className="cta" type="submit" style={{marginTop:10, width:'100%'}}>Enter</button>
      <p className="muted" style={{marginTop:6}}>Default: <code>admin123</code> (set <code>VITE_ADMIN_PASS</code> in Netlify).</p>
    </form>;
  }

  return (
    <div>
      <h1 className="page-title">Admin CMS</h1>
      <div className="card">
        <button className="cta" onClick={()=>navigator.clipboard.writeText(exportJson())}>Copy Export JSON</button>
        <button style={{marginLeft:8}} onClick={()=>{const json=prompt('Paste JSON'); if(json) try{importJson(json)}catch{alert('Invalid JSON')}}>Import JSON</button>
        <button style={{marginLeft:8, background:'var(--danger)', color:'#fff', border:0, padding:'10px 14px', borderRadius:10}} onClick={()=>{ if(confirm('Reset to defaults?')) reset(); }}>Reset</button>
      </div>

      <Section title="Site Info">
        <div className="grid cols-2">
          <label>Site Name <input value={data.site.name} onChange={e=>update('site.name', e.target.value)}/></label>
          <label>Logo URL <input value={data.site.logoUrl} onChange={e=>update('site.logoUrl', e.target.value)}/></label>
          <label>Phone <input value={data.site.phone} onChange={e=>update('site.phone', e.target.value)}/></label>
          <label>Email <input value={data.site.email} onChange={e=>update('site.email', e.target.value)}/></label>
          <label>Address <input value={data.site.address} onChange={e=>update('site.address', e.target.value)}/></label>
        </div>
      </Section>

      <Section title="Home – Hero Images">
        <div className="grid cols-2">
          {data.home.heroImages.map((url, i)=>(
            <div key={i} className="card">
              <input value={url} onChange={e=>{
                const copy=[...data.home.heroImages]; copy[i]=e.target.value; update('home.heroImages', copy);
              }} style={{width:'100%'}}/>
              <div style={{display:'flex', gap:8, marginTop:8}}>
                <button onClick={()=>{ const copy=data.home.heroImages.filter((_,x)=>x!==i); update('home.heroImages', copy); }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={()=>update('home.heroImages', [...data.home.heroImages, ''])}>Add Image</button>
      </Section>

      <Section title="Home – Mission & Teasers">
        <textarea rows="2" style={{width:'100%'}} value={data.home.mission} onChange={e=>update('home.mission', e.target.value)} />
        <div className="grid cols-3" style={{marginTop:8}}>
          {data.home.missionTeasers.map((t,i)=>(
            <div key={i} className="card">
              <input placeholder="Title" value={t.title} onChange={e=>{
                const copy=[...data.home.missionTeasers]; copy[i].title=e.target.value; update('home.missionTeasers', copy);
              }}/>
              <input placeholder="Excerpt" value={t.excerpt} onChange={e=>{
                const copy=[...data.home.missionTeasers]; copy[i].excerpt=e.target.value; update('home.missionTeasers', copy);
              }}/>
              <input placeholder="Link" value={t.link} onChange={e=>{
                const copy=[...data.home.missionTeasers]; copy[i].link=e.target.value; update('home.missionTeasers', copy);
              }}/>
              <button onClick={()=>update('home.missionTeasers', data.home.missionTeasers.filter((_,x)=>x!==i))}>Remove</button>
            </div>
          ))}
        </div>
        <button onClick={()=>update('home.missionTeasers', [...data.home.missionTeasers, {title:'',excerpt:'',link:''}])}>Add Teaser</button>
      </Section>

      <Section title="Services">
        <div className="grid cols-2">
          {data.services.map((s,i)=>(
            <div key={s.id} className="card">
              <label>ID <input value={s.id} onChange={e=>{
                const copy=[...data.services]; copy[i].id=e.target.value; update('services', copy);
              }}/></label>
              <label>Title <input value={s.title} onChange={e=>{
                const copy=[...data.services]; copy[i].title=e.target.value; update('services', copy);
              }}/></label>
              <label>Description <textarea rows="2" value={s.description} onChange={e=>{
                const copy=[...data.services]; copy[i].description=e.target.value; update('services', copy);
              }}/></label>
              <button onClick={()=>update('services', data.services.filter((_,x)=>x!==i))}>Remove</button>
            </div>
          ))}
        </div>
        <button onClick={()=>update('services', [...data.services, {id:'new', title:'New', description:''}])}>Add Service</button>
      </Section>

      <Section title="Training">
        <div className="grid cols-2">
          {data.training.map((t,i)=>(
            <div key={t.id} className="card">
              <label>ID <input value={t.id} onChange={e=>{const copy=[...data.training]; copy[i].id=e.target.value; update('training', copy);}}/></label>
              <label>Title <input value={t.title} onChange={e=>{const copy=[...data.training]; copy[i].title=e.target.value; update('training', copy);}}/></label>
              <label>Description <textarea rows="2" value={t.description} onChange={e=>{const copy=[...data.training]; copy[i].description=e.target.value; update('training', copy);}}/></label>
              <button onClick={()=>update('training', data.training.filter((_,x)=>x!==i))}>Remove</button>
            </div>
          ))}
        </div>
        <button onClick={()=>update('training', [...data.training, {id:'new', title:'New', description:''}])}>Add Training</button>
      </Section>

      <Section title="About – Mission, Team, FAQs">
        <label>Mission <textarea rows="2" style={{width:'100%'}} value={data.about.mission} onChange={e=>update('about.mission', e.target.value)} /></label>
        <h3>Team</h3>
        <div className="grid cols-2">
          {data.about.team.map((m,i)=>(
            <div key={i} className="card">
              <input placeholder="Name" value={m.name} onChange={e=>{const copy=[...data.about.team]; copy[i].name=e.target.value; update('about.team', copy);}}/>
              <input placeholder="Role" value={m.role} onChange={e=>{const copy=[...data.about.team]; copy[i].role=e.target.value; update('about.team', copy);}}/>
              <input placeholder="Photo URL" value={m.photo||''} onChange={e=>{const copy=[...data.about.team]; copy[i].photo=e.target.value; update('about.team', copy);}}/>
              <textarea rows="2" placeholder="Bio" value={m.bio} onChange={e=>{const copy=[...data.about.team]; copy[i].bio=e.target.value; update('about.team', copy);}}/>
              <button onClick={()=>update('about.team', data.about.team.filter((_,x)=>x!==i))}>Remove</button>
            </div>
          ))}
        </div>
        <button onClick={()=>update('about.team', [...data.about.team, {name:'',role:'',photo:'',bio:''}])}>Add Team Member</button>

        <h3>FAQs</h3>
        {data.about.faqs.map((f,i)=>(
          <div key={i} className="card">
            <input placeholder="Question" value={f.q} onChange={e=>{const copy=[...data.about.faqs]; copy[i].q=e.target.value; update('about.faqs', copy);}}/>
            <textarea rows="2" placeholder="Answer" value={f.a} onChange={e=>{const copy=[...data.about.faqs]; copy[i].a=e.target.value; update('about.faqs', copy);}}/>
            <button onClick={()=>update('about.faqs', data.about.faqs.filter((_,x)=>x!==i))}>Remove</button>
          </div>
        ))}
        <button onClick={()=>update('about.faqs', [...data.about.faqs, {q:'', a:''}])}>Add FAQ</button>
      </Section>

      <Section title="Contact">
        <label>General <textarea rows="2" style={{width:'100%'}} value={data.contact.general} onChange={e=>update('contact.general', e.target.value)}/></label>
        <label>Reservations <textarea rows="2" style={{width:'100%'}} value={data.contact.reservations} onChange={e=>update('contact.reservations', e.target.value)}/></label>
      </Section>

      <Section title="Jobs">
        <label>Intro <textarea rows="2" style={{width:'100%'}} value={data.jobs.intro} onChange={e=>update('jobs.intro', e.target.value)}/></label>
        <div className="grid cols-2">
          {data.jobs.positions.map((p,i)=>(
            <div key={i} className="card">
              <input placeholder="Title" value={p.title} onChange={e=>{const copy=[...data.jobs.positions]; copy[i].title=e.target.value; update('jobs.positions', copy);}}/>
              <textarea rows="2" placeholder="Description" value={p.description} onChange={e=>{const copy=[...data.jobs.positions]; copy[i].description=e.target.value; update('jobs.positions', copy);}}/>
              <input placeholder="Apply Link" value={p.applyLink} onChange={e=>{const copy=[...data.jobs.positions]; copy[i].applyLink=e.target.value; update('jobs.positions', copy);}}/>
              <button onClick={()=>update('jobs.positions', data.jobs.positions.filter((_,x)=>x!==i))}>Remove</button>
            </div>
          ))}
        </div>
        <button onClick={()=>update('jobs.positions', [...data.jobs.positions, {title:'', description:'', applyLink:''}])}>Add Position</button>
      </Section>

      <Section title="Privacy & Credits">
        <label>Privacy Policy <textarea rows="4" style={{width:'100%'}} value={data.policies.privacy} onChange={e=>update('policies.privacy', e.target.value)}/></label>
        <label>Credits <textarea rows="2" style={{width:'100%'}} value={data.credits.text} onChange={e=>update('credits.text', e.target.value)}/></label>
      </Section>
    </div>
  );
}
EOF

cat > src/crm/defaultContent.js <<'EOF'
export const defaultContent = {
  site: {
    name: "Happy Paws",
    logoUrl: "/logo.svg",
    phone: "(555) 555-0123",
    email: "hello@happypaws.example",
    address: "123 Wag Street, Pawville, USA",
    socials: { instagram:"#", facebook:"#" }
  },
  home: {
    heroImages: [
      "https://images.unsplash.com/photo-1558944351-c0d7e269024d",
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1"
    ],
    mission: "Safe, clean, and joy-filled experiences for dogs and their humans.",
    missionTeasers: [
      { title:"Splash Parks", excerpt:"Indoor & outdoor water fun.", link:"/services#splash" },
      { title:"Overnight Stays", excerpt:"Cozy suites & 24/7 care.", link:"/services#overnight" },
      { title:"Training", excerpt:"From puppy to pro.", link:"/training" }
    ],
    quickLinks: [
      { label:"Mission", href:"/about#mission" },
      { label:"Reviews", href:"/about#reviews" },
      { label:"FAQs", href:"/about#faqs" }
    ]
  },
  services: [
    { id:"splash", title:"Indoor / Outdoor Splash Parks", description:"Supervised splash zones for all sizes." },
    { id:"overnight", title:"Overnight Stays", description:"Comfortable suites, night checks, and webcams." },
    { id:"day", title:"Day Options", description:"Half, full, and extended day play." },
    { id:"bathing", title:"24 Hour Code Access Self Bathing Room", description:"Wash anytime with secure access." },
    { id:"birthday", title:"Birthday Parties", description:"Custom themes, photos, and treats." },
    { id:"social", title:"Indoor / Outdoor Social Areas with 16 Tap Pour My Beer / Wine System", description:"Relax while pups play." },
    { id:"events", title:"Events", description:"Monthly socials & adoption events." },
    { id:"grooming", title:"Full Service Grooming", description:"Baths, cuts, nails, and spa add-ons." }
  ],
  training: [
    { id:"group", title:"Group Obedience Classes", description:"Basic to advanced manners." },
    { id:"sport", title:"Sport, AKC & Fun Classes", description:"Rally, tricks, CGC." },
    { id:"puppy", title:"Puppy University", description:"Foundations for life." },
    { id:"private", title:"Private Lessons", description:"One-on-one coaching." },
    { id:"staytrain", title:"Stay-N-Train / Day-Train", description:"Board & train or daily." },
    { id:"trainers", title:"Meet The Trainers and Reviews", description:"Experienced, certified team." }
  ],
  about: {
    team: [
      { name:"Alex Rivera", role:"General Manager", photo:"", bio:"10+ years in pet care." },
      { name:"Sam Lee", role:"Head Trainer", photo:"", bio:"CPDT-KA & AKC evaluator." }
    ],
    mission:"We deliver safe, enriching, and transparent care that puts canine welfare first.",
    different:[
      "Transparent webcams and report cards.",
      "Science-based handling & certifications.",
      "Thoughtful playgroup curation."
    ],
    gallery:[
      "https://images.unsplash.com/photo-1558944351-c0d7e269024d",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
      "https://images.unsplash.com/photo-1507149833265-60c372daea22"
    ],
    reviews:[
      { name:"Jordan", text:"Our pup sprints to the door every time!" },
      { name:"Morgan", text:"Training changed our daily life." }
    ],
    faqs:[
      { q:"What vaccines are required?", a:"Rabies, DHPP, and Bordetella. Proof required." },
      { q:"Do you separate by size?", a:"Yes, by size and play style with supervisor ratios." }
    ]
  },
  contact: {
    general:"Questions? Call, email, or use the form.",
    reservations:"Use the reservation form and we’ll confirm availability by email."
  },
  jobs: {
    intro:"Join a mission-driven team that puts dogs first.",
    positions:[
      { title:"Daycare Attendant", description:"Supervise groups, clean & care.", applyLink:"#"},
      { title:"Groomer", description:"Full-service grooming experience.", applyLink:"#"}
    ]
  },
  policies: { privacy: "We respect your privacy. We collect only what we need to provide services…" },
  credits: { text: "Site by You. Photos via Unsplash placeholders—replace with client assets." }
};
EOF

cat > src/crm/CRMProvider.jsx <<'EOF'
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultContent } from './defaultContent';

const CRMContext = createContext(null);

function load() {
  try {
    const raw = localStorage.getItem('hp_cms_v1');
    if (!raw) return defaultContent;
    const parsed = JSON.parse(raw);
    return { ...defaultContent, ...parsed };
  } catch { return defaultContent; }
}
function save(data) { localStorage.setItem('hp_cms_v1', JSON.stringify(data)); }

export function CRMProvider({ children }) {
  const [data, setData] = useState(load());

  useEffect(()=>{ save(data); }, [data]);

  const value = useMemo(()=>({
    data,
    setData,
    reset: ()=>setData(defaultContent),
    export: ()=>JSON.stringify(data, null, 2),
    import: (json)=>{ const obj = JSON.parse(json); setData(obj); }
  }), [data]);

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error('useCRM must be used inside CRMProvider');
  return ctx;
}
EOF

# Netlify config + function
mkdir -p netlify/functions
cat > netlify.toml <<'EOF'
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[dev]
  framework = "#custom"
  command = "npm run dev"
  targetPort = 5173

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

cat > netlify/functions/chatbot.js <<'EOF'
exports.handler = async (event) => {
  try {
    const { message = "" } = JSON.parse(event.body || "{}");
    const faqs = [
      { q: "vaccines", a: "We require Rabies, DHPP, and Bordetella with proof." },
      { q: "overnight", a: "Overnight Stays include cozy suites, night checks, and webcams." },
      { q: "hours", a: "Open daily 6:30am–8:00pm. Self-bathing is 24/7 with code access." },
      { q: "groom", a: "Full service grooming by appointment. Ask about deshedding and nail trims." },
      { q: "training", a: "We offer Group, Private, Puppy U, and Stay-N-Train." },
      { q: "splash", a: "Indoor/outdoor splash parks with supervision and size/play style groups." },
      { q: "reservation", a: "Use the Reservations form; we confirm via email shortly." }
    ];
    const lower = message.toLowerCase();
    const hit = faqs.find(f => lower.includes(f.q));
    const reply = hit
      ? hit.a
      : "Thanks for asking! I can help with services, reservations, hours, and requirements. Try asking about vaccines, overnight, or grooming.";
    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (e) {
    return { statusCode: 200, body: JSON.stringify({ reply: "I had trouble understanding that—please try again." }) };
  }
};
EOF

# README
cat > README.md <<'EOF'
# Happy Paws – Pet Day Care & Boarding (React + Vite + Netlify)

## Dev
1) npm i
2) npm run dev  → http://localhost:5173
3) Edit content in **/admin** (default password: `admin123` or set `VITE_ADMIN_PASS`).
4) Deploy to Netlify. Add env var `VITE_ADMIN_PASS`.

## Features
- Responsive header + hamburger + Book Now
- CMS-managed pages (localStorage + JSON import/export)
- Left aside ToC, right sticky chatbot
- Netlify Forms (Contact + Reservations)
- Netlify Functions stub for chatbot
EOF

echo "▶ Done.

Next:
  cd $APP_NAME
  npm i
  npm run dev

Deploy:
  - Push to GitHub and use 'Deploy to Netlify' OR 'netlify deploy'.
  - Set env VITE_ADMIN_PASS in Netlify for /admin gate.
"
