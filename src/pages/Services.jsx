import { useCRM } from '../crm/CRMProvider.jsx';
import Markdown from '../components/Markdown.jsx';

function Block({ id, title, body }) {
  return (
    <section id={id} className="card" style={{marginTop:12}}>
      <h2 className="section-title">{title}</h2>
      <p className="muted">{body}</p>
    </section>
  );
}

export default function Services(){
  const { data } = useCRM();
  const items = data.services || [];
  return (
    <>
      <h1 className="page-title">Services</h1>
       
        {/* One wide card per block, stacked */}
      {blocks.map((b, i)=>(
        <section key={b.id || i} id={b.id || `services-${i}`} className="card" style={{ marginTop: i ? 12 : 0 }}>
          <h2 className="section-title" style={{ marginTop: 0 }}>{b.title}</h2>
          <Markdown>{b.description || ''}</Markdown>
        </section>
      ))}
    </>
  );
}
