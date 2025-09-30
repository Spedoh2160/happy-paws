import { useEffect, useState } from 'react';

export default function Sidebar({ sections }) {
  const [active, setActive] = useState(sections?.[0]?.id);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 1]});
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page">
      {sections.map(s => (
        <a key={s.id} href={`#${s.id}`} className={`link ${active===s.id?'active':''}`}>{s.label}</a>
      ))}
      <hr style={{margin:'10px 0'}}/>
      <a className="link" href="#">Back to top ↑</a>
    </nav>
  );
}
