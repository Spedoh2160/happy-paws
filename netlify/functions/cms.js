import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };

  const store = getStore('cms'); // site-wide store; persisted across deploys. :contentReference[oaicite:1]{index=1}
  const key = 'content.json';

  try {
    if (event.httpMethod === 'GET') {
      const json = await store.get(key, { type: 'json' }); // null if first run
      return {
        statusCode: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify(json || {}),
      };
    }

    if (event.httpMethod === 'POST') {
      const adminKey = process.env.ADMIN_SAVE_KEY || '';
      const sentKey = (event.headers['x-admin-key'] || '').toString();
      if (!adminKey || sentKey !== adminKey) {
        return { statusCode: 401, headers: cors, body: 'Unauthorized' };
      }
      // Body is the full content JSON
      const text = event.body || '{}';
      // Validate JSON
      JSON.parse(text);
      await store.set(key, text);
      return { statusCode: 200, headers: cors, body: '{"ok":true}' };
    }

    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: `Server error: ${e?.message || e}` };
  }
};
