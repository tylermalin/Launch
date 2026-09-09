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

const CAMPAIGN_HASHTAG = '#MalamaNodes'

/** Admin-set overrides for the amplify copy (stored in KV, edited from /admin/partners). */
export type AmplifyOverrides = {
  hashtag?: string
  /** Per-channel replacement post text. Empty/missing → use the built-in default. */
  posts?: Partial<Record<AmplifyChannel, string>>
}

export function buildAmplifyPosts(
  opts: { referralUrl: string; displayName?: string; hashtag?: string },
  overrides?: AmplifyOverrides,
): AmplifyPost[] {
  const url = opts.referralUrl
  const ov = overrides?.posts ?? {}
  const tag = overrides?.hashtag ?? opts.hashtag ?? CAMPAIGN_HASHTAG
  const enc = encodeURIComponent
  const pick = (c: AmplifyChannel, def: string) => (ov[c]?.trim() || def)

  // ── X / Twitter (high-energy, scarcity-driven, DePIN asset class) ─────────
  const xText =
    `Big environmental data is broken. @MalamaLabs is fixing it — by letting you own the infrastructure.\n\n` +
    `Only 200 "Hex Node" territories are opening across the US. Each one gives you:\n` +
    `🔋 Real-world hardware sensor kit\n` +
    `🗺️ Geographic NFT license (~1,770 km²)\n` +
    `🪙 125,000 $MLMA tokens (uptime-vested)\n\n` +
    `Real data, on-chain. Lock in your hex before your region is claimed 👉 ${url}\n\n${tag} #VerifyTheEarth #DePIN`

  // ── Reddit (native, utility-focused link-post title) ─────────────────────
  const redditTitle =
    `Own the environmental data grid: Mālama Labs is releasing 200 "Hex Node" hardware + NFT territories to map US air/water/soil on-chain`

  // ── LinkedIn (authoritative dMRV / RWA infrastructure framing) ────────────
  const linkedinText =
    `The future of environmental data infrastructure isn't centralized — it's distributed.\n\n` +
    `I'm supporting Mālama Labs as they launch their Genesis Nodes: a decentralized network of cryptographic ` +
    `hardware sensors mapping real-time soil, water, and air quality directly on-chain.\n\n` +
    `They're opening exactly 200 "Hex Node" territories across the US. Each pairs a physical hardware deployment ` +
    `with a geographic NFT license (~1,770 km²) and a 125,000 $MLMA token uptime incentive.\n\n` +
    `If you track the intersection of DePIN, climate tech, and real-world assets (RWAs), this is a deployment worth watching.\n\n` +
    `Explore the live hex map and secure a territory 👉 ${url}`

  // ── Telegram (short, high-signal alpha) ──────────────────────────────────
  const telegramText =
    `🚨 DePIN + Climate Tech launch 🚨\n\n` +
    `@MalamaLabs is dropping Genesis Nodes to build an on-chain environmental data grid (water, air, soil).\n\n` +
    `• Only 200 US "Hex Node" territories\n` +
    `• $2,000 launch price → physical hardware + an NFT license for a ~1,770 km² territory\n` +
    `• 125,000 $MLMA tokens tied to sensor uptime\n\n` +
    `Real infrastructure yielding real data. Secure your region before it's locked 👉 ${url}`

  // ── Discord (structured to stand out in announce/whitelist channels) ─────
  const discordText =
    `🗺️ **Own a Piece of the On-Chain Environmental Data Grid** 🗺️\n\n` +
    `Partnering with **Mālama Labs** for their Genesis Hex Nodes — physical hardware sensors that ` +
    `cryptographically sign real-world environmental data (soil, air, water) straight to the blockchain.\n\n` +
    `**TL;DR**\n` +
    `• **Scarcity:** exactly 200 "Hex Node" territories across the US\n` +
    `• **The asset:** $2,000 → hardware sensor kit + a geographic NFT license (~1,770 km²)\n` +
    `• **Incentives:** 125,000 $MLMA tokens, vesting on sensor uptime milestones\n\n` +
    `Bridges physical hardware (DePIN) with real-world climate utility.\n\n` +
    `👉 View the live Hex Map & claim your territory: ${url}`

  // Apply admin overrides, then derive share URLs from the FINAL text so a
  // prefilled composer (X, Telegram) reflects edited copy.
  const xFinal = pick('x', xText)
  const redditFinal = pick('reddit', redditTitle)
  const linkedinFinal = pick('linkedin', linkedinText)
  const telegramFinal = pick('telegram', telegramText)
  const discordFinal = pick('discord', discordText)

  return [
    {
      channel: 'x',
      label: 'X / Twitter',
      text: xFinal,
      shareUrl: `https://twitter.com/intent/tweet?text=${enc(xFinal)}`,
      hint: 'Opens the tweet composer prefilled. Post it, then pin or retweet from the Mālama account.',
    },
    {
      channel: 'reddit',
      label: 'Reddit (DePIN subs)',
      text: redditFinal,
      title: redditFinal,
      subreddits: [...DEPIN_SUBREDDITS],
      shareUrl: `https://www.reddit.com/r/${DEPIN_SUBREDDITS[0]}/submit?url=${enc(url)}&title=${enc(redditFinal)}`,
      hint: 'Opens a link post in r/depin. Also share in r/CryptoCurrency, r/helium, r/Cardano, r/IoTeX. Read each sub’s self-promo rules first.',
    },
    {
      channel: 'linkedin',
      label: 'LinkedIn',
      text: linkedinFinal,
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      hint: 'LinkedIn only prefills the link — copy the text above and paste it as your post commentary.',
    },
    {
      channel: 'telegram',
      label: 'Telegram',
      text: telegramFinal,
      shareUrl: `https://t.me/share/url?url=${enc(url)}&text=${enc(telegramFinal)}`,
      hint: 'Opens Telegram’s share sheet. Post in DePIN / crypto groups you’re part of.',
    },
    {
      channel: 'discord',
      label: 'Discord',
      text: discordFinal,
      shareUrl: null,
      hint: 'Copy and paste into DePIN / crypto Discord servers (Mālama, Base, Cardano communities).',
    },
  ]
}
