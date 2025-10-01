export const handler = async (event) => {
  // CORS for browser calls
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { statusCode: 500, headers: cors, body: 'Missing GITHUB_TOKEN env var' };

    const { owner, repo, branch = 'main', contentText, path = 'public/content.json' } = JSON.parse(event.body || '{}');
    if (!owner || !repo || !contentText) {
      return { statusCode: 400, headers: cors, body: 'owner, repo, contentText are required' };
    }

    const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `token ${token}`, // PAT
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    };

    // Fetch existing to get sha (if present)
    let sha;
    {
      const res = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers });
      if (res.ok) {
        const j = await res.json();
        sha = j.sha;
      }
    }

    const body = {
      message: 'chore(content): publish shared content.json',
      content: Buffer.from(contentText, 'utf8').toString('base64'),
      branch,
      ...(sha ? { sha } : {}),
    };

    const putRes = await fetch(apiBase, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (!putRes.ok) {
      const txt = await putRes.text();
      return { statusCode: putRes.status, headers: cors, body: `GitHub PUT failed: ${txt}` };
    }

    return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: `Server error: ${e?.message || e}` };
  }
};
