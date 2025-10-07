// path: src/pages/Admin.jsx
import { useEffect, useMemo, useState } from 'react';
import { useCRM } from '../crm/CRMProvider.jsx';
import ImagePicker from '../components/ImagePicker.jsx';
import GalleryManager from '../components/GalleryManager.jsx';

function Section({ id, title, children }) {
  return (
    <section id={id} className="card admin-section">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
}

const PAGES = ['home', 'services', 'training', 'about', 'contact', 'jobs', 'privacy', 'credits'];
const successBg = 'var(--success, #2e7d32)';
const dangerBg  = 'var(--danger, #c62828)';
const FN_BASE = import.meta.env.DEV ? 'http://localhost:8888' : '';

function downloadContentJson(text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'content.json'; a.click();
  URL.revokeObjectURL(url);
}

export default function Admin() {
  const { data, setData, reset, export: exportJson, import: importJson } = useCRM();

  // Auth
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const expected = import.meta.env.VITE_ADMIN_PASS || 'admin123';
  function login(e) { e.preventDefault(); if (pass === expected) setAuthed(true); else alert('Incorrect password'); }

  // Deep update
  function update(path, value) {
    setData(prev => {
      const copy = structuredClone(prev);
      const segs = path.split('.');
      let cur = copy;
      for (let i = 0; i < segs.length - 1; i++) {
        const k = segs[i];
        const nextIsIndex = Number.isInteger(+segs[i + 1]);
        if (cur[k] == null) cur[k] = nextIsIndex ? [] : {};
        cur = cur[k];
      }
      cur[segs[segs.length - 1]] = value;
      return copy;
    });
  }

  // Save to server
  const [busy, setBusy] = useState(false);
  async function saveToServer() {
    try {
      setBusy(true);
      const text = exportJson(); JSON.parse(text);
      const res = await fetch(`${FN_BASE}/.netlify/functions/cms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': pass },
        body: text
      });
      if (!res.ok) throw new Error(await res.text());
      alert('Saved for everyone.');
    } catch (e) {
      alert(`Save failed: ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  }

  function saveToBrowser() {
    try { localStorage.setItem('crmData/v1', JSON.stringify(data)); alert('Saved to this browser.'); }
    catch { alert('Save failed (localStorage).'); }
  }

  if (!authed) {
    return (
      <form onSubmit={login} className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
        <h1 className="page-title">Admin Login</h1>
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 10 }}
        />
        <button className="cta" type="submit" style={{ marginTop: 10, width: '100%' }}>Enter</button>
        <p className="muted" style={{ marginTop: 6 }}>
          Default: <code>admin123</code> — set <code>VITE_ADMIN_PASS</code> (build) and <code>ADMIN_SAVE_KEY</code> (function) in Netlify.
        </p>
      </form>
    );
  }

  // Sticky nav
  const navItems = useMemo(() => ([
    { id: 'seo-global',        label: 'SEO Global' },
    { id: 'seo-pages',         label: 'SEO Pages' },
    { id: 'appearance-global', label: 'Appearance Global' },
    { id: 'appearance-pages',  label: 'Appearance Per Page' },
    { id: 'site-info',         label: 'Site Info' },
    { id: 'home-hero',         label: 'Home Hero' },
    { id: 'home-teasers',      label: 'Home Teasers' },
    { id: 'services',          label: 'Services' },
    { id: 'training',          label: 'Training' },
    { id: 'about',             label: 'About' },
    { id: 'contact',           label: 'Contact' },
    { id: 'jobs',              label: 'Jobs' },
    { id: 'privacy-credits',   label: 'Privacy & Credits' },
  ]), []);
  const [activeId, setActiveId] = useState(navItems[0]?.id || 'seo-global');

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('.admin-section'));
    if (!sections.length) return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveId(visible[0].target.id);
    }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="admin-wrap">
      {/* Sticky top: heading + toolbar + nav */}
      <div className="admin-top">
        <div className="admin-top__inner">
          <h1 className="page-title" style={{ margin: 0 }}>Admin CMS</h1>

          <div className="admin-toolbar">
            <button className="cta" onClick={() => navigator.clipboard.writeText(exportJson())}>Copy Export JSON</button>
            <button onClick={() => {
              const json = prompt('Paste JSON');
              if (json) { try { importJson(json); alert('Imported.'); } catch { alert('Invalid JSON'); } }
            }}>Import JSON</button>
            <button onClick={() => downloadContentJson(exportJson())}>Download content.json</button>
            <button onClick={saveToBrowser}>Save to Browser</button>
            <button
              style={{ background: successBg, color:'#fff', border:0, padding:'10px 14px', borderRadius:10 }}
              onClick={saveToServer}
              disabled={busy}
              aria-busy={busy ? 'true' : 'false'}
            >
              {busy ? 'Saving…' : 'Save to Server'}
            </button>
            <button
              style={{ background: dangerBg, color:'#fff', border:0, padding:'10px 14px', borderRadius:10 }}
              onClick={() => { if (confirm('Reset to defaults?')) reset(); }}
            >
              Reset
            </button>
          </div>

          <nav className="admin-nav" aria-label="Admin sections">
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`admin-nav__link ${activeId === id ? 'is-active' : ''}`}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        <Section id="seo-global" title="SEO – Global">
          <div className="grid cols-2">
            <label>Default Title <input value={data.seo?.defaultTitle || ''} onChange={e => update('seo.defaultTitle', e.target.value)} /></label>
            <label>Default Description <input value={data.seo?.defaultDescription || ''} onChange={e => update('seo.defaultDescription', e.target.value)} /></label>
            <label>Default Social Image <input value={data.seo?.defaultImage || ''} onChange={e => update('seo.defaultImage', e.target.value)} /></label>
            <label>Canonical Base (https://domain.com) <input value={data.seo?.canonicalBase || ''} onChange={e => update('seo.canonicalBase', e.target.value)} /></label>
            <label>Twitter Handle <input value={data.seo?.twitterHandle || ''} onChange={e => update('seo.twitterHandle', e.target.value)} /></label>
          </div>
        </Section>

        <Section id="seo-pages" title="SEO – Pages">
          <div className="grid cols-2">
            {PAGES.map((k) => {
              const p = (data.seo?.pages?.[k]) || { title: '', description: '', image: '' };
              return (
                <div key={k} className="card">
                  <strong style={{ display: 'block', marginBottom: 8 }}>{k}</strong>
                  <input placeholder="Title" value={p.title}
                    onChange={e => update('seo.pages', { ...data.seo.pages, [k]: { ...p, title: e.target.value } })}/>
                  <input placeholder="Description" value={p.description}
                    onChange={e => update('seo.pages', { ...data.seo.pages, [k]: { ...p, description: e.target.value } })}/>
                  <input placeholder="Social Image URL" value={p.image}
                    onChange={e => update('seo.pages', { ...data.seo.pages, [k]: { ...p, image: e.target.value } })}/>
                </div>
              );
            })}
          </div>
        </Section>

        <Section id="appearance-global" title="Appearance – Background (Global)">
          <div className="grid cols-2">
            <label>Color <input type="color" value={data.theme?.body?.color || '#ffffff'} onChange={e => update('theme.body.color', e.target.value)} /></label>
            <label>Size <input value={data.theme?.body?.size || ''} onChange={e => update('theme.body.size', e.target.value)} placeholder="cover | contain" /></label>
            <label>Repeat <input value={data.theme?.body?.repeat || ''} onChange={e => update('theme.body.repeat', e.target.value)} placeholder="no-repeat" /></label>
            <label>Position <input value={data.theme?.body?.position || ''} onChange={e => update('theme.body.position', e.target.value)} placeholder="center center" /></label>
            <label>Attachment <input value={data.theme?.body?.attachment || ''} onChange={e => update('theme.body.attachment', e.target.value)} placeholder="scroll | fixed" /></label>
          </div>
          <ImagePicker
            label="Background Image"
            items={[{ url: data.theme?.body?.imageUrl || '', alt: '' }]}
            onChange={(next) => update('theme.body.imageUrl', next?.[0]?.url || '')}
            allowUpload multiple={false}
            resize={{ maxWidth: 2400, maxHeight: 2400, quality: 0.85, format: 'auto' }}
          />
        </Section>

        <Section id="appearance-pages" title="Appearance – Background (Per Page)">
          <div className="grid cols-2">
            {PAGES.map((k) => {
              const t = (data.theme?.pages?.[k]) || { color:'', imageUrl:'', size:'', repeat:'', position:'', attachment:'' };
              return (
                <div key={k} className="card">
                  <strong style={{ display: 'block', marginBottom: 8 }}>{k}</strong>
                  <label>Color <input type="color" value={t.color || '#ffffff'}
                    onChange={e => update('theme.pages', { ...data.theme.pages, [k]: { ...t, color: e.target.value } })}/></label>
                  <label>Size <input value={t.size}
                    onChange={e => update('theme.pages', { ...data.theme.pages, [k]: { ...t, size: e.target.value } })}/></label>
                  <label>Repeat <input value={t.repeat}
                    onChange={e => update('theme.pages', { ...data.theme.pages, [k]: { ...t, repeat: e.target.value } })}/></label>
                  <label>Position <input value={t.position}
                    onChange={e => update('theme.pages', { ...data.theme.pages, [k]: { ...t, position: e.target.value } })}/></label>
                  <label>Attachment <input value={t.attachment}
                    onChange={e => update('theme.pages', { ...data.theme.pages, [k]: { ...t, attachment: e.target.value } })}/></label>
                  <ImagePicker
                    label="Background Image"
                    items={[{ url: t.imageUrl || '', alt: '' }]}
                    onChange={(next) => update('theme.pages', { ...data.theme.pages, [k]: { ...t, imageUrl: next?.[0]?.url || '' } })}
                    allowUpload multiple={false}
                    resize={{ maxWidth: 2400, maxHeight: 2400, quality: 0.85, format: 'auto' }}
                  />
                  <div className="muted" style={{ marginTop: 6 }}>Leave fields empty to inherit Global.</div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section id="site-info" title="Site Info">
          <div className="grid cols-2">
            <label>Site Name <input value={data.site?.name || ''} onChange={e => update('site.name', e.target.value)} /></label>
            <label>Logo URL <input value={data.site?.logoUrl || ''} onChange={e => update('site.logoUrl', e.target.value)} /></label>
            <label>Phone <input value={data.site?.phone || ''} onChange={e => update('site.phone', e.target.value)} /></label>
            <label>Email <input value={data.site?.email || ''} onChange={e => update('site.email', e.target.value)} /></label>
            <label>Address <input value={data.site?.address || ''} onChange={e => update('site.address', e.target.value)} /></label>
          </div>
        </Section>

        <Section id="home-hero" title="Home – Hero Images">
          <ImagePicker
            label="Hero Images"
            items={data.home?.heroImages || []}
            onChange={(next) => update('home.heroImages', next)}
            allowUpload multiple
            resize={{ maxWidth: 1920, maxHeight: 1080, quality: 0.82, format: 'auto' }}
          />
        </Section>

        <Section id="home-teasers" title="Home – Mission & Teasers">
          <textarea rows="2" style={{ width: '100%' }} value={data.home?.mission || ''} onChange={e => update('home.mission', e.target.value)} />
          <div className="grid cols-3" style={{ marginTop: 8 }}>
            {(data.home?.missionTeasers || []).map((t, i) => (
              <div key={i} className="card">
                <input placeholder="Title" value={t.title}
                  onChange={e => { const copy=[...(data.home?.missionTeasers || [])]; copy[i].title=e.target.value; update('home.missionTeasers', copy); }}/>
                <input placeholder="Excerpt" value={t.excerpt}
                  onChange={e => { const copy=[...(data.home?.missionTeasers || [])]; copy[i].excerpt=e.target.value; update('home.missionTeasers', copy); }}/>
                <input placeholder="Link" value={t.link}
                  onChange={e => { const copy=[...(data.home?.missionTeasers || [])]; copy[i].link=e.target.value; update('home.missionTeasers', copy); }}/>
                <button onClick={() => update('home.missionTeasers', (data.home?.missionTeasers || []).filter((_, x) => x !== i))}>Remove</button>
              </div>
            ))}
          </div>
          <button onClick={() => update('home.missionTeasers', [...(data.home?.missionTeasers || []), { title:'', excerpt:'', link:'' }])}>Add Teaser</button>
        </Section>

        <Section id="services" title="Services">
          <div className="grid cols-2">
            {(data.services || []).map((s, i) => (
              <div key={s.id || i} className="card">
                <label>ID <input value={s.id} onChange={e => { const copy=[...(data.services || [])]; copy[i].id=e.target.value; update('services', copy); }} /></label>
                <label>Title <input value={s.title} onChange={e => { const copy=[...(data.services || [])]; copy[i].title=e.target.value; update('services', copy); }} /></label>
                <label>Description <textarea rows="2" value={s.description} onChange={e => { const copy=[...(data.services || [])]; copy[i].description=e.target.value; update('services', copy); }} /></label>
                <button onClick={() => update('services', (data.services || []).filter((_, x) => x !== i))}>Remove</button>
              </div>
            ))}
          </div>
          <button onClick={() => update('services', [ ...(data.services || []), { id:'new', title:'New', description:'' } ])}>Add Service</button>
        </Section>

        <Section id="training" title="Training">
          <div className="grid cols-2">
            {(data.training || []).map((t, i) => (
              <div key={t.id || i} className="card">
                <label>ID <input value={t.id} onChange={e => { const copy=[...(data.training || [])]; copy[i].id=e.target.value; update('training', copy); }} /></label>
                <label>Title <input value={t.title} onChange={e => { const copy=[...(data.training || [])]; copy[i].title=e.target.value; update('training', copy); }} /></label>
                <label>Description <textarea rows="2" value={t.description} onChange={e => { const copy=[...(data.training || [])]; copy[i].description=e.target.value; update('training', copy); }} /></label>
                <button onClick={() => update('training', (data.training || []).filter((_, x) => x !== i))}>Remove</button>
              </div>
            ))}
          </div>
          <button onClick={() => update('training', [ ...(data.training || []), { id:'new', title:'New', description:'' } ])}>Add Training</button>
        </Section>

        <Section id="about" title="About – Mission, Gallery, Team, FAQs">
          <label>Mission
            <textarea rows="2" style={{ width: '100%' }} value={data.about?.mission || ''} onChange={e => update('about.mission', e.target.value)} />
          </label>

          <h3 style={{ marginTop: 12 }}>Photo Gallery</h3>
          <GalleryManager
            value={data.about?.gallery || []}
            onChange={(next) => update('about.gallery', next)}
          />

          <h3 style={{ marginTop: 12 }}>Team</h3>
          <div className="grid cols-2">
            {(data.about?.team || []).map((m, i) => (
              <div key={i} className="card">
                <input placeholder="Name" value={m.name} onChange={e => { const c=[...(data.about?.team || [])]; c[i].name=e.target.value; update('about.team', c); }} />
                <input placeholder="Role" value={m.role} onChange={e => { const c=[...(data.about?.team || [])]; c[i].role=e.target.value; update('about.team', c); }} />
                <ImagePicker
                  label="Photo"
                  items={[{ url: m.photo || '', alt: m.name || '' }]}
                  onChange={(next) => { const c=[...(data.about?.team || [])]; c[i].photo = next?.[0]?.url || ''; update('about.team', c); }}
                  allowUpload multiple={false} resize={{ maxWidth: 600, maxHeight: 600, quality: 0.85, format: 'auto' }}
                />
                <textarea rows="2" placeholder="Bio" value={m.bio} onChange={e => { const c=[...(data.about?.team || [])]; c[i].bio=e.target.value; update('about.team', c); }} />
                <button onClick={() => update('about.team', (data.about?.team || []).filter((_, x) => x !== i))}>Remove</button>
              </div>
            ))}
          </div>
          <button onClick={() => update('about.team', [ ...(data.about?.team || []), { name:'', role:'', photo:'', bio:'' } ])}>Add Team Member</button>

          <h3 style={{ marginTop: 12 }}>FAQs</h3>
          {(data.about?.faqs || []).map((f, i) => (
            <div key={i} className="card">
              <input placeholder="Question" value={f.q} onChange={e => { const c=[...(data.about?.faqs || [])]; c[i].q=e.target.value; update('about.faqs', c); }} />
              <textarea rows="2" placeholder="Answer" value={f.a} onChange={e => { const c=[...(data.about?.faqs || [])]; c[i].a=e.target.value; update('about.faqs', c); }} />
              <button onClick={() => update('about.faqs', (data.about?.faqs || []).filter((_, x) => x !== i))}>Remove</button>
            </div>
          ))}
          <button onClick={() => update('about.faqs', [ ...(data.about?.faqs || []), { q:'', a:'' } ])}>Add FAQ</button>
        </Section>

        <Section id="contact" title="Contact">
          <label>General
            <textarea rows="2" style={{ width: '100%' }} value={data.contact?.general || ''} onChange={e => update('contact.general', e.target.value)} />
          </label>
          <label>Reservations
            <textarea rows="2" style={{ width: '100%' }} value={data.contact?.reservations || ''} onChange={e => update('contact.reservations', e.target.value)} />
          </label>
        </Section>

        <Section id="jobs" title="Jobs">
          <label>Intro
            <textarea rows="2" style={{ width: '100%' }} value={data.jobs?.intro || ''} onChange={e => update('jobs.intro', e.target.value)} />
          </label>
          <div className="grid cols-2">
            {(data.jobs?.positions || []).map((p, i) => (
              <div key={i} className="card">
                <input placeholder="Title" value={p.title} onChange={e => { const c=[...(data.jobs?.positions || [])]; c[i].title=e.target.value; update('jobs.positions', c); }} />
                <textarea rows="2" placeholder="Description" value={p.description} onChange={e => { const c=[...(data.jobs?.positions || [])]; c[i].description=e.target.value; update('jobs.positions', c); }} />
                <input placeholder="Apply Link" value={p.applyLink} onChange={e => { const c=[...(data.jobs?.positions || [])]; c[i].applyLink=e.target.value; update('jobs.positions', c); }} />
                <button onClick={() => update('jobs.positions', (data.jobs?.positions || []).filter((_, x) => x !== i))}>Remove</button>
              </div>
            ))}
          </div>
          <button onClick={() => update('jobs.positions', [ ...(data.jobs?.positions || []), { title:'', description:'', applyLink:'' } ])}>Add Position</button>
        </Section>

        <Section id="privacy-credits" title="Privacy & Credits">
          <label>Privacy Policy
            <textarea rows="4" style={{ width:'100%' }} value={data.policies?.privacy || ''} onChange={e => update('policies.privacy', e.target.value)} />
          </label>
          <label>Credits
            <textarea rows="2" style={{ width:'100%' }} value={data.credits?.text || ''} onChange={e => update('credits.text', e.target.value)} />
          </label>
        </Section>
      </div>

      {/* Scoped styles for Admin UI */}
      <style>{`
        .admin-wrap { --admin-top-h: 120px; }
        .admin-top {
          position: sticky; top: 0; z-index: 1000;
          background: var(--bg, #fff);
          border-bottom: 1px solid var(--border, #e5e7eb);
          box-shadow: 0 1px 0 rgba(0,0,0,.03);
        }
        .admin-top__inner { max-width: 1200px; margin: 0 auto; padding: 12px 16px; }
        .admin-toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .admin-nav { display: flex; gap: 8px; overflow-x: auto; padding: 10px 0 2px; scrollbar-width: thin; }
        .admin-nav__link {
          display: inline-block; white-space: nowrap;
          padding: 8px 10px; border-radius: 10px; color: inherit; text-decoration: none;
          border: 1px solid transparent;
        }
        .admin-nav__link:hover { background: var(--surface, #f6f7fb); }
        .admin-nav__link.is-active { background: var(--surface, #f6f7fb); border-color: var(--border, #e5e7eb); }
        .admin-content { max-width: 1200px; margin: 0 auto; padding: 12px 16px 40px; }
        .admin-section { margin-top: 14px; scroll-margin-top: 120px; }
        @media (max-width: 768px){
          .admin-wrap { --admin-top-h: 148px; }
          .admin-section { scroll-margin-top: 148px; }
        }
      `}</style>
    </div>
  );
}
