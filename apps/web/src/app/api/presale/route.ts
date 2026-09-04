import { NextResponse } from 'next/server'
import { salesClosed } from '@/lib/sales-closed'

export const runtime = 'nodejs'

// Sales are paused. No prices, availability, or reservation counts are exposed.
export async function GET() {
  return NextResponse.json({ open: false })
}

export async function POST() {
  return salesClosed()
}
