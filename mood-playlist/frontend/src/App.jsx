import { useCallback, useState } from 'react'

import { ErrorMessage } from './components/ErrorMessage.jsx'
import { MoodBadge } from './components/MoodBadge.jsx'
import { PlaylistView } from './components/PlaylistView.jsx'
import { TextInput } from './components/TextInput.jsx'
import { analyzeMood, getPlaylist } from './services/api.js'

function moodBackgroundClass(moodState) {
  const key = moodState?.mood ?? null
  if (key === 'happy') {
    return 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100'
  }
  if (key === 'sad') {
    return 'bg-slate-900'
  }
  if (key === 'calm') {
    return 'bg-purple-50'
  }
  return 'bg-white'
}

function App() {
  const [text, setText] = useState('')
  const [mood, setMood] = useState(null)
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const moodResult = await analyzeMood(text)
      const playlistResult = await getPlaylist(
        moodResult.valence,
        moodResult.energy,
        moodResult.mood,
      )
      setMood(moodResult)
      setPlaylist(playlistResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [text])

  const surface = mood?.mood === 'sad' ? 'dark' : 'light'
  const titleClass =
    surface === 'dark'
      ? 'text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl'
      : 'text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${moodBackgroundClass(mood)}`}
    >
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16">
        <h1 className={`mb-10 text-center ${titleClass}`}>🎵 Mood Playlist</h1>

        {error ? (
          <div className="mb-8">
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          </div>
        ) : null}

        <TextInput
          text={text}
          setText={setText}
          onSubmit={handleSubmit}
          loading={loading}
          surface={surface}
        />

        {mood ? (
          <div className="mt-10 border-t border-slate-200/60 pt-10 dark:border-slate-600/50">
            <MoodBadge
              mood={mood.mood}
              valence={mood.valence}
              energy={mood.energy}
              surface={surface}
            />
          </div>
        ) : null}

        {playlist ? (
          <div className="mt-10 border-t border-slate-200/60 pt-10 dark:border-slate-600/50">
            <PlaylistView playlist={playlist} surface={surface} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default App
