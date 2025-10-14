// path: src/components/TextBlockEditor.jsx
import Markdown from './Markdown.jsx';

export default function TextBlockEditor({
  label = 'Text Block (Markdown supported)',
  value = '',
  onChange,
  rows = 6,
  placeholder = 'Type Markdown…',
  preview = true,
}) {
  return (
    <div className="card">
      <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>{label}</label>
      <textarea
        rows={rows}
        style={{ width: '100%' }}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
      {preview && (
        <div className="card" style={{ marginTop: 10 }}>
          <div className="section-title">Preview</div>
          <Markdown>{value}</Markdown>
        </div>
      )}
      <div className="muted" style={{ marginTop: 6 }}>
        Supports headings, lists, links. Line breaks are preserved.
      </div>
    </div>
  );
}