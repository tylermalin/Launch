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

  if (loading) return <Shell><p style={{ color: '#666', fontFamily: 'monospace' }}>Loading partner registry…</p></Shell>;
  if (error === 'Forbidden') return <Shell><p style={{ color: '#f87171', fontFamily: 'monospace' }}>Access denied — admin only.</p></Shell>;
  if (error) return <Shell><p style={{ color: '#f87171', fontFamily: 'monospace' }}>Error: {error}</p></Shell>;

  const pending = partners.filter((p) => !p.approved);
  const active  = partners.filter((p) =>  p.approved);

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
