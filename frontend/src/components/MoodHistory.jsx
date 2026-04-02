import { motion } from 'framer-motion'

function moodBadgeTone(mood) {
  if (mood === 'happy') return 'bg-amber-100 text-amber-800 border-amber-300'
  if (mood === 'sad') return 'bg-slate-700 text-slate-100 border-slate-500'
  return 'bg-violet-100 text-violet-800 border-violet-300'
}

function capitalize(value) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function formatRelativeDate(isoString) {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''
  const now = new Date()
  const dayNow = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayThen = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((dayNow - dayThen) / 86400000)
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  return date.toLocaleDateString()
}

function truncateForDisplay(text, max = 80) {
  if (!text) return ''
  if (text.length <= max) return text
  return `${text.slice(0, max)}...`
}

export function MoodHistory({ entries, onClose, onReplay, onClear }) {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/35"
        onClick={onClose}
        aria-label="Close history panel"
      />

      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3 }}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Mood History</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {entries.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              No history yet. Analyze your mood to start building it.
            </p>
          ) : (
            entries.slice(0, 10).map((entry) => (
              <div key={entry.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${moodBadgeTone(
                      entry.mood,
                    )}`}
                  >
                    {capitalize(entry.mood)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatRelativeDate(entry.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{truncateForDisplay(entry.text, 80)}</p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onReplay(entry)}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 transition-colors hover:border-violet-300 hover:text-violet-600"
                  >
                    Replay
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={onClear}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-500 transition-colors hover:border-rose-300 hover:text-rose-600"
          >
            Clear history
          </button>
        </div>
      </motion.aside>
    </motion.div>
  )
}
