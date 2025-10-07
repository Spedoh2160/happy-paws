import { useCRM } from '../crm/CRMProvider.jsx';
import GallerySlider from '../components/GallerySlider.jsx';

export default function About() {
  const { data } = useCRM();

  // Back-compat: strings → {url, caption:''}, objects → {url, caption}
  const galleryItems = normalizeGallery(data?.about?.gallery);

  return (
    <div>
      <h1 className="page-title">About</h1>

      <section id="team" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Management Team</h2>
        <div className="grid cols-2">
          {(data.about?.team || []).map((m,i)=>(
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
          {(data.about?.reviews || []).map((r,i)=>(<li key={i}>"{r.text}" — <span className="muted">{r.name}</span></li>))}
        </ul>
      </section>

      <section id="different" className="card" style={{marginTop:12}}>
        <h2 className="section-title">How We're Different</h2>
        <ul>{(data.about?.different || []).map((d,i)=>(<li key={i}>{d}</li>))}</ul>
      </section>

      {/* ✅ NEW: Gallery slider with captions */}
      <section id="gallery" className="card" style={{ marginTop: 12 }}>
        <h2 className="section-title">Photo Gallery</h2>
        {/* ✅ Slider replaces the broken grid */}
        <GallerySlider items={galleryItems} height={420} fit="contain" />
      </section>

      <section id="mission" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Our Mission</h2>
        <p className="muted">{data.about?.mission}</p>
      </section>

      <section id="faqs" className="card" style={{marginTop:12}}>
        <h2 className="section-title">FAQs</h2>
        <table className="table">
          <tbody>
            {(data.about?.faqs || []).map((f,i)=>(
              <tr key={i}><th style={{width:'40%'}}>{f.q}</th><td>{f.a}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function normalizeGallery(gal){
  if (!Array.isArray(gal)) return [];
  return gal.map((it) => {
    if (!it) return null;
    if (typeof it === 'string') return { url: it, caption: filenameToCaption(it) };
    if (typeof it === 'object' && it.url) {
      const cap = it.caption ?? it.alt ?? filenameToCaption(it.url);
      return { url: it.url, caption: cap || '' };
    }
    return null;
  }).filter(Boolean);
}

function filenameToCaption(url=''){
  try{
    const name = url.split('/').pop() || '';
    const base = name.replace(/\.[a-z0-9]+$/i,'').replace(/[-_]+/g, ' ').trim();
    return base ? base.charAt(0).toUpperCase() + base.slice(1) : '';
  }catch{ return ''; }
}