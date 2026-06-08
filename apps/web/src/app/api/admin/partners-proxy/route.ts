/**
 * /api/admin/partners-proxy
 *
 * Server-side proxy for the KOL admin endpoints. Keeps ADMIN_SECRET
 * off the client. Requires the caller to be authenticated as an admin
 * email (ADMIN_EMAILS env var, comma-separated) via email session.
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
import { listKOLs, getKOLStats, registerKOL, updateKOL, buildReferralUrl, buildVanityUrl } from '@/lib/kol-registry';
import { getAmplifyOverrides, setAmplifyOverrides } from '@/lib/amplify-config';
import { getPayoutsOverview, runPayoutBatch } from '@/lib/payouts-admin';

export const runtime = 'nodejs';

// ── Admin auth ────────────────────────────────────────────────────────────────

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'tyler@malamaproject.org')
  .split(',')
  .map((e) => e.trim().toLowerCase());

async function getCallerEmail(_req: NextRequest): Promise<string | null> {
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

// ── Partner list (direct, no self-fetch) ───────────────────────────────────────

async function listPartnersWithStats() {
  const partners = await listKOLs();
  const stats = await Promise.all(partners.map((p) => getKOLStats(p.id)));
  const response = stats
    .filter(Boolean)
    .map((s) => ({ ...s!, referralUrl: buildReferralUrl(s!.partner.id), vanityUrl: buildVanityUrl(s!.partner.id) }));
  return { partners: response, count: response.length };
}

// ── Approved copy templates ───────────────────────────────────────────────────

// Not exported — Next.js route files only allow HTTP-verb exports.
// The admin page fetches templates via ?action=templates (JSON API).
const APPROVED_COPY_TEMPLATES = [
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

type ApprovedCopyTemplate = typeof APPROVED_COPY_TEMPLATES[number];

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32);
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const email = await getCallerEmail(req);
  if (!isAdmin(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const action = req.nextUrl.searchParams.get('action') ?? 'list';
  const id = req.nextUrl.searchParams.get('id');

  try {
    if (action === 'list') return NextResponse.json(await listPartnersWithStats());
    if (action === 'get' && id) {
      const stats = await getKOLStats(id);
      if (!stats) return NextResponse.json({ error: 'KOL not found' }, { status: 404 });
      return NextResponse.json({ ...stats, referralUrl: buildReferralUrl(id), vanityUrl: buildVanityUrl(id) });
    }
    if (action === 'templates') return NextResponse.json({ templates: APPROVED_COPY_TEMPLATES });
    if (action === 'payouts') return NextResponse.json(await getPayoutsOverview());
    if (action === 'amplify-config') return NextResponse.json({ config: await getAmplifyOverrides() });
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    console.error('[partners-proxy GET]', action, e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Server error' }, { status: 500 });
  }
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const email = await getCallerEmail(req);
  if (!isAdmin(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const action = body.action as string;

  try {
    if (action === 'invite') {
      const { partnerEmail, displayName, commissionBps = 1000 } = body as { partnerEmail?: string; displayName?: string; commissionBps?: number };
      if (!displayName) return NextResponse.json({ error: 'displayName required' }, { status: 400 });
      const id = slugify(String(displayName)) || `partner-${Date.now().toString(36)}`;
      const partner = await registerKOL({
        id,
        displayName: String(displayName).trim(),
        email: partnerEmail ? String(partnerEmail).toLowerCase() : undefined,
        walletAddress: '0x0000000000000000000000000000000000000000', // placeholder until partner provides
        commissionBps: typeof commissionBps === 'number' ? commissionBps : 1000,
        bio: '',
        approved: true, // admin-invited partners are pre-approved
      });
      return NextResponse.json({ partner, referralUrl: buildReferralUrl(partner.id), vanityUrl: buildVanityUrl(partner.id) });
    }

    if (action === 'approve') {
      const { id } = body as { id: string };
      const updated = await updateKOL(id, { approved: true });
      if (!updated) return NextResponse.json({ error: 'KOL not found' }, { status: 404 });
      return NextResponse.json({ partner: updated });
    }

    if (action === 'run-payouts') {
      const { commissionIds, kolId } = body as { commissionIds?: string[]; kolId?: string };
      const r = await runPayoutBatch({ approvedBy: email ?? 'admin', commissionIds, kolId });
      return NextResponse.json(r.body, { status: r.status });
    }

    if (action === 'set-amplify') {
      const { config } = body as { config?: unknown };
      const saved = await setAmplifyOverrides(config ?? {});
      return NextResponse.json({ ok: true, config: saved });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    console.error('[partners-proxy POST]', action, e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Server error' }, { status: 500 });
  }
}
