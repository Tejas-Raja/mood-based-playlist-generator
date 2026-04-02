import { motion } from 'framer-motion'

import { SongCard } from './SongCard.jsx'

export function PlaylistView({
  playlist,
  isDark,
  onRegenerate,
  loading = false,
  surface = 'light',
}) {
  if (!playlist) return null

  const hintClass =
    typeof isDark === 'boolean'
      ? isDark
        ? 'text-slate-400'
        : 'text-slate-500'
      : surface === 'dark'
        ? 'text-slate-400'
        : 'text-slate-500'
  const songs = playlist.songs ?? []
  const emptyCopy =
    "We couldn't find tracks for this mood. Try describing your day differently."

  if (songs.length === 0) {
    return (
      <div className="space-y-5">
        <p className={`text-center text-sm italic ${hintClass}`}>
          {playlist.mood_hint}
        </p>
        <div
          className={`rounded-2xl border px-6 py-8 text-center ${
            typeof isDark === 'boolean'
              ? isDark
                ? 'border-slate-700/80 bg-slate-800/30 text-slate-200'
                : 'border-slate-200/80 bg-white/60 text-slate-700'
              : surface === 'dark'
                ? 'border-slate-700/80 bg-slate-800/30 text-slate-200'
                : 'border-slate-200/80 bg-white/60 text-slate-700'
          }`}
        >
          <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-200" />
          <p className="text-sm">{emptyCopy}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <p className={`text-center text-sm italic ${hintClass}`}>{playlist.mood_hint}</p>
      <ul className="space-y-3">
        {songs.map((song, index) => (
          <li key={`${song.spotify_url}-${index}`}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.3 }}
            >
              <SongCard
                title={song.title}
                artist={song.artist}
                album={song.album}
                image={song.image}
                spotify_url={song.spotify_url}
              />
            </motion.div>
          </li>
        ))}
      </ul>
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onRegenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 transition-colors hover:border-violet-300 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M3 12a9 9 0 0 1 15.3-6.3L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15.3 6.3L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          <span>Regenerate playlist</span>
        </button>
      </div>
    </motion.div>
  )
}
