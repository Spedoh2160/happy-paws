// path: src/crm/CRMProvider.jsx
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

  // 1) Load from localStorage (device-specific overrides)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData(prev => deepMerge(prev, parsed));
      }
    } catch {}
  }, []);

  // 2) Load shared /content.json (repo-published) for everyone
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/content.json', { cache: 'no-store' });
        if (res.ok) {
          const remote = await res.json();
          if (alive) setData(prev => deepMerge(prev, remote));
        }
      } catch { /* no shared file yet — ignore */ }
      finally { loadedRef.current = true; }
    })();
    return () => { alive = false; };
  }, []);

  // Persist local edits to localStorage
  useEffect(() => {
    if (!loadedRef.current) return; // avoid saving too early
    try {
      const raw = JSON.stringify(data);
      localStorage.setItem(LS_KEY, raw);
    } catch {}
  }, [data]);

  // Export/import helpers
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

export function useCRM() { return useContext(CRMContext); }