import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, ADMIN_TOKEN } from '@/app/admin/auth-constants';

// Gate everything under /admin behind the session cookie, except the login page
// itself. Authenticated users hitting the login page are sent on to the dashboard.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthed = request.cookies.get(ADMIN_COOKIE)?.value === ADMIN_TOKEN;
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
