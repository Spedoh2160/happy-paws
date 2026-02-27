// path: src/pages/Admin.jsx
// NOTE: full file with Markdown "Text Blocks" wired for all content areas.
// Non-content fields (phone/email/logo/url) remain inputs.
import { useEffect, useMemo, useState } from 'react';
import { useCRM } from '../crm/CRMProvider.jsx';
import ImagePicker from '../components/ImagePicker.jsx';
import GalleryManager from '../components/GalleryManager.jsx';
import TextBlockEditor from '../components/TextBlockEditor.jsx';

function Section({ id, title, children }) {
  return (
    <section
      id={id}
      className="card admin-section"
      style={{ scrollMarginTop: 110 }} // ✅ offset for sticky header
    >
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
}

const PAGES = ['home', 'services', 'prices', 'training', 'about', 'contact', 'jobs', 'privacy', 'credits'];
const successBg = 'var(--success, #2e7d32)';
const dangerBg  = 'var(--danger, #c62828)';
const FN_BASE   = import.meta.env.DEV ? 'http://localhost:8888' : '';
const clone = (v) => (typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v || {})));

function downloadContentJson(text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'content.json'; a.click();
  URL.revokeObjectURL(url);
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const expected = import.meta.env.VITE_ADMIN_PASS || 'admin123';

  function login(e) { e.preventDefault(); if (pass === expected) setAuthed(true); else alert('Incorrect password'); }
  if (!authed) {
    return (
      <form onSubmit={login} className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
        <h1 className="page-title">Admin Login</h1>
        <input type="password" placeholder="Password" value={pass}
               onChange={(e)=>setPass(e.target.value)}
               style={{ width:'100%', padding:10, border:'1px solid var(--border)', borderRadius:10 }}/>
        <button className="cta" type="submit" style={{ marginTop: 10, width: '100%' }}>Enter</button>
        <p className="muted" style={{ marginTop: 6 }}>
          Default: <code>admin123</code> — set <code>VITE_ADMIN_PASS</code> and <code>ADMIN_SAVE_KEY</code> in Netlify.
        </p>
      </form>
    );
  }
  return <AdminApp pass={pass} />;
}

