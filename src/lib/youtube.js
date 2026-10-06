/**
 * YouTube Data API v3 helpers
 * API key loaded from .env: VITE_YOUTUBE_API_KEY
 */

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

/**
 * Normalize a YouTube search result or video item into our app's shape
 */
function normalizeSearchItem(item) {
  const videoId = item.id?.videoId || item.id
  const snippet = item.snippet || {}
  return {
    id: videoId,
    youtubeId: videoId,
    title: snippet.title || 'Untitled',
    channel: snippet.channelTitle || 'Unknown Channel',
    thumbnail:
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      snippet.thumbnails?.default?.url ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    publishedAt: snippet.publishedAt || '',
    description: snippet.description || '',
    // Duration and views are not returned by search endpoint — fetched separately when needed
    duration: '',
    views: '',
    category: 'search',
  }
}

function normalizeVideoItem(item) {
  const videoId = typeof item.id === 'string' ? item.id : item.id?.videoId
  const snippet = item.snippet || {}
  const stats = item.statistics || {}
  const views = stats.viewCount
    ? formatViews(parseInt(stats.viewCount, 10))
    : ''
  const duration = item.contentDetails?.duration
    ? parseDuration(item.contentDetails.duration)
    : ''

  return {
    id: videoId,
    youtubeId: videoId,
    title: snippet.title || 'Untitled',
    channel: snippet.channelTitle || 'Unknown Channel',
    thumbnail:
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    publishedAt: snippet.publishedAt || '',
    description: snippet.description || '',
    duration,
    views,
    category: 'trending',
  }
}

/** Parse ISO 8601 duration (PT1H2M3S) to human-readable string */
function parseDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ''
  const h = match[1] ? parseInt(match[1]) : 0
  const m = match[2] ? parseInt(match[2]) : 0
  const s = match[3] ? parseInt(match[3]) : 0
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Format view count to abbreviated string (e.g. 1,234,567 → 1.2M) */
function formatViews(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

/**
 * Search YouTube videos by query
 * @param {string} query
 * @param {number} maxResults
 * @param {string} pageToken
 * @returns {Promise<{items: Array, nextPageToken: string}>}
 */
export async function searchYouTube(query, maxResults = 24, pageToken = '') {
  if (!API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    throw new Error('NO_API_KEY')
  }
  if (!query?.trim()) return { items: [], nextPageToken: '' }

  const url = new URL(`${BASE_URL}/search`)
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('q', query.trim())
  url.searchParams.set('type', 'video')
  url.searchParams.set('videoEmbeddable', 'true') // Strictly enforce
  url.searchParams.set('maxResults', String(maxResults))
  url.searchParams.set('safeSearch', 'moderate')
  url.searchParams.set('key', API_KEY)
  if (pageToken) url.searchParams.set('pageToken', pageToken)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }
  const data = await res.json()
  return {
    items: (data.items || []).map(normalizeSearchItem),
    nextPageToken: data.nextPageToken || ''
  }
}

/**
 * Get trending / most popular videos
 * @param {number} maxResults
 * @param {string} pageToken
 * @param {string} regionCode
 * @returns {Promise<{items: Array, nextPageToken: string}>}
 */
export async function getTrending(maxResults = 24, pageToken = '', regionCode = 'US') {
  if (!API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    throw new Error('NO_API_KEY')
  }

  const url = new URL(`${BASE_URL}/videos`)
  url.searchParams.set('part', 'snippet,contentDetails,statistics')
  url.searchParams.set('chart', 'mostPopular')
  url.searchParams.set('regionCode', regionCode)
  url.searchParams.set('maxResults', String(maxResults))
  url.searchParams.set('key', API_KEY)
  if (pageToken) url.searchParams.set('pageToken', pageToken)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }
  const data = await res.json()
  return {
    items: (data.items || []).map(normalizeVideoItem),
    nextPageToken: data.nextPageToken || ''
  }
}

/**
 * Get details for a single video by ID
 * @param {string} videoId
 * @returns {Promise<Object|null>} normalized video object
 */
