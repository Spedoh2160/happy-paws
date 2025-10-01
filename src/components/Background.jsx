// ============================================================================
// FILE: src/components/Background.jsx
// Purpose: Applies global/per-page background (color/image) to <body>
// ============================================================================
import { useEffect } from 'react';
import { useCRM } from '../crm/CRMProvider.jsx';

export default function Background({ pageKey }) {
  const { data } = useCRM();
  useEffect(() => {
    const theme = data?.theme || {};
    const body = theme.body || {};
    const page = theme.pages?.[pageKey] || {};
    const pick = (k) => (page[k] ?? body[k] ?? '');

    const prev = {
      color: document.body.style.backgroundColor,
      image: document.body.style.backgroundImage,
      size: document.body.style.backgroundSize,
      repeat: document.body.style.backgroundRepeat,
      position: document.body.style.backgroundPosition,
      attachment: document.body.style.backgroundAttachment,
    };

    const imageUrl = pick('imageUrl');
    document.body.style.backgroundColor = pick('color') || '';
    document.body.style.backgroundImage = imageUrl ? `url("${imageUrl}")` : '';
    document.body.style.backgroundSize = pick('size') || (imageUrl ? 'cover' : '');
    document.body.style.backgroundRepeat = pick('repeat') || (imageUrl ? 'no-repeat' : '');
    document.body.style.backgroundPosition = pick('position') || (imageUrl ? 'center center' : '');
    document.body.style.backgroundAttachment = pick('attachment') || '';

    return () => {
      document.body.style.backgroundColor = prev.color;
      document.body.style.backgroundImage = prev.image;
      document.body.style.backgroundSize = prev.size;
      document.body.style.backgroundRepeat = prev.repeat;
      document.body.style.backgroundPosition = prev.position;
      document.body.style.backgroundAttachment = prev.attachment;
    };
  }, [data?.theme, pageKey]);
  return null;
}