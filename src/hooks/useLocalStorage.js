import { useEffect, useState } from 'react'

// useState that is persisted to localStorage under `key`.
// Wrapped in try/catch because storage can be unavailable (private mode, blocked cookies).
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore: the app still works, it just won't remember this value
    }
  }, [key, value])

  return [value, setValue]
}
