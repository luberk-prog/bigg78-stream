import { useState, useEffect } from 'react'
import { getThumbnailCandidates } from '../lib/youtube'

export default function YouTubeImage({ videoId, src, alt = '', className = '', ...props }) {
  const candidates = videoId ? getThumbnailCandidates(videoId) : (src ? [src] : [])
  const [candidateIndex, setCandidateIndex] = useState(0)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setCandidateIndex(0)
    setHasError(false)
  }, [videoId, src])

  const currentSrc = candidates[candidateIndex] || src || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1200&auto=format&fit=crop'

  const handleError = () => {
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex(prev => prev + 1)
    } else {
      setHasError(true)
    }
  }

  return (
    <img
      src={hasError ? 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1200&auto=format&fit=crop' : currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  )
}
