// ======================================================
// file: src/components/GallerySlider.jsx
// Purpose: Reusable slider with captions (auto-advance + dots)
// ======================================================
import { useEffect, useMemo, useRef, useState } from 'react';

export default function GallerySlider({
  items = [],        // [{ url, caption }]
  intervalMs = 4500, // auto-advance delay
  height = 420,      // max height
}) {
  const slides = useMemo(
    () => (Array.isArray(items) ? items.filter(x => x && x.url) : []),
    [items]
  );
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [slides.length, intervalMs]);

  function go(i) {
    if (timerRef.current) clearInterval(timerRef.current);
    setIdx(i);
  }
  function prev(){ go((idx - 1 + slides.length) % slides.length); }
  function next(){ go((idx + 1) % slides.length); }

  if (!slides.length) {
    return <div className="card" style={{textAlign:'center'}}>No gallery images yet.</div>;
  }

  return (
    <div className="slider" style={{ maxHeight: height, position:'relative' }} aria-roledescription="carousel">
      <div
        className="slides"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {slides.map((s, i) => (
          <figure className="slide" key={i} style={{ background:'#000' }}>
            <img
              src={s.url}
              alt={s.caption || `Gallery ${i + 1}`}
              style={{ width:'100%', height:'100%', objectFit:'cover' }}
              onError={(e)=>{ e.currentTarget.style.opacity='0.2'; }}
            />
            {/* Caption overlay */}
            {(s.caption) ? (
              <figcaption
                style={{
                  position:'absolute',
                  left:0, right:0, bottom:0,
                  padding:'10px 14px',
                  color:'#fff',
                  textShadow:'0 1px 2px rgba(0,0,0,.7)',
                  background:'linear-gradient(transparent, rgba(0,0,0,.45))'
                }}
              >
                {s.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {/* Prev/Next */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={prev}
            style={navBtnStyle('left')}
          >‹</button>
          <button
            aria-label="Next slide"
            onClick={next}
            style={navBtnStyle('right')}
          >›</button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="slider-controls">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === idx ? 'active' : ''}`}
              aria-label={`Go to slide ${i+1}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function navBtnStyle(side){
  return {
    position:'absolute',
    top:'50%',
    transform:'translateY(-50%)',
    [side]:'8px',
    width:36, height:36,
    borderRadius:999,
    border:'1px solid rgba(255,255,255,.6)',
    background:'rgba(0,0,0,.25)',
    color:'#fff',
    cursor:'pointer',
    display:'grid',
    placeItems:'center',
    fontSize:20,
    lineHeight:1
  };
}