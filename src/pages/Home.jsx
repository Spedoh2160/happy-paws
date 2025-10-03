import Slider from '../components/Slider.jsx';
import { useCRM } from '../crm/CRMProvider.jsx';

export default function Home() {
  const { data } = useCRM();
  return (
    <div>
      <section id="intro" className="card">
        <h1 className="page-title">Welcome to {data.site.name}</h1>
        <Slider images={data.home.heroImages}/>
        <p className="muted" style={{marginTop:12}}>{data.home.mission}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h2 className="section-title">Quick Links</h2>
        <div className="grid home-teasers">
          {(data.home?.missionTeasers || []).map((t, i) => (
            <div key={i}>
              <h3 style={{ margin: '0 0 6px', fontWeight: 800 }}>{t.title}</h3>
              <p className="muted" style={{ margin: 0 }}>{t.excerpt}</p>
              {t.link ? (
                <a className="cta" href={t.link} style={{ marginTop: 10, display: 'inline-block' }}>
                  Learn more
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section id="quicklinks" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Quick Links</h2>
        <div className="grid cols-1">
          {data.home.quickLinks.map((q,i)=>(
            <a key={i} className="card" href={q.href}>{q.label}</a>
          ))}
        </div>
      </section>
    </div>
  );
}
