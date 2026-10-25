import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Filters from './components/Filters'
import EventCard from './components/EventCard'
import EventModal from './components/EventModal'
import Toast from './components/Toast'
import Footer from './components/Footer'
import { EmptyState, ErrorState, SkeletonCard } from './components/States'
import { useEvents } from './hooks/useEvents'
import { useTheme } from './hooks/useTheme'
import { useLocalStorage } from './hooks/useLocalStorage'
import { CATEGORY_STYLES } from './utils/categories'
import { daysUntil, parseDate } from './utils/date'

const CATEGORIES = Object.keys(CATEGORY_STYLES)

// "#event-3" -> 3, anything else -> null
function idFromHash() {
  const match = /^#event-(\d+)$/.exec(window.location.hash)
  return match ? Number(match[1]) : null
}

// Copy text to the clipboard. Falls back to the older execCommand method
// for browsers that block the Clipboard API.
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    textarea.remove()
    return ok
  }
}

export default function App() {
  const { events, status, retry } = useEvents()
  const { theme, toggleTheme } = useTheme()
  const [savedIds, setSavedIds] = useLocalStorage('savedEvents', [])

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('soonest')
  const [savedOnly, setSavedOnly] = useState(false)
  const [selectedId, setSelectedId] = useState(idFromHash)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }, [])

  // keep the open modal in sync with the URL so event links can be shared
  useEffect(() => {
    const onHash = () => setSelectedId(idFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const openEvent = useCallback((id) => {
    history.replaceState(null, '', `#event-${id}`)
    setSelectedId(id)
  }, [])

  const closeEvent = useCallback(() => {
    history.replaceState(null, '', window.location.pathname + window.location.search)
    setSelectedId(null)
  }, [])

  const toggleSave = useCallback(
    (id) => {
      const isSaved = savedIds.includes(id)
      setSavedIds(isSaved ? savedIds.filter((x) => x !== id) : [...savedIds, id])
      showToast(isSaved ? 'Removed from saved events' : 'Event saved')
    },
    [savedIds, setSavedIds, showToast],
  )

  const shareEvent = useCallback(
    async (event) => {
      const url = `${window.location.origin}${window.location.pathname}#event-${event.id}`
      if (navigator.share) {
        try {
          await navigator.share({ title: event.title, text: event.description, url })
          return
        } catch (err) {
          if (err.name === 'AbortError') return // user closed the share sheet
        }
      }
      const copied = await copyText(url)
      showToast(copied ? 'Link copied to clipboard' : "Couldn't copy, use the URL in the address bar")
    },
    [showToast],
  )

  const upcoming = useMemo(() => events.filter((e) => daysUntil(e.date) >= 0), [events])

  const stats = useMemo(() => {
    const nextDays = upcoming.length ? Math.min(...upcoming.map((e) => daysUntil(e.date))) : null
    return {
      total: upcoming.length,
      categories: new Set(events.map((e) => e.category)).size,
      organizers: new Set(events.map((e) => e.organizer)).size,
      thisWeek: upcoming.filter((e) => daysUntil(e.date) <= 7).length,
      nextDays,
    }
  }, [events, upcoming])

  // search + "saved" filter first, so category chip counts reflect the search
  const searched = useMemo(() => {
    const q = query.trim().toLowerCase()
    return events.filter((e) => {
      if (savedOnly && !savedIds.includes(e.id)) return false
      if (!q) return true
      const haystack = [e.title, e.description, e.venue, e.organizer, e.category, ...(e.tags ?? [])].join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [events, query, savedOnly, savedIds])

  const categoryCounts = useMemo(() => {
    const counts = { All: searched.length }
    for (const e of searched) counts[e.category] = (counts[e.category] ?? 0) + 1
    return counts
  }, [searched])

  const visible = useMemo(() => {
    const list = category === 'All' ? searched : searched.filter((e) => e.category === category)
    const byDate = (a, b) => (parseDate(a.date) - parseDate(b.date)) * (sort === 'latest' ? -1 : 1)
    const compare = sort === 'az' ? (a, b) => a.title.localeCompare(b.title) : byDate
    // events that already happened always go to the end of the list
    const isPast = (e) => daysUntil(e.date) < 0
    return [...list].sort((a, b) => isPast(a) - isPast(b) || compare(a, b))
  }, [searched, category, sort])

  const selectedEvent = events.find((e) => e.id === selectedId)
  const filtersActive = query || category !== 'All' || savedOnly

  const clearFilters = () => {
    setQuery('')
    setCategory('All')
    setSavedOnly(false)
  }

  let content
  if (status === 'loading') {
    content = (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  } else if (status === 'error') {
    content = <ErrorState onRetry={retry} />
  } else if (visible.length === 0) {
    content =
      savedOnly && savedIds.length === 0 && !query ? (
        <EmptyState
          emoji="🔖"
          title="No saved events yet"
          message="Tap the bookmark icon on any event to save it here. Saved events stay even after you close the browser."
          action={
            <button onClick={() => setSavedOnly(false)} className="btn btn-primary">
              Browse all events
            </button>
          }
        />
      ) : (
        <EmptyState
          title="No events match your filters"
          message={query ? `Nothing found for "${query}". Try a different keyword or category.` : 'Try a different category or clear your filters.'}
          action={
            <button onClick={clearFilters} className="btn btn-primary">
              Clear all filters
            </button>
          }
        />
      )
  } else {
    content = (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((event, i) => (
          <EventCard
            key={event.id}
            index={i}
            event={event}
            saved={savedIds.includes(event.id)}
            onToggleSave={toggleSave}
            onOpen={openEvent}
          />
        ))}
      </div>
    )
  }

  return (
    <div id="top" className="min-h-screen">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        savedCount={savedIds.length}
        onShowSaved={() => setSavedOnly(true)}
        onShowAll={() => setSavedOnly(false)}
      />

      <main>
        <Hero stats={stats} loading={status === 'loading'} onShowSaved={() => setSavedOnly(true)} />

        <section id="events" className="mx-auto max-w-6xl scroll-mt-20 px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{savedOnly ? 'Your saved events' : 'All events'}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {status === 'success'
                  ? `Showing ${visible.length} of ${events.length} events · ${upcoming.length} upcoming`
                  : 'Fetching the latest events…'}
              </p>
            </div>
            {filtersActive && status === 'success' && (
              <button onClick={clearFilters} className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                Clear filters
              </button>
            )}
          </div>

          <Filters
            query={query}
            onQueryChange={setQuery}
            categories={CATEGORIES}
            categoryCounts={categoryCounts}
            activeCategory={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
            savedOnly={savedOnly}
            onSavedOnlyChange={setSavedOnly}
            savedCount={savedIds.length}
          />

          <div className="mt-8">{content}</div>
        </section>
      </main>

      <Footer />

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          saved={savedIds.includes(selectedEvent.id)}
          onToggleSave={toggleSave}
          onClose={closeEvent}
          onShare={shareEvent}
        />
      )}

      <Toast toast={toast} />
    </div>
  )
}
