
// path: src/pages/Admin.jsx
import { useState } from 'react';
import { useCRM } from '../crm/CRMProvider.jsx';
import ImagePicker from '../components/ImagePicker.jsx';

function Section({ title, children }) {
  return <div className="card" style={{ marginTop: 12 }}><h2 className="section-title">{title}</h2>{children}</div>;
}

export default function Admin() {
  const { data, setData, reset, export: exportJson, import: importJson } = useCRM();
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const expected = import.meta.env.VITE_ADMIN_PASS || 'admin123';

  function login(e) {
    e.preventDefault();
    if (pass === expected) setAuthed(true); else alert('Incorrect password');
  }

  function update(path, value) {
    setData(prev => {
      const copy = structuredClone(prev);
      const segs = path.split('.');
      let cur = copy;
      for (let i = 0; i < segs.length - 1; i++) cur = cur[segs[i]];
      cur[segs.at(-1)] = value;
      return copy;
    });
  }

  if (!authed) {
    return (
      <form onSubmit={login} className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
        <h1 className="page-title">Admin Login</h1>
        <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 10 }} />
        <button className="cta" type="submit" style={{ marginTop: 10, width: '100%' }}>Enter</button>
        <p className="muted" style={{ marginTop: 6 }}>Default: <code>admin123</code> (set <code>VITE_ADMIN_PASS</code> in Netlify).</p>
      </form>
    );
  }

  return (
    <div>
      <h1 className="page-title">Admin CMS</h1>

      <div className="card">
        <button className="cta" onClick={() => navigator.clipboard.writeText(exportJson())}>Copy Export JSON</button>
        <button style={{ marginLeft: 8 }} onClick={() => {
          const json = prompt('Paste JSON');
          if (json) {
            try { importJson(json); }
            catch { alert('Invalid JSON'); }
          }
        }}>Import JSON</button>
        <button
          style={{ marginLeft: 8, background: 'var(--danger)', color: '#fff', border: 0, padding: '10px 14px', borderRadius: 10 }}
          onClick={() => { if (confirm('Reset to defaults?')) reset(); }}
        >
          Reset
        </button>
      </div>

      <Section title="Site Info">
        <div className="grid cols-2">
          <label>Site Name <input value={data.site.name} onChange={e => update('site.name', e.target.value)} /></label>
          <label>Logo URL <input value={data.site.logoUrl} onChange={e => update('site.logoUrl', e.target.value)} /></label>
          <label>Phone <input value={data.site.phone} onChange={e => update('site.phone', e.target.value)} /></label>
          <label>Email <input value={data.site.email} onChange={e => update('site.email', e.target.value)} /></label>
          <label>Address <input value={data.site.address} onChange={e => update('site.address', e.target.value)} /></label>
        </div>
      </Section>

      <Section title="Home – Hero Images">
        <ImagePicker
          label="Hero Images"
          items={data.home.heroImages}
          onChange={(next) => update('home.heroImages', next)}
          allowUpload
          multiple
        />
      </Section>

      <Section title="Home – Mission & Teasers">
        <textarea rows="2" style={{ width: '100%' }} value={data.home.mission} onChange={e => update('home.mission', e.target.value)} />
        <div className="grid cols-3" style={{ marginTop: 8 }}>
          {data.home.missionTeasers.map((t, i) => (
            <div key={i} className="card">
              <input placeholder="Title" value={t.title} onChange={e => { const copy = [...data.home.missionTeasers]; copy[i].title = e.target.value; update('home.missionTeasers', copy); }} />
              <input placeholder="Excerpt" value={t.excerpt} onChange={e => { const copy = [...data.home.missionTeasers]; copy[i].excerpt = e.target.value; update('home.missionTeasers', copy); }} />
              <input placeholder="Link" value={t.link} onChange={e => { const copy = [...data.home.missionTeasers]; copy[i].link = e.target.value; update('home.missionTeasers', copy); }} />
              <button onClick={() => update('home.missionTeasers', data.home.missionTeasers.filter((_, x) => x !== i))}>Remove</button>
            </div>
          ))}
        </div>
        <button onClick={() => update('home.missionTeasers', [...data.home.missionTeasers, { title: '', excerpt: '', link: '' }])}>Add Teaser</button>
      </Section>

      <Section title="Services">
        <div className="grid cols-2">
          {data.services.map((s, i) => (
            <div key={s.id} className="card">
              <label>ID <input value={s.id} onChange={e => { const copy = [...data.services]; copy[i].id = e.target.value; update('services', copy); }} /></label>
              <label>Title <input value={s.title} onChange={e => { const copy = [...data.services]; copy[i].title = e.target.value; update('services', copy); }} /></label>
              <label>Description <textarea rows="2" value={s.description} onChange={e => { const copy = [...data.services]; copy[i].description = e.target.value; update('services', copy); }} /></label>
              <button onClick={() => update('services', data.services.filter((_, x) => x !== i))}>Remove</button>
            </div>
          ))}
        </div>
        <button onClick={() => update('services', [...data.services, { id: 'new', title: 'New', description: '' }])}>Add Service</button>
      </Section>

      <Section title="Training">
        <div className="grid cols-2">
          {data.training.map((t, i) => (
            <div key={t.id} className="card">
              <label>ID <input value={t.id} onChange={e => { const copy = [...data.training]; copy[i].id = e.target.value; update('training', copy); }} /></label>
              <label>Title <input value={t.title} onChange={e => { const copy = [...data.training]; copy[i].title = e.target.value; update('training', copy); }} /></label>
              <label>Description <textarea rows="2" value={t.description} onChange={e => { const copy = [...data.training]; copy[i].description = e.target.value; update('training', copy); }} /></label>
              <button onClick={() => update('training', data.training.filter((_, x) => x !== i))}>Remove</button>
            </div>
          ))}
        </div>
        <button onClick={() => update('training', [...data.training, { id: 'new', title: 'New', description: '' }])}>Add Training</button>
      </Section>

      <Section title="About – Mission, Team, FAQs">
        <label>Mission <textarea rows="2" style={{ width: '100%' }} value={data.about.mission} onChange={e => update('about.mission', e.target.value)} /></label>

        <h3>Photo Gallery</h3>
        <ImagePicker
          label="Gallery Images"
          items={data.about.gallery}
          onChange={(next) => update('about.gallery', next)}
          allowUpload
          multiple
        />

        <h3>Team</h3>
        <div className="grid cols-2">
          {data.about.team.map((m, i) => (
            <div key={i} className="card">
              <input placeholder="Name" value={m.name} onChange={e => { const c = [...data.about.team]; c[i].name = e.target.value; update('about.team', c); }} />
              <input placeholder="Role" value={m.role} onChange={e => { const c = [...data.about.team]; c[i].role = e.target.value; update('about.team', c); }} />
              <ImagePicker
                label="Photo"
                items={[{ url: m.photo || '', alt: m.name || '' }]}
                onChange={(next) => {
                  const c = [...data.about.team];
                  c[i].photo = (next?.[0]?.url) || '';
                  // optional alt per member could be added later
                  update('about.team', c);
                }}
                allowUpload
                multiple={false}
              />
              <textarea rows="2" placeholder="Bio" value={m.bio} onChange={e => {
                const c = [...data.about.team]; c[i].bio = e.target.value; update('about.team', c);
              }} />
              <button onClick={() => update('about.team', data.about.team.filter((_, x) => x !== i))}>Remove</button>
            </div>
          ))}
        </div>
        <button onClick={() => update('about.team', [...data.about.team, { name: '', role: '', photo: '', bio: '' }])}>Add Team Member</button>

        <h3>FAQs</h3>
        {data.about.faqs.map((f, i) => (
          <div key={i} className="card">
            <input placeholder="Question" value={f.q} onChange={e => { const c = [...data.about.faqs]; c[i].q = e.target.value; update('about.faqs', c); }} />
            <textarea rows="2" placeholder="Answer" value={f.a} onChange={e => { const c = [...data.about.faqs]; c[i].a = e.target.value; update('about.faqs', c); }} />
            <button onClick={() => update('about.faqs', data.about.faqs.filter((_, x) => x !== i))}>Remove</button>
          </div>
        ))}
        <button onClick={() => update('about.faqs', [...data.about.faqs, { q: '', a: '' }])}>Add FAQ</button>
      </Section>

      <Section title="Contact">
        <label>General <textarea rows="2" style={{ width: '100%' }} value={data.contact.general} onChange={e => update('contact.general', e.target.value)} /></label>
        <label>Reservations <textarea rows="2" style={{ width: '100%' }} value={data.contact.reservations} onChange={e => update('contact.reservations', e.target.value)} /></label>
      </Section>

      <Section title="Jobs">
        <label>Intro <textarea rows="2" style={{ width: '100%' }} value={data.jobs.intro} onChange={e => update('jobs.intro', e.target.value)} /></label>
        <div className="grid cols-2">
          {data.jobs.positions.map((p, i) => (
            <div key={i} className="card">
              <input placeholder="Title" value={p.title} onChange={e => { const c = [...data.jobs.positions]; c[i].title = e.target.value; update('jobs.positions', c); }} />
              <textarea rows="2" placeholder="Description" value={p.description} onChange={e => { const c = [...data.jobs.positions]; c[i].description = e.target.value; update('jobs.positions', c); }} />
              <input placeholder="Apply Link" value={p.applyLink} onChange={e => { const c = [...data.jobs.positions]; c[i].applyLink = e.target.value; update('jobs.positions', c); }} />
              <button onClick={() => update('jobs.positions', data.jobs.positions.filter((_, x) => x !== i))}>Remove</button>
            </div>
          ))}
        </div>
        <button onClick={() => update('jobs.positions', [...data.jobs.positions, { title: '', description: '', applyLink: '' }])}>Add Position</button>
      </Section>

      <Section title="Privacy & Credits">
        <label>Privacy Policy <textarea rows="4" style={{ width: '100%' }} value={data.policies.privacy} onChange={e => update('policies.privacy', e.target.value)} /></label>
        <label>Credits <textarea rows="2" style={{ width: '100%' }} value={data.credits.text} onChange={e => update('credits.text', e.target.value)} /></label>
      </Section>
    </div>
  );
}

