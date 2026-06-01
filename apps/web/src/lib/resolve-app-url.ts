/**
 * Resolves the canonical app URL for use in server-side redirect URLs (e.g. Stripe
 * success/cancel, launch links, email links).
 *
 * Priority order:
 *  1. NEXT_PUBLIC_APP_URL      — explicit override (set this on your Vercel project)
 *  2. VERCEL_PROJECT_PRODUCTION_URL — Vercel auto-sets on production deploys
 *  3. VERCEL_URL              — Vercel auto-sets on every deploy (preview-specific URL)
 *  4. x-forwarded-host / host — derived from the incoming request (works on any host)
 *  5. http://localhost:3000   — last-resort dev fallback only
 *
 * Never falls back to localhost on a real Vercel deployment because VERCEL_URL
 * is always set there.
 */
export function resolveAppUrl(req?: Request): string {
  const isPreview = process.env.VERCEL_ENV === 'preview'

  if (isPreview) {
    if (process.env.VERCEL_BRANCH_URL) return `https://${process.env.VERCEL_BRANCH_URL}`
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    if (req) {
      const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
      if (host) return `https://${host}`
    }
  }

  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (req) {
    const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
    if (host) return `https://${host}`
  }
  return 'http://localhost:3000'
}
