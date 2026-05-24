import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * Magic Express wallet endpoint.
 *
 * Requires an OIDC provider (Auth0, Firebase, Clerk, etc.) to supply
 * an access token for Magic's server-side wallet creation. Auth0 has
 * been removed from this project — this endpoint is disabled until an
 * OIDC provider is re-configured or Magic OTP replaces the flow.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Magic Express wallet requires an OIDC provider. Auth0 has been removed. Configure an OIDC provider or use Magic Email OTP instead.' },
    { status: 501 },
  )
}
