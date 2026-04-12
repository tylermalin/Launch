import type { Metadata } from 'next'
import { Inter_Tight, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import SiteFooter from '@/components/SiteFooter'
import { Providers } from '@/components/Providers'
import 'mapbox-gl/dist/mapbox-gl.css'

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mālama Labs | Environmental Data Network',
  description:
    'Cryptographic environmental data network anchored natively to the Base Layer and Cardano economies.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${interTight.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className={`${interTight.className} bg-malama-bg text-malama-ink min-h-screen flex flex-col font-sans antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
