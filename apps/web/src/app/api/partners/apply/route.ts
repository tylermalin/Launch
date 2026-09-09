import { salesClosed } from '@/lib/sales-closed'

export const runtime = 'nodejs'

// Genesis hex node sales are paused — the partner/commission program is closed,
// so new applications are no longer accepted.
export async function POST() { return salesClosed() }
