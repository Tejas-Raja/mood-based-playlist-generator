const API_BASE = 'http://localhost:8000'

function errorMessageFromResponse(res, body) {
  if (body?.detail != null) {
    const { detail } = body
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      return detail.map((e) => e.msg ?? JSON.stringify(e)).join('; ')
    }
    return String(detail)
  }
  return res.statusText || `Request failed (${res.status})`
}

async function parseJsonOrEmpty(res) {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

/**
 * @param {string} text
 * @returns {Promise<{ mood: string, valence: number, energy: number }>}
 */
export async function analyzeMood(text) {
  let res
  try {
    res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
  } catch {
    throw new Error('Could not reach the server. Is the backend running?')
  }
  const body = await parseJsonOrEmpty(res)
  if (!res.ok) {
    throw new Error(errorMessageFromResponse(res, body))
  }
  return body
}

/**
 * @param {number} valence
 * @param {number} energy
 * @param {string} [mood]
 * @returns {Promise<{ songs: unknown[], mood_hint: string }>}
 */
export async function getPlaylist(valence, energy, mood) {
  const params = new URLSearchParams({
    valence: String(valence),
    energy: String(energy),
    mood: mood ?? 'calm',
  })
  let res
  try {
    res = await fetch(`${API_BASE}/playlist?${params.toString()}`)
  } catch {
    throw new Error('Could not reach the server. Is the backend running?')
  }
  const body = await parseJsonOrEmpty(res)
  if (!res.ok) {
    throw new Error(errorMessageFromResponse(res, body))
  }
  return body
}
