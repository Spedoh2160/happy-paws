import { useCRM } from '../crm/CRMProvider.jsx';

export default function Privacy() {
  const { data } = useCRM();
  return (
    <div>
      <section id="privacy" className="card">
        <h1 className="page-title">Privacy Policy</h1>
        <p className="muted" style={{whiteSpace:'pre-wrap'}}>{data.policies.privacy}</p>
      </section>
    </div>
  );
}
