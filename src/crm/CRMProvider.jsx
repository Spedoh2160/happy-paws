import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultContent } from './defaultContent';

const CRMContext = createContext(null);

function load() {
  try {
    const raw = localStorage.getItem('hp_cms_v1');
    if (!raw) return defaultContent;
    const parsed = JSON.parse(raw);
    return { ...defaultContent, ...parsed };
  } catch { return defaultContent; }
}
function save(data) { localStorage.setItem('hp_cms_v1', JSON.stringify(data)); }

export function CRMProvider({ children }) {
  const [data, setData] = useState(load());

  useEffect(()=>{ save(data); }, [data]);

  const value = useMemo(()=>({
    data,
    setData,
    reset: ()=>setData(defaultContent),
    export: ()=>JSON.stringify(data, null, 2),
    import: (json)=>{ const obj = JSON.parse(json); setData(obj); }
  }), [data]);

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error('useCRM must be used inside CRMProvider');
  return ctx;
}
