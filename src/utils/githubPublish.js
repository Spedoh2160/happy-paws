export function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export async function publishContentJsonDirect(cfg, contentText) {
  const { owner, repo, token, branch = 'main', path = 'public/content.json' } = cfg;
  if (!owner || !repo || !token) throw new Error('Missing owner/repo/token');

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `token ${token}`, // try Bearer if org policy requires
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // get sha if exists
  let sha;
  try {
    const r = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers });
    if (r.ok) sha = (await r.json()).sha;
  } catch {}

  const body = {
    message: 'chore(content): publish shared content.json',
    content: encodeBase64(contentText),
    branch,
    ...(sha ? { sha } : {}),
  };

  const res = await fetch(apiBase, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub PUT failed ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function publishContentJsonViaFunction({ owner, repo, branch = 'main', path = 'public/content.json' }, contentText) {
  const res = await fetch('/.netlify/functions/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, repo, branch, contentText, path }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
