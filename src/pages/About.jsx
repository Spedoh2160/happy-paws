// path: src/pages/About.jsx
import { useCRM } from '../crm/CRMProvider.jsx';
import Markdown from '../components/Markdown.jsx';
import GallerySlider from '../components/GallerySlider.jsx';

function normalizeGallery(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((it) => {
      if (!it) return null;
      if (typeof it === 'string') {
        return { url: it, caption: filenameToCaption(it) };
      }
      if (typeof it === 'object') {
        const url = it.url || it.src || '';
        if (!url) return null;
        const caption = it.caption ?? it.alt ?? filenameToCaption(url);
        return { url, caption: caption || '' };
      }
      return null;
    })
    .filter(Boolean);
}
function filenameToCaption(url = '') {
  try {
    const name = url.split('/').pop() || '';
    const base = name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim();
    return base ? base.charAt(0).toUpperCase() + base.slice(1) : '';
  } catch {
    return '';
  }
}

export default function About() {
  const { data } = useCRM();

  const mission = data?.about?.mission || '';
  const team = Array.isArray(data?.about?.team) ? data.about.team : [];
  const reviews = Array.isArray(data?.about?.reviews) ? data.about.reviews : [];
  const different = Array.isArray(data?.about?.different) ? data.about.different : [];
  const faqs = Array.isArray(data?.about?.faqs) ? data.about.faqs : [];

  // Slider items with captions; "contain" to keep dogs centered within frame
  const galleryItems = normalizeGallery(data?.about?.gallery);

  return (
    <div>
      <h1 className="page-title">About</h1>

      {/* Team */}
      {team.length > 0 && (
        <section id="team" className="card" style={{ marginTop: 12 }}>
          <h2 className="section-title">Management Team</h2>
          <div className="grid cols-2">
            {team.map((m, i) => (
              <article key={i} className="card">
                {m?.photo ? (
                  <img
                    src={m.photo}
                    alt={m?.name || 'Team member'}
                    style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 10 }}
                  />
                ) : null}
                {m?.name ? <strong style={{ display: 'block', marginTop: 8 }}>{m.name}</strong> : null}
                {m?.role ? <div className="muted">{m.role}</div> : null}
                {m?.bio ? (
                  <div style={{ marginTop: 8 }}>
                    <Markdown>{m.bio}</Markdown>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section id="reviews" className="card" style={{ marginTop: 12 }}>
          <h2 className="section-title">Reviews</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {reviews.map((r, i) => (
              <li key={i} style={{ margin: '.35rem 0' }}>
                {r?.text ? <em>“{r.text}”</em> : null} {r?.name ? <span className="muted">— {r.name}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* How we're different */}
      {different.length > 0 && (
        <section id="different" className="card" style={{ marginTop: 12 }}>
          <h2 className="section-title">How We're Different</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {different.map((d, i) => (
              <li key={i} style={{ margin: '.35rem 0' }}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Photo Gallery SLIDESHOW (auto/controls handled by component) */}
      {galleryItems.length > 0 && (
        <section id="gallery" className="card" style={{ marginTop: 12 }}>
          <h2 className="section-title">Photo Gallery</h2>
          {/* Centering + letterboxing via fit="contain"; captions from items[].caption */}
          <GallerySlider items={galleryItems} height={420} fit="contain" />
        </section>
      )}

      {/* Mission (Markdown) */}
      {mission && (
        <section id="mission" className="card" style={{ marginTop: 12 }}>
          <h2 className="section-title">Our Mission</h2>
          <Markdown>{mission}</Markdown>
        </section>
      )}

      {/* FAQs (answers support Markdown) */}
      {faqs.length > 0 && (
        <section id="faqs" className="card" style={{ marginTop: 12 }}>
          <h2 className="section-title">FAQs</h2>
          <table className="table">
            <tbody>
              {faqs.map((f, i) => (
                <tr key={i}>
                  <th style={{ width: '40%', verticalAlign: 'top' }}>{f?.q || ''}</th>
                  <td><Markdown>{f?.a || ''}</Markdown></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
