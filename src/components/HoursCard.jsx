// path: src/components/HoursCard.jsx
import { useMemo } from 'react';
import { useCRM } from '../crm/CRMProvider.jsx';

function normalizeRows(rows) {
  const fallback = [
    { day: 'Sunday', open: '', close: '', closed: true },
    { day: 'Monday', open: '8:00 AM', close: '5:00 PM', closed: false },
    { day: 'Tuesday', open: '8:00 AM', close: '5:00 PM', closed: false },
    { day: 'Wednesday', open: '8:00 AM', close: '5:00 PM', closed: false },
    { day: 'Thursday', open: '8:00 AM', close: '5:00 PM', closed: false },
    { day: 'Friday', open: '8:00 AM', close: '5:00 PM', closed: false },
    { day: 'Saturday', open: '9:00 AM', close: '2:00 PM', closed: false },
  ];
  if (!Array.isArray(rows) || rows.length !== 7) return fallback;
  return rows.map((r, i) => ({
    day: String(r?.day || fallback[i].day),
    open: String(r?.open || ''),
    close: String(r?.close || ''),
    closed: Boolean(r?.closed),
  }));
}

function IconLink({ href, label, children }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      style={{
        width: 36,
        height: 36,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border)',
        borderRadius: 10,
        textDecoration: 'none',
      }}
    >
      {children}
    </a>
  );
}

export default function HoursCard() {
  const { data } = useCRM();

  const hours = data?.site?.hours || {};
  const rows = useMemo(() => normalizeRows(hours?.weekly), [hours?.weekly]);

  const holidayHours = String(hours?.holiday || '').trim();
  const phone = String(data?.site?.phone || '').trim();
  const address = String(data?.site?.address || '').trim();

  const facebookUrl = String(data?.site?.social?.facebookUrl || '').trim();
  const instagramUrl = String(data?.site?.social?.instagramUrl || '').trim();

  const mapsQuery = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : '';

  return (
    <div className="card" style={{ position: 'sticky', top: 90 }}>
      <div className="section-title">Hours & Info</div>

      {/* Weekly table */}
      <div style={{ marginTop: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {rows.map((r) => (
              <tr key={r.day}>
                <td style={{ padding: '6px 0', fontWeight: 650 }}>{r.day}</td>
                <td style={{ padding: '6px 0', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {r.closed ? (
                    <span className="muted">Closed</span>
                  ) : (
                    <span>
                      {r.open} <span className="muted">–</span> {r.close}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Holiday hours */}
      {holidayHours ? (
        <div style={{ marginTop: 10 }}>
          <div className="muted" style={{ marginBottom: 6 }}>Holiday Hours</div>
          <div className="card" style={{ padding: 10 }}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{holidayHours}</div>
          </div>
        </div>
      ) : null}

      {/* Location */}
      {(address || phone) ? (
        <div style={{ marginTop: 10 }}>
          <div className="muted" style={{ marginBottom: 6 }}>Location</div>
          <div className="card" style={{ padding: 10 }}>
            {address ? (
              <div style={{ marginBottom: phone ? 8 : 0 }}>
                <div style={{ fontWeight: 650 }}>Address</div>
                {mapsQuery ? (
                  <a href={mapsQuery} target="_blank" rel="noreferrer">{address}</a>
                ) : (
                  <div>{address}</div>
                )}
              </div>
            ) : null}

            {phone ? (
              <div>
                <div style={{ fontWeight: 650 }}>Phone</div>
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Social */}
      {(facebookUrl || instagramUrl) ? (
        <div style={{ marginTop: 10 }}>
          <div className="muted" style={{ marginBottom: 6 }}>Social</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <IconLink href={facebookUrl} label="Facebook">
              <span aria-hidden="true" style={{ fontSize: 18 }}>f</span>
            </IconLink>
            <IconLink href={instagramUrl} label="Instagram">
              <span aria-hidden="true" style={{ fontSize: 18 }}>◎</span>
            </IconLink>
          </div>
        </div>
      ) : null}
    </div>
  );
}