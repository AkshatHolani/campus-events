import { getCategoryStyle } from '../utils/categories'
import { formatDate, formatTime, parseDate, relativeLabel } from '../utils/date'
import { ArrowRightIcon, BookmarkIcon, CalendarIcon, PinIcon } from './Icons'

export default function EventCard({ event, saved, onToggleSave, onOpen, index }) {
  const style = getCategoryStyle(event.category)
  const soon = relativeLabel(event.date)
  const d = parseDate(event.date)
  const ended = soon === 'Ended'

  return (
    <article
      onClick={() => onOpen(event.id)}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 animate-fade-up hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 ${
        ended ? 'opacity-60 grayscale-[60%] hover:opacity-100' : ''
      }`}
    >
      {/* cover */}
      <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${style.gradient}`}>
        <span
          className="absolute -bottom-6 -right-4 text-[7rem] leading-none opacity-90 drop-shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
          aria-hidden="true"
        >
          {style.emoji}
        </span>

        {/* date block */}
        <div className="absolute left-4 top-4 rounded-2xl bg-white/90 px-3 py-2 text-center shadow-md backdrop-blur dark:bg-slate-950/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            {d.toLocaleDateString('en-IN', { month: 'short' })}
          </p>
          <p className="text-xl font-extrabold leading-none">{d.getDate()}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleSave(event.id)
          }}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${event.title} from saved` : `Save ${event.title}`}
          title={saved ? 'Saved' : 'Save'}
          className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full shadow-md backdrop-blur transition-all duration-200 hover:scale-110 active:scale-90 ${
            saved ? 'bg-indigo-600 text-white' : 'bg-white/90 text-slate-700 dark:bg-slate-950/80 dark:text-slate-200'
          }`}
        >
          <BookmarkIcon filled={saved} className="h-5 w-5" />
        </button>

        {soon && (
          <span className="absolute bottom-4 left-4 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {soon}
          </span>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}>{event.category}</span>
        <h3 className="mt-3 text-lg font-bold leading-snug transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{event.description}</p>

        <div className="mt-4 space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 shrink-0" />
            {formatDate(event.date)} · {formatTime(event.startTime)}
          </p>
          <p className="flex items-center gap-2">
            <PinIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <span className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">by {event.organizer}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpen(event.id)
            }}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg text-sm font-semibold text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-400"
          >
            View details
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  )
}
