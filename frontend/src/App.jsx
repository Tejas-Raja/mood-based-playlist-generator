import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import { ErrorMessage } from './components/ErrorMessage.jsx'
import { LoadingState } from './components/LoadingState.jsx'
import { MoodAnalysis } from './components/MoodAnalysis.jsx'
import { MoodHistory } from './components/MoodHistory.jsx'
import { PlaylistView } from './components/PlaylistView.jsx'
import { TextInput } from './components/TextInput.jsx'
import { analyzeMood, getPlaylist } from './services/api.js'
import { clearHistory, getHistory, saveToHistory } from './services/history.js'

function backgroundGradientClass(moodState) {
  const mood = moodState?.mood ?? null
  if (mood === 'happy') return 'from-amber-100 via-orange-50 to-yellow-50'
  if (mood === 'sad') return 'from-slate-900 via-slate-800 to-slate-900'
  if (mood === 'calm') return 'from-purple-50 via-violet-50 to-indigo-50'
  return 'from-white via-gray-50 to-gray-50'
}

function App() {
  const [text, setText] = useState('')
  const [mood, setMood] = useState(null)
  const [playlist, setPlaylist] = useState(null)
  const [loadingStep, setLoadingStep] = useState(null)
  const [historyEntries, setHistoryEntries] = useState(() => getHistory())
  const [historyOpen, setHistoryOpen] = useState(false)
  const [error, setError] = useState(null)
  const [inlineValidation, setInlineValidation] = useState(null)
  const loading = loadingStep !== null

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim()
    if (trimmed.length < 10) {
      setInlineValidation('Please enter at least 10 characters.')
      setError(null)
      return
    }

    setInlineValidation(null)
    setLoadingStep('analyzing')
    setError(null)
    try {
      const moodResult = await analyzeMood(text)
      setLoadingStep('finding')
      const playlistResult = await getPlaylist(
        moodResult.valence,
        moodResult.energy,
        moodResult.mood,
      )
      setLoadingStep(null)
      setMood(moodResult)
      setPlaylist(playlistResult)
      const updatedHistory = saveToHistory({
        text,
        mood: moodResult.mood,
        valence: moodResult.valence,
        energy: moodResult.energy,
        reason: moodResult.reason,
      })
      setHistoryEntries(updatedHistory)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setInlineValidation(null)
    } finally {
      setLoadingStep(null)
    }
  }, [text])

  const handleRegenerate = useCallback(async () => {
    if (!mood) return
    setLoadingStep('finding')
    setError(null)
    try {
      const playlistResult = await getPlaylist(mood.valence, mood.energy, mood.mood)
      setPlaylist(playlistResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoadingStep(null)
    }
  }, [mood])

  const handleReplay = useCallback(async (entry) => {
    setMood({
      mood: entry.mood,
      valence: entry.valence,
      energy: entry.energy,
      reason: entry.reason,
      keywords_detected: [],
    })
    setHistoryOpen(false)
    setLoadingStep('finding')
    setError(null)
    try {
      const playlistResult = await getPlaylist(entry.valence, entry.energy, entry.mood)
      setPlaylist(playlistResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoadingStep(null)
    }
  }, [])

  const handleClearHistory = useCallback(() => {
    clearHistory()
    setHistoryEntries([])
  }, [])

  const isDark = mood?.mood === 'sad'

  return (
    <div
      className={`min-h-screen bg-gradient-to-br transition-all duration-700 ${backgroundGradientClass(
        mood,
      )} ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
    >
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-0">
        <div className="relative mb-10 text-center">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="absolute right-0 top-0 rounded-lg border border-slate-200 bg-white/60 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-violet-300 hover:text-violet-600"
          >
            History
          </button>
          <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl`}>
            Mood Playlist
          </h1>
          <p
            className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
          >
            Describe your day. We'll find the soundtrack.
          </p>
          <div
            className="mx-auto mt-4 h-1.5 w-28 rounded-full bg-gradient-to-r from-violet-400 via-amber-300 to-fuchsia-400 opacity-80"
            aria-hidden
          />
        </div>

        {error ? (
          <div className="mb-8">
            <ErrorMessage
              message={error}
              onDismiss={() => {
                setError(null)
                setInlineValidation(null)
              }}
            />
          </div>
        ) : null}

        <TextInput
          text={text}
          setText={setText}
          onSubmit={handleSubmit}
          loading={loading}
          isDark={isDark}
        />

        {inlineValidation ? (
          <p
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
              isDark
                ? 'border-slate-700/80 bg-slate-800/40 text-slate-200'
                : 'border-slate-200/80 bg-white/70 text-slate-700'
            }`}
          >
            {inlineValidation}
          </p>
        ) : null}

        {loadingStep ? (
          <LoadingState step={loadingStep} />
        ) : null}

        {!loadingStep && mood ? (
          <MoodAnalysis
            mood={mood.mood}
            valence={mood.valence}
            energy={mood.energy}
            reason={mood.reason}
            keywords_detected={mood.keywords_detected}
          />
        ) : null}

        {!loadingStep && playlist ? (
          <div className="mt-10 border-t border-slate-200/60 pt-10 dark:border-slate-600/50">
            <PlaylistView
              playlist={playlist}
              isDark={isDark}
              onRegenerate={handleRegenerate}
              loading={loadingStep === 'finding'}
            />
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {historyOpen ? (
          <MoodHistory
            entries={historyEntries}
            onClose={() => setHistoryOpen(false)}
            onReplay={handleReplay}
            onClear={handleClearHistory}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default App
