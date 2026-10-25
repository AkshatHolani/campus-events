import { useEffect, useRef } from 'react'
import { getCategoryStyle } from '../utils/categories'
import { formatDate, formatTime, googleCalendarUrl, relativeLabel } from '../utils/date'
import { BookmarkIcon, CalendarIcon, CheckIcon, ClockIcon, CloseIcon, FlagIcon, PinIcon, ShareIcon, UsersIcon } from './Icons'

export default function EventModal({ event, saved, onToggleSave, onClose, onShare }) {
  const closeRef = useRef(null)
  const style = getCategoryStyle(event.category)
  const soon = relativeLabel(event.date)

  // close on Escape, lock page scroll and move focus into the dialog
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const prevFocus = document.activeElement
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.()
    }
  }, [onClose])

  const meta = [
    { icon: CalendarIcon, label: 'Date', value: formatDate(event.date, { weekday: 'long', year: 'numeric', month: 'long' }) },
    { icon: ClockIcon, label: 'Time', value: `${formatTime(event.startTime)} – ${formatTime(event.endTime)}` },
    { icon: PinIcon, label: 'Venue', value: event.venue },
    { icon: FlagIcon, label: 'Organised by', value: event.organizer },
    { icon: UsersIcon, label: 'Capacity', value: `${event.seats} seats` },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="event-title">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-pop-in dark:bg-slate-900 sm:rounded-3xl">
        {/* cover */}
        <div className={`relative h-40 shrink-0 overflow-hidden bg-gradient-to-br sm:h-48 ${style.gradient}`}>
          <span className="absolute -bottom-8 -right-4 text-[9rem] leading-none opacity-90 drop-shadow-lg" aria-hidden="true">
            {style.emoji}
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-950/80 dark:text-slate-200"
            aria-label="Close details"
          >
            <CloseIcon />
          </button>
          <div className="absolute bottom-4 left-5 flex gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 dark:bg-slate-950/80 dark:text-slate-100">
              {style.emoji} {event.category}
            </span>
            {soon && <span className="rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white">{soon}</span>}
          </div>
        </div>

        {/* scrollable content */}
        <div className="overflow-y-auto p-5 sm:p-7">
          <h2 id="event-title" className="text-2xl font-extrabold leading-tight sm:text-3xl">
            {event.title}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{event.description}</p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {meta.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</dt>
                  <dd className="text-sm font-semibold">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <h3 className="mt-7 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">About this event</h3>
          <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">{event.details}</p>

          {event.highlights?.length > 0 && (
            <>
              <h3 className="mt-7 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Highlights</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {event.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </>
          )}

          {event.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {event.tags.map((t) => (
                <span key={t} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex shrink-0 flex-wrap gap-2 border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:px-7">
          <button onClick={() => onToggleSave(event.id)} aria-pressed={saved} className={`btn flex-1 ${saved ? 'btn-primary' : 'btn-ghost'}`}>
            <BookmarkIcon filled={saved} className="h-4 w-4" />
            {saved ? 'Saved' : 'Save event'}
          </button>
          <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost flex-1">
            <CalendarIcon className="h-4 w-4" />
            Add to calendar
          </a>
          <button onClick={() => onShare(event)} className="btn btn-ghost flex-1">
            <ShareIcon className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
