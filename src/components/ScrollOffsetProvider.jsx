// path: src/components/ScrollOffsetProvider.jsx
import { useEffect } from 'react';
import { offsetScrollTo } from '../utils/scrollOffset.js';

export default function ScrollOffsetProvider({ children }) {
  useEffect(() => {
    // Jump correctly on initial load with hash
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      // Delay to let layout paint
      requestAnimationFrame(() => offsetScrollTo(id));
    }

    // Handle future hash changes (e.g., manual URL edits)
    const onHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      offsetScrollTo(id);
    };
    window.addEventListener('hashchange', onHash);

    // Intercept in-page anchor clicks like <a href="#services">
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      // Only intercept if target exists on this page
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return; // let browser do its thing if not found
      e.preventDefault();
      offsetScrollTo(id);
      // keep the URL hash in sync
      history.pushState(null, '', `#${encodeURIComponent(id)}`);
    };
    document.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('hashchange', onHash);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return children;
}
