import LandingVideoCard from './LandingVideoCard'

export default function TrendingSection({ videos = [], isLoading = false }) {
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-7 w-36 bg-zinc-800 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="aspect-video w-full bg-zinc-800 rounded-md"></div>
              <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
              <div className="h-3 w-1/2 bg-zinc-800 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!videos || videos.length === 0) return null

  // Skip the first video if it's featured in hero, or show items 1..5 for trending section
  const trendingList = videos.length > 4 ? videos.slice(0, 8) : videos

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Trending
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal">
            Most popular videos watching across BIGG78 STREAM
          </p>
        </div>
      </div>

      {/* Video Cards Grid (4 visible at once on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {trendingList.map((video, idx) => (
          <LandingVideoCard key={video.id || video.youtubeId || idx} video={video} />
        ))}
      </div>
    </section>
  )
}
