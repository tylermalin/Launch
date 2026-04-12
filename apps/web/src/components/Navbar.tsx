'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Hexagon } from 'lucide-react'

const homeLinks = [
  { href: '#economics', label: 'Economics' },
  { href: '#hardware', label: 'Hardware' },
  { href: '#timeline', label: 'Timeline' },
  { href: '#faq', label: 'FAQ' },
  { href: '#reserve', label: 'Reserve' },
]

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isDocs = pathname.startsWith('/docs')

  return (
    <nav className="w-full bg-[#0A1628]/90 backdrop-blur-md border-b border-gray-800 z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Hexagon className="w-8 h-8 text-emerald-400" />
            <span className="text-xl font-bold tracking-tight text-white">
              Mālama<span className="text-emerald-400">Labs</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 md:gap-4">
            {isHome && homeLinks.map(({ href, label }) => (
              <a key={href} href={href}
                className="hidden md:inline text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium px-2 py-1">
                {label}
              </a>
            ))}

            <Link href="/docs"
              className={`hidden md:inline transition-colors text-sm font-medium px-2 py-1 ${isDocs ? 'text-emerald-400' : 'text-gray-400 hover:text-emerald-400'}`}>
              Docs
            </Link>

            <Link href="/timeline"
              className="hidden md:inline text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium px-2 py-1">
              Timeline
            </Link>

            <Link href="/map"
              className="hidden md:inline text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium px-2 py-1">
              Explorer
            </Link>

            <Link href="/presale"
              className="hidden md:inline text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium px-2 py-1">
              Pre-Sale
            </Link>

            <Link href="/dashboard"
              className="bg-emerald-500 text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg shadow-emerald-400/20 hover:scale-105 transition-transform duration-300 ease-out ml-2">
              Launch App
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
