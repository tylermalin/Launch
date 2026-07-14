import AddressHexLookup from '@/components/AddressHexLookup'

export const metadata = {
  title: 'Address → Hex Lookup',
  description: 'Find the Res-4 hex cell that contains your address.',
}

export default function LookupPage() {
  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-16">
      <h1 className="text-2xl font-bold text-white">Find your hex</h1>
      <p className="mt-2 text-sm text-gray-400">
        Enter your address to see the Res-4 H3 cell (~1,770 km²) that contains it.
      </p>
      <div className="mt-8">
        <AddressHexLookup />
      </div>
    </main>
  )
}
