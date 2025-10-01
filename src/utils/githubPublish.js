// ============================================================================
// FILE: src/utils/githubPublish.js
// Purpose: Commit public/content.json to GitHub via Contents API
// ============================================================================
export function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

/**
 * @param {{ owner:string, repo:string, branch?:string, token:string, path?:string }} cfg
 * @param {string} contentText - prettified JSON
 */
export async function publishContentJson(cfg, contentText) {
  const { owner, repo, token } = cfg;
  const branch = cfg.branch || "main";
  const path = cfg.path || "public/content.json";
  if (!owner || !repo || !token) throw new Error("Missing owner/repo/token.");

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `token ${token}`,
  };

  // 1) Try to fetch current file to obtain sha (needed for updates)
  let sha = undefined;
  try {
    const res = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers });
    if (res.ok) {
      const j = await res.json();
      sha = j.sha;
    }
  } catch { /* ignore; file may not exist yet */ }

  // 2) PUT new content
  const body = {
    message: "chore(content): publish shared content.json",
    content: encodeBase64(contentText),
    branch,
    sha, // include only if present
  };
  const putRes = await fetch(apiBase, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!putRes.ok) {
    const txt = await putRes.text().catch(() => "");
    throw new Error(`GitHub PUT failed: ${putRes.status} ${txt}`);
  }
  return putRes.json();
}