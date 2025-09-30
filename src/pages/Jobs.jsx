import { useCRM } from '../crm/CRMProvider.jsx';

export default function Jobs() {
  const { data } = useCRM();
  return (
    <div>
      <h1 className="page-title">Careers</h1>
      <section id="careers" className="card">
        <p className="muted">{data.jobs.intro}</p>
        <div className="grid cols-2" style={{marginTop:12}}>
          {data.jobs.positions.map((p,i)=>(
            <div key={i} className="card">
              <h3 style={{margin:'6px 0'}}>{p.title}</h3>
              <p className="muted">{p.description}</p>
              <a className="cta" href={p.applyLink || '#'}>Apply</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
