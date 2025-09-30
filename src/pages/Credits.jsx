import { useCRM } from '../crm/CRMProvider.jsx';

export default function Credits() {
  const { data } = useCRM();
  return (
    <div>
      <section id="credits" className="card">
        <h1 className="page-title">Site Credits</h1>
        <p className="muted">{data.credits.text}</p>
      </section>
    </div>
  );
}
