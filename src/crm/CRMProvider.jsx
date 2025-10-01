// FILE: src/crm/CRMProvider.jsx
// Loads localStorage (device-only) + shared /content.json (global).
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

  // 1) Load device-local overrides
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setData(prev => deepMerge(prev, JSON.parse(raw)));
    } catch {}
  }, []);

  // 2) Load shared /content.json for everyone (cache-busted)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const url = `/content.json?v=${Date.now()}`; // prevent stale cache
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const remote = await res.json();
          if (alive) setData(prev => deepMerge(prev, remote));
        }
      } catch {
        // no shared file yet — ok
      } finally {
        loadedRef.current = true;
      }
    })();
    return () => { alive = false; };
  }, []);

  // Persist local edits after initial load completes
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