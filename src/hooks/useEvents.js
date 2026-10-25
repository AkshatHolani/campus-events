import { useCallback, useEffect, useState } from 'react'

// Loads events from the local JSON file in /public.
// A small artificial delay makes the loading skeleton visible, like a real API.
const FAKE_DELAY_MS = 700

export function useEvents() {
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'

  const load = useCallback(async (signal) => {
    setStatus('loading')
    try {
      await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))
      const res = await fetch(`${import.meta.env.BASE_URL}events.json`, { signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setEvents(data)
      setStatus('success')
    } catch (err) {
      if (err.name !== 'AbortError') setStatus('error')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  return { events, status, retry: () => load() }
}
