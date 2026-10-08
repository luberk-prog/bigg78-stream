import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import YouTubeImage from './YouTubeImage'

export default function TrendingSection({ videos = [], isLoading = false }) {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Use first 6 videos for the trending carousel
  const trendingVideos = videos.length > 0 ? videos.slice(0, 6) : []
  const totalSlides = trendingVideos.length

  const currentVideo = trendingVideos[currentIndex]

  // Auto-advance every 8 seconds
  useEffect(() => {
    if (totalSlides <= 1 || isLoading) return

    const timer = setInterval(() => {
      handleNext()
    }, 8000)

    return () => clearInterval(timer)
  }, [currentIndex, totalSlides, isLoading])

  const handleNext = () => {
    if (totalSlides === 0) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
      setIsTransitioning(false)
    }, 300)
  }

  const handlePrev = () => {
    if (totalSlides === 0) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
      setIsTransitioning(false)
    }, 300)
  }

  const handleSelectSlide = (idx) => {
    if (idx === currentIndex || isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(idx)
      setIsTransitioning(false)
    }, 300)
  }

  const handleWatchNow = () => {
    if (!currentVideo) return
    const videoId = currentVideo.id || currentVideo.youtubeId
    navigate(`/watch/${videoId}`)
  }

  // Loading skeleton
  if (isLoading || totalSlides === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 mb-2">Trending</h2>
        </div>
        <div className="relative h-96 sm:h-[28rem] lg:h-96 bg-zinc-900 rounded-lg overflow-hidden animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-900" />
        </div>
      </section>
    )
  }

  if (!currentVideo) return null

  const videoId = currentVideo.id || currentVideo.youtubeId

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-200 mb-1">Trending</h2>
        <p className="text-xs sm:text-sm text-zinc-500">Featured trending content</p>
      </div>

      {/* Featured Carousel Container */}
      <div className="relative group">
        {/* Main Featured Slide */}
        <div
          className={`relative h-80 sm:h-96 lg:h-[400px] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800/50 shadow-2xl transition-opacity duration-300 ${
            isTransitioning ? 'opacity-60' : 'opacity-100'
          }`}
        >
          {/* Background Image */}
          <YouTubeImage
            videoId={videoId}
            src={currentVideo.thumbnail}
            alt={currentVideo.title}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
              isTransitioning ? 'scale-105 blur-sm' : 'scale-100 blur-none'
            }`}
          />

          {/* Gradient Overlay - Left Side (for text readability) */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />

          {/* Gradient Overlay - Bottom (fade out) */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8">
            {/* Top Metadata */}
            <div className="flex flex-wrap items-start gap-2">
              {currentVideo.category && (
                <span className="inline-block px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-700/50 text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
                  {currentVideo.category}
                </span>
              )}
              {currentVideo.duration && (
                <span className="inline-block px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-700/50 text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
                  {currentVideo.duration}
                </span>
              )}
            </div>

            {/* Bottom Content */}
            <div
              className={`transition-all duration-300 ${
                isTransitioning ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
              }`}
            >
              {/* Title */}
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 line-clamp-2 leading-tight">
                {currentVideo.title}
              </h3>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-xs sm:text-sm text-zinc-400">
                {currentVideo.channel && <span>{currentVideo.channel}</span>}
                {currentVideo.views && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span>{currentVideo.views} views</span>
                  </>
                )}
              </div>

              {/* Description */}
              {currentVideo.description && (
                <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 mb-5 max-w-xl leading-relaxed">
                  {currentVideo.description}
                </p>
              )}

              {/* CTA Button */}
              <button
                onClick={handleWatchNow}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </button>
            </div>
          </div>
        </div>

        {/* Previous Button */}
        {totalSlides > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous trending"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 opacity-0 transition-all duration-200 hover:bg-zinc-700 hover:text-white group-hover:opacity-100 lg:-translate-x-8 lg:h-12 lg:w-12"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Button */}
        {totalSlides > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next trending"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 opacity-0 transition-all duration-200 hover:bg-zinc-700 hover:text-white group-hover:opacity-100 lg:translate-x-8 lg:h-12 lg:w-12"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Slide Indicator */}
      {totalSlides > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {/* Dots Navigation */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSlide(idx)}
                aria-label={`Go to trending slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-red-600'
                    : 'w-2 bg-zinc-700 hover:bg-zinc-600'
                }`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="text-xs font-semibold text-zinc-500 ml-4 min-w-[50px] text-center">
            {String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </div>
        </div>
      )}
    </section>
  )
}
