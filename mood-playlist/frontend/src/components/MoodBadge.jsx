import { useEffect, useState } from 'react'

function barTone(mood) {
  if (mood === 'happy') return 'bg-amber-400'
  if (mood === 'sad') return 'bg-sky-500'
  return 'bg-violet-500'
}

function badgeStyles(mood) {
  if (mood === 'happy') {
    return 'border-amber-200/80 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 ring-1 ring-amber-300/50'
  }
  if (mood === 'sad') {
    return 'border-slate-500/60 bg-gradient-to-r from-slate-700 to-slate-600 text-slate-100 ring-1 ring-slate-500/40'
  }
  return 'border-violet-200/80 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-900 ring-1 ring-violet-300/50'
}

function labelTone(mood, isDarkLayout) {
  if (isDarkLayout) return 'text-slate-400'
  return 'text-slate-500'
}

export function MoodBadge({
  mood,
  valence,
  energy,
  isDark,
  surface = 'light',
}) {
  const isDarkLayout =
    typeof isDark === 'boolean' ? isDark : surface === 'dark'
  const label = mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : ''

  const [displayValence, setDisplayValence] = useState(0)
  const [displayEnergy, setDisplayEnergy] = useState(0)

  useEffect(() => {
    const v = Math.min(1, Math.max(0, valence ?? 0))
    const e = Math.min(1, Math.max(0, energy ?? 0))
    setDisplayValence(v)
    setDisplayEnergy(e)
  }, [valence, energy])

  return (
    <div className="animate-mood-fade-in space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold capitalize shadow-sm ${badgeStyles(mood)}`}
        >
          {label}
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <div
            className={`mb-1 flex justify-between text-xs font-medium ${labelTone(mood, isDarkLayout)}`}
          >
            <span>Valence</span>
            <span className="tabular-nums">{valence.toFixed(2)}</span>
          </div>
          <div
            className={`h-2 overflow-hidden rounded-full ${isDarkLayout ? 'bg-slate-700' : 'bg-slate-200/90'}`}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${barTone(mood)}`}
              style={{
                width: `${Math.min(100, Math.max(0, displayValence * 100))}%`,
              }}
            />
          </div>
        </div>
        <div>
          <div
            className={`mb-1 flex justify-between text-xs font-medium ${labelTone(mood, isDarkLayout)}`}
          >
            <span>Energy</span>
            <span className="tabular-nums">{energy.toFixed(2)}</span>
          </div>
          <div
            className={`h-2 overflow-hidden rounded-full ${isDarkLayout ? 'bg-slate-700' : 'bg-slate-200/90'}`}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${barTone(mood)}`}
              style={{
                width: `${Math.min(100, Math.max(0, displayEnergy * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      <p
        className={`pt-1 text-center text-xs ${
          isDarkLayout ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        Based on your text, we found a{' '}
        <span className="font-semibold capitalize">{mood}</span> vibe
      </p>
    </div>
  )
}
