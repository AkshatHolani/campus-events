import { useEffect, useState } from 'react'
import { BookmarkIcon, CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons'

export default function Navbar({ theme, onToggleTheme, savedCount, onShowSaved, onShowAll }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // add a shadow once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Home', href: '#top', onClick: null },
    { label: 'Events', href: '#events', onClick: onShowAll },
    { label: 'About', href: '#about', onClick: null },
  ]

  const handleLink = (onClick) => {
    onClick?.()
    setMenuOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-lg transition-all duration-300 ${
        scrolled
          ? 'border-slate-200/80 bg-white/80 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/80'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
            🎟️
          </span>
          <span>
            Campus<span className="text-indigo-600 dark:text-indigo-400">Pulse</span>
          </span>
        </a>

        {/* desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => handleLink(l.onClick)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <a href="#events" onClick={() => handleLink(onShowSaved)} className="icon-btn relative" aria-label={`Saved events (${savedCount})`} title="Saved events">
            <BookmarkIcon />
            {savedCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white animate-pop-in">
                {savedCount}
              </span>
            )}
          </a>
          <button
            onClick={onToggleTheme}
            className="icon-btn"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="icon-btn md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-3 animate-fade-in dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => handleLink(l.onClick)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#events"
            onClick={() => handleLink(onShowSaved)}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Saved events ({savedCount})
          </a>
        </div>
      )}
    </header>
  )
}
