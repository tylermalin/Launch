'use client';

/**
 * /admin/partners — Mālama Labs Partner Management
 *
 * Accessible only to admin emails (ADMIN_EMAILS env var).
 * Uses /api/admin/partners-proxy to keep ADMIN_SECRET server-side.
 *
 * Features:
 *  • View all KOL partners with live stats (clicks, conversions, earned)
 *  • Approve pending applications
 *  • Invite new partners via email or shareable link
 *  • Copy approved outreach templates to clipboard
 */

import { useEffect, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface KOLPartner {
  id: string;
  displayName: string;
  email?: string;
  twitterHandle?: string;
  commissionBps: number;
  approved: boolean;
  createdAt: string;
}

interface KOLStats {
  clicks: number;
  conversions: number;
  totalEarned: number;
  pendingEarned: number;
  paidEarned: number;
}

interface PartnerWithStats extends KOLPartner {
  stats?: KOLStats;
  referralUrls?: { base: string; cardano: string; direct: string };
}

interface CopyTemplate {
  id: string;
  label: string;
  subject: string | null;
  body: string;
}

interface PayoutGroup {
  kolId: string;
  displayName: string;
  walletAddress: string | null;
  walletValid: boolean;
  walletReason?: string;
  commissionCount: number;
  totalUsd: number;
}

interface PayoutsData {
  config: { network: string; dryRun: boolean; maxBatchUsd: number; hasWallet: boolean };
  hotWallet: { address: string; usdc: number; eth: string } | null;
  totalPendingUsd: number;
  pendingCount: number;
  groups: PayoutGroup[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://launch.malamalabs.com';

function referralUrl(kolId: string) {
  return `${APP_URL}/ref/${kolId}`;
}

function commissionLabel(bps: number) {
  return `${(bps / 100).toFixed(0)}%`;
}

function statusBadge(approved: boolean) {
  return approved
    ? { label: 'Active', bg: '#0a2a0a', color: '#c4f061', border: '#2a4a2a' }
    : { label: 'Pending', bg: '#2a1a00', color: '#f0a031', border: '#4a3a00' };
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerWithStats[]>([]);
  const [templates, setTemplates] = useState<CopyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<PartnerWithStats | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CopyTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [payouts, setPayouts] = useState<PayoutsData | null>(null);
  const [payoutBusy, setPayoutBusy] = useState<string | null>(null);
  const [payoutMsg, setPayoutMsg] = useState<string | null>(null);

  const [amplify, setAmplify] = useState<{ hashtag?: string; posts?: Record<string, string> }>({});
  const [amplifySaving, setAmplifySaving] = useState(false);
  const [amplifyMsg, setAmplifyMsg] = useState<string | null>(null);

  const loadPayouts = () =>
    fetch('/api/admin/partners-proxy?action=payouts')
      .then((r) => r.json())
      .then((d) => { if (!d.error) setPayouts(d as PayoutsData); })
      .catch(() => {});

  const loadAmplify = () =>
    fetch('/api/admin/partners-proxy?action=amplify-config')
      .then((r) => r.json())
      .then((d) => { if (!d.error) setAmplify(d.config ?? {}); })
      .catch(() => {});

  const AMPLIFY_CHANNELS: { key: string; label: string; placeholder: string }[] = [
    { key: 'x', label: 'X / Twitter', placeholder: 'Tweet copy — include [REFERRAL_URL] via the auto-injected link' },
    { key: 'reddit', label: 'Reddit (link-post title)', placeholder: 'Reddit post title' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'LinkedIn post commentary' },
    { key: 'telegram', label: 'Telegram', placeholder: 'Telegram message' },
    { key: 'discord', label: 'Discord', placeholder: 'Discord message' },
  ];

  const setAmplifyPost = (key: string, val: string) =>
    setAmplify((a) => ({ ...a, posts: { ...(a.posts ?? {}), [key]: val } }));

  const saveAmplify = async () => {
    setAmplifySaving(true);
    setAmplifyMsg(null);
    try {
      const res = await fetch('/api/admin/partners-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set-amplify', config: amplify }),
      });
      const data = await res.json();
      if (!res.ok) setAmplifyMsg(`✕ ${data.error ?? 'Save failed'}`);
      else { setAmplify(data.config ?? {}); setAmplifyMsg('Saved — every partner now sees this copy.'); }
    } catch (e) {
      setAmplifyMsg(`✕ ${String(e)}`);
    } finally {
      setAmplifySaving(false);
    }
  };

  // ── Load data ──
  useEffect(() => {
    Promise.all([
      fetch('/api/admin/partners-proxy?action=list').then((r) => r.json()),
      fetch('/api/admin/partners-proxy?action=templates').then((r) => r.json()),
    ])
      .then(([partnerData, templateData]) => {
        if (partnerData.error) throw new Error(partnerData.error);
        setPartners((partnerData.partners ?? partnerData.kols ?? []) as PartnerWithStats[]);
        setTemplates((templateData.templates ?? []) as CopyTemplate[]);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
    loadPayouts();
    loadAmplify();
  }, []);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const approve = async (id: string) => {
    const res = await fetch('/api/admin/partners-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve', id }),
    });
    if (res.ok) {
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, approved: true } : p))
      );
    }
  };

  const runPayout = async (group?: PayoutGroup) => {
    if (!payouts) return;
    const dry = payouts.config.dryRun;
    const what = group
      ? `$${group.totalUsd} to ${group.displayName}`
      : `all pending ($${payouts.totalPendingUsd})`;
    if (!window.confirm(`${dry ? '[DRY RUN] ' : '⚠️ LIVE — '}Send ${what} in USDC on ${payouts.config.network}?`)) return;
    setPayoutBusy(group?.kolId ?? 'all');
    setPayoutMsg(null);
    try {
      const res = await fetch('/api/admin/partners-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run-payouts', ...(group ? { kolId: group.kolId } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPayoutMsg(`✕ ${data.error ?? 'Payout failed'}`);
      } else {
        setPayoutMsg(
          `${data.dryRun ? '[DRY RUN] ' : ''}Paid ${data.paidCount} · failed ${data.failedCount} · skipped ${data.skippedCount} · $${data.paidUsd}`
        );
        await loadPayouts();
        fetch('/api/admin/partners-proxy?action=list')
          .then((r) => r.json())
          .then((d) => { if (!d.error) setPartners((d.partners ?? d.kols ?? []) as PartnerWithStats[]); })
          .catch(() => {});
      }
    } catch (e) {
      setPayoutMsg(`✕ ${String(e)}`);
    } finally {
      setPayoutBusy(null);
    }
  };

  if (loading) return <Shell><p style={{ color: '#666', fontFamily: 'monospace' }}>Loading partner registry…</p></Shell>;
  if (error === 'Forbidden') return <Shell><p style={{ color: '#f87171', fontFamily: 'monospace' }}>Access denied — admin only.</p></Shell>;
  if (error) return <Shell><p style={{ color: '#f87171', fontFamily: 'monospace' }}>Error: {error}</p></Shell>;

  const pending = partners.filter((p) => !p.approved);
  const active  = partners.filter((p) =>  p.approved);
  const totals = partners.reduce(
    (acc, p) => ({
      clicks: acc.clicks + (p.stats?.clicks ?? 0),
      conversions: acc.conversions + (p.stats?.conversions ?? 0),
      earned: acc.earned + (p.stats?.totalEarned ?? 0),
    }),
    { clicks: 0, conversions: 0, earned: 0 },
  );

  return (
    <Shell>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-fraunces, serif)', fontSize: 28, color: '#e8e8e8', margin: 0 }}>
            Partner Registry
          </h1>
          <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0' }}>
            {active.length} active · {pending.length} pending · {partners.length} total
          </p>
        </div>
        <button onClick={() => setShowInvite(true)} style={styles.ctaBtn}>
          + Invite Partner
        </button>
      </div>

      {/* ── Activity overview ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Partners', value: String(partners.length) },
          { label: 'Active', value: String(active.length) },
          { label: 'Total clicks', value: totals.clicks.toLocaleString() },
          { label: 'Conversions', value: totals.conversions.toLocaleString() },
          { label: 'Commissions', value: `$${totals.earned.toFixed(0)}` },
        ].map((s) => (
          <div key={s.label} style={{ background: '#141414', border: '1px solid #222', borderRadius: 8, padding: '12px 14px' }}>
            <p style={{ color: '#666', fontSize: 11, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' }}>{s.label}</p>
            <p style={{ color: '#e8e8e8', fontSize: 22, fontWeight: 800, margin: '4px 0 0' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Payouts ── */}
      {payouts && (
        <Section title="Partner Payouts · USDC on Base">
          <div
            style={{
              display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
              background: payouts.config.dryRun ? '#15240f' : '#2a1206',
              border: `1px solid ${payouts.config.dryRun ? '#2a4a2a' : '#5a2a10'}`,
              borderRadius: 6, padding: '10px 14px', marginBottom: 14,
              fontFamily: 'monospace', fontSize: 12,
            }}
          >
            <span style={{ color: payouts.config.dryRun ? '#c4f061' : '#f0a031', fontWeight: 700 }}>
              {payouts.config.dryRun ? 'DRY RUN' : '● LIVE'}
            </span>
            <span style={{ color: '#888' }}>network: {payouts.config.network}</span>
            <span style={{ color: '#888' }}>cap: ${payouts.config.maxBatchUsd}/batch</span>
            <span style={{ color: '#888' }}>
              wallet: {payouts.hotWallet
                ? `${payouts.hotWallet.address.slice(0, 6)}…${payouts.hotWallet.address.slice(-4)} · ${payouts.hotWallet.usdc} USDC · ${Number(payouts.hotWallet.eth).toFixed(4)} ETH`
                : (payouts.config.hasWallet ? 'configured' : '⚠ not configured')}
            </span>
          </div>

          {payoutMsg && (
            <p style={{ color: payoutMsg.startsWith('✕') ? '#f87171' : '#c4f061', fontFamily: 'monospace', fontSize: 13, margin: '0 0 12px' }}>
              {payoutMsg}
            </p>
          )}

          <p style={{ color: '#888', fontSize: 13, margin: '0 0 12px' }}>
            {payouts.pendingCount} pending commission{payouts.pendingCount === 1 ? '' : 's'} · ${payouts.totalPendingUsd} total
          </p>

          {payouts.groups.length === 0 && (
            <p style={{ color: '#555', fontFamily: 'monospace', fontSize: 13 }}>No pending commissions to pay.</p>
          )}

          {payouts.groups.map((g) => (
            <div key={g.kolId} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              background: '#141414', border: '1px solid #222', borderRadius: 6, padding: '10px 14px', marginBottom: 8,
            }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#e8e8e8', fontSize: 14, margin: 0, fontWeight: 600 }}>{g.displayName}</p>
                <p style={{ color: '#666', fontSize: 11, fontFamily: 'monospace', margin: '2px 0 0' }}>
                  {g.commissionCount} sale{g.commissionCount === 1 ? '' : 's'} ·{' '}
                  {g.walletValid
                    ? `${g.walletAddress!.slice(0, 6)}…${g.walletAddress!.slice(-4)}`
                    : <span style={{ color: '#f0a031' }}>⚠ {g.walletReason}</span>}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#c4f061', fontFamily: 'monospace', fontSize: 14 }}>${g.totalUsd}</span>
                <button
                  onClick={() => runPayout(g)}
                  disabled={!g.walletValid || payoutBusy !== null}
                  style={{ ...styles.chipBtn, opacity: (!g.walletValid || payoutBusy !== null) ? 0.4 : 1, cursor: (!g.walletValid || payoutBusy !== null) ? 'not-allowed' : 'pointer' }}
                >
                  {payoutBusy === g.kolId ? 'Paying…' : 'Approve & Pay'}
                </button>
              </div>
            </div>
          ))}

          {payouts.groups.some((g) => g.walletValid) && (
            <button
              onClick={() => runPayout()}
              disabled={payoutBusy !== null}
              style={{ ...styles.ctaBtn, marginTop: 10, opacity: payoutBusy !== null ? 0.4 : 1 }}
            >
              {payoutBusy === 'all' ? 'Paying all…' : `Pay all valid (${payouts.config.dryRun ? 'dry run' : 'LIVE'})`}
            </button>
          )}
        </Section>
      )}

      {/* ── Pending approvals ── */}
      {pending.length > 0 && (
        <Section title={`Pending Approval (${pending.length})`}>
          {pending.map((p) => (
            <PartnerRow
              key={p.id}
              partner={p}
              onSelect={() => setSelectedPartner(p)}
              onApprove={() => approve(p.id)}
              onCopyLink={() => copy(referralUrl(p.id), `link-${p.id}`)}
              copied={copiedId === `link-${p.id}`}
            />
          ))}
        </Section>
      )}

      {/* ── Active partners ── */}
      <Section title={`Active Partners (${active.length})`}>
        {active.length === 0 && (
          <p style={{ color: '#555', fontFamily: 'monospace', fontSize: 13 }}>
            No active partners yet. Invite one above.
          </p>
        )}
        {active.map((p) => (
          <PartnerRow
            key={p.id}
            partner={p}
            onSelect={() => setSelectedPartner(p)}
            onCopyLink={() => copy(referralUrl(p.id), `link-${p.id}`)}
            copied={copiedId === `link-${p.id}`}
          />
        ))}
      </Section>

      {/* ── Approved copy templates ── */}
      {/* ── Amplify messaging editor ── */}
      <Section title="Amplify Messaging — partner push copy">
        <p style={{ color: '#666', fontSize: 13, margin: '0 0 14px' }}>
          Edit the ready-to-post copy partners see in their dashboard&apos;s Amplify toolkit. Leave a field blank to use
          the built-in default. Each partner&apos;s referral link is appended automatically.
        </p>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', color: '#888', fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Campaign hashtag
          </label>
          <input
            value={amplify.hashtag ?? ''}
            onChange={(e) => setAmplify((a) => ({ ...a, hashtag: e.target.value }))}
            placeholder="#DePIN"
            style={{ width: '100%', maxWidth: 240, background: '#0d0d0d', border: '1px solid #222', borderRadius: 6, padding: '8px 10px', color: '#e8e8e8', fontSize: 13 }}
          />
        </div>
        {AMPLIFY_CHANNELS.map((ch) => (
          <div key={ch.key} style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', color: '#c4f061', fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              {ch.label}
            </label>
            <textarea
              rows={ch.key === 'x' || ch.key === 'reddit' ? 2 : 3}
              value={amplify.posts?.[ch.key] ?? ''}
              onChange={(e) => setAmplifyPost(ch.key, e.target.value)}
              placeholder={ch.placeholder}
              style={{ width: '100%', background: '#0d0d0d', border: '1px solid #222', borderRadius: 6, padding: '8px 10px', color: '#e8e8e8', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
          <button onClick={saveAmplify} disabled={amplifySaving} style={{ ...styles.ctaBtn, opacity: amplifySaving ? 0.5 : 1 }}>
            {amplifySaving ? 'Saving…' : 'Save messaging'}
          </button>
          {amplifyMsg && (
            <span style={{ color: amplifyMsg.startsWith('✕') ? '#f87171' : '#c4f061', fontSize: 13, fontFamily: 'monospace' }}>
              {amplifyMsg}
            </span>
          )}
        </div>
      </Section>

      <Section title="Approved Outreach Templates">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTemplate(t)}
              style={{
                background: '#141414',
                border: `1px solid ${selectedTemplate?.id === t.id ? '#c4f061' : '#222'}`,
                borderRadius: 6,
                padding: '12px 14px',
                cursor: 'pointer',
              }}
            >
              <p style={{ color: '#e8e8e8', fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>{t.label}</p>
              {t.subject && <p style={{ color: '#666', fontSize: 11, fontFamily: 'monospace', margin: 0 }}>Subj: {t.subject}</p>}
            </div>
          ))}
        </div>

        {selectedTemplate && (
          <div style={{ marginTop: 16, background: '#141414', border: '1px solid #2a2a2a', borderRadius: 6, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <p style={{ color: '#c4f061', fontSize: 12, fontFamily: 'monospace', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {selectedTemplate.label}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => copy(
                    `${selectedTemplate.subject ? `Subject: ${selectedTemplate.subject}\n\n` : ''}${selectedTemplate.body}`,
                    `tpl-${selectedTemplate.id}`
                  )}
                  style={styles.chipBtn}
                >
                  {copiedId === `tpl-${selectedTemplate.id}` ? '✓ Copied' : 'Copy Text'}
                </button>
                <button onClick={() => setSelectedTemplate(null)} style={styles.chipBtn}>✕</button>
              </div>
            </div>
            {selectedTemplate.subject && (
              <p style={{ color: '#888', fontSize: 12, fontFamily: 'monospace', marginBottom: 8 }}>
                <strong style={{ color: '#aaa' }}>Subject:</strong> {selectedTemplate.subject}
              </p>
            )}
            <pre style={{ color: '#c8c8c8', fontSize: 12, fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>
              {selectedTemplate.body}
            </pre>
            <p style={{ color: '#555', fontSize: 11, marginTop: 12, fontFamily: 'monospace' }}>
              Replace [NAME], [REFERRAL_URL], [COMMISSION] with partner-specific values.
            </p>
          </div>
        )}
      </Section>

      {/* ── Partner detail drawer ── */}
      {selectedPartner && (
        <PartnerDrawer
          partner={selectedPartner}
          templates={templates}
          onClose={() => setSelectedPartner(null)}
          onCopy={copy}
          copiedId={copiedId}
        />
      )}

      {/* ── Invite modal ── */}
      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onCreated={(p) => { setPartners((prev) => [p, ...prev]); setShowInvite(false); }}
        />
      )}
    </Shell>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '40px 32px', maxWidth: 1100, margin: '0 auto' }}>
      <nav style={{ marginBottom: 32 }}>
        <a href="/dashboard" style={{ color: '#555', fontSize: 12, fontFamily: 'monospace', textDecoration: 'none' }}>
          ← Back to Dashboard
        </a>
        <span style={{ color: '#333', marginLeft: 12 }}>/</span>
        <span style={{ color: '#888', marginLeft: 12, fontSize: 12, fontFamily: 'monospace' }}>admin / partners</span>
      </nav>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'monospace', fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

// ── Partner Row ───────────────────────────────────────────────────────────────

function PartnerRow({
  partner, onSelect, onApprove, onCopyLink, copied,
}: {
  partner: PartnerWithStats;
  onSelect: () => void;
  onApprove?: () => void;
  onCopyLink: () => void;
  copied: boolean;
}) {
  const badge = statusBadge(partner.approved);
  const stats = partner.stats;
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, marginBottom: 8, cursor: 'pointer' }}
      onClick={onSelect}
    >
      {/* Name + contact */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#e8e8e8', fontSize: 14, fontWeight: 600, margin: 0 }}>{partner.displayName}</p>
        <p style={{ color: '#666', fontSize: 12, fontFamily: 'monospace', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {partner.email ?? partner.twitterHandle ?? partner.id}
        </p>
      </div>
      {/* Status */}
      <span style={{ padding: '3px 10px', borderRadius: 4, fontSize: 11, fontFamily: 'monospace', background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
        {badge.label}
      </span>
      {/* Commission */}
      <span style={{ color: '#c4f061', fontFamily: 'monospace', fontSize: 13, minWidth: 36, textAlign: 'right' }}>
        {commissionLabel(partner.commissionBps)}
      </span>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, color: '#555', fontFamily: 'monospace', fontSize: 12 }}>
        <span>{stats?.clicks ?? 0} clicks</span>
        <span>{stats?.conversions ?? 0} conv.</span>
        <span style={{ color: '#c4f061' }}>${(stats?.totalEarned ?? 0).toFixed(2)}</span>
      </div>
      {/* Actions */}
      <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onCopyLink} style={styles.chipBtn}>
          {copied ? '✓' : '⎘ Link'}
        </button>
        {onApprove && (
          <button onClick={onApprove} style={{ ...styles.chipBtn, background: '#0a2a0a', color: '#c4f061', borderColor: '#2a4a2a' }}>
            Approve
          </button>
        )}
      </div>
    </div>
  );
}

// ── Partner Drawer ────────────────────────────────────────────────────────────

function PartnerDrawer({
  partner, templates, onClose, onCopy, copiedId,
}: {
  partner: PartnerWithStats;
  templates: CopyTemplate[];
  onClose: () => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}) {
  const [selectedTpl, setSelectedTpl] = useState<CopyTemplate | null>(null);
  const url = referralUrl(partner.id);

  const fillTemplate = (tpl: CopyTemplate) =>
    tpl.body
      .replace(/\[NAME\]/g, partner.displayName)
      .replace(/\[REFERRAL_URL\]/g, url)
      .replace(/\[COMMISSION\]/g, commissionLabel(partner.commissionBps));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}
      onClick={onClose}
    >
      <div
        style={{ width: 480, height: '100%', background: '#0f0f0f', borderLeft: '1px solid #1f1f1f', overflowY: 'auto', padding: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-fraunces, serif)', fontSize: 22, color: '#e8e8e8', margin: 0 }}>{partner.displayName}</h2>
            {partner.email && <p style={{ color: '#666', fontSize: 13, margin: '4px 0 0' }}>{partner.email}</p>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Referral link */}
        <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 6, padding: '12px 14px', marginBottom: 20 }}>
          <p style={{ color: '#555', fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Referral Link</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <code style={{ flex: 1, color: '#c4f061', fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all' }}>{url}</code>
            <button onClick={() => onCopy(url, `drawer-link-${partner.id}`)} style={styles.chipBtn}>
              {copiedId === `drawer-link-${partner.id}` ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Clicks',       value: partner.stats?.clicks ?? 0 },
            { label: 'Conversions',  value: partner.stats?.conversions ?? 0 },
            { label: 'Total Earned', value: `$${(partner.stats?.totalEarned ?? 0).toFixed(2)}` },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#141414', border: '1px solid #1a1a1a', borderRadius: 6, padding: '10px 12px' }}>
              <p style={{ color: '#555', fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', margin: '0 0 4px' }}>{label}</p>
              <p style={{ color: '#e8e8e8', fontSize: 18, fontWeight: 600, fontFamily: 'monospace', margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Message / copy composer */}
        <p style={{ color: '#555', fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Outreach Templates
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTpl(selectedTpl?.id === t.id ? null : t)}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                background: selectedTpl?.id === t.id ? '#1a2a0a' : '#141414',
                border: `1px solid ${selectedTpl?.id === t.id ? '#2a4a2a' : '#222'}`,
                borderRadius: 6,
                color: '#c8c8c8',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {selectedTpl && (
          <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 6, padding: 16 }}>
            {selectedTpl.subject && (
              <p style={{ color: '#888', fontSize: 12, fontFamily: 'monospace', marginBottom: 10 }}>
                <strong>Subject:</strong> {selectedTpl.subject.replace('[NAME]', partner.displayName)}
              </p>
            )}
            <pre style={{ color: '#c8c8c8', fontSize: 12, whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: '0 0 12px' }}>
              {fillTemplate(selectedTpl)}
            </pre>
            <button
              onClick={() => onCopy(
                `${selectedTpl.subject ? `Subject: ${selectedTpl.subject.replace('[NAME]', partner.displayName)}\n\n` : ''}${fillTemplate(selectedTpl)}`,
                `composed-${partner.id}-${selectedTpl.id}`
              )}
              style={styles.ctaBtn}
            >
              {copiedId === `composed-${partner.id}-${selectedTpl.id}` ? '✓ Copied to clipboard' : 'Copy personalised message'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Invite Modal ──────────────────────────────────────────────────────────────

function InviteModal({ onClose, onCreated }: { onClose: () => void; onCreated: (p: PartnerWithStats) => void }) {
  const [form, setForm] = useState({ displayName: '', partnerEmail: '', commissionBps: 1000 });
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/partners-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'invite', ...form }),
      });
      const data = await res.json() as { partner?: PartnerWithStats; kol?: PartnerWithStats; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Failed to create partner');
      const partner = data.partner ?? data.kol!;
      setGeneratedLink(referralUrl(partner.id));
      onCreated(partner);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: 32, width: 440 }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'var(--font-fraunces, serif)', fontSize: 22, color: '#e8e8e8', margin: '0 0 24px' }}>
          Invite a Partner
        </h2>

        {generatedLink ? (
          <div>
            <p style={{ color: '#c4f061', fontSize: 14, marginBottom: 12 }}>Partner created ✓</p>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>Referral link:</p>
            <code style={{ display: 'block', background: '#1a1a1a', padding: '10px 12px', borderRadius: 4, color: '#c4f061', fontSize: 13, wordBreak: 'break-all', marginBottom: 16 }}>
              {generatedLink}
            </code>
            <button onClick={() => navigator.clipboard.writeText(generatedLink)} style={styles.ctaBtn}>
              Copy Link
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <Label>Display Name *</Label>
            <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              required style={styles.input} placeholder="e.g. Jane Smith" />

            <Label>Partner Email (optional)</Label>
            <input value={form.partnerEmail} onChange={(e) => setForm({ ...form, partnerEmail: e.target.value })}
              type="email" style={styles.input} placeholder="partner@example.com" />

            <Label>Commission</Label>
            <select
              value={form.commissionBps}
              onChange={(e) => setForm({ ...form, commissionBps: Number(e.target.value) })}
              style={styles.input}
            >
              <option value={500}>5%</option>
              <option value={1000}>10%</option>
              <option value={1500}>15%</option>
              <option value={2000}>20%</option>
            </select>

            {error && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" disabled={loading} style={styles.ctaBtn}>
                {loading ? 'Creating…' : 'Create & Get Link'}
              </button>
              <button type="button" onClick={onClose} style={styles.ghostBtn}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ color: '#888', fontSize: 12, fontFamily: 'monospace', margin: '0 0 6px' }}>{children}</p>;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  ctaBtn: {
    padding: '10px 20px',
    background: '#c4f061',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: 4,
    fontSize: 13,
    fontWeight: 700,
    fontFamily: 'monospace',
    cursor: 'pointer',
    letterSpacing: '0.04em',
  } as React.CSSProperties,

  chipBtn: {
    padding: '5px 12px',
    background: '#1a1a1a',
    color: '#c8c8c8',
    border: '1px solid #2a2a2a',
    borderRadius: 4,
    fontSize: 11,
    fontFamily: 'monospace',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,

  ghostBtn: {
    padding: '10px 20px',
    background: 'transparent',
    color: '#888',
    border: '1px solid #2a2a2a',
    borderRadius: 4,
    fontSize: 13,
    fontFamily: 'monospace',
    cursor: 'pointer',
  } as React.CSSProperties,

  input: {
    display: 'block',
    width: '100%',
    marginBottom: 16,
    padding: '10px 12px',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 4,
    color: '#e8e8e8',
    fontSize: 14,
    fontFamily: 'monospace',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,
};
