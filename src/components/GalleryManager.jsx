import ImagePicker from './ImagePicker.jsx';

export default function GalleryManager({ value = [], onChange }) {
  const items = toObjects(value);

  function setItem(i, patch){
    const next = items.map((it, idx) => idx === i ? { ...it, ...patch } : it);
    onChange?.(next);
  }
  function remove(i){ onChange?.(items.filter((_, idx) => idx !== i)); }
  function onPickerChange(nextItems){
    // ImagePicker provides [{ url, alt }]
    const next = (nextItems || []).map(x => ({ url: x.url, caption: x.alt || '' }));
    onChange?.(next);
  }

  return (
    <div>
      <ImagePicker
        label="Gallery Images"
        items={items.map(({url, caption}) => ({ url, alt: caption }))}
        onChange={onPickerChange}
        allowUpload
        multiple
        resize={{ maxWidth: 1280, maxHeight: 1280, quality: 0.82, format: 'auto' }}
      />
      <div className="grid cols-2" style={{ marginTop: 12 }}>
        {items.map((it, i) => (
          <div key={i} className="card" style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:12 }}>
            <img src={it.url} alt="" style={{ width:80, height:80, objectFit:'cover', borderRadius:8, border:'1px solid var(--border)' }}/>
            <div>
              <label>Caption
                <input
                  value={it.caption || ''}
                  onChange={e => setItem(i, { caption: e.target.value })}
                  placeholder="Describe the photo…"
                  style={{ width:'100%', marginTop:6 }}
                />
              </label>
              <div style={{ marginTop:8 }}>
                <button
                  onClick={() => remove(i)}
                  style={{ padding:'8px 12px', borderRadius:8, border:'1px solid var(--border)', background:'#fff' }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function toObjects(val){
  if (!Array.isArray(val)) return [];
  return val.map(v => {
    if (!v) return null;
    if (typeof v === 'string') return { url: v, caption: '' };
    if (typeof v === 'object' && v.url) return { url: v.url, caption: v.caption ?? v.alt ?? '' };
    return null;
  }).filter(Boolean);
}