/**
 * Transactional email via Resend (https://resend.com).
 *
 * Uses the REST API directly (no SDK dependency). Configure:
 *   RESEND_API_KEY        — required to actually send (else sends are skipped + logged)
 *   RESEND_FROM           — verified sender, e.g. "Mālama Labs <noreply@malamalabs.com>"
 *   ADMIN_NOTIFY_EMAIL    — where internal notifications go (defaults below)
 *
 * sendEmail never throws — it returns { ok } so callers can fire-and-continue
 * without risking the user-facing request.
 */
const RESEND_ENDPOINT = 'https://api.resend.com/emails'

const FROM = process.env.RESEND_FROM?.trim() || 'Mālama Labs <noreply@malamalabs.com>'

/** Internal recipient for lead / application notifications. */
export const ADMIN_NOTIFY_EMAIL =
  (process.env.ADMIN_NOTIFY_EMAIL || process.env.RESEND_TO || 'hello@malamalabs.com').trim()

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim())
}

export type SendEmailInput = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set — skipping send to', input.to)
    return { ok: false, error: 'not configured' }
  }
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo,
      }),
    })
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string }
    if (!res.ok) {
      console.error('[email] Resend error', res.status, data)
      return { ok: false, error: data?.message || `HTTP ${res.status}` }
    }
    return { ok: true, id: data?.id }
  } catch (e) {
    console.error('[email] send failed', e)
    return { ok: false, error: e instanceof Error ? e.message : 'send failed' }
  }
}

/** Minimal branded HTML wrapper for transactional mail. */
export function emailLayout(heading: string, bodyHtml: string): string {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a">
    <h2 style="font-size:18px;margin:0 0 16px;color:#0a0a0a">${heading}</h2>
    <div style="font-size:14px;line-height:1.6;color:#333">${bodyHtml}</div>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
    <p style="font-size:12px;color:#999">Mālama Labs · the trust anchor for physical-world data</p>
  </div>`
}

const esc = (s: string) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] || c))
export { esc as escapeHtml }
