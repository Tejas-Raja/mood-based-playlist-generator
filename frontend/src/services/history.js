const HISTORY_KEY = 'moodplaylist_history'
const MAX_ENTRIES = 10

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveToHistory({ text, mood, valence, energy, reason }) {
  const entry = {
    id: Date.now(),
    text: (text || '').slice(0, 120),
    mood,
    valence,
    energy,
    reason,
    timestamp: new Date().toISOString(),
  }
  const existing = getHistory()
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  return updated
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}
