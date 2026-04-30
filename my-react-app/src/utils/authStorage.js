const AUTH_STORAGE_KEY = 'northstar-auth-session'

export function loadStoredSession() {
  try {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY)

    if (!storedValue) {
      return null
    }

    return JSON.parse(storedValue)
  } catch {
    return null
  }
}

export function saveStoredSession(session) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
