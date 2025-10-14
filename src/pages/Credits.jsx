// path: src/pages/Credits.jsx
import { useCRM } from '../crm/CRMProvider.jsx';
import Markdown from '../components/Markdown.jsx';
export default function Credits(){
  const { data } = useCRM();
  return (
    <section id="credits" className="card">
      <h1 className="page-title">Site Credits</h1>
      <Markdown>{data.credits?.text || ''}</Markdown>
    </section>
  );
}