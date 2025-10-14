import { useCRM } from '../crm/CRMProvider.jsx';
import Markdown from '../components/Markdown.jsx';


export default function Training(){
  const { data } = useCRM();
  const blocks = data.training || [];
  return (
    <>
      <h1 className="page-title">Training</h1>
      <div className="grid cols-2">
        {blocks.map((b, i)=>(
          <div key={b.id || i} className="card">
            <h2 className="section-title">{b.title}</h2>
            <Markdown>{b.description || ''}</Markdown>
          </div>
        ))}
      </div>
    </>
  );
}