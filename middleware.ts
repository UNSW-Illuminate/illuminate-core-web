import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE } from '@/app/admin/auth-constants';
import { getAdminAuthState, isValidSessionToken } from '@/app/admin/auth-session';

// Gate everything under /admin behind a signed session cookie, except the login
// page itself. Authenticated users hitting the login page are sent on to the
// dashboard. An unconfigured deployment (admin env vars missing in production)
// can never authenticate, so every request falls through to the login page.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authState = getAdminAuthState();
  const token = request.cookies.get(ADMIN_COOKIE)?.value;

  const isAuthed =
    authState.kind === 'configured' && (await isValidSessionToken(token, authState.config.secret));
  const isLoginPage = pathname === '/admin/login';

  if (!isAuthed && !isLoginPage) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthed && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
