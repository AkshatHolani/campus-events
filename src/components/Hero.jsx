import { ArrowRightIcon, BookmarkIcon } from './Icons'

export default function Hero({ stats, loading, onShowSaved }) {
  return (
    <section className="relative overflow-hidden">
      {/* soft background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-fuchsia-400/25 blur-3xl dark:bg-fuchsia-600/15" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-16">
        <div className="max-w-3xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            {loading
              ? 'Loading events…'
              : stats.thisWeek > 0
                ? `${stats.thisWeek} happening this week`
                : stats.nextDays !== null
                  ? `Next event in ${stats.nextDays} days`
                  : 'New events coming soon'}
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Never miss what's happening on{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              campus
            </span>
            .
          </h1>

          <p className="mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Hackathons, fests, workshops and tournaments, all in one place. Search, filter by what you love and save
            events so you don't forget them.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#events" className="btn btn-primary px-6 py-3 text-base">
              Browse events <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a href="#events" onClick={onShowSaved} className="btn btn-ghost px-6 py-3 text-base">
              <BookmarkIcon className="h-4 w-4" /> My saved events
            </a>
          </div>
        </div>

        <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 animate-fade-up [animation-delay:150ms]">
          {[
            { label: 'Upcoming events', value: stats.total },
            { label: 'Categories', value: stats.categories },
            { label: 'Organising clubs', value: stats.organizers },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
            >
              <p className="text-2xl font-extrabold sm:text-3xl">{loading ? '–' : s.value}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
