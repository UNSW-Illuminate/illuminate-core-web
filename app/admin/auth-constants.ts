// Temporary hardcoded admin auth ("for now"). Swap these for env vars and a
// real session/secret before exposing this anywhere public.
export const ADMIN_COOKIE = 'illuminate_admin';
export const ADMIN_TOKEN = 'illuminate-admin-session';
export const ADMIN_USER = 'admin';
export const ADMIN_PASSWORD = 'admin';
// 8 hours, in seconds.
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;
