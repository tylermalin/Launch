import { NextResponse } from 'next/server'

// Genesis hex node sales are paused. Every purchase / checkout / reservation /
// payment endpoint returns this instead of processing anything.
export function salesClosed() {
  return NextResponse.json(
    {
      error: 'Genesis hex node sales are not open.',
      registerInterest: '/presale',
    },
    { status: 410 },
  )
}
