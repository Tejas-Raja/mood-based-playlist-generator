import { motion } from 'framer-motion'

export function SongCard({ title, artist, album, image, spotify_url }) {
  return (
    <motion.a
      href={spotify_url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.015, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/60 hover:border-violet-200 hover:shadow-md dark:border-slate-600/80 dark:bg-slate-800/60 dark:hover:bg-slate-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      aria-label={`Open ${title || 'track'} on Spotify`}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
        {image ? (
          <img
            src={image}
            alt={album ? `${album} album art` : 'Album art'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500"
            aria-hidden
          >
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </p>
        <p className="truncate text-sm text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded-full"
              aria-hidden
              style={{ background: '#1DB954' }}
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle cx="12" cy="12" r="10" fill="#1DB954" />
                <path
                  d="M8 10.5c3.3-1 6.7-.5 9.6.9"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8.7 13.3c2.6-.6 5.2-.2 7.5.9"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9.5 16c1.7-.3 3.3-.1 4.9.7"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="truncate">{artist}</span>
          </span>
        </p>
        <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">
          {album}
        </p>
      </div>
    </motion.a>
  )
}
