// path: src/pages/Home.jsx
import { useCRM } from '../crm/CRMProvider.jsx';
import Slider from '../components/Slider.jsx';
import Markdown from '../components/Markdown.jsx';

function normalizeImages(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((it) => {
      if (!it) return null;
      if (typeof it === 'string') return { url: it, alt: '', caption: '' };
      if (typeof it === 'object') {
        const url = it.url || it.src || '';
        if (!url) return null;
        return { url, alt: it.alt || '', caption: it.caption || '' };
      }
      return null;
    })
    .filter(Boolean);
}

export default function Home() {
  const { data } = useCRM();

  const siteName   = data?.site?.name || 'Happy Paws';
  const heroItems  = normalizeImages(data?.home?.heroImages);
  const mission    = data?.home?.mission || '';
  const teasers    = Array.isArray(data?.home?.missionTeasers) ? data.home.missionTeasers : [];
  const quickLinks = Array.isArray(data?.home?.quickLinks) ? data.home.quickLinks : [];

  return (
    <div>
      {/* Intro + HERO slider */}
      <section id="intro" className="card" style={{ marginTop: 0 }}>
        <h1 className="page-title">Welcome to {siteName}</h1>
        {!!heroItems.length && (
          <div className="slider" style={{ marginTop: 8 }}>
            <Slider images={heroItems} height={420} fit="cover" />
          </div>
        )}
        {mission && (
          <div style={{ marginTop: 12 }}>
            <Markdown>{mission}</Markdown>
          </div>
        )}
      </section>

      {/* Mission teasers: stacked one per card */}
      {!!teasers.length && (
        <section id="mission" aria-label="Mission Teasers">
          {teasers.map((t, i) => (
            <section key={i} className="card" style={{ marginTop: 12 }}>
              {t?.title && <h2 className="section-title" style={{ marginTop: 0 }}>{t.title}</h2>}
              <Markdown>{t?.excerpt || ''}</Markdown>
              {t?.link && (
                <p style={{ marginTop: 10 }}>
                  <a className="cta" href={t.link}>Learn more</a>
                </p>
              )}
            </section>
          ))}
        </section>
      )}

      {/* Quick links: stacked cards */}
      {!!quickLinks.length && (
        <section id="quicklinks" aria-label="Quick Links">
          {quickLinks.map((q, i) => (
            <section key={i} className="card" style={{ marginTop: 12 }}>
              <a href={q?.href || '#'}>{q?.label || 'Link'}</a>
            </section>
          ))}
        </section>
      )}
    </div>
  );
}
