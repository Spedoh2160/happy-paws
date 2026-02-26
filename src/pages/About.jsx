// path: src/pages/About.jsx
import { useMemo } from 'react';
import { useCRM } from '../crm/CRMProvider.jsx';
import Markdown from '../components/Markdown.jsx';
import GallerySlider from '../components/GallerySlider.jsx';

function normalizeGallery(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((it) => {
      if (!it) return null;
      if (typeof it === 'string') return { url: it, caption: filenameToCaption(it) };
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

const MEADOW_RIDGE_APART = [
  {
    title: 'Advanced Air Purification in Every Animal Area',
    body:
      'With Aerapy air systems installed throughout all pet-access spaces, we actively reduce airborne contaminants, odors, and pathogens — promoting a cleaner, healthier environment for pets and staff alike.',
  },
  {
    title: 'Commercial-Grade Outdoor Play Surfaces',
    body:
      'All exterior play yards feature commercial-grade turf designed for durability, drainage, sanitation efficiency, and year-round safety.',
  },
  {
    title: 'VIP Presidential Private Suites',
    body:
      'Our premium private suites include in-room televisions and enhanced comfort features, offering a low-stress, luxury boarding experience for discerning pet parents.',
  },
  {
    title: 'Social Lounge with 16-Tap Beer & Wine System',
    body:
      'Guests enjoy a thoughtfully designed social space featuring a 16-tap self-serve beer and wine wall paired with theatre-quality popcorn — creating a hospitality experience unlike traditional kennels.',
  },
  {
    title: 'Heated Indoor Splash Park and Outdoor Splash Park',
    body:
      'Our heated splash park allows for safe, supervised water enrichment year-round, supporting exercise, mental stimulation, and controlled energy release.',
  },
];

function normalizeApartItems(differentRaw) {
  if (!Array.isArray(differentRaw)) return [];
  return differentRaw
    .map((it) => {
      if (!it) return null;

      // Old format: ["Some bullet", ...]
      if (typeof it === 'string') {
        const title = it.trim();
        return title ? { title, body: '' } : null;
      }

      // New format: [{ title, body }]
      if (typeof it === 'object') {
        const title = String(it.title || it.heading || '').trim();
        const body = String(it.body || it.description || '').trim();
        if (!title && !body) return null;
        return { title: title || 'More', body };
      }

      return null;
    })
    .filter(Boolean);
}

export default function About() {
  const { data } = useCRM();

  const mission = data?.about?.mission || '';
  const team = Array.isArray(data?.about?.team) ? data.about.team : [];
  const faqs = Array.isArray(data?.about?.faqs) ? data.about.faqs : [];

  const galleryItems = useMemo(() => normalizeGallery(data?.about?.gallery), [data?.about?.gallery]);

  const differentRaw = Array.isArray(data?.about?.different) ? data.about.different : [];
  const apartItems = useMemo(() => normalizeApartItems(differentRaw), [differentRaw]);
  const finalApartItems = apartItems.length > 0 ? apartItems : MEADOW_RIDGE_APART;

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

      {/* What sets Meadow Ridge apart */}
      {finalApartItems.length > 0 && (
        <section id="different" className="card" style={{ marginTop: 12 }}>
          <h2 className="section-title">What Sets Meadow Ridge Apart?</h2>

          <div className="grid cols-2" style={{ marginTop: 8 }}>
            {finalApartItems.map((it, i) => (
              <div key={i} className="card">
                {it.title ? <strong style={{ display: 'block' }}>{it.title}</strong> : null}
                {it.body ? (
                  <div style={{ marginTop: 6 }}>
                    <Markdown>{it.body}</Markdown>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {galleryItems.length > 0 && (
        <section id="gallery" className="card" style={{ marginTop: 12 }}>
          <h2 className="section-title">Photo Gallery</h2>
          <GallerySlider items={galleryItems} height={420} fit="contain" />
        </section>
      )}

      {/* Mission */}
      {mission && (
        <section id="mission" className="card" style={{ marginTop: 12 }}>
          <h2 className="section-title">Our Mission</h2>
          <Markdown>{mission}</Markdown>
        </section>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section id="faqs" className="card" style={{ marginTop: 12 }}>
          <h2 className="section-title">FAQs</h2>
          <table className="table">
            <tbody>
              {faqs.map((f, i) => (
                <tr key={i}>
                  <th style={{ width: '40%', verticalAlign: 'top' }}>{f?.q || ''}</th>
                  <td>
                    <Markdown>{f?.a || ''}</Markdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}