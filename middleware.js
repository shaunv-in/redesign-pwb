// Vercel Edge Middleware: password gate for /house/* on shaunvincent.net.
// The login page is served from here; a correct password sets a 30-day cookie. The password is stored only as a salted SHA-256 hash.
export const config = { matcher: ['/house', '/house/:path*'] };
const SALT = 'nadumuttam', HASH = '7dc84bfa19a421bdce29fdbd88a4752d9f52cdb03ef707f5b674f85f21bf843a', COOKIE = 'house_auth';
const LOGIN_HTML = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Nadumuttam House</title>\n<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#ECEEE8;color:#17201B;font:16px/1.5 Manrope,system-ui,sans-serif}form{background:#F7F8F4;border:1px solid #C8CEC5;padding:28px 30px;width:min(360px,calc(100vw - 32px));display:grid;gap:12px}h1{margin:0;font:400 1.3rem Jost,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}input{font:inherit;padding:10px 12px;border:1px solid #C8CEC5;border-radius:3px}button{font:500 .8rem Jost,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:11px;border:0;background:#17201B;color:#F7F8F4;cursor:pointer}.bad{color:#8E2A2A;font-size:.85rem;margin:0}</style></head>\n<body><form method=\"post\" action=\"/house/login\"><h1>Nadumuttam House</h1><p style=\"margin:0;color:#56625A;font-size:.9rem\">Private. Enter the password to open the viewer.</p><input type=\"password\" name=\"password\" placeholder=\"Password\" autofocus required><input type=\"hidden\" name=\"next\" id=\"next\" value=\"%NEXT%\"><p class=\"bad\" id=\"bad\" %BAD%>That password isn't right.</p><button type=\"submit\">Open</button></form>\n</body></html>";
async function sha(s) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
const token = () => sha(SALT + HASH + 'cookie');
const page = (bad, next) => new Response(LOGIN_HTML.replace('%BAD%', bad ? '' : 'hidden').replace('%NEXT%', next.replace(/"/g, '')), { status: bad ? 401 : 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
export default async function middleware(req) {
  const url = new URL(req.url), cookie = req.headers.get('cookie') || '', tk = await token();
  if (url.pathname === '/house') return Response.redirect(new URL('/house/' + url.search, url.origin), 308);   // relative asset paths need the trailing slash
  const authed = cookie.split(';').some(c => c.trim() === COOKIE + '=' + tk);
  if (url.pathname.replace(/\/$/, '') === '/house/login') {
    if (req.method === 'POST') {
      const form = await req.formData(); const pw = String(form.get('password') || ''), next = String(form.get('next') || '/house/');
      if (await sha(SALT + pw) === HASH) return new Response(null, { status: 303, headers: { Location: next === '/house' ? '/house/' : next.startsWith('/house/') ? next : '/house/', 'Set-Cookie': `${COOKIE}=${tk}; Path=/house; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000` } });
      return page(true, next);
    }
    return page(false, url.searchParams.get('next') || '/house/');
  }
  if (authed) return;
  return page(false, url.pathname + url.search);
}
