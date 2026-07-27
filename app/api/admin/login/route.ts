import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_SESSION_MAX_AGE } from '@/app/admin/auth-constants';
import { createSessionToken, getAdminAuthState, timingSafeEqual } from '@/app/admin/auth-session';

export async function POST(request: Request) {
  const authState = getAdminAuthState();

  if (authState.kind === 'unconfigured') {
    // Fails closed: a production deployment without admin credentials must not
    // fall back to a default that is public in the source.
    console.error(`Admin login is unconfigured; missing: ${authState.missing.join(', ')}`);
    return NextResponse.json({ error: 'Admin access is not configured.' }, { status: 503 });
  }

  let username = '';
  let password = '';
  try {
    const body: unknown = await request.json();
    if (typeof body === 'object' && body !== null) {
      const fields: { username?: unknown; password?: unknown } = body;
      username = typeof fields.username === 'string' ? fields.username : '';
      password = typeof fields.password === 'string' ? fields.password : '';
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Both comparisons always run, so timing never reveals which field was wrong.
  const usernameMatches = timingSafeEqual(username, authState.config.username);
  const passwordMatches = timingSafeEqual(password, authState.config.password);

  if (!usernameMatches || !passwordMatches) {
    return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createSessionToken(authState.config.secret), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}
