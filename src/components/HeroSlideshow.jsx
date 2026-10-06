import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import YouTubeImage from './YouTubeImage'

export default function HeroSlideshow({ videos = [], isLoading = false }) {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const slideCount = Math.min(videos.length, 5)
  const currentVideo = videos[currentIndex]

  // Auto-rotate slideshow every 7 seconds
  useEffect(() => {
    if (slideCount <= 1 || isLoading) return

    const timer = setInterval(() => {
      handleNext()
    }, 7000)

    return () => clearInterval(timer)
  }, [currentIndex, slideCount, isLoading])

  const handleNext = () => {
    if (slideCount === 0) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount)
      setIsTransitioning(false)
    }, 300)
  }

  const handlePrev = () => {
    if (slideCount === 0) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount)
      setIsTransitioning(false)
    }, 300)
  }

  const handleSelectSlide = (idx) => {
    if (idx === currentIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(idx)
      setIsTransitioning(false)
    }, 300)
  }

  const handleWatchNow = () => {
    if (!currentVideo) return
    const targetId = currentVideo.id || currentVideo.youtubeId
    navigate(`/watch/${targetId}`)
  }

  if (isLoading || !currentVideo) {
    return (
      <div className="relative w-full h-[75vh] sm:h-[82vh] bg-zinc-900 animate-pulse flex items-end p-6 sm:p-12 lg:p-16 border-b border-zinc-800/80">
        <div className="max-w-2xl space-y-4 w-full">
          <div className="w-24 h-6 bg-zinc-800 rounded"></div>
          <div className="w-3/4 h-12 bg-zinc-800 rounded"></div>
          <div className="w-1/2 h-5 bg-zinc-800 rounded"></div>
          <div className="w-full h-16 bg-zinc-800 rounded"></div>
          <div className="w-36 h-12 bg-zinc-800 rounded-md"></div>
        </div>
      </div>
    )
  }

  const videoId = currentVideo.id || currentVideo.youtubeId

  return (
    <section className="relative w-full h-[78vh] sm:h-[84vh] min-h-[540px] bg-zinc-950 overflow-hidden select-none">
      {/* Dynamic YouTube Background Image */}
      <div className="absolute inset-0 z-0">
        <YouTubeImage
          videoId={videoId}
          src={currentVideo.thumbnail}
          alt={currentVideo.title}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isTransitioning ? 'opacity-30 scale-105' : 'opacity-75 scale-100'
          }`}
        />

        {/* Cinematic Overlay Treatments */}
        {/* Dark Left Side Gradient for readable typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent w-full sm:w-[75%] lg:w-[60%]" />
        
        {/* Dark Bottom Fade into page content */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        
        {/* Top Fade for Navigation contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-transparent to-transparent h-32" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20">
        <div
          className={`max-w-3xl space-y-4 sm:space-y-5 transition-all duration-500 ${
            isTransitioning ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Metadata & Tag */}
          <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
            <span className="px-2.5 py-1 rounded bg-red-600/90 text-white font-bold tracking-wide uppercase text-[11px]">
              Trending #{currentIndex + 1}
            </span>
            {currentVideo.category && (
              <span className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px] bg-zinc-900/80 px-2.5 py-1 rounded border border-zinc-800">
                {currentVideo.category}
              </span>
            )}
            {currentVideo.duration && (
              <span className="text-zinc-400 text-xs hidden xs:inline-block">
                • {currentVideo.duration}
              </span>
            )}
            {currentVideo.views && (
              <span className="text-zinc-400 text-xs hidden sm:inline-block">
                • {currentVideo.views} views
              </span>
            )}
          </div>

          {/* Video Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md line-clamp-2">
            {currentVideo.title}
          </h1>

          {/* Channel Info & Description */}
          <div className="space-y-2">
            <p className="text-zinc-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              {currentVideo.channel}
            </p>
            {currentVideo.description && (
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed line-clamp-2 max-w-2xl font-normal drop-shadow-sm">
                {currentVideo.description}
              </p>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={handleWatchNow}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-md bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-sm sm:text-base tracking-wide transition-colors shadow-lg shadow-red-950/50 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </button>
          </div>
        </div>

        {/* Minimal Controls & Slideshow Pagination (Bottom Right) */}
        {slideCount > 1 && (
          <div className="absolute bottom-8 right-4 sm:right-8 lg:right-12 z-20 flex items-center gap-4 bg-zinc-950/70 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-800/80">
            {/* Arrows */}
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Slide Indicators */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: slideCount }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSlide(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-red-500'
                      : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <span className="text-xs font-semibold text-zinc-400 min-w-[28px] text-center">
              {currentIndex + 1}/{slideCount}
            </span>

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
