// path: src/components/Markdown.jsx
import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ breaks: true }); // keep manual line breaks

export default function Markdown({ children = '' }) {
  const html = DOMPurify.sanitize(marked.parse(children || ''));
  // keep typography inside .md namespace
  return <div className="md" dangerouslySetInnerHTML={{ __html: html }} />;
}
