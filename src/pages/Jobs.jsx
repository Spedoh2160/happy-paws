// path: src/pages/Jobs.jsx
import { useCRM } from '../crm/CRMProvider.jsx';
import Markdown from '../components/Markdown.jsx';

export default function Jobs(){
  const { data } = useCRM();
  return (
    <>
      <h1 className="page-title">Careers</h1>
      <section id="careers" className="card">
        <Markdown>{data.jobs?.intro || ''}</Markdown>
      </section>
      <div className="grid cols-2" style={{marginTop:12}}>
        {(data.jobs?.positions || []).map((p,i)=>(
          <div key={i} className="card">
            <h3 className="section-title">{p.title}</h3>
            <Markdown>{p.description || ''}</Markdown>
            {p.applyLink && <p><a className="cta" href={p.applyLink}>Apply Now</a></p>}
          </div>
        ))}
      </div>
    </>
  );
}