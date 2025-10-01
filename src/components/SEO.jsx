// ============================================================================
// FILE: src/components/SEO.jsx
// Purpose: Injects <title>, meta description, OG/Twitter tags, canonical
// ============================================================================
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCRM } from '../crm/CRMProvider.jsx';

function setMeta(kind, name, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${kind}="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(kind, name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
  el.setAttribute('href', href);
}

export default function SEO({ pageKey }) {
  const { data } = useCRM();
  const loc = useLocation();
  useEffect(() => {
    const seo = data?.seo || {};
    const page = seo.pages?.[pageKey] || {};
    const title = page.title || seo.defaultTitle || data?.site?.name || 'Site';
    const desc = page.description || seo.defaultDescription || '';
    const image = page.image || seo.defaultImage || data?.site?.logoUrl || '/logo.svg';

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const base = (seo.canonicalBase || origin || '').replace(/\/$/, '');
    const url = base ? `${base}${loc.pathname}` : (origin + loc.pathname);

    document.title = title;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary_large_image');
    if (seo.twitterHandle) setMeta('name', 'twitter:site', seo.twitterHandle);
    setLink('canonical', url);
  }, [data, pageKey, loc.pathname]);
  return null;
}