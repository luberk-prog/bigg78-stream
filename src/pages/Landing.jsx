import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LandingNavbar from '../components/LandingNavbar'
import HeroSlideshow from '../components/HeroSlideshow'
import TrendingSection from '../components/TrendingSection'
import { fetchLandingVideos } from '../lib/youtube'

export default function Landing() {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      setIsLoading(true)
      try {
        const res = await fetchLandingVideos(12)
        if (isMounted) {
          setVideos(res.items || [])
          setIsFallback(res.isFallback)
        }
      } catch (err) {
        console.error('Error fetching landing page videos:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-600 selection:text-white relative overflow-x-hidden">
      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Section with YouTube Slideshow */}
      <HeroSlideshow videos={videos} isLoading={isLoading} />

      {/* Main Content Area */}
      <main className="relative z-10 space-y-12 pb-16">
        {/* Trending YouTube Content Row */}
        <TrendingSection videos={videos} isLoading={isLoading} />

        {/* Feature / Vision Statement Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="space-y-3 p-6 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              <div className="w-10 h-10 rounded bg-red-950/60 border border-red-900/50 flex items-center justify-center text-red-500 font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Find Something Worth Watching
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Explore popular YouTube trailers, videos, and live content with high-definition thumbnail previews and real-time metadata.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              <div className="w-10 h-10 rounded bg-red-950/60 border border-red-900/50 flex items-center justify-center text-red-500 font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Watch It Together
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Connect seamlessly with friends for synchronized viewing, shared reactions, and instant video navigation.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              <div className="w-10 h-10 rounded bg-red-950/60 border border-red-900/50 flex items-center justify-center text-red-500 font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Cinematic & Uninterrupted
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Enjoy a clutter-free, distraction-free environment crafted specifically for high-fidelity media experience.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Minimalist Streaming Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white font-black text-xs">
              B
            </div>
            <span className="text-sm font-bold text-zinc-300 tracking-tight uppercase">
              BIGG78 <span className="text-red-500">STREAM</span>
            </span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/login" className="hover:text-zinc-300 transition-colors">Sign In</Link>
            <Link to="/search" className="hover:text-zinc-300 transition-colors">Browse</Link>
          </div>

          <p className="text-zinc-600">
            © {new Date().getFullYear()} BIGG78 STREAM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
