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

      <section id="mission" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Mission Teasers</h2>
        <div className="grid cols-3">
          {data.home.missionTeasers.map((m,i)=>(
            <a key={i} className="card" href={m.link}>
              <h3 style={{margin:'4px 0'}}>{m.title}</h3>
              <p className="muted">{m.excerpt}</p>
            </a>
          ))}
        </div>
      </section>

      <section id="quicklinks" className="card" style={{marginTop:12}}>
        <h2 className="section-title">Quick Links</h2>
        <div className="grid cols-3">
          {data.home.quickLinks.map((q,i)=>(
            <a key={i} className="card" href={q.href}>{q.label}</a>
          ))}
        </div>
      </section>
    </div>
  );
}
