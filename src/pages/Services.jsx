import { useCRM } from '../crm/CRMProvider.jsx';

function Block({ id, title, body }) {
  return (
    <section id={id} className="card" style={{marginTop:12}}>
      <h2 className="section-title">{title}</h2>
      <p className="muted">{body}</p>
    </section>
  );
}

export default function Services() {
  const { data } = useCRM();
  const find = (key) => data.services.find(s=>s.id===key);
  return (
    <div>
      <h1 className="page-title">Services</h1>
      {['splash','overnight','day','bathing','birthday','social','events','grooming'].map(k=>{
        const item = find(k);
        return <Block key={k} id={item.id} title={item.title} body={item.description}/>
      })}
    </div>
  );
}
