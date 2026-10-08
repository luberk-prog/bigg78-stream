import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'HOME', to: '/' },
  { label: 'MOVIES', to: '/search' },
  { label: 'SERIES', to: '/library' },
  { label: 'ROOMS', to: '/dashboard' },
]

export default function LandingNavbar() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px]">
        <div className="flex items-center gap-4 rounded-full border border-white/10 bg-[#0a0a0e]/75 px-3 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-4 lg:px-5">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ef4444] text-lg font-black tracking-tight text-white shadow-[0_10px_30px_rgba(239,68,68,0.45)] transition-transform duration-200 hover:scale-105">
              B
            </div>
            <div className="hidden sm:block">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">Bigg78</div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-white">
                Stream
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex md:flex-1 md:justify-center">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60 transition-all duration-200 hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden flex-1 max-w-md lg:block">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-white/40">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/35 focus:border-white/20 focus:outline-none"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-3 lg:hidden">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-white/40">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/35 focus:border-white/20 focus:outline-none"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  )
}
