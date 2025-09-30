// path: src/components/ImagePicker.jsx
import { useRef, useState } from 'react';

function normalize(item) {
  if (!item) return { url: '', alt: '' };
  return typeof item === 'string' ? { url: item, alt: '' } : { url: item.url || '', alt: item.alt || '' };
}
function normalizeList(list = []) {
  return list.map(normalize);
}

function canWebP() {
  try {
    const c = document.createElement('canvas');
    return c.toDataURL('image/webp').startsWith('data:image/webp');
  } catch { return false; }
}
function fitContain(w, h, maxW, maxH) {
  if (!maxW && !maxH) return { w, h };
  const r = w / h;
  let nw = w, nh = h;
  if (maxW && nw > maxW) { nw = maxW; nh = Math.round(nw / r); }
  if (maxH && nh > maxH) { nh = maxH; nw = Math.round(nh * r); }
  return { w: nw, h: nh };
}
async function loadImageFromFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return img;
  } finally {
    // revoked later after draw (we need it during draw on some browsers)
  }
}
async function resizeImageFile(file, opts = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    format = 'auto' // 'auto'|'webp'|'jpeg'|'png'
  } = opts;

  const preferWebp = format === 'webp' || (format === 'auto' && canWebP());
  const outType = preferWebp ? 'image/webp' : (format === 'png' ? 'image/png' : 'image/jpeg');

  const img = await loadImageFromFile(file);
  const { w, h } = fitContain(img.naturalWidth || img.width, img.naturalHeight || img.height, maxWidth, maxHeight);

  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d', { alpha: outType === 'image/png' });
  // Why: higher quality resampling for fewer artifacts.
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);

  const dataUrl = c.toDataURL(outType, outType === 'image/jpeg' || outType === 'image/webp' ? quality : undefined);
  URL.revokeObjectURL(img.src);
  return dataUrl;
}

export default function ImagePicker({
  items = [],
  onChange,
  label = 'Images',
  allowUpload = true,
  multiple = true,
  resize // { maxWidth, maxHeight, quality, format }
}) {
  const [list, setList] = useState(normalizeList(items));
  const fileRef = useRef(null);
  const urlRef = useRef(null);

  function commit(next) {
    setList(next);
    onChange?.(next);
  }

  async function addFiles(files) {
    const arr = Array.from(files || []);
    const dataUrls = await Promise.all(arr.map((f) => resize ? resizeImageFile(f, resize) : fileToDataUrl(f)));
    const next = [...list, ...dataUrls.map((u) => ({ url: u, alt: '' }))];
    commit(next);
  }

  function addUrl() {
    const v = urlRef.current?.value?.trim();
    if (!v) return;
    commit([...list, { url: v, alt: '' }]);
    urlRef.current.value = '';
  }

  function update(i, patch) {
    const next = [...list];
    next[i] = { ...next[i], ...patch };
    commit(next);
  }

  function remove(i) { commit(list.filter((_, x) => x !== i)); }

  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  }

  function setSingle(obj) { commit([normalize(obj)]); }

  function fileToDataUrl(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onerror = () => rej(new Error('Read failed'));
      fr.onload = () => res(fr.result);
      fr.readAsDataURL(file);
    });
  }

  // Single mode
  if (!multiple) {
    const one = normalize(list[0]);
    return (
      <div className="card">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <strong>{label}</strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, marginTop: 12 }}>
          <div className="card" style={{ display: 'grid', placeItems: 'center', minHeight: 120 }}>
            {one.url ? (
              <img src={one.url} alt={one.alt || 'preview'} style={{ maxWidth: '100%', borderRadius: 8 }} loading="lazy" />
            ) : (
              <div className="muted">No image</div>
            )}
          </div>
          <div className="grid" style={{ gap: 8 }}>
            <input
              placeholder="Image URL or data URL"
              value={one.url}
              onChange={(e) => setSingle({ ...one, url: e.target.value })}
            />
            <input
              placeholder="Alt text"
              value={one.alt}
              onChange={(e) => setSingle({ ...one, alt: e.target.value })}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              {allowUpload && (
                <>
                  <input
                    type="file"
                    ref={fileRef}
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files?.length) return;
                      const f = e.target.files[0];
                      const u = resize ? await resizeImageFile(f, resize) : await fileToDataUrl(f);
                      setSingle({ ...one, url: u });
                      e.target.value = '';
                    }}
                    style={{ display: 'none' }}
                  />
                  <button onClick={() => fileRef.current?.click()}>Upload file</button>
                </>
              )}
              <button onClick={() => setSingle({ url: '', alt: '' })}>Clear</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Multi mode
  return (
    <div className="card">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <strong>{label}</strong>
      </div>

      <div className="grid cols-3" style={{ marginTop: 12 }}>
        {list.map((it, i) => (
          <div key={i} className="card">
            <div style={{ display: 'grid', placeItems: 'center', minHeight: 120, marginBottom: 8 }}>
              {it.url ? (
                <img src={it.url} alt={it.alt || 'preview'} style={{ maxWidth: '100%', borderRadius: 8 }} loading="lazy" />
              ) : (
                <div className="muted">No image</div>
              )}
            </div>
            <input
              placeholder="Image URL or data URL"
              value={it.url}
              onChange={(e) => update(i, { url: e.target.value })}
            />
            <input
              placeholder="Alt text"
              value={it.alt}
              onChange={(e) => update(i, { alt: e.target.value })}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <button onClick={() => move(i, -1)}>↑</button>
              <button onClick={() => move(i, +1)}>↓</button>
              <button onClick={() => remove(i)} style={{ background: 'var(--danger)', color: '#fff' }}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input ref={urlRef} placeholder="Paste image URL and click Add URL" style={{ flex: 1, minWidth: 240 }} />
          <button onClick={addUrl}>Add URL</button>

          {allowUpload && (
            <>
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                multiple
                onChange={async (e) => {
                  if (!e.target.files?.length) return;
                  await addFiles(e.target.files);
                  e.target.value = '';
                }}
                style={{ display: 'none' }}
              />
              <button onClick={() => fileRef.current?.click()}>Upload files</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}