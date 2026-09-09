import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { MagicProvider } from '@/components/magic/MagicProvider'
import { getEvmRpcUrl } from '@/lib/evm-network'
import LaunchClient from './LaunchClient'

export default function LaunchPage() {
  const publishableKey = process.env.NEXT_PUBLIC_MAGIC_API_KEY?.trim() ?? ''
  // RPC for the active network (mainnet vs sepolia) — single source of truth.
  const rpcUrl = getEvmRpcUrl()

  return (
    <MagicProvider publishableKey={publishableKey} rpcUrl={rpcUrl || undefined}>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-malama-teal" />
          </div>
        }
      >
        <LaunchClient hasMagicPublishableKey={Boolean(publishableKey)} />
      </Suspense>
    </MagicProvider>
  )
}
