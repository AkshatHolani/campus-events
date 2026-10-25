import { AlertIcon } from './Icons'

// Placeholder card shown while events are loading
export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" aria-hidden="true">
      <div className="h-40 animate-pulse bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-5 w-4/5 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800/70" />
        <div className="h-4 w-2/3 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800/70" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800/70" />
      </div>
    </div>
  )
}

export function EmptyState({ emoji = '🔍', title, message, action }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 px-6 py-16 text-center animate-fade-up dark:border-slate-800">
      <span className="text-5xl" aria-hidden="true">
        {emoji}
      </span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-rose-200 bg-rose-50 px-6 py-16 text-center animate-fade-up dark:border-rose-500/30 dark:bg-rose-500/10">
      <AlertIcon className="h-10 w-10 text-rose-500" />
      <h3 className="mt-4 text-lg font-bold">Couldn't load events</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">
        Something went wrong while fetching the event list. Check your connection and try again.
      </p>
      <button onClick={onRetry} className="btn btn-primary mt-6">
        Try again
      </button>
    </div>
  )
}
