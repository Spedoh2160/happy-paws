import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { defaultContent } from './defaultContent.js';

const CRMContext = createContext(null);
const LS_KEY = 'crmData/v1';

function deepMerge(base, overlay) {
  if (Array.isArray(base) || Array.isArray(overlay) || typeof base !== 'object' || typeof overlay !== 'object' || !base || !overlay) {
    return overlay ?? base;
  }
  const out = { ...base };
  for (const k of Object.keys(overlay)) out[k] = deepMerge(base[k], overlay[k]);
  return out;
}

export function CRMProvider({ children }) {
  const [data, setData] = useState(defaultContent);
  const loadedRef = useRef(false);

  // Device-local (instant preview)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setData(prev => deepMerge(prev, JSON.parse(raw)));
    } catch {}
  }, []);

  // Shared server content via Netlify Function (preferred)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/.netlify/functions/cms', { cache: 'no-store' });
        if (res.ok) {
          const remote = await res.json();
          if (alive && remote && Object.keys(remote).length) {
            setData(prev => deepMerge(prev, remote));
          }
        }
      } catch {}
      finally { loadedRef.current = true; }
    })();
    return () => { alive = false; };
  }, []);

  // Persist local preview
  useEffect(() => {
    if (!loadedRef.current) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
  }, [data]);

  const api = useMemo(() => ({
    data,
    setData,
    export: () => JSON.stringify(data, null, 2),
    import: (raw) => {
      const next = JSON.parse(raw);
      setData(next);
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
    },
    reset: () => {
      setData(defaultContent);
      try { localStorage.removeItem(LS_KEY); } catch {}
    }
  }), [data]);

  return <CRMContext.Provider value={api}>{children}</CRMContext.Provider>;
}
export function useCRM(){ return useContext(CRMContext); }