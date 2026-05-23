import { Auth0Client } from '@auth0/nextjs-auth0/server'

/**
 * Server-side Auth0 session client (Regular Web Application, nextjs-auth0 v4).
 *
 * Auth routes are served by proxy.ts via auth0.middleware():
 *   /auth/login     → start login (add ?screen_hint=signup for registration)
 *   /auth/logout    → end session
 *   /auth/callback  → OAuth callback
 *   /auth/profile   → current session JSON
 *
 * Required env vars (set in .env.local AND in Vercel Dashboard):
 *   AUTH0_DOMAIN         e.g. dev-abc123.us.auth0.com
 *   AUTH0_CLIENT_ID      from Auth0 Application settings
 *   AUTH0_CLIENT_SECRET  from Auth0 Application settings
 *   AUTH0_SECRET         random 32-byte hex  →  openssl rand -hex 32
 *   APP_BASE_URL         http://localhost:3000 (local) | https://launch.malamalabs.com (prod)
 *
 * The SDK reads all values from env vars automatically.
 * If AUTH0_DOMAIN is absent the middleware throws a clear error on first
 * auth request — no silent routing to a dummy tenant.
 */
export const auth0 = new Auth0Client({
  signInReturnToPath: '/dashboard',
})
