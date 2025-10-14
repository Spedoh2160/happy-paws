import { useCRM } from '../crm/CRMProvider.jsx';
import Markdown from '../components/Markdown.jsx';


export default function Training(){
  const { data } = useCRM();
  const blocks = data.training || [];
   return (
    <>
      <h1 className="page-title">Training</h1>

      {/* One wide card per block, stacked */}
      {blocks.map((b, i)=>(
        <section key={b.id || i} id={b.id || `training-${i}`} className="card" style={{ marginTop: i ? 12 : 0 }}>
          <h2 className="section-title" style={{ marginTop: 0 }}>{b.title}</h2>
          <Markdown>{b.description || ''}</Markdown>
        </section>
      ))}
    </>
  );
}