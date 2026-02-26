// path: src/pages/Prices.jsx
import { useMemo } from 'react';
import { useCRM } from '../crm/CRMProvider.jsx';

function escapeHtml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function mdToHtml(md = '') {
  const src = escapeHtml(md).replaceAll('\r\n', '\n');

  let out = src
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

  const lines = out.split('\n');
  const html = [];
  let inList = false;

  for (const line of lines) {
    const li = line.match(/^\-\s+(.+)$/);
    if (li) {
      if (!inList) {
        inList = true;
        html.push('<ul>');
      }
      html.push(`<li>${li[1]}</li>`);
      continue;
    }
    if (inList) {
      inList = false;
      html.push('</ul>');
    }

    if (line.trim() === '') html.push('<div style="height:10px"></div>');
    else html.push(`<p>${line}</p>`);
  }

  if (inList) html.push('</ul>');
  return html.join('');
}

function Markdown({ value }) {
  const html = useMemo(() => mdToHtml(value || ''), [value]);
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

function cleanId(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function Prices() {
  const { data = {} } = useCRM();
  const services = Array.isArray(data.services) ? data.services : [];

  return (
    <div className="page">
      <h1 className="page-title">Prices</h1>
      <p className="muted">
        Pricing may vary based on pet size, temperament, and special requests. Contact us for a personalized quote.
      </p>

      <div className="grid cols-2" style={{ marginTop: 12 }}>
        {services.map((s, idx) => {
          const title = s?.title || `Service ${idx + 1}`;
          const id = cleanId(s?.id || title || idx);
          const anchorId = `svc-${id}`;

          const startingAt = (s?.startingAt || '').trim();
          const tiers = Array.isArray(s?.tiers) ? s.tiers : [];
          const description = s?.description || '';
          const priceDetails = s?.priceDetails || '';

          return (
            <section key={s?.id || idx} id={anchorId} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                  {title}
                </h2>
                {startingAt ? <div style={{ fontWeight: 800, fontSize: 18 }}>{startingAt}</div> : null}
              </div>

              {description ? (
                <div style={{ marginTop: 8 }}>
                  <Markdown value={description} />
                </div>
              ) : null}

              {tiers.length ? (
                <div style={{ marginTop: 10 }}>
                  <div className="muted" style={{ marginBottom: 6 }}>
                    Options
                  </div>
                  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--border)' }}>
                            Service
                          </th>
                          <th
                            style={{
                              textAlign: 'right',
                              padding: 10,
                              borderBottom: '1px solid var(--border)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tiers.map((t, i) => (
                          <tr key={i}>
                            <td style={{ padding: 10, borderBottom: '1px solid var(--border)' }}>
                              <div style={{ fontWeight: 650 }}>{t?.label || `Option ${i + 1}`}</div>
                              {t?.note ? <div className="muted" style={{ marginTop: 4 }}>{t.note}</div> : null}
                            </td>
                            <td
                              style={{
                                padding: 10,
                                borderBottom: '1px solid var(--border)',
                                textAlign: 'right',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {t?.price || ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {priceDetails ? (
                <div style={{ marginTop: 10 }}>
                  <div className="muted" style={{ marginBottom: 6 }}>
                    Details
                  </div>
                  <Markdown value={priceDetails} />
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}