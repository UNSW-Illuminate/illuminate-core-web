import { ADMIN_SESSION_MAX_AGE } from './auth-constants';

/**
 * Admin session handling, shared by the middleware (Edge runtime) and the login
 * route handler. Uses Web Crypto only, so it runs unchanged in both.
 *
 * The session cookie is `<expiry>.<HMAC-SHA256(expiry)>`. The signature is what
 * makes it a session: without the secret a forged cookie cannot be produced, and
 * the embedded expiry is verified server-side rather than trusted from the
 * cookie's own max-age (which the client controls).
 */

type AdminAuthConfig = {
  username: string;
  password: string;
  secret: string;
};

export type AdminAuthState =
  | { kind: 'configured'; config: AdminAuthConfig }
  | { kind: 'unconfigured'; missing: string[] };

/** Local-development stand-ins. Never used when NODE_ENV is production. */
const DEV_FALLBACK: AdminAuthConfig = {
  username: 'admin',
  password: 'admin',
  secret: 'illuminate-development-secret',
};

const encoder = new TextEncoder();

/**
 * Reads admin credentials from the environment.
 *
 * In production every value must be set explicitly — a missing variable returns
 * `unconfigured` and login is refused, rather than silently falling back to a
 * publicly known password. Development keeps the admin/admin convenience.
 */
export function getAdminAuthState(): AdminAuthState {
  const username = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (process.env.NODE_ENV !== 'production') {
    return {
      kind: 'configured',
      config: {
        username: username ?? DEV_FALLBACK.username,
        password: password ?? DEV_FALLBACK.password,
        secret: secret ?? DEV_FALLBACK.secret,
      },
    };
  }

  const missing = [
    username ? null : 'ADMIN_USER',
    password ? null : 'ADMIN_PASSWORD',
    secret ? null : 'ADMIN_SESSION_SECRET',
  ].filter((name): name is string => name !== null);

  if (missing.length > 0 || !username || !password || !secret) {
    return { kind: 'unconfigured', missing };
  }

  return { kind: 'configured', config: { username, password, secret } };
}

/** Length-independent comparison, so a wrong guess leaks no timing signal. */
export function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  const length = Math.max(aBytes.length, bBytes.length);

  let mismatch = aBytes.length === bBytes.length ? 0 : 1;

  for (let index = 0; index < length; index += 1) {
    mismatch |= (aBytes[index] ?? 0) ^ (bBytes[index] ?? 0);
  }

  return mismatch === 0;
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/** Mints a signed session value that expires ADMIN_SESSION_MAX_AGE from now. */
export async function createSessionToken(secret: string, now = Date.now()): Promise<string> {
  const expiresAt = String(now + ADMIN_SESSION_MAX_AGE * 1000);
  return `${expiresAt}.${await sign(expiresAt, secret)}`;
}

/** True only for an unexpired cookie carrying a signature we produced. */
export async function isValidSessionToken(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): Promise<boolean> {
  if (!token) {
    return false;
  }

  const separator = token.lastIndexOf('.');
  if (separator <= 0) {
    return false;
  }

  const expiresAt = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expiryMs = Number(expiresAt);

  if (!Number.isFinite(expiryMs) || expiryMs <= now) {
    return false;
  }

  return timingSafeEqual(signature, await sign(expiresAt, secret));
}
