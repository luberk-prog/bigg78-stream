import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import YouTubeImage from './YouTubeImage'

export default function TrendingSection({ videos = [], isLoading = false }) {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const scrollRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Maximum 12 trending videos
  const trendingVideos = videos.length > 0 ? videos.slice(0, 12) : []

  // Update scroll state
  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    updateScrollState()
    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollState)
      window.addEventListener('resize', updateScrollState)
      return () => {
        container.removeEventListener('scroll', updateScrollState)
        window.removeEventListener('resize', updateScrollState)
      }
    }
  }, [trendingVideos])

  // Scroll to center a specific card when hovered
  const scrollToCard = (idx) => {
    if (scrollRef.current) {
      const cardWidth = 208 // card width (w-48 = 192px + gap)
      const gap = 12
      const containerWidth = scrollRef.current.clientWidth
      const cardCenter = idx * (cardWidth + gap) + cardWidth / 2
      const scrollLeft = cardCenter - containerWidth / 2

      scrollRef.current.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth',
      })
    }
  }

  const handleMouseEnter = (idx) => {
    setHoveredIndex(idx)
    scrollToCard(idx)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = 220 // card width + gap
      const scrollAmount = cardWidth * 3 // scroll 3 cards at a time
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleWatchNow = (video, e) => {
    e.stopPropagation()
    const videoId = video.id || video.youtubeId
    navigate(`/watch/${videoId}`)
  }

  // Loading skeleton
  if (isLoading || trendingVideos.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h2 className="mb-4 text-lg font-bold text-zinc-300">Trending</h2>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-48 flex-shrink-0 animate-pulse">
              <div className="aspect-[2/3] w-full rounded-md bg-zinc-800" />
              <div className="mt-2 h-3 w-3/4 rounded bg-zinc-800" />
              <div className="mt-1 h-2 w-1/2 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!trendingVideos || trendingVideos.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 -mt-4 sm:-mt-6">
      {/* Section Header */}
      <h2 className="mb-5 text-lg font-bold text-zinc-300">Trending</h2>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative"
      >
        {/* Scrollable Cards Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {trendingVideos.map((video, idx) => {
            const videoId = video.id || video.youtubeId
            const isHovered = hoveredIndex === idx
            const isActive = hoveredIndex !== null

            return (
              <div
                key={videoId || idx}
                className="group relative w-48 flex-shrink-0 cursor-pointer snap-start select-none transition-all duration-300"
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Card */}
                <div
                  className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
                    isHovered
                      ? 'border-zinc-600 shadow-2xl scale-105'
                      : isActive
                      ? 'border-zinc-800/50 shadow-lg opacity-50 blur-sm'
                      : 'border-zinc-800/50 shadow-lg opacity-100'
                  }`}
                >
                  {/* Thumbnail - 2:3 Aspect */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
                    <YouTubeImage
                      videoId={videoId}
                      src={video.thumbnail}
                      alt={video.title}
                      className={`h-full w-full object-cover transition-all duration-300 ${
                        isHovered
                          ? 'scale-100 brightness-110'
                          : isActive
                          ? 'scale-100 brightness-75'
                          : 'scale-100 brightness-100'
                      }`}
                    />

                    {/* Hover Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/30 transition-opacity duration-300 flex items-center justify-center ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-zinc-900 shadow-xl">
                        <svg className="ml-0.5 h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Duration Badge */}
                    {video.duration && (
                      <span
                        className={`absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white transition-opacity ${
                          isHovered ? 'opacity-100' : 'opacity-70'
                        }`}
                      >
                        {video.duration}
                      </span>
                    )}
                  </div>

                  {/* Card Info - Only on Hover */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-3 py-3 transition-all duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-0'
                    }`}
                  >
                    {/* Category */}
                    {video.category && (
                      <p className="text-[10px] font-semibold uppercase text-zinc-400 truncate">
                        {video.category}
                      </p>
                    )}

                    {/* Title */}
                    <h3 className="line-clamp-2 text-xs font-semibold text-white leading-tight mt-1">
                      {video.title}
                    </h3>

                    {/* Watch Button */}
                    <button
                      onClick={(e) => handleWatchNow(video, e)}
                      className="mt-2 w-full rounded bg-red-600/95 py-1 text-[10px] font-bold text-white transition-all hover:bg-red-700"
                    >
                      Watch
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Left Navigation Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll trending left"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:text-white hover:shadow-lg sm:-translate-x-4"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Navigation Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll trending right"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:text-white hover:shadow-lg sm:translate-x-4"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Left Gradient Fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none z-10" />
        )}

        {/* Right Gradient Fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none z-10" />
        )}
      </div>

      {/* Metadata */}
      {trendingVideos.length > 0 && (
        <p className="mt-3 text-xs text-zinc-600">
          {trendingVideos.length} trending videos
        </p>
      )}
    </section>
  )
}
