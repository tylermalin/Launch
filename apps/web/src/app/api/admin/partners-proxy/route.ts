/**
 * /api/admin/partners-proxy
 *
 * Server-side proxy for the KOL admin endpoints. Keeps ADMIN_SECRET
 * off the client. Requires the caller to be authenticated as an admin
 * email (ADMIN_EMAILS env var, comma-separated) via Auth0 or email session.
 *
 * GET  ?action=list            → all partners with stats
 * GET  ?action=get&id=<slug>   → single partner detail
 * POST action=invite           → invite a new partner (email or link)
 * POST action=approve&id=      → approve a pending partner
 * POST action=message&id=      → send approved copy to a partner
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseEmailSessionToken } from '@/lib/email-session';

// ── Admin auth ────────────────────────────────────────────────────────────────

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'tyler@malamaproject.org')
  .split(',')
  .map((e) => e.trim().toLowerCase());

async function getCallerEmail(req: NextRequest): Promise<string | null> {
  // Try Auth0 session first
  try {
    const { auth0 } = await import('@/lib/auth0');
    const session = await auth0.getSession();
    if (session?.user?.email) return (session.user.email as string).toLowerCase();
  } catch { /* no Auth0 */ }

  // Fall back to email session cookie
  const jar = await cookies();
  const raw = jar.get('malama_email_session')?.value;
  if (raw) {
    const parsed = parseEmailSessionToken(raw);
    if (parsed?.email) return parsed.email.toLowerCase();
  }
  return null;
}

function isAdmin(email: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}

// ── KOL API forwarding ────────────────────────────────────────────────────────

const KOL_BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

async function kolFetch(path: string, init?: RequestInit) {
  const secret = process.env.ADMIN_SECRET ?? '';
  const url = `${KOL_BASE}/api/admin/kol${path}`;
  return fetch(url, {
    ...init,
    headers: { ...(init?.headers ?? {}), 'x-admin-secret': secret, 'Content-Type': 'application/json' },
  });
}

// ── Approved copy templates ───────────────────────────────────────────────────

export const APPROVED_COPY_TEMPLATES = [
  {
    id: 'intro-general',
    label: 'General Introduction',
    subject: 'Partnership Opportunity — Mālama Labs Genesis Nodes',
    body: `Hi [NAME],

We're building the world's first hardware-signed environmental data network, and we'd love to have you as a launch partner.

Mālama Labs Genesis Nodes are city-scale hex territories that operators own outright — each comes with a hardware kit, an NFT-HEX geographic licence, and a 125,000 MLMA vesting schedule tied to real-world sensor uptime.

We have 200 launch slots across 5 US regions. Your referral link earns you [COMMISSION]% on every reservation made through it.

Referral link: [REFERRAL_URL]

Happy to jump on a call — let me know.

– Mālama Labs`,
  },
  {
    id: 'follow-up',
    label: 'Follow-up (2nd touch)',
    subject: 'Re: Mālama Labs Genesis Nodes — Quick update',
    body: `Hi [NAME],

Following up on our partnership note — we're now live at launch.malamalabs.com and reservations are open.

Your personalised link: [REFERRAL_URL]

A few things that have resonated with our early operators:
• Hardware-signed data — each node cryptographically signs its environmental readings on-chain
• City-scale territory — Res-4 hex licences (~1,770 km²) are large enough to matter commercially
• Genesis pricing — $2,000 flat, with a 1.5× year-1 validation multiplier

Let me know if you have questions.

– Mālama Labs`,
  },
  {
    id: 'social-caption',
    label: 'Social / Caption Copy',
    subject: null,
    body: `I'm partnering with Mālama Labs — the first network where environmental sensors sign their own data on-chain 🌿

They're selling 200 city-scale "Hex Node" territories across the US right now. Each one comes with hardware, an NFT licence, and 125k MLMA tokens vesting over your first year of operation.

My link for early access → [REFERRAL_URL]`,
  },
  {
    id: 'newsletter-blurb',
    label: 'Newsletter / Email Blurb',
    subject: 'Something interesting in environmental data infrastructure',
    body: `[NAME] — quick one for your audience.

Mālama Labs is opening 200 "Hex Node" territories across the US. These are physical + digital assets: you get a hardware sensor kit AND a geographic NFT licence for a ~1,770 km² territory. The hardware cryptographically signs environmental data on-chain — water quality, air quality, soil conditions.

Launch price: $2,000. 125,000 MLMA tokens vest based on sensor uptime milestones.

Use my link to explore the hex map and reserve: [REFERRAL_URL]`,
  },
] as const;

export type ApprovedCopyTemplate = typeof APPROVED_COPY_TEMPLATES[number];

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const email = await getCallerEmail(req);
  if (!isAdmin(email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const action = req.nextUrl.searchParams.get('action') ?? 'list';
  const id = req.nextUrl.searchParams.get('id');

  if (action === 'list') {
    const res = await kolFetch('');
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  if (action === 'get' && id) {
    const res = await kolFetch(`/${id}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  if (action === 'templates') {
    return NextResponse.json({ templates: APPROVED_COPY_TEMPLATES });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const email = await getCallerEmail(req);
  if (!isAdmin(email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json() as Record<string, unknown>;
  const action = body.action as string;

  if (action === 'invite') {
    // Create a new partner + return their referral link
    const { partnerEmail, displayName, commissionBps = 1000 } = body as {
      partnerEmail?: string;
      displayName: string;
      commissionBps?: number;
    };
    const res = await kolFetch('', {
      method: 'POST',
      body: JSON.stringify({
        displayName,
        email: partnerEmail,
        walletAddress: '0x0000000000000000000000000000000000000000', // placeholder until partner provides
        commissionBps,
        bio: '',
        approved: true, // admin-invited partners are pre-approved
      }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  if (action === 'approve') {
    const { id } = body as { id: string };
    const res = await kolFetch(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ approved: true }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
