/**
 * Server-only store for admin-set Amplify overrides (channel copy + hashtag).
 *
 * Kept separate from lib/amplify.ts (which is imported by client components and
 * must not pull in the KV/Redis client). The partner `me` API loads these and
 * passes them to buildAmplifyPosts so admin edits flow to every partner.
 */

import { kv } from '@/lib/kv'
import type { AmplifyOverrides } from '@/lib/amplify'

const KEY = 'kol:amplify:config'
const CHANNELS = ['x', 'reddit', 'linkedin', 'telegram', 'discord'] as const

export async function getAmplifyOverrides(): Promise<AmplifyOverrides> {
  return (await kv.get<AmplifyOverrides>(KEY)) ?? {}
}

/** Validate + persist. Empty strings are dropped so they fall back to defaults. */
export async function setAmplifyOverrides(input: unknown): Promise<AmplifyOverrides> {
  const next = (input ?? {}) as AmplifyOverrides
  const clean: AmplifyOverrides = {}

  if (typeof next.hashtag === 'string' && next.hashtag.trim()) {
    clean.hashtag = next.hashtag.trim().slice(0, 60)
  }

  const posts: Partial<Record<(typeof CHANNELS)[number], string>> = {}
  for (const c of CHANNELS) {
    const v = next.posts?.[c]
    if (typeof v === 'string' && v.trim()) posts[c] = v.trim().slice(0, 2000)
  }
  if (Object.keys(posts).length) clean.posts = posts

  await kv.set(KEY, clean)
  return clean
}
