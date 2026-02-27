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

function FacebookIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9
           1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z"
      />
    </svg>
  );
}

function InstagramIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Z"
      />
      <path
        fill="currentColor"
        d="M12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z"
      />
      <circle fill="currentColor" cx="17.5" cy="6.5" r="1.2" />
    </svg>
  );
}

/* function IconLink({ href, label, children }) {
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
} */

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
                <FacebookIcon />
            </IconLink>
            <IconLink href={instagramUrl} label="Instagram">
                <InstagramIcon />
            </IconLink>
            </div>
        </div>
        ) : null}
    </div>
  );
}