import { useNavigate } from 'react-router-dom'
import YouTubeImage from './YouTubeImage'

export default function LandingVideoCard({ video }) {
  const navigate = useNavigate()

  if (!video) return null

  const videoId = video.id || video.youtubeId

  const handleClick = () => {
    navigate(`/watch/${videoId}`)
  }

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer flex flex-col space-y-2 select-none"
    >
      {/* 16:9 Aspect Ratio Thumbnail Container */}
      <div className="relative aspect-video w-full rounded-md overflow-hidden bg-zinc-900 border border-zinc-800/80">
        <YouTubeImage
          videoId={videoId}
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 ease-out"
        />

        {/* Hover Overlay with subtle Play Icon */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-200 tracking-wider">
            {video.duration}
          </div>
        )}
      </div>

      {/* Video Information */}
      <div className="space-y-1 px-0.5">
        <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white line-clamp-2 leading-snug transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="truncate max-w-[70%] font-medium">{video.channel}</span>
          {video.views && <span>{video.views}</span>}
        </div>
      </div>
    </div>
  )
}
