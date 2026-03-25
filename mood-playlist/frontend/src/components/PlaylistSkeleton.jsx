export function PlaylistSkeleton({ isDark, count = 10 }) {
  const hintClass = isDark ? 'text-slate-300' : 'text-slate-500'
  const cardBg = isDark ? 'bg-slate-800/40 border-slate-700/80' : 'bg-white/50 border-slate-200/80'
  const coverBg = isDark ? 'bg-slate-700/70' : 'bg-slate-200/80'
  const barBg = isDark ? 'bg-slate-700/70' : 'bg-slate-200/80'

  return (
    <div className="space-y-5">
      <p className={`text-center text-sm italic ${hintClass}`}>Finding songs that match your vibe…</p>
      <ul className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <li
            key={index}
            className="animate-mood-card-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border p-3 shadow-sm backdrop-blur-sm transition-colors ${cardBg} animate-pulse`}
              aria-hidden
            >
              <div className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg ${coverBg}`} />
              <div className="min-w-0 flex-1 py-0.5 space-y-3">
                <div className={`h-3 w-4/5 rounded-full ${barBg}`} />
                <div className={`h-3 w-3/5 rounded-full ${barBg}`} />
                <div className={`h-3 w-2/5 rounded-full ${barBg}`} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

