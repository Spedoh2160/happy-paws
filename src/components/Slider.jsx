import { useEffect, useRef, useState } from 'react';

export default function Slider({ images=[], interval=4500 }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const count = images.length || 1;

  useEffect(() => {
    const id = setInterval(()=>setIdx(i => (i+1) % count), interval);
    timer.current = id;
    return () => clearInterval(id);
  }, [count, interval]);

  const go = (i) => setIdx(i);
  const pause = () => timer.current && clearInterval(timer.current);

  return (
    <div className="slider" onMouseEnter={pause}>
      <div className="slides" style={{transform:`translateX(-${idx*100}%)`}}>
        {(images.length?images:[{url:'https://images.unsplash.com/photo-1548199973-03cce0bbc87b'}]).map((img, i)=>(
          <div className="slide" key={i} aria-hidden={i!==idx}>
            <img src={typeof img==='string'?img:img.url} alt={img.alt || 'Pet facility photo'} loading="eager"/>
          </div>
        ))}
      </div>
      <div className="slider-controls" aria-label="Slide controls">
        {Array.from({length: count}).map((_,i)=>(
          <button key={i} className={`dot ${i===idx?'active':''}`} aria-label={`Go to slide ${i+1}`} onClick={()=>go(i)} />
        ))}
      </div>
    </div>
  );
}
