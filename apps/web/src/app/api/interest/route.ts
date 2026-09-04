// POST /api/interest — non-binding Genesis interest registration.
// Stores to the shared Upstash DB as hexinterest:{id} + a hexinterests set, and
// sends a plain confirmation email. No purchase, no reservation, no payment.

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

// The canonical shared database (same one malama-admin reads /admin/interest from).
const redis = Redis.fromEnv();

const CONFIRMATION =
  "Recorded. This registration is non-binding and creates no obligation on either side. We will contact you before any sale reopens.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PARTICIPATION = new Set([
  "operate hardware myself",
  "delegate to a local operator",
  "undecided",
]);

function ipHash(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  return crypto.createHash("sha256").update(ip).digest("hex");
}

async function rateLimited(hash: string): Promise<boolean> {
  const key = `ratelimit:hexinterest:${hash}`;
  const n = await redis.incr(key);
  if (n === 1) await redis.expire(key, 3600);
  return n > 10;
}

async function sendConfirmation(to: string): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.warn("[interest] RESEND_API_KEY not set — skipping confirmation to", to);
    return;
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Jeffrey Wise <jeffrey@malamalabs.com>",
      to: [to],
      reply_to: "jeffrey@malamaproject.org",
      subject: "Mālama Labs: interest registered.",
      text: CONFIRMATION,
      html: `<p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">${CONFIRMATION}</p>`,
    }),
  }).catch((e) => console.error("[interest] confirmation send failed", e));
}

export async function POST(req: NextRequest) {
  const hash = ipHash(req);
  try {
    if (await rateLimited(hash)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const org = String(body?.org || "").trim();
    const country = String(body?.country || "").trim();
    const cell = String(body?.cell || "").trim();
    const participation = String(body?.participation || "").trim();
    const notes = String(body?.notes || "").trim().slice(0, 500);

    if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
    if (!EMAIL_RE.test(email))
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    if (!country) return NextResponse.json({ error: "Country is required." }, { status: 400 });
    if (!cell)
      return NextResponse.json({ error: "A cell or region of interest is required." }, { status: 400 });
    if (!PARTICIPATION.has(participation))
      return NextResponse.json({ error: "Select how you would participate." }, { status: 400 });

    const id = crypto.randomUUID();
    const record = {
      id,
      name,
      email,
      org: org || undefined,
      country,
      cells: [cell],
      participation,
      notes: notes || undefined,
      ts: new Date().toISOString(),
      ip_hash: hash,
      source: "launch",
    };

    await redis.set(`hexinterest:${id}`, record);
    await redis.sadd("hexinterests", id);

    await sendConfirmation(email);

    return NextResponse.json({ ok: true, message: CONFIRMATION });
  } catch (e) {
    console.error("[interest] error", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
