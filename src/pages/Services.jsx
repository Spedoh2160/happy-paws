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
      <div className="grid cols-2">
        {items.map((s, i)=>(
          <div key={s.id || i} className="card">
            <h2 className="section-title">{s.title}</h2>
            <Markdown>{s.description || ''}</Markdown>
          </div>
        ))}
      </div>
    </>
  );
}