// path: src/pages/About.jsx
import { useCRM } from '../crm/CRMProvider.jsx';

function srcOf(x) { return typeof x === 'string' ? x : (x?.url || ''); }
function altOf(x, i) { return typeof x === 'string' ? `Gallery ${i+1}` : (x?.alt || `Gallery ${i+1}`); }

export default function About(){ const { data } = useCRM();
  return (<div><h1 className="page-title">About</h1>
    <section id="team" className="card" style={{marginTop:12}}><h2 className="section-title">Management Team</h2>
      <div className="grid cols-2">{data.about.team.map((m,i)=>(<div key={i} className="card">
        <strong>{m.name}</strong><div className="muted">{m.role}</div>
        {m.photo ? <img src={m.photo} alt={m.name || 'Team photo'} style={{width:'100%',borderRadius:12, marginTop:8}}/> : null}
        <p style={{marginTop:6}}>{m.bio}</p></div>))}</div>
    </section>
    <section id="reviews" className="card" style={{marginTop:12}}><h2 className="section-title">Reviews</h2>
      <ul>{data.about.reviews.map((r,i)=>(<li key={i}>"{r.text}" — <span className="muted">{r.name}</span></li>))}</ul>
    </section>
    <section id="different" className="card" style={{marginTop:12}}><h2 className="section-title">How We're Different</h2><ul>{data.about.different.map((d,i)=>(<li key={i}>{d}</li>))}</ul></section>
    <section id="gallery" className="card" style={{marginTop:12}}><h2 className="section-title">Photo Gallery</h2>
      <div className="grid cols-3">{(data.about.gallery||[]).map((g,i)=>(<img key={i} src={srcOf(g)} alt={altOf(g,i)} style={{width:'100%',borderRadius:12}}/>))}</div>
    </section>
    <section id="mission" className="card" style={{marginTop:12}}><h2 className="section-title">Our Mission</h2><p className="muted">{data.about.mission}</p></section>
    <section id="faqs" className="card" style={{marginTop:12}}><h2 className="section-title">FAQs</h2>
      <table className="table"><tbody>{data.about.faqs.map((f,i)=>(<tr key={i}><th style={{width:'40%'}}>{f.q}</th><td>{f.a}</td></tr>))}</tbody></table>
    </section>
  </div>);
}