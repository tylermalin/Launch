/**
 * Amplify — partner "push" toolkit.
 *
 * Generates channel-specific, ready-to-post copy with the partner's referral
 * link injected, plus one-click share-intent URLs where the platform supports
 * prefill. Drives organic distribution across X, Reddit (DePIN subs), LinkedIn,
 * Telegram, and Discord.
 *
 * Admin-editable templates can override these defaults later; this is the
 * built-in baseline.
 */

export type AmplifyChannel = 'x' | 'reddit' | 'linkedin' | 'telegram' | 'discord'

export type AmplifyPost = {
  channel: AmplifyChannel
  label: string
  /** Ready-to-post copy (referral link already embedded). */
  text: string
  /** One-click composer URL prefilled where supported; null = copy & paste. */
  shareUrl: string | null
  /** Reddit: link-post title (separate from URL). */
  title?: string
  /** Reddit: suggested communities to post in. */
  subreddits?: string[]
  /** Short how-to nudge shown under the action. */
  hint: string
}

/** Key DePIN / crypto communities worth posting in. */
export const DEPIN_SUBREDDITS = [
  'depin',
  'CryptoCurrency',
  'helium',
  'Cardano',
  'IoTeX',
] as const

const CAMPAIGN_HASHTAG = '#DePIN'

export function buildAmplifyPosts(opts: {
  referralUrl: string
  displayName?: string
  hashtag?: string
}): AmplifyPost[] {
  const url = opts.referralUrl
  const tag = opts.hashtag ?? CAMPAIGN_HASHTAG
  const enc = encodeURIComponent

  // ── X / Twitter ──────────────────────────────────────────────────────────
  const xText =
    `Mālama Genesis is live — hardware-signed environmental + AI-compute data ` +
    `anchored on @base and @Cardano. 200 Genesis Hex Nodes. Reserve yours 👉 ${url} ${tag} #Mālama`

  // ── Reddit (link post to a DePIN sub) ────────────────────────────────────
  const redditTitle =
    `Mālama Genesis — hardware-signed DePIN for carbon + AI-compute data (200 Genesis Hex Nodes, on Base & Cardano)`

  // ── LinkedIn (professional framing) ──────────────────────────────────────
  const linkedinText =
    `Backing Mālama Labs — the trust anchor for physical-world data. Carbon dMRV (proven) ` +
    `and AI-compute monitoring (scaling) on one hardware-signed architecture, anchored to Base ` +
    `and Cardano. They're releasing 200 Genesis Hex Nodes. Reserve one: ${url}`

  // ── Telegram ─────────────────────────────────────────────────────────────
  const telegramText =
    `Mālama Genesis is live ⚡ 200 hardware-signed Hex Nodes for the physical-data network ` +
    `(carbon dMRV + AI-compute), on Base + Cardano. Reserve yours 👉 ${url}`

  // ── Discord ──────────────────────────────────────────────────────────────
  const discordText =
    `**Mālama Genesis is live** — 200 hardware-signed Hex Nodes for the physical-data network ` +
    `(carbon dMRV + AI-compute), anchored on Base + Cardano.\nReserve yours 👉 ${url}`

  return [
    {
      channel: 'x',
      label: 'X / Twitter',
      text: xText,
      shareUrl: `https://twitter.com/intent/tweet?text=${enc(xText)}`,
      hint: 'Opens the tweet composer prefilled. Post it, then pin or retweet from the Mālama account.',
    },
    {
      channel: 'reddit',
      label: 'Reddit (DePIN subs)',
      text: redditTitle,
      title: redditTitle,
      subreddits: [...DEPIN_SUBREDDITS],
      shareUrl: `https://www.reddit.com/r/${DEPIN_SUBREDDITS[0]}/submit?url=${enc(url)}&title=${enc(redditTitle)}`,
      hint: 'Opens a link post in r/depin. Also share in r/CryptoCurrency, r/helium, r/Cardano, r/IoTeX. Read each sub’s self-promo rules first.',
    },
    {
      channel: 'linkedin',
      label: 'LinkedIn',
      text: linkedinText,
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      hint: 'LinkedIn only prefills the link — copy the text above and paste it as your post commentary.',
    },
    {
      channel: 'telegram',
      label: 'Telegram',
      text: telegramText,
      shareUrl: `https://t.me/share/url?url=${enc(url)}&text=${enc(telegramText)}`,
      hint: 'Opens Telegram’s share sheet. Post in DePIN / crypto groups you’re part of.',
    },
    {
      channel: 'discord',
      label: 'Discord',
      text: discordText,
      shareUrl: null,
      hint: 'Copy and paste into DePIN / crypto Discord servers (Mālama, Base, Cardano communities).',
    },
  ]
}
