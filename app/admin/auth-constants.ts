// Cookie shape for the admin session. No secrets live here, so this module is
// safe to import from anywhere. Credentials and the signing secret are read from
// the environment in auth-session.ts.
export const ADMIN_COOKIE = 'illuminate_admin';

// 8 hours, in seconds.
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;
