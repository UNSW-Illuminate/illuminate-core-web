import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  ADMIN_PASSWORD,
  ADMIN_SESSION_MAX_AGE,
  ADMIN_TOKEN,
  ADMIN_USER,
} from '@/app/admin/auth-constants';

export async function POST(request: Request) {
  let username = '';
  let password = '';
  try {
    const body = (await request.json()) as { username?: unknown; password?: unknown };
    username = typeof body.username === 'string' ? body.username : '';
    password = typeof body.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}
