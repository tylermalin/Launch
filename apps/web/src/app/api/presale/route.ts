import { NextResponse } from 'next/server'
import { forgeHexNFT } from '@/lib/mint'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { evmAddress, cardanoAddress, hexId } = body

    if (!evmAddress || !cardanoAddress || !hexId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // In production, verify the USDC EVM transfer here before minting
    const txHash = await forgeHexNFT(cardanoAddress, hexId);

    return NextResponse.json({ 
      success: true,
      genesisNumber: Math.floor(Math.random() * 200) + 1,
      transactionHash: txHash,
      message: 'Genesis NFT forged accurately!'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    total: 200,
    remaining: 195,
    reserved: 5,
    priceUSDC: 2000,
  })
}
