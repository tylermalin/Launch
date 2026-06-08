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
import { sendEmail, emailLayout, escapeHtml } from '@/lib/email';

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
    label: 'Partner Invite (1st touch)',
    subject: 'Partner Invite: Launching Mālama Labs Genesis Nodes ([COMMISSION]% Commission)',
    body: `Hi [NAME],

We're launching the first decentralized, hardware-signed environmental data network (DePIN), and we want to invite you as a founding launch partner.

Mālama Labs is deploying 200 "Genesis Hex Nodes" across the US. For web3, climate-tech, and hardware audiences it's a rare double-play asset class: a physical environmental sensor kit combined with a Res-4 geographic NFT license (~1,770 km²) that earns 125,000 $MLMA tokens based on data-uptime milestones.

Why partner with us?
• High-yield commissions: you earn [COMMISSION]% on every $2,000 node reservation made through your link.
• Plug-and-play kit: we provide all the copy, graphics, and live-map tracking in your dashboard.
• True scarcity: only 200 slots across 5 US regions — built-in urgency for your audience.

Your unique partner link is ready: [REFERRAL_URL]

Got 5 minutes for a quick alignment call this week?

– The Mālama Labs Team`,
  },
  {
    id: 'follow-up',
    label: 'Follow-up — 1.5× multiplier (2nd touch)',
    subject: 'Re: Mālama Labs Genesis Nodes — the 1.5× multiplier is live',
    body: `Hi [NAME],

Following up on our launch partnership — we're officially live and territories on the hex map are starting to lock down.

Your personalized partner link: [REFERRAL_URL]

What's driving early traction with our network operators:
• Cryptographic truth — sensors sign environmental data directly on-chain, eliminating greenwashing.
• Massive territories — a single Res-4 hex (~1,770 km²) gives operators real regional data dominance.
• Early-adopter edge — the $2,000 Genesis tier includes a 1.5× Year-1 validation token multiplier.

Promotion is entirely plug-and-play in your dashboard toolkit. Want any custom graphics or data angles for your specific audience?

– The Mālama Labs Team`,
  },
  {
    id: 'social-caption',
    label: 'KOL Social / Caption (for partners to post)',
    subject: null,
    body: `Own the environmental data grid before it's mapped out. 🌍🛰️

I'm partnering with @MalamaLabs for the rollout of their Genesis Nodes — the first DePIN network where physical hardware sensors cryptographically sign real-world climate data directly on-chain.

They're releasing exactly 200 city-scale "Hex Node" territories across the US.

What you get as an operator:
📦 A physical environmental hardware sensor kit (air, water, soil)
🗺️ A geographic NFT license for a ~1,770 km² territory
🪙 125,000 $MLMA tokens vested via real-world uptime milestones
⚡ A 1.5× token validation multiplier for Year 1

Real infrastructure. Real data. Real-world rewards.

Secure your hex on the live map before your region is claimed: [REFERRAL_URL]

#MalamaNodes #VerifyTheEarth #DePIN`,
  },
  {
    id: 'newsletter-blurb',
    label: 'KOL Newsletter / Email (for partners to send)',
    subject: 'The infrastructure play bridging crypto and climate tech',
    body: `[NAME] — quick one for you today if you've been tracking the DePIN (Decentralized Physical Infrastructure Networks) space.

Mālama Labs is opening exactly 200 "Hex Node" territories across the United States to build a decentralized, un-gameable environmental data grid.

These are hybrid physical + digital infrastructure assets. For a launch price of $2,000, operators get:
1. A physical hardware sensor kit that cryptographically signs environmental data (water quality, air, soil) directly to the blockchain.
2. A geographic NFT license securing a ~1,770 km² territory.
3. A 125,000 $MLMA token package that vests based on your sensor's real-world uptime milestones.

Only 200 slots across the country — territories are first-come, first-served.

Use my link to view the live tracking map and claim your region before the Genesis tier closes:

👉 Explore the Hex Map & Reserve Your Node: [REFERRAL_URL]`,
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
      // Welcome the partner with their live referral link.
      if (updated.email) {
        const ref = buildReferralUrl(id);
        await sendEmail({
          to: updated.email,
          subject: 'You’re approved — Mālama Labs Partner Program',
          html: emailLayout(`Welcome aboard, ${escapeHtml(updated.displayName)}`, `
            <p>Your Mālama Labs partner account is approved and your referral link is live:</p>
            <p><a href="${ref}">${escapeHtml(ref)}</a></p>
            <p>Sign in to your dashboard for ready-to-post copy across X, LinkedIn, Reddit, Telegram,
            and Discord, plus live tracking of your referrals and commissions:
            <a href="https://launch.malamalabs.com/partners">launch.malamalabs.com/partners</a></p>
            <p>Let’s go win. 🌍</p>`),
        }).catch(() => {});
      }
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