export async function getVideoById(videoId) {
  if (!API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    throw new Error('NO_API_KEY')
  }

  const url = new URL(`${BASE_URL}/videos`)
  url.searchParams.set('part', 'snippet,contentDetails,statistics')
  url.searchParams.set('id', videoId)
  url.searchParams.set('key', API_KEY)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `HTTP ${res.status}`)
  }
  const data = await res.json()
  const items = data.items || []
  return items.length > 0 ? normalizeVideoItem(items[0]) : null
}

/**
 * Get prioritized list of YouTube thumbnail URLs for a given video ID
 * maxresdefault -> hqdefault -> mqdefault -> default
 */
export function getThumbnailCandidates(videoId) {
  if (!videoId) return []
  return [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/default.jpg`,
  ]
}

/**
 * Get landing page videos (Hero + Trending) with safe fallback to mock videos
 */
export async function fetchLandingVideos(limit = 10) {
  try {
    if (!hasApiKey()) {
      console.warn('YouTube API key not found. Using fallback mock videos.')
      return { items: getFallbackVideos(limit), isFallback: true }
    }

    const trendingRes = await getTrending(limit).catch(err => {
      console.warn('getTrending failed:', err.message)
      return null
    })

    if (trendingRes?.items && trendingRes.items.length > 0) {
      return { items: trendingRes.items, isFallback: false }
    }

    // Try search endpoint fallback if trending chart is empty or fails
    const searchRes = await searchYouTube('official trailer 4k', limit).catch(err => {
      console.warn('searchYouTube fallback failed:', err.message)
      return null
    })

    if (searchRes?.items && searchRes.items.length > 0) {
      return { items: searchRes.items, isFallback: false }
    }

    return { items: getFallbackVideos(limit), isFallback: true }
  } catch (error) {
    console.error('fetchLandingVideos error:', error)
    return { items: getFallbackVideos(limit), isFallback: true }
  }
}

/** Returns realistic YouTube video fallback data with real YouTube video IDs */
export function getFallbackVideos(limit = 10) {
  const fallbacks = [
    {
      id: 'Way9Dexny3w',
      youtubeId: 'Way9Dexny3w',
      title: 'Dune: Part Two — Official Main Trailer',
      channel: 'Warner Bros. Pictures',
      thumbnail: 'https://i.ytimg.com/vi/Way9Dexny3w/maxresdefault.jpg',
      thumbnails: getThumbnailCandidates('Way9Dexny3w'),
      description: 'The mythic journey of Paul Atreides as he unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
      duration: '2:50',
      views: '28.4M',
      publishedAt: '2024-01-15',
      category: 'Sci-Fi / Action',
    },
    {
      id: 'TcMBFSGVi1c',
      youtubeId: 'TcMBFSGVi1c',
      title: 'Avengers: Endgame — Official Trailer',
      channel: 'Marvel Entertainment',
      thumbnail: 'https://i.ytimg.com/vi/TcMBFSGVi1c/maxresdefault.jpg',
      thumbnails: getThumbnailCandidates('TcMBFSGVi1c'),
      description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.',
      duration: '2:26',
      views: '154M',
      publishedAt: '2019-03-14',
      category: 'Superhero',
    },
    {
      id: 'uYPbbksJxIg',
      youtubeId: 'uYPbbksJxIg',
      title: 'Oppenheimer — Official Trailer',
      channel: 'Universal Pictures',
      thumbnail: 'https://i.ytimg.com/vi/uYPbbksJxIg/maxresdefault.jpg',
      thumbnails: getThumbnailCandidates('uYPbbksJxIg'),
      description: 'Written and directed by Christopher Nolan, Oppenheimer is an IMAX-shot epic thriller pushing audiences into the pulse-pounding paradox.',
      duration: '3:05',
      views: '62.1M',
      publishedAt: '2023-05-08',
      category: 'Drama / History',
    },
    {
      id: 'EXeTwQWrcwY',
      youtubeId: 'EXeTwQWrcwY',
      title: 'The Dark Knight — Official Trailer',
      channel: 'DC / Warner Bros.',
      thumbnail: 'https://i.ytimg.com/vi/EXeTwQWrcwY/maxresdefault.jpg',
      thumbnails: getThumbnailCandidates('EXeTwQWrcwY'),
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
      duration: '2:30',
      views: '45.8M',
      publishedAt: '2008-07-18',
      category: 'Action / Crime',
    },
    {
      id: 'YoHD9XEInc0',
      youtubeId: 'YoHD9XEInc0',
      title: 'Inception — Official Trailer [HD]',
      channel: 'Warner Bros. Pictures',
      thumbnail: 'https://i.ytimg.com/vi/YoHD9XEInc0/maxresdefault.jpg',
      thumbnails: getThumbnailCandidates('YoHD9XEInc0'),
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      duration: '2:28',
      views: '38.2M',
      publishedAt: '2010-05-10',
      category: 'Sci-Fi / Thriller',
    },
    {
      id: 'zSWdZVtXT7E',
      youtubeId: 'zSWdZVtXT7E',
      title: 'Interstellar — Official Trailer 3',
      channel: 'Paramount Pictures',
      thumbnail: 'https://i.ytimg.com/vi/zSWdZVtXT7E/maxresdefault.jpg',
      thumbnails: getThumbnailCandidates('zSWdZVtXT7E'),
      description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers.',
      duration: '2:40',
      views: '51.9M',
      publishedAt: '2014-10-01',
      category: 'Sci-Fi / Adventure',
    },
    {
      id: 'qEVUtrk8_B4',
      youtubeId: 'qEVUtrk8_B4',
      title: 'Spider-Man: No Way Home — Official Teaser Trailer',
      channel: 'Sony Pictures Entertainment',
      thumbnail: 'https://i.ytimg.com/vi/qEVUtrk8_B4/maxresdefault.jpg',
      thumbnails: getThumbnailCandidates('qEVUtrk8_B4'),
      description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
      duration: '3:04',
      views: '92.5M',
      publishedAt: '2021-08-24',
      category: 'Action / Adventure',
    },
    {
      id: 'shW9i6k8CB0',
      youtubeId: 'shW9i6k8CB0',
      title: 'Spider-Man: Across the Spider-Verse — Official Trailer',
      channel: 'Sony Pictures Animation',
      thumbnail: 'https://i.ytimg.com/vi/shW9i6k8CB0/maxresdefault.jpg',
      thumbnails: getThumbnailCandidates('shW9i6k8CB0'),
      description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
      duration: '2:21',
      views: '44.3M',
      publishedAt: '2022-12-13',
      category: 'Animation / Action',
    },
    {
      id: 'mqqft2x_Aa4',
      youtubeId: 'mqqft2x_Aa4',
      title: 'The Batman — Main Trailer',
      channel: 'Warner Bros. Pictures',
      thumbnail: 'https://i.ytimg.com/vi/mqqft2x_Aa4/maxresdefault.jpg',
      thumbnails: getThumbnailCandidates('mqqft2x_Aa4'),
      description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption.',
      duration: '2:38',
      views: '68.7M',
      publishedAt: '2021-10-16',
      category: 'Crime / Mystery',
    },
    {
      id: 'fjg6ZkXpypc',
      youtubeId: 'fjg6ZkXpypc',
      title: 'Top Gun: Maverick — Official Trailer',
      channel: 'Paramount Pictures',
      thumbnail: 'https://i.ytimg.com/vi/fjg6ZkXpypc/maxresdefault.jpg',
      thumbnails: getThumbnailCandidates('fjg6ZkXpypc'),
      description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates.',
      duration: '2:30',
      views: '57.0M',
      publishedAt: '2019-12-16',
      category: 'Action / Drama',
    }
  ]
  return fallbacks.slice(0, limit)
}

/** Returns true if the API key is configured */
export function hasApiKey() {
  return Boolean(API_KEY) && API_KEY !== 'YOUR_YOUTUBE_API_KEY_HERE'
}

