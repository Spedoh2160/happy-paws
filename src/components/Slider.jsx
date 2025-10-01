// path: src/components/Slider.jsx
import { useEffect, useMemo, useRef, useState } from 'react';

function normalizeImages(images = []) {
  return images
    .map((img) => (typeof img === 'string' ? { url: img, alt: 'Pet facility photo' } : img))
    .filter((i) => i && i.url); // ignore empty entries from admin
}

export default function Slider({ images = [], interval = 4500 }) {
  const list = useMemo(() => normalizeImages(images), [images]);
  const count = list.length;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  // start/stop loop
  useEffect(() => {
    // Why: do nothing if only 0/1 images
    if (paused || count <= 1 || interval <= 0) return;
    timer.current = setInterval(() => setIdx((i) => (i + 1) % count), interval);
    return () => clearInterval(timer.current);
  }, [paused, count, interval]);

  // pause when tab is hidden, resume when visible
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // reset index if list shrinks
  useEffect(() => {
    if (idx >= count) setIdx(0);
  }, [count, idx]);

  const go = (i) => setIdx(i);
  const onEnter = () => setPaused(true);
  const onLeave = () => setPaused(false);

  // fallback if no images configured
  const renderList = count ? list : [{ url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b', alt: 'Dog' }];

  return (
    <div className="slider" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="slides" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {renderList.map((img, i) => (
          <div className="slide" key={i} aria-hidden={i !== idx}>
            <img src={img.url} alt={img.alt || 'Pet facility photo'} loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
      <div className="slider-controls" aria-label="Slide controls">
        {Array.from({ length: renderList.length }).map((_, i) => (
          <button key={i} className={`dot ${i === idx ? 'active' : ''}`} aria-label={`Go to slide ${i + 1}`} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}
