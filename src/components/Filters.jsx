import { useEffect, useRef } from 'react'
import { BookmarkIcon, CloseIcon, SearchIcon } from './Icons'
import { getCategoryStyle } from '../utils/categories'

export default function Filters({
  query,
  onQueryChange,
  categories,
  categoryCounts,
  activeCategory,
  onCategoryChange,
  sort,
  onSortChange,
  savedOnly,
  onSavedOnlyChange,
  savedCount,
}) {
  const inputRef = useRef(null)

  // press "/" anywhere to jump to the search box
  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if (e.key === '/' && !typing) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search events</span>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && onQueryChange('')}
            placeholder="Search by name, venue, club or tag…"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-12 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-900 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              onClick={() => {
                onQueryChange('')
                inputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 px-1.5 text-xs text-slate-400 dark:border-slate-700 sm:block">
              /
            </kbd>
          )}
        </label>

        <div className="flex gap-3">
          <label className="flex-1 sm:flex-none">
            <span className="sr-only">Sort events</span>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-full w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-900"
            >
              <option value="soonest">Soonest first</option>
              <option value="latest">Latest first</option>
              <option value="az">Name (A–Z)</option>
            </select>
          </label>

          <button
            onClick={() => onSavedOnlyChange(!savedOnly)}
            aria-pressed={savedOnly}
            className={`chip rounded-2xl px-4 py-3 ${savedOnly ? 'chip-on' : 'chip-off'}`}
          >
            <BookmarkIcon filled={savedOnly} className="h-4 w-4" />
            Saved
            <span className={`text-xs ${savedOnly ? 'text-indigo-100' : 'text-slate-400'}`}>{savedCount}</span>
          </button>
        </div>
      </div>

      {/* category chips: scroll sideways on small screens */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
        {['All', ...categories].map((cat) => {
          const active = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              aria-pressed={active}
              className={`chip ${active ? 'chip-on' : 'chip-off'}`}
            >
              {cat !== 'All' && <span aria-hidden="true">{getCategoryStyle(cat).emoji}</span>}
              {cat}
              <span className={`text-xs ${active ? 'text-indigo-100' : 'text-slate-400'}`}>{categoryCounts[cat] ?? 0}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
