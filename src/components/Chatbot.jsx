import { useEffect, useRef, useState } from 'react';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [log, setLog] = useState([{ role:'bot', text:'Hi! Ask me about services, reservations, or hours.' }]);
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); }, [log]);

  async function send() {
    if (!input.trim()) return;
    const user = { role:'user', text: input.trim() };
    setLog(l => [...l, user]);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/.netlify/functions/chatbot', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: user.text })
      });
      const data = await res.json();
      setLog(l => [...l, { role:'bot', text: data.reply || 'Sorry, I did not understand.' }]);
    } catch (e) {
      setLog(l => [...l, { role:'bot', text: 'Network issue. Try again.' }]);
    } finally { setBusy(false); }
  }

  function onKey(e){ if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } }

  return (
    <>
      <div className="chat-log" role="log" aria-live="polite">
        {log.map((m,i)=>(
          <div key={i} className={`msg ${m.role==='user'?'user':'bot'}`}>{m.text}</div>
        ))}
        <div ref={endRef}/>
      </div>
      <div className="chat-input">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your question…" onKeyDown={onKey} aria-label="Chat input"/>
        <button onClick={send} disabled={busy}>{busy?'…':'Send'}</button>
      </div>
    </>
  );
}
