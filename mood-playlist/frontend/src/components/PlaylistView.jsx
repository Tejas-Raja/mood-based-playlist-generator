import { SongCard } from './SongCard.jsx'

export function PlaylistView({ playlist, surface = 'light' }) {
  if (!playlist) return null

  const hintClass =
    surface === 'dark' ? 'text-slate-400' : 'text-slate-500'
  const songs = playlist.songs ?? []

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
