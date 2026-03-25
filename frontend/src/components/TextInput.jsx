export function TextInput({
  text,
  setText,
  onSubmit,
  loading,
  isDark,
  surface = 'light',
}) {
  const dark = typeof isDark === 'boolean' ? isDark : surface === 'dark'

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!loading) onSubmit()
    }
  }

  const fieldClass = dark
    ? 'w-full rounded-2xl border border-slate-600/80 bg-slate-800/50 px-4 py-3 text-[15px] leading-relaxed text-slate-100 shadow-inner shadow-black/20 placeholder:text-slate-500 focus:border-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-500/35'
    : 'w-full rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3 text-[15px] leading-relaxed text-slate-800 shadow-md shadow-slate-200/50 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30'

  const btnClass = dark
    ? 'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:from-violet-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50'
    : 'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-700 hover:to-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div className="space-y-4">
      <label className="sr-only" htmlFor="mood-text">
        Describe your mood
      </label>
      <textarea
        id="mood-text"
        aria-label="Describe your day"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tell me about your day..."
        disabled={loading}
        className={`min-h-[7.5rem] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 ${fieldClass}`}
      />
      <button
        type="button"
        aria-label="Generate My Playlist"
        onClick={() => !loading && onSubmit()}
        disabled={loading}
        className={`${btnClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
      >
        {loading ? (
          <>
            <svg
              className="h-5 w-5 shrink-0 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Generating…</span>
          </>
        ) : (
          'Generate My Playlist'
        )}
      </button>
    </div>
  )
}
