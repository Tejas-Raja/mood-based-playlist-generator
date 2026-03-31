import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function clamp01(value) {
  return Math.min(1, Math.max(0, Number(value) || 0))
}

function moodBadgeTone(mood) {
  if (mood === 'happy') return 'bg-amber-100 text-amber-800 border-amber-300'
  if (mood === 'sad') return 'bg-slate-700 text-slate-100 border-slate-500'
  return 'bg-violet-100 text-violet-800 border-violet-300'
}

function energyLabel(value) {
  if (value <= 0.3) return 'Low'
  if (value <= 0.6) return 'Medium'
  return 'High'
}

function energyBarTone(value) {
  if (value <= 0.3) return 'bg-blue-500'
  if (value <= 0.6) return 'bg-sky-500'
  return 'bg-amber-500'
}

function valenceLabel(value) {
  if (value <= 0.3) return 'Negative'
  if (value <= 0.6) return 'Neutral'
  if (value <= 0.8) return 'Positive'
  return 'Very Positive'
}

function valenceBarTone(value) {
  if (value <= 0.3) return 'bg-slate-500'
  if (value <= 0.6) return 'bg-emerald-400'
  return 'bg-emerald-600'
}

export function MoodAnalysis({
  mood,
  valence,
  energy,
  reason,
  keywords_detected = [],
}) {
  const [animateBars, setAnimateBars] = useState(false)

  const clampedEnergy = clamp01(energy)
  const clampedValence = clamp01(valence)
  const moodLabel = mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : ''

  useEffect(() => {
    const timer = setTimeout(() => setAnimateBars(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mt-6 rounded-2xl border border-gray-100 bg-white/60 p-5 shadow-sm backdrop-blur"
    >
      <p className="text-xs uppercase tracking-widest text-gray-500">
        Mood Breakdown
      </p>

      <div className="mt-3">
        <span
          className={`inline-flex rounded-full border px-5 py-2 text-lg font-semibold capitalize ${moodBadgeTone(
            mood,
          )}`}
        >
          {moodLabel}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm text-gray-600">
            Energy - {energyLabel(clampedEnergy)} ({clampedEnergy.toFixed(2)})
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full transition-all duration-700 ease-out ${energyBarTone(
                clampedEnergy,
              )}`}
              style={{ width: `${animateBars ? clampedEnergy * 100 : 0}%` }}
            />
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm text-gray-600">
            Valence - {valenceLabel(clampedValence)} ({clampedValence.toFixed(2)})
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full transition-all duration-700 ease-out ${valenceBarTone(
                clampedValence,
              )}`}
              style={{ width: `${animateBars ? clampedValence * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm italic text-gray-500">{reason}</p>

      {keywords_detected.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-xs text-gray-500">Keywords detected:</p>
          <div className="flex flex-wrap gap-1">
            {keywords_detected.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </motion.section>
  )
}
