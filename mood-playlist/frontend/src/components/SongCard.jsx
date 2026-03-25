export function SongCard({ title, artist, album, image, spotify_url }) {
  return (
    <a
      href={spotify_url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md dark:border-slate-600/80 dark:bg-slate-800/60"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" />
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
        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        <p className="truncate text-sm text-slate-600 dark:text-slate-400">{artist}</p>
        <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">{album}</p>
      </div>
    </a>
  )
}
