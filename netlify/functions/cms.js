import { getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
};

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  // Why: your site didn’t auto-configure Blobs, so we pass siteID+token explicitly.
  const siteID = process.env.BLOBS_SITE_ID;     // Netlify: Project/Site ID
  const token  = process.env.BLOBS_TOKEN;       // Netlify Personal Access Token
  const adminKey = process.env.ADMIN_SAVE_KEY || ''; // Same pwd you use at /admin (e.g., admin123)

  if (!siteID || !token) {
    return { statusCode: 500, headers: CORS, body: 'Missing BLOBS_SITE_ID or BLOBS_TOKEN env var' };
  }

  const store = getStore({ name: 'cms', siteID, token, consistency: 'strong' });
  const key = 'content.json';

  try {
    if (event.httpMethod === 'GET') {
      const json = await store.get(key, { type: 'json' }); // null if never saved
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(json || {}) };
    }

    if (event.httpMethod === 'POST') {
      // Simple auth: header must match ADMIN_SAVE_KEY
      const sentKey = String(event.headers['x-admin-key'] || '');
      if (!adminKey || sentKey !== adminKey) {
        return { statusCode: 401, headers: CORS, body: 'Unauthorized' };
      }
      const text = event.body || '{}';
      JSON.parse(text); // validate JSON
      await store.set(key, text);
      return { statusCode: 200, headers: CORS, body: '{"ok":true}' };
    }

    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: `Server error: ${e?.message || e}` };
  }
};
