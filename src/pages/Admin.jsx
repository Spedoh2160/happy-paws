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
  <button
    className="cta"
    onClick={() => navigator.clipboard.writeText(exportJson())}
  >
    Copy Export JSON
  </button>

  <button
    style={{ marginLeft: 8 }}
    // Why: explicit braces prevent the parser from thinking JSX starts early.
    onClick={() => {
      const json = prompt('Paste JSON');
      if (json) {
        try {
          importJson(json);
        } catch (e) {
          alert('Invalid JSON');
        }
      }
    }}
  >
    Import JSON
  </button>

  <button
    style={{
      marginLeft: 8,
      background: 'var(--danger)',
      color: '#fff',
      border: 0,
      padding: '10px 14px',
      borderRadius: 10
    }}
    onClick={() => {
      if (confirm('Reset to defaults?')) reset();
    }}
  >
    Reset
  </button>
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
