import { CheckIcon } from './Icons'

// Small notification at the bottom of the screen. `toast` is { id, message } or null.
export default function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4" role="status" aria-live="polite">
      <div
        key={toast.id}
        className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl animate-pop-in dark:bg-white dark:text-slate-900"
      >
        <CheckIcon className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
        {toast.message}
      </div>
    </div>
  )
}
