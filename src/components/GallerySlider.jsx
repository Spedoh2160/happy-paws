import { useEffect, useMemo, useRef, useState } from 'react';

export default function GallerySlider({
  items = [],          // [{ url, caption }]
  intervalMs = 4500,   // auto-advance
  height = 420,        // fixed frame height in px
  fit = 'contain',     // 'contain' (show all) or 'cover'
}) {
  const slides = useMemo(
    () => (Array.isArray(items) ? items.filter(x => x && x.url) : []),
    [items]
  );

  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % slides.length), intervalMs);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [slides.length, intervalMs]);

  const go   = (i) => { if (timerRef.current) clearInterval(timerRef.current); setIdx(i); };
  const prev = () => go((idx - 1 + slides.length) % slides.length);
  const next = () => go((idx + 1) % slides.length);

  if (!slides.length) {
    return <div className="card" style={{ textAlign:'center' }}>No gallery images yet.</div>;
  }

  // inline styles to avoid global CSS conflicts
  const dotStyle = (active) => ({
    width: 10, height: 10, borderRadius: 999,
    background: active ? 'var(--brand, #2563eb)' : 'rgba(255,255,255,.65)',
    border: '1px solid rgba(0,0,0,.2)', cursor:'pointer'
  });

  return (
    <div
      className="gslider"
      aria-roledescription="carousel"
      style={{ position:'relative', overflow:'hidden', borderRadius:14, background:'#000' }}
    >
      <div
        className="gslides"
        style={{
          display:'flex',
          transform:`translateX(-${idx * 100}%)`,
          transition:'transform .4s ease',
          willChange:'transform'
        }}
      >
        {slides.map((s, i) => (
          <figure
            key={i}
            className="gslide"
            style={{
              margin:0,
              minWidth:'100%',           // ✅ fixed slide width
              width:'100%',
              height,                    // ✅ fixed frame height (prevents jumping)
              position:'relative',
              display:'grid',
              placeItems:'center',
              background:'#000'
            }}
          >
            <img
              src={s.url}
              alt={s.caption || `Gallery ${i + 1}`}
              onError={(e)=>{ e.currentTarget.style.opacity='0.25'; }}
              style={{
                maxWidth:'100%',
                maxHeight:'100%',
                width: fit === 'cover' ? '100%' : 'auto',
                height: fit === 'cover' ? '100%' : 'auto',
                objectFit: fit,              // ✅ contain by default
                objectPosition:'50% 50%',    // ✅ centered
                display:'block'
              }}
            />
            {/* Caption overlay (always try to show if not empty) */}
            {s.caption ? (
              <figcaption
                style={{
                  position:'absolute', left:0, right:0, bottom:0,
                  padding:'10px 14px',
                  color:'#fff',
                  textShadow:'0 1px 2px rgba(0,0,0,.9)',
                  background:'linear-gradient(transparent, rgba(0,0,0,.55))'
                }}
              >
                {s.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={prev}
            style={navBtn('left')}
          >‹</button>
          <button
            aria-label="Next"
            onClick={next}
            style={navBtn('right')}
          >›</button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div
          className="gcontrols"
          style={{
            position:'absolute', bottom:10, left:'50%',
            transform:'translateX(-50%)',
            display:'flex', gap:6, alignItems:'center'
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i+1}`}
              onClick={() => go(i)}
              style={dotStyle(i === idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function navBtn(side){
  return {
    position:'absolute',
    top:'50%', transform:'translateY(-50%)',
    [side]:'8px',
    width:36, height:36,
    borderRadius:999,
    border:'1px solid rgba(255,255,255,.6)',
    background:'rgba(0,0,0,.35)',
    color:'#fff',
    cursor:'pointer',
    display:'grid', placeItems:'center',
    fontSize:20, lineHeight:1
  };
}

