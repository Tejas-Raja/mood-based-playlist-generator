import { SongCard } from './SongCard.jsx'

export function PlaylistView({ playlist, isDark, surface = 'light' }) {
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
    <div className="space-y-5">
      <p className={`text-center text-sm italic ${hintClass}`}>{playlist.mood_hint}</p>
      <ul className="space-y-3">
        {songs.map((song, index) => (
          <li
            key={`${song.spotify_url}-${index}`}
            className="animate-mood-card-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <SongCard
              title={song.title}
              artist={song.artist}
              album={song.album}
              image={song.image}
              spotify_url={song.spotify_url}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
