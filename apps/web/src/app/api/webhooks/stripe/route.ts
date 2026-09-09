import { salesClosed } from '@/lib/sales-closed'

export const runtime = 'nodejs'

export async function POST() { return salesClosed() }
