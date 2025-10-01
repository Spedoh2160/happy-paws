// FILE: src/components/Background.jsx
// Fixes fallback: empty strings won't block global background.
// Applies to both <html> and <body> for reliable rendering.
import { useEffect } from 'react';
import { useCRM } from '../crm/CRMProvider.jsx';

function isUnset(v) {
  return v == null || (typeof v === 'string' && v.trim() === '');
}

export default function Background({ pageKey }) {
  const { data } = useCRM();

  useEffect(() => {
    const theme = data?.theme || {};
    const body = theme.body || {};
    const page = (theme.pages && theme.pages[pageKey]) || {};

    const pick = (k) => {
      const pv = page?.[k];
      if (!isUnset(pv)) return pv;
      const gv = body?.[k];
      if (!isUnset(gv)) return gv;
      return '';
    };

    const imageUrl = pick('imageUrl');
    const color = pick('color');
    const size = pick('size') || (imageUrl ? 'cover' : '');
    const repeat = pick('repeat') || (imageUrl ? 'no-repeat' : '');
    const position = pick('position') || (imageUrl ? 'center center' : '');
    const attachment = pick('attachment') || '';

    // apply to both <html> and <body>
    const targets = [document.documentElement, document.body];

    const prev = targets.map((el) => ({
      el,
      color: el.style.backgroundColor,
      image: el.style.backgroundImage,
      size: el.style.backgroundSize,
      repeat: el.style.backgroundRepeat,
      position: el.style.backgroundPosition,
      attachment: el.style.backgroundAttachment,
    }));

    targets.forEach((el) => {
      el.style.backgroundColor = color || '';
      el.style.backgroundImage = imageUrl ? `url("${imageUrl}")` : '';
      el.style.backgroundSize = size;
      el.style.backgroundRepeat = repeat;
      el.style.backgroundPosition = position;
      el.style.backgroundAttachment = attachment;
    });

    return () => {
      prev.forEach(({ el, color, image, size, repeat, position, attachment }) => {
        el.style.backgroundColor = color;
        el.style.backgroundImage = image;
        el.style.backgroundSize = size;
        el.style.backgroundRepeat = repeat;
        el.style.backgroundPosition = position;
        el.style.backgroundAttachment = attachment;
      });
    };
  }, [data?.theme, pageKey]);

  return null;
}