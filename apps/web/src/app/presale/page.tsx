import type { Metadata } from 'next'
import RegisterInterestForm from '@/components/RegisterInterestForm'

export const metadata: Metadata = {
  title: 'Register interest | Mālama Genesis | Mālama Labs',
  description:
    'Genesis hex node sales are not open. Register non-binding interest and we will notify registered parties in advance of any sale.',
}

export default function PresalePage() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pt-16 pb-32 px-4 relative overflow-x-hidden">
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-malama-accent/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-[800px] h-[800px] bg-malama-accent-dim/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-6xl pt-8">
        <RegisterInterestForm />
      </div>
    </div>
  )
}
