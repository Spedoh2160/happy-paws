import { useCRM } from '../crm/CRMProvider.jsx';

export default function Training() {
  const { data } = useCRM();
  const id = (k) => data.training.find(s=>s.id===k);
  return (
    <div>
      <h1 className="page-title">Training</h1>
      {['group','sport','puppy','private','staytrain','trainers'].map(k=>{
        const item = id(k);
        return (
          <section key={k} id={item.id} className="card" style={{marginTop:12}}>
            <h2 className="section-title">{item.title}</h2>
            <p className="muted">{item.description}</p>
          </section>
        );
      })}
    </div>
  );
}
