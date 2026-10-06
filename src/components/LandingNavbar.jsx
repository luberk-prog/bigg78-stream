import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
    <header className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* LEFT: Logo / Wordmark */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-lg tracking-wider shadow-md shadow-red-900/30 group-hover:bg-red-500 transition-colors">
            B
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase font-sans">
            BIGG78 <span className="text-red-500 font-extrabold">STREAM</span>
          </span>
        </Link>

        {/* CENTER: Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden sm:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-900/80 hover:bg-zinc-900 focus:bg-zinc-950 text-white placeholder-zinc-400 text-sm rounded-md border border-zinc-800 focus:border-zinc-500 focus:outline-none transition-colors"
            />
          </div>
        </form>

        {/* RIGHT: Sign In */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/login"
            className="px-5 py-2 rounded-md text-sm font-semibold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 transition-colors shadow-sm"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Mobile Search field */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-900/90 text-white placeholder-zinc-400 text-xs rounded border border-zinc-800 focus:outline-none"
            />
          </div>
        </form>
      </div>
    </header>
  )
}
