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
        return {
          url,
          alt: it.alt || '',
          caption: it.caption || '',
        };
      }
      return null;
    })
    .filter(Boolean);
}

export default function Home() {
  const { data } = useCRM();

  const siteName = data?.site?.name || 'Happy Paws';
  const heroItems = normalizeImages(data?.home?.heroImages);

  const mission = data?.home?.mission || '';
  const teasers = Array.isArray(data?.home?.missionTeasers) ? data.home.missionTeasers : [];
  const quickLinks = Array.isArray(data?.home?.quickLinks) ? data.home.quickLinks : [];

  return (
    <div>
      {/* Intro + HERO slider */}
      <section id="intro" className="card">
        <h1 className="page-title">Welcome to {siteName}</h1>
        <div className="slider" style={{ marginTop: 8 }}>
          {/* Slider component supports a simple array; we pass mapped items (back-compat safe) */}
          <Slider images={heroItems} height={420} fit="cover" />
        </div>

        {/* Mission (Markdown) */}
        {mission && (
          <div style={{ marginTop: 12 }}>
            <Markdown>{mission}</Markdown>
          </div>
        )}
      </section>

      {/* Mission teasers as cards (Markdown excerpts) */}
      {(teasers?.length ?? 0) > 0 && (
        <section id="mission" className="home-teasers" style={{ marginTop: 16 }}>
          <h2 className="section-title">Coming Soon - Your Pet's Home Away from Home</h2>
          <div className="home-teasers" style={{ marginTop: 8 }}>
            {teasers.map((t, i) => (
              <article key={i} className="card">
                {t?.title ? (
                  <h3 className="section-title" style={{ marginTop: 0 }}>{t.title}</h3>
                ) : null}
                <Markdown>{t?.excerpt || ''}</Markdown>
                {t?.link ? (
                  <p style={{ marginTop: 10 }}>
                    <a className="cta" href={t.link}>Learn more</a>
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Quick links */}
      {(quickLinks?.length ?? 0) > 0 && (
        <section id="quicklinks" className="card" style={{ marginTop: 12 }}>
          <h2 className="section-title">Quick Links</h2>
          <div className="grid cols-1">
            {quickLinks.map((q, i) => (
              <a key={i} className="card" href={q?.href || '#'}>{q?.label || 'Link'}</a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}