function AdminApp({ pass }) {
  const { data = {}, setData, reset, export: exportJson, import: importJson } = useCRM();

  function update(path, value) {
    setData(prev => {
      const copy = clone(prev);
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

  const navItems = useMemo(() => ([
    { id: 'seo-global',        label: 'SEO – Global' },
    { id: 'seo-pages',         label: 'SEO – Pages' },
    { id: 'appearance-global', label: 'Appearance – Global' },
    { id: 'appearance-pages',  label: 'Appearance – Per Page' },
    { id: 'site-info',         label: 'Site Info' },
    { id: 'hours',             label: 'Hours & Info' },
    { id: 'home-hero',         label: 'Home – Hero' },
    { id: 'home-teasers',      label: 'Home – Teasers' },
    { id: 'prices',            label: 'Prices – Page' }, 
    { id: 'services',          label: 'Services (Text Blocks)' },
    { id: 'training',          label: 'Training (Text Blocks)' },
    { id: 'about',             label: 'About (Text Blocks + Gallery)' },
    { id: 'contact',           label: 'Contact (Text Blocks)' },
    { id: 'jobs',              label: 'Jobs (Text Blocks)' },
    { id: 'privacy-credits',   label: 'Privacy & Credits (Text Blocks)' },
  ]), []);
  const [activeId, setActiveId] = useState(navItems[0].id);

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

  // safe getters
  const seoPages   = data.seo?.pages   || {};
  const themePages = data.theme?.pages || {};

  const setSeoPage   = (k, patch) => update('seo.pages',   { ...seoPages,   [k]: { ...(seoPages[k] || {}),   ...patch } });
  const setThemePage = (k, patch) => update('theme.pages', { ...themePages, [k]: { ...(themePages[k] || {}), ...patch } });

  return (
    <div className="admin-shell">
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
            <button style={{ background: successBg, color:'#fff', border:0, padding:'10px 14px', borderRadius:10 }}
                    onClick={saveToServer} disabled={busy} aria-busy={busy ? 'true' : 'false'}>
              {busy ? 'Saving…' : 'Save to Server'}
            </button>
           <div
              className="card"
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                opacity: 0.95,
              }}
              role="note"
              aria-label="Reset disabled"
            >
              <span style={{ fontWeight: 700 }}>Reset disabled.</span>
              <span className="muted">
                Please contact site administrator for assistance. <a href="tel:17203465390">720-346-5390</a>.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-content">
          {/* SEO */}
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
                const p = seoPages[k] || { title: '', description: '', image: '' };
                return (
                  <div key={k} className="card">
                    <strong style={{ display: 'block', marginBottom: 8 }}>{k}</strong>
                    <input placeholder="Title" value={p.title} onChange={e => setSeoPage(k, { title: e.target.value })}/>
                    <input placeholder="Description" value={p.description} onChange={e => setSeoPage(k, { description: e.target.value })}/>
                    <input placeholder="Social Image URL" value={p.image} onChange={e => setSeoPage(k, { image: e.target.value })}/>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Appearance */}
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
                const t = themePages[k] || { color:'', imageUrl:'', size:'', repeat:'', position:'', attachment:'' };
                return (
                  <div key={k} className="card">
                    <strong style={{ display: 'block', marginBottom: 8 }}>{k}</strong>
                    <label>Color <input type="color" value={t.color || '#ffffff'} onChange={e => setThemePage(k, { color: e.target.value })}/></label>
                    <label>Size <input value={t.size || ''} onChange={e => setThemePage(k, { size: e.target.value })}/></label>
                    <label>Repeat <input value={t.repeat || ''} onChange={e => setThemePage(k, { repeat: e.target.value })}/></label>
                    <label>Position <input value={t.position || ''} onChange={e => setThemePage(k, { position: e.target.value })}/></label>
                    <label>Attachment <input value={t.attachment || ''} onChange={e => setThemePage(k, { attachment: e.target.value })}/></label>
                    <ImagePicker
                      label="Background Image"
                      items={[{ url: t.imageUrl || '', alt: '' }]}
                      onChange={(next) => setThemePage(k, { imageUrl: next?.[0]?.url || '' })}
                      allowUpload multiple={false}
                      resize={{ maxWidth: 2400, maxHeight: 2400, quality: 0.85, format: 'auto' }}
                    />
                    <div className="muted" style={{ marginTop: 6 }}>Leave fields empty to inherit Global.</div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Site info (keep inputs) */}
          <Section id="site-info" title="Site Info">
            <div className="grid cols-2">
              <label>Site Name <input value={data.site?.name || ''} onChange={e => update('site.name', e.target.value)} /></label>
              <label>Logo URL <input value={data.site?.logoUrl || ''} onChange={e => update('site.logoUrl', e.target.value)} /></label>
              <label>Phone <input value={data.site?.phone || ''} onChange={e => update('site.phone', e.target.value)} /></label>
              <label>Email <input value={data.site?.email || ''} onChange={e => update('site.email', e.target.value)} /></label>
              <label>Address <input value={data.site?.address || ''} onChange={e => update('site.address', e.target.value)} /></label>
            </div>
          </Section>

          <Section id="hours" title="Hours & Info">
          <p className="muted" style={{ marginTop: 0 }}>
            This controls the right-side “Hours & Info” card (above the AI chat) and can be used on the Contact page too.
          </p>

          <h3 style={{ marginTop: 12 }}>Weekly Hours</h3>
          <div className="card">
            {(data.site?.hours?.weekly || []).map((r, i) => (
              <div key={i} className="grid cols-2" style={{ alignItems: 'end', marginBottom: 10 }}>
                <label>
                  Day
                  <input
                    value={r?.day || ''}
                    onChange={(e) => {
                      const c = clone(data.site?.hours?.weekly || []);
                      c[i] = { ...(c[i] || {}), day: e.target.value };
                      update('site.hours.weekly', c);
                    }}
                  />
                </label>

                <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={!!r?.closed}
                    onChange={(e) => {
                      const c = clone(data.site?.hours?.weekly || []);
                      c[i] = { ...(c[i] || {}), closed: e.target.checked };
                      update('site.hours.weekly', c);
                    }}
                  />
                  Closed
                </label>

                <label>
                  Open
                  <input
                    value={r?.open || ''}
                    onChange={(e) => {
                      const c = clone(data.site?.hours?.weekly || []);
                      c[i] = { ...(c[i] || {}), open: e.target.value };
                      update('site.hours.weekly', c);
                    }}
                    placeholder="8:00 AM"
                  />
                </label>

                <label>
                  Close
                  <input
                    value={r?.close || ''}
                    onChange={(e) => {
                      const c = clone(data.site?.hours?.weekly || []);
                      c[i] = { ...(c[i] || {}), close: e.target.value };
                      update('site.hours.weekly', c);
                    }}
                    placeholder="5:00 PM"
                  />
                </label>
              </div>
            ))}
            <div className="muted">Tip: Sunday–Saturday should be 7 rows.</div>
          </div>

          <h3 style={{ marginTop: 12 }}>Holiday Hours</h3>
          <TextBlockEditor
            label="Holiday Hours (Plain text)"
            value={data.site?.hours?.holiday || ''}
            onChange={(v) => update('site.hours.holiday', v)}
            rows={4}
          />

          <h3 style={{ marginTop: 12 }}>Social Links</h3>
          <div className="grid cols-2">
            <label>
              Facebook URL
              <input value={data.site?.social?.facebookUrl || ''} onChange={(e) => update('site.social.facebookUrl', e.target.value)} />
            </label>
            <label>
              Instagram URL
              <input value={data.site?.social?.instagramUrl || ''} onChange={(e) => update('site.social.instagramUrl', e.target.value)} />
            </label>
          </div>

          <h3 style={{ marginTop: 12 }}>Location (uses Site Info)</h3>
          <div className="muted">Address and Phone are taken from Site Info above.</div>
        </Section>

          {/* Home */}
          <Section id="home-hero" title="Home – Hero Images">
            <ImagePicker
              label="Hero Images"
              items={data.home?.heroImages || []}
              onChange={(next) => update('home.heroImages', next)}
              allowUpload multiple
              resize={{ maxWidth: 1920, maxHeight: 1080, quality: 0.82, format: 'auto' }}
            />
          </Section>

          <Section id="home-teasers" title="Home – Mission & Teasers (Text Blocks)">
            <TextBlockEditor
              label="Home Mission (Markdown)"
              value={data.home?.mission || ''}
              onChange={(v)=>update('home.mission', v)}
            />
            <div className="grid cols-2" style={{ marginTop: 8 }}>
              {(data.home?.missionTeasers || []).map((t, i) => (
                <div key={i} className="card">
                  <label>Title <input value={t.title || ''} onChange={e => { const c=[...(data.home?.missionTeasers || [])]; c[i] = { ...c[i], title:e.target.value }; update('home.missionTeasers', c); }}/></label>
                  <TextBlockEditor
                    label="Teaser Text (Markdown)"
                    value={t.excerpt || ''}
                    onChange={(v)=>{ const c=[...(data.home?.missionTeasers || [])]; c[i] = { ...c[i], excerpt:v }; update('home.missionTeasers', c); }}
                    rows={4}
                  />
                  <label>Link <input value={t.link || ''} onChange={e => { const c=[...(data.home?.missionTeasers || [])]; c[i] = { ...c[i], link:e.target.value }; update('home.missionTeasers', c); }}/></label>
                  <button onClick={() => update('home.missionTeasers', (data.home?.missionTeasers || []).filter((_, x) => x !== i))}>Remove</button>
                </div>
              ))}
            </div>
            <button onClick={() => update('home.missionTeasers', [...(data.home?.missionTeasers || []), { title:'', excerpt:'', link:'' }])}>Add Teaser</button>
          </Section>

          <Section id="prices" title="Prices – Page">
          <p className="muted" style={{ marginTop: 0 }}>
            The Prices page is generated from your <strong>Services</strong> entries.
            Update each service’s <code>Starting At</code>, tiered prices, and price details in the Services section below.
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', height: 10 }}>
            <a className="cta" href="#services">Go to Services Pricing</a>
            <a href="/prices" target="_blank" rel="noreferrer">Open Prices Page</a>
          </div>
        </Section>

          {/* Services (Text Blocks per service)
          <Section id="services" title="Services – Text Blocks">
            <div className="grid cols-2">
              {(data.services || []).map((s, i) => (
                <div key={s.id || i} className="card">
                  <label>ID <input value={s.id || ''} onChange={e => { const c=[...(data.services || [])]; c[i] = { ...c[i], id:e.target.value }; update('services', c); }} /></label>
                  <label>Title <input value={s.title || ''} onChange={e => { const c=[...(data.services || [])]; c[i] = { ...c[i], title:e.target.value }; update('services', c); }} /></label>
                  <TextBlockEditor
                    label="Description (Markdown)"
                    value={s.description || ''}
                    onChange={(v)=>{ const c=[...(data.services || [])]; c[i] = { ...c[i], description:v }; update('services', c); }}
                    rows={6}
                  />
                  <button onClick={() => update('services', (data.services || []).filter((_, x) => x !== i))}>Remove</button>
                </div>
              ))}
            </div>
            <button onClick={() => update('services', [ ...(data.services || []), { id:'new', title:'New', description:'' } ])}>Add Service</button>
          </Section> */}


           
<Section id="services" title="Services – Text Blocks">
  <div className="grid cols-2">
    {(data.services || []).map((s, i) => (
      <div key={s.id || i} className="card">
        <label>ID <input value={s.id || ''} onChange={e => { const c=[...(data.services || [])]; c[i] = { ...c[i], id:e.target.value }; update('services', c); }} /></label>
        <label>Title <input value={s.title || ''} onChange={e => { const c=[...(data.services || [])]; c[i] = { ...c[i], title:e.target.value }; update('services', c); }} /></label>

        <label>Starting At (e.g. “From $35/day”)
          <input value={s.startingAt || ''} onChange={e => { const c=[...(data.services || [])]; c[i] = { ...c[i], startingAt:e.target.value }; update('services', c); }} />
        </label>

        <TextBlockEditor
          label="Description (Markdown)"
          value={s.description || ''}
          onChange={(v)=>{ const c=[...(data.services || [])]; c[i] = { ...c[i], description:v }; update('services', c); }}
          rows={6}
        />

        <div style={{ marginTop: 8 }}>
          <strong style={{ display: 'block', marginBottom: 6 }}>Price Tiers (optional)</strong>
          {(s.tiers || []).map((t, ti) => (
            <div key={ti} className="card" style={{ padding: 10 }}>
              <label>Label <input value={t.label || ''} onChange={e => { const c=[...(data.services || [])]; const tiers=[...(c[i].tiers || [])]; tiers[ti] = { ...(tiers[ti] || {}), label:e.target.value }; c[i] = { ...c[i], tiers }; update('services', c); }} /></label>
              <label>Price <input value={t.price || ''} onChange={e => { const c=[...(data.services || [])]; const tiers=[...(c[i].tiers || [])]; tiers[ti] = { ...(tiers[ti] || {}), price:e.target.value }; c[i] = { ...c[i], tiers }; update('services', c); }} /></label>
              <label>Note (optional) <input value={t.note || ''} onChange={e => { const c=[...(data.services || [])]; const tiers=[...(c[i].tiers || [])]; tiers[ti] = { ...(tiers[ti] || {}), note:e.target.value }; c[i] = { ...c[i], tiers }; update('services', c); }} /></label>
              <button onClick={() => { const c=[...(data.services || [])]; c[i] = { ...c[i], tiers:(c[i].tiers || []).filter((_,x)=>x!==ti) }; update('services', c); }}>Remove Tier</button>
            </div>
          ))}
          <button onClick={() => { const c=[...(data.services || [])]; const tiers=[...(c[i].tiers || [])]; tiers.push({ label:'', price:'', note:'' }); c[i] = { ...c[i], tiers }; update('services', c); }}>Add Tier</button>
        </div>

        <TextBlockEditor
          label="Price Details (Markdown, optional)"
          value={s.priceDetails || ''}
          onChange={(v)=>{ const c=[...(data.services || [])]; c[i] = { ...c[i], priceDetails:v }; update('services', c); }}
          rows={4}
        />

        <button onClick={() => update('services', (data.services || []).filter((_, x) => x !== i))}>Remove</button>
      </div>
    ))}
  </div>

  <button onClick={() => update('services', [ ...(data.services || []), { id:'new', title:'New', description:'', startingAt:'', tiers:[], priceDetails:'' } ])}>
    Add Service
  </button>
</Section>

          {/* Training (Text Blocks) */}
          <Section id="training" title="Training – Text Blocks">
            <div className="grid cols-2">
              {(data.training || []).map((t, i) => (
                <div key={t.id || i} className="card">
                  <label>ID <input value={t.id || ''} onChange={e => { const c=[...(data.training || [])]; c[i] = { ...c[i], id:e.target.value }; update('training', c); }} /></label>
                  <label>Title <input value={t.title || ''} onChange={e => { const c=[...(data.training || [])]; c[i] = { ...c[i], title:e.target.value }; update('training', c); }} /></label>
                  <TextBlockEditor
                    label="Description (Markdown)"
                    value={t.description || ''}
                    onChange={(v)=>{ const c=[...(data.training || [])]; c[i] = { ...c[i], description:v }; update('training', c); }}
                    rows={6}
                  />
                  <button onClick={() => update('training', (data.training || []).filter((_, x) => x !== i))}>Remove</button>
                </div>
              ))}
            </div>
            <button onClick={() => update('training', [ ...(data.training || []), { id:'new', title:'New', description:'' } ])}>Add Training</button>
          </Section>

          {/* About */}
          <Section id="about" title="About – Text Blocks & Gallery">
            <TextBlockEditor
              label="Our Mission (Markdown)"
              value={data.about?.mission || ''}
              onChange={(v)=>update('about.mission', v)}
            />
            <h3 style={{ marginTop: 12 }}>Photo Gallery</h3>
            <GalleryManager value={data.about?.gallery || []} onChange={(next) => update('about.gallery', next)} />

            <h3 style={{ marginTop: 12 }}>Team</h3>
            <div className="grid cols-2">
              {(data.about?.team || []).map((m, i) => (
                <div key={i} className="card">
                  <label>Name <input value={m.name || ''} onChange={e => { const c=[...(data.about?.team || [])]; c[i] = { ...c[i], name:e.target.value }; update('about.team', c); }} /></label>
                  <label>Role <input value={m.role || ''} onChange={e => { const c=[...(data.about?.team || [])]; c[i] = { ...c[i], role:e.target.value }; update('about.team', c); }} /></label>
                  <ImagePicker
                    label="Photo"
                    items={[{ url: m.photo || '', alt: m.name || '' }]}
                    onChange={(next) => { const c=[...(data.about?.team || [])]; c[i] = { ...c[i], photo: (next?.[0]?.url || '') }; update('about.team', c); }}
                    allowUpload multiple={false} resize={{ maxWidth: 600, maxHeight: 600, quality: 0.85, format: 'auto' }}
                  />
                  <TextBlockEditor
                    label="Bio (Markdown)"
                    value={m.bio || ''}
                    onChange={(v)=>{ const c=[...(data.about?.team || [])]; c[i] = { ...c[i], bio:v }; update('about.team', c); }}
                    rows={4}
                  />
                  <button onClick={() => update('about.team', (data.about?.team || []).filter((_, x) => x !== i))}>Remove</button>
                </div>
              ))}
            </div>
            <button onClick={() => update('about.team', [ ...(data.about?.team || []), { name:'', role:'', photo:'', bio:'' } ])}>Add Team Member</button>

            <h3 style={{ marginTop: 12 }}>What Sets Meadow Ridge Apart?</h3>
            <div className="grid cols-2">
              {(data.about?.different || []).map((d, i) => (
                <div key={i} className="card">
                  <label>
                    Title
                    <input
                      value={d?.title || ''}
                      onChange={(e) => {
                        const c = clone(data.about?.different || []);
                        c[i] = { ...(c[i] || {}), title: e.target.value };
                        update('about.different', c);
                      }}
                    />
                  </label>

                  <TextBlockEditor
                    label="Description (Markdown)"
                    value={d?.body || ''}
                    onChange={(v) => {
                      const c = clone(data.about?.different || []);
                      c[i] = { ...(c[i] || {}), body: v };
                      update('about.different', c);
                    }}
                    rows={5}
                  />

                  <button
                    onClick={() =>
                      update(
                        'about.different',
                        (data.about?.different || []).filter((_, x) => x !== i)
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                update('about.different', [
                  ...(data.about?.different || []),
                  { title: '', body: '' },
                ])
              }
            >
              Add “Apart” Item
            </button>
              
            <h3 style={{ marginTop: 12 }}>FAQs</h3>
            {(data.about?.faqs || []).map((f, i) => (
              <div key={i} className="card">
                <label>Question <input value={f.q || ''} onChange={e => { const c=[...(data.about?.faqs || [])]; c[i] = { ...c[i], q:e.target.value }; update('about.faqs', c); }} /></label>
                <TextBlockEditor
                  label="Answer (Markdown)"
                  value={f.a || ''}
                  onChange={(v)=>{ const c=[...(data.about?.faqs || [])]; c[i] = { ...c[i], a:v }; update('about.faqs', c); }}
                  rows={4}
                />
                <button onClick={() => update('about.faqs', (data.about?.faqs || []).filter((_, x) => x !== i))}>Remove</button>
              </div>
            ))}
            <button onClick={() => update('about.faqs', [ ...(data.about?.faqs || []), { q:'', a:'' } ])}>Add FAQ</button>
          </Section>

          {/* Contact */}
          <Section id="contact" title="Contact – Text Blocks">
            <TextBlockEditor
              label="General (Markdown)"
              value={data.contact?.general || ''}
              onChange={(v)=>update('contact.general', v)}
            />
            <TextBlockEditor
              label="Reservations (Markdown)"
              value={data.contact?.reservations || ''}
              onChange={(v)=>update('contact.reservations', v)}
            />
          </Section>

          {/* Jobs */}
          <Section id="jobs" title="Jobs – Text Blocks">
            <TextBlockEditor
              label="Intro (Markdown)"
              value={data.jobs?.intro || ''}
              onChange={(v)=>update('jobs.intro', v)}
            />
            <div className="grid cols-2">
              {(data.jobs?.positions || []).map((p, i, arr) => (
                <div key={i} className="card">
                  <label>Title <input value={p.title || ''} onChange={e => { const c=[...arr]; c[i] = { ...c[i], title:e.target.value }; update('jobs.positions', c); }} /></label>
                  <TextBlockEditor
                    label="Description (Markdown)"
                    value={p.description || ''}
                    onChange={(v)=>{ const c=[...(data.jobs?.positions || [])]; c[i] = { ...c[i], description:v }; update('jobs.positions', c); }}
                    rows={5}
                  />
                  <label>Apply Link <input value={p.applyLink || ''} onChange={e => { const c=[...arr]; c[i] = { ...c[i], applyLink:e.target.value }; update('jobs.positions', c); }} /></label>
                  <button onClick={() => update('jobs.positions', (data.jobs?.positions || []).filter((_, x) => x !== i))}>Remove</button>
                </div>
              ))}
            </div>
            <button onClick={() => update('jobs.positions', [ ...(data.jobs?.positions || []), { title:'', description:'', applyLink:'' } ])}>Add Position</button>
          </Section>

          {/* Privacy & Credits */}
          <Section id="privacy-credits" title="Privacy & Credits – Text Blocks">
            <TextBlockEditor
              label="Privacy Policy (Markdown)"
              value={data.policies?.privacy || ''}
              onChange={(v)=>update('policies.privacy', v)}
              rows={8}
            />
            <TextBlockEditor
              label="Credits (Markdown)"
              value={data.credits?.text || ''}
              onChange={(v)=>update('credits.text', v)}
              rows={4}
            />
          </Section>
        </div>

        {/* Right-aside jump nav */}
        <aside className="admin-aside" aria-label="Jump to Section">
          <div className="admin-aside__inner card">
            <div className="admin-aside__title">Sections</div>
            <div className="admin-aside__links">
              {navItems.map(({ id, label }) => (
                <a key={id} href={`#${id}`} className={`admin-aside__link ${activeId === id ? 'is-active' : ''}`}>{label}</a>
              ))}
            </div>
            <hr style={{ border:0, borderTop:'1px solid var(--border)', margin:'10px 0' }} />
            <a href="#seo-global" className="admin-aside__link">↑ Back to top</a>
          </div>
        </aside>
      </div>
    </div>
  );
}