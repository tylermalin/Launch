import { existsSync } from 'fs'
import path from 'path'
import { loadEnvConfig } from '@next/env'

/**
 * Resolve Next app root so .env.local loads when dev is run from monorepo root.
 */
function getWebAppRoot(): string {
  const cwd = process.cwd()
  if (existsSync(path.join(cwd, '.env.local')) || existsSync(path.join(cwd, '.env'))) {
    return cwd
  }
  const nested = path.join(cwd, 'apps', 'web')
  if (existsSync(path.join(nested, '.env.local')) || existsSync(path.join(nested, '.env'))) {
    return nested
  }
  return cwd
}

let envLoaded = false
function ensureEnvFromDisk() {
  if (envLoaded) return
  envLoaded = true
  try {
    loadEnvConfig(getWebAppRoot())
  } catch {
    /* Next also loads env; this is a fallback */
  }
}

/**
 * Stripe secret key — server-only.
 * Use STRIPE_SECRET_KEY (Stripe default) or NEXT_PRIVATE_STRIPE_KEY in apps/web/.env.local
 * Bracket access avoids webpack eliding unknown process.env keys at build time.
 */
export function getStripeSecretKey(): string | undefined {
  ensureEnvFromDisk()
  const e = process.env as Record<string, string | undefined>
  return e['STRIPE_SECRET_KEY'] || e['NEXT_PRIVATE_STRIPE_KEY']
}
