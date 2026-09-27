// Password-protects the published playground (Cloudflare Pages Functions run this before every request).
//
// First visit: the browser shows its own username and password prompt. After a correct login, a signed cookie is
// set for 30 days, shared by every *.<project>.pages.dev address (main and all branches), so people log in once.
// Changing the password logs everyone out.
//
// Credentials are Cloudflare Pages secrets, set for both Production and Preview: SITE_USERNAME and SITE_PASSWORD.
// Local development (npm run dev) doesn't use this file.

const COOKIE = "playground_auth";
const MAX_AGE = 60 * 60 * 24 * 30;
const encoder = new TextEncoder();

async function sign(username, password) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`carbon-playground:${username}`));
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a, b) {
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  return x.byteLength === y.byteLength && crypto.subtle.timingSafeEqual(x, y);
}

function readCookie(request, name) {
  const header = request.headers.get("Cookie") ?? "";
  const match = header.split(/;\s*/).find((part) => part.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : undefined;
}

function readBasicAuth(request) {
  const header = request.headers.get("Authorization") ?? "";
  if (!header.startsWith("Basic ")) return undefined;
  try {
    const decoded = atob(header.slice(6));
    const colon = decoded.indexOf(":");
    return colon < 0 ? undefined : { username: decoded.slice(0, colon), password: decoded.slice(colon + 1) };
  } catch {
    return undefined;
  }
}

// Share the cookie across branch addresses: team-03.carbon-playground.pages.dev -> carbon-playground.pages.dev
function cookieDomain(hostname) {
  const parts = hostname.split(".");
  return hostname.endsWith(".pages.dev") && parts.length >= 3 ? `; Domain=${parts.slice(-3).join(".")}` : "";
}

const askForLogin = () =>
  new Response("Please log in to view the Carbon Playground.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Carbon Playground", charset="UTF-8"', "Cache-Control": "no-store" },
  });

export async function onRequest({ request, env, next }) {
  const { SITE_USERNAME: username, SITE_PASSWORD: password } = env;
  if (!username || !password) {
    return new Response("The site login hasn't been set up yet (SITE_USERNAME and SITE_PASSWORD).", { status: 503 });
  }

  const expected = await sign(username, password);
  const cookie = readCookie(request, COOKIE);
  if (cookie && safeEqual(cookie, expected)) return next();

  const credentials = readBasicAuth(request);
  if (!credentials || !safeEqual(credentials.username, username) || !safeEqual(credentials.password, password)) {
    return askForLogin();
  }

  const response = await next();
  const withCookie = new Response(response.body, response);
  const { hostname } = new URL(request.url);
  withCookie.headers.append(
    "Set-Cookie",
    `${COOKIE}=${expected}; Max-Age=${MAX_AGE}; Path=/${cookieDomain(hostname)}; Secure; HttpOnly; SameSite=Lax`,
  );
  return withCookie;
}
