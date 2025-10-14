// path: src/pages/Services.jsx
import { useCRM } from '../crm/CRMProvider.jsx';
import Markdown from '../components/Markdown.jsx';

export default function Services(){
  const { data } = useCRM();
  const items = Array.isArray(data.services) ? data.services : [];

  return (
    <>
      <h1 className="page-title">Services</h1>

      {items.map((s, i)=>(
        <section
          key={s.id || i}
          id={s.id || `service-${i}`}
          className="card"
          style={{ marginTop: i ? 12 : 0 }}
        >
          {s.title && <h2 className="section-title" style={{ marginTop: 0 }}>{s.title}</h2>}
          <Markdown>{s.description || ''}</Markdown>
        </section>
      ))}
    </>
  );
}
