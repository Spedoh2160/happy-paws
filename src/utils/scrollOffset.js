// path: src/utils/scrollOffset.js
export function getHeaderHeight() {
  // Prefer CSS var, else measure .header, else fallback
  const root = getComputedStyle(document.documentElement);
  const varH = root.getPropertyValue('--header-h')?.trim();
  if (varH && varH.endsWith('px')) return parseFloat(varH);
  const el = document.querySelector('.header');
  return el?.getBoundingClientRect().height || 76; // fallback
}

export function offsetScrollTo(id, { behavior = 'smooth', extra = 8 } = {}) {
  const el = typeof id === 'string' ? document.getElementById(id) : id;
  if (!el) return;
  const headerH = getHeaderHeight();
  const top = window.scrollY + el.getBoundingClientRect().top - headerH - extra;
  window.scrollTo({ top, behavior });
}
