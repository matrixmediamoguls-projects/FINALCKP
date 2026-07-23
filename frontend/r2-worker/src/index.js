const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, HEAD, OPTIONS',
  'access-control-allow-headers': 'Range, If-None-Match',
  'access-control-expose-headers': 'Accept-Ranges, Content-Length, Content-Range, ETag',
  'access-control-max-age': '86400',
};

function withCors(headers) {
  for (const [name, value] of Object.entries(CORS_HEADERS)) headers.set(name, value);
  return headers;
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {
        status: 405,
        headers: withCors(new Headers({ allow: 'GET, HEAD, OPTIONS' })),
      });
    }

    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
    if (!key || key.includes('..')) {
      return new Response('Invalid media key', { status: 400, headers: CORS_HEADERS });
    }

    const rangeHeader = request.headers.get('range');
    const object = await env.MEDIA.get(key, rangeHeader ? { range: request.headers } : undefined);
    if (!object) {
      return new Response('Media not found', { status: 404, headers: CORS_HEADERS });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('accept-ranges', 'bytes');
    headers.set('cache-control', 'public, max-age=86400');

    let status = 200;
    if (rangeHeader && object.range) {
      status = 206;
      const offset = object.range.offset ?? 0;
      const length = object.range.length ?? object.size;
      headers.set('content-range', `bytes ${offset}-${offset + length - 1}/${object.size}`);
      headers.set('content-length', String(length));
    } else {
      headers.set('content-length', String(object.size));
    }

    return new Response(request.method === 'HEAD' ? null : object.body, {
      status,
      headers: withCors(headers),
    });
  },
};
