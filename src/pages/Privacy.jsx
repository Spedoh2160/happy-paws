// path: src/pages/Privacy.jsx
import { useCRM } from '../crm/CRMProvider.jsx';
import Markdown from '../components/Markdown.jsx';
export default function Privacy(){
  const { data } = useCRM();
  return (
    <section id="privacy" className="card">
      <h1 className="page-title">Privacy Policy</h1>
      <Markdown>{data.policies?.privacy || ''}</Markdown>
    </section>
  );
}