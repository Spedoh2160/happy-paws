// ============================================================================
// FILE: src/pages/Admin.jsx  (REPLACE with this; adds SEO + Background editors)
// ============================================================================
import { useState } from 'react'; import { useCRM } from '../crm/CRMProvider.jsx';
import ImagePicker from '../components/ImagePicker.jsx';
function Section({ title, children }){ return <div className="card" style={{marginTop:12}}><h2 className="section-title">{title}</h2>{children}</div>; }
const PAGES = ['home','services','training','about','contact','jobs','privacy','credits'];

function downloadContentJson(text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'content.json'; a.click();
  URL.revokeObjectURL(url);
}

export default function Admin(){
  const { data, setData, reset, export: exportJson, import: importJson } = useCRM();
  const [authed, setAuthed] = useState(false); const [pass, setPass] = useState('');
  const expected = import.meta.env.VITE_ADMIN_PASS || 'admin123';
  function login(e){ e.preventDefault(); if (pass === expected) setAuthed(true); else alert('Incorrect password'); }
  function update(path, value){
    setData(prev => { const copy = structuredClone(prev); const segs = path.split('.'); let cur = copy; for (let i=0;i<segs.length-1;i++) cur = cur[segs[i]] ?? (cur[segs[i]] = {}); cur[segs.at(-1)] = value; return copy; });
  }
  if (!authed) return (<form onSubmit={login} className="card" style={{maxWidth:420, margin:'40px auto'}}>
    <h1 className="page-title">Admin Login</h1><input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%',padding:10,border:'1px solid var(--border)',borderRadius:10}}/>
    <button className="cta" type="submit" style={{marginTop:10,width:'100%'}}>Enter</button>
    <p className="muted" style={{marginTop:6}}>Default: <code>admin123</code> (set <code>VITE_ADMIN_PASS</code> in Netlify).</p></form>);

  return (<div><h1 className="page-title">Admin CMS</h1>
    <div className="card">
      <button className="cta" onClick={()=>navigator.clipboard.writeText(exportJson())}>Copy Export JSON</button>
      <button style={{marginLeft:8}} onClick={()=>{const json=prompt('Paste JSON'); if(json) { try{importJson(json)}catch{alert('Invalid JSON')} }}}>Import JSON</button>
      <button style={{marginLeft:8,background:'var(--danger)',color:'#fff',border:0,padding:'10px 14px',borderRadius:10}} onClick={()=>{ if(confirm('Reset to defaults?')) reset(); }}>Reset</button>
      <button style={{ marginLeft: 8 }} onClick={() => downloadContentJson(exportJson())}>Download content.json</button>    
    </div>

    

    <Section title="SEO – Global">
      <div className="grid cols-2">
        <label>Default Title <input value={data.seo.defaultTitle} onChange={e=>update('seo.defaultTitle', e.target.value)} /></label>
        <label>Default Description <input value={data.seo.defaultDescription} onChange={e=>update('seo.defaultDescription', e.target.value)} /></label>
        <label>Default Social Image <input value={data.seo.defaultImage} onChange={e=>update('seo.defaultImage', e.target.value)} /></label>
        <label>Canonical Base (https://domain.com) <input value={data.seo.canonicalBase} onChange={e=>update('seo.canonicalBase', e.target.value)} /></label>
        <label>Twitter Handle (e.g. @happypaws) <input value={data.seo.twitterHandle} onChange={e=>update('seo.twitterHandle', e.target.value)} /></label>
      </div>
    </Section>

    <Section title="SEO – Pages">
      <div className="grid cols-2">
        {PAGES.map((k)=>{ const p = data.seo.pages[k] || { title:'', description:'', image:'' };
          return (<div key={k} className="card">
            <strong style={{display:'block',marginBottom:8}}>{k}</strong>
            <input placeholder="Title" value={p.title} onChange={e=>{ const c={...data.seo.pages,[k]:{...p,title:e.target.value}}; update('seo.pages', c); }}/>
            <input placeholder="Description" value={p.description} onChange={e=>{ const c={...data.seo.pages,[k]:{...p,description:e.target.value}}; update('seo.pages', c); }}/>
            <input placeholder="Social Image URL" value={p.image} onChange={e=>{ const c={...data.seo.pages,[k]:{...p,image:e.target.value}}; update('seo.pages', c); }}/>
          </div>);
        })}
      </div>
    </Section>

    <Section title="Appearance – Background (Global)">
      <div className="grid cols-2">
        <label>Color <input type="color" value={data.theme.body.color} onChange={e=>update('theme.body.color', e.target.value)} /></label>
        <label>Size <input value={data.theme.body.size} onChange={e=>update('theme.body.size', e.target.value)} placeholder="cover | contain | 1200px auto" /></label>
        <label>Repeat <input value={data.theme.body.repeat} onChange={e=>update('theme.body.repeat', e.target.value)} placeholder="no-repeat | repeat" /></label>
        <label>Position <input value={data.theme.body.position} onChange={e=>update('theme.body.position', e.target.value)} placeholder="center center" /></label>
        <label>Attachment <input value={data.theme.body.attachment} onChange={e=>update('theme.body.attachment', e.target.value)} placeholder="scroll | fixed" /></label>
      </div>
      <ImagePicker
        label="Background Image"
        items={[{ url: data.theme.body.imageUrl || '', alt: '' }]}
        onChange={(next)=>update('theme.body.imageUrl', next?.[0]?.url || '')}
        allowUpload
        multiple={false}
        resize={{ maxWidth: 2400, maxHeight: 2400, quality: 0.85, format: 'auto' }}
      />
    </Section>

    <Section title="Appearance – Background (Per Page)">
      <div className="grid cols-2">
        {PAGES.map((k)=>{ const t = data.theme.pages[k] || { color:'', imageUrl:'', size:'', repeat:'', position:'', attachment:'' };
          return (<div key={k} className="card">
            <strong style={{display:'block',marginBottom:8}}>{k}</strong>
            <label>Color <input type="color" value={t.color || '#ffffff'} onChange={e=>{ const c={...data.theme.pages,[k]:{...t,color:e.target.value}}; update('theme.pages', c); }}/></label>
            <label>Size <input value={t.size} onChange={e=>{ const c={...data.theme.pages,[k]:{...t,size:e.target.value}}; update('theme.pages', c); }}/></label>
            <label>Repeat <input value={t.repeat} onChange={e=>{ const c={...data.theme.pages,[k]:{...t,repeat:e.target.value}}; update('theme.pages', c); }}/></label>
            <label>Position <input value={t.position} onChange={e=>{ const c={...data.theme.pages,[k]:{...t,position:e.target.value}}; update('theme.pages', c); }}/></label>
            <label>Attachment <input value={t.attachment} onChange={e=>{ const c={...data.theme.pages,[k]:{...t,attachment:e.target.value}}; update('theme.pages', c); }}/></label>
            <ImagePicker
              label="Background Image"
              items={[{ url: t.imageUrl || '', alt: '' }]}
              onChange={(next)=>{ const c={...data.theme.pages,[k]:{...t,imageUrl: next?.[0]?.url || ''}}; update('theme.pages', c); }}
              allowUpload
              multiple={false}
              resize={{ maxWidth: 2400, maxHeight: 2400, quality: 0.85, format: 'auto' }}
            />
            <div className="muted" style={{marginTop:6}}>Leave fields empty to inherit Global.</div>
          </div>);
        })}
      </div>
    </Section>

    <Section title="Site Info"><div className="grid cols-2">
      <label>Site Name <input value={data.site.name} onChange={e=>update('site.name', e.target.value)}/></label>
      <label>Logo URL <input value={data.site.logoUrl} onChange={e=>update('site.logoUrl', e.target.value)}/></label>
      <label>Phone <input value={data.site.phone} onChange={e=>update('site.phone', e.target.value)}/></label>
      <label>Email <input value={data.site.email} onChange={e=>update('site.email', e.target.value)}/></label>
      <label>Address <input value={data.site.address} onChange={e=>update('site.address', e.target.value)}/></label>
    </div></Section>

    <Section title="Home – Hero Images">
      <ImagePicker
        label="Hero Images"
        items={data.home.heroImages}
        onChange={(next)=>update('home.heroImages', next)}
        allowUpload multiple
        resize={{ maxWidth: 1920, maxHeight: 1080, quality: 0.82, format: 'auto' }}
      />
    </Section>

    <Section title="Home – Mission & Teasers">
      <textarea rows="2" style={{width:'100%'}} value={data.home.mission} onChange={e=>update('home.mission', e.target.value)} />
      <div className="grid cols-3" style={{marginTop:8}}>
        {data.home.missionTeasers.map((t,i)=>(<div key={i} className="card">
          <input placeholder="Title" value={t.title} onChange={e=>{ const copy=[...data.home.missionTeasers]; copy[i].title=e.target.value; update('home.missionTeasers', copy); }}/>
          <input placeholder="Excerpt" value={t.excerpt} onChange={e=>{ const copy=[...data.home.missionTeasers]; copy[i].excerpt=e.target.value; update('home.missionTeasers', copy); }}/>
          <input placeholder="Link" value={t.link} onChange={e=>{ const copy=[...data.home.missionTeasers]; copy[i].link=e.target.value; update('home.missionTeasers', copy); }}/>
          <button onClick={()=>update('home.missionTeasers', data.home.missionTeasers.filter((_,x)=>x!==i))}>Remove</button>
        </div>))}
      </div><button onClick={()=>update('home.missionTeasers', [...data.home.missionTeasers, {title:'',excerpt:'',link:''}])}>Add Teaser</button>
    </Section>

    <Section title="Services"><div className="grid cols-2">
      {data.services.map((s,i)=>(<div key={s.id} className="card">
        <label>ID <input value={s.id} onChange={e=>{ const copy=[...data.services]; copy[i].id=e.target.value; update('services', copy); }}/></label>
        <label>Title <input value={s.title} onChange={e=>{ const copy=[...data.services]; copy[i].title=e.target.value; update('services', copy); }}/></label>
        <label>Description <textarea rows="2" value={s.description} onChange={e=>{ const copy=[...data.services]; copy[i].description=e.target.value; update('services', copy); }}/></label>
        <button onClick={()=>update('services', data.services.filter((_,x)=>x!==i))}>Remove</button>
      </div>))}
    </div><button onClick={()=>update('services', [...data.services, {id:'new', title:'New', description:''}])}>Add Service</button></Section>

    <Section title="Training"><div className="grid cols-2">
      {data.training.map((t,i)=>(<div key={t.id} className="card">
        <label>ID <input value={t.id} onChange={e=>{ const copy=[...data.training]; copy[i].id=e.target.value; update('training', copy); }}/></label>
        <label>Title <input value={t.title} onChange={e=>{ const copy=[...data.training]; copy[i].title=e.target.value; update('training', copy); }}/></label>
        <label>Description <textarea rows="2" value={t.description} onChange={e=>{ const copy=[...data.training]; copy[i].description=e.target.value; update('training', copy); }}/></label>
        <button onClick={()=>update('training', data.training.filter((_,x)=>x!==i))}>Remove</button>
      </div>))}
    </div><button onClick={()=>update('training', [...data.training, {id:'new', title:'New', description:''}])}>Add Training</button></Section>

    <Section title="About – Mission, Gallery, Team, FAQs">
      <label>Mission <textarea rows="2" style={{width:'100%'}} value={data.about.mission} onChange={e=>update('about.mission', e.target.value)} /></label>
      <h3>Photo Gallery</h3>
      <ImagePicker label="Gallery Images" items={data.about.gallery} onChange={(next)=>update('about.gallery', next)} allowUpload multiple
        resize={{ maxWidth: 1280, maxHeight: 1280, quality: 0.82, format: 'auto' }}
      />
      <h3>Team</h3><div className="grid cols-2">{data.about.team.map((m,i)=>(<div key={i} className="card">
        <input placeholder="Name" value={m.name} onChange={e=>{ const c=[...data.about.team]; c[i].name=e.target.value; update('about.team', c); }}/>
        <input placeholder="Role" value={m.role} onChange={e=>{ const c=[...data.about.team]; c[i].role=e.target.value; update('about.team', c); }}/>
        <ImagePicker label="Photo" items={[{ url: m.photo||'', alt: m.name||'' }]} onChange={(next)=>{ const c=[...data.about.team]; c[i].photo = next?.[0]?.url || ''; update('about.team', c); }} allowUpload multiple={false}
          resize={{ maxWidth: 600, maxHeight: 600, quality: 0.85, format: 'auto' }}
        />
        <textarea rows="2" placeholder="Bio" value={m.bio} onChange={e=>{ const c=[...data.about.team]; c[i].bio=e.target.value; update('about.team', c); }}/>
        <button onClick={()=>update('about.team', data.about.team.filter((_,x)=>x!==i))}>Remove</button>
      </div>))}</div>
      <button onClick={()=>update('about.team', [...data.about.team, {name:'',role:'',photo:'',bio:''}])}>Add Team Member</button>
      <h3>FAQs</h3>{data.about.faqs.map((f,i)=>(<div key={i} className="card">
        <input placeholder="Question" value={f.q} onChange={e=>{ const c=[...data.about.faqs]; c[i].q=e.target.value; update('about.faqs', c); }}/>
        <textarea rows="2" placeholder="Answer" value={f.a} onChange={e=>{ const c=[...data.about.faqs]; c[i].a=e.target.value; update('about.faqs', c); }}/>
        <button onClick={()=>update('about.faqs', data.about.faqs.filter((_,x)=>x!==i))}>Remove</button>
      </div>))}
      <button onClick={()=>update('about.faqs', [...data.about.faqs, {q:'', a:''}])}>Add FAQ</button>
    </Section>

    <Section title="Contact"><label>General <textarea rows="2" style={{width:'100%'}} value={data.contact.general} onChange={e=>update('contact.general', e.target.value)}/></label>
      <label>Reservations <textarea rows="2" style={{width:'100%'}} value={data.contact.reservations} onChange={e=>update('contact.reservations', e.target.value)}/></label></Section>

    <Section title="Jobs"><label>Intro <textarea rows="2" style={{width:'100%'}} value={data.jobs.intro} onChange={e=>update('jobs.intro', e.target.value)}/></label>
      <div className="grid cols-2">{data.jobs.positions.map((p,i)=>(<div key={i} className="card">
        <input placeholder="Title" value={p.title} onChange={e=>{ const c=[...data.jobs.positions]; c[i].title=e.target.value; update('jobs.positions', c); }}/>
        <textarea rows="2" placeholder="Description" value={p.description} onChange={e=>{ const c=[...data.jobs.positions]; c[i].description=e.target.value; update('jobs.positions', c); }}/>
        <input placeholder="Apply Link" value={p.applyLink} onChange={e=>{ const c=[...data.jobs.positions]; c[i].applyLink=e.target.value; update('jobs.positions', c); }}/>
        <button onClick={()=>update('jobs.positions', data.jobs.positions.filter((_,x)=>x!==i))}>Remove</button>
      </div>))}</div>
      <button onClick={()=>update('jobs.positions', [...data.jobs.positions, {title:'', description:'', applyLink:''}])}>Add Position</button>
    </Section>

    <Section title="Privacy & Credits"><label>Privacy Policy <textarea rows="4" style={{width:'100%'}} value={data.policies.privacy} onChange={e=>update('policies.privacy', e.target.value)}/></label>
      <label>Credits <textarea rows="2" style={{width:'100%'}} value={data.credits.text} onChange={e=>update('credits.text', e.target.value)}/></label></Section>
  </div>);
}
