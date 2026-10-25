import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

function systemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

// Light/dark theme. Defaults to the OS setting, then remembers the user's choice.
export function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', systemPrefersDark() ? 'dark' : 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
