// Visual style for each event category. Cards use a gradient "cover" with an
// emoji instead of remote images, so nothing can break or load slowly.
export const CATEGORY_STYLES = {
  Tech: {
    emoji: '💻',
    gradient: 'from-indigo-500 via-blue-500 to-cyan-400',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  },
  Workshop: {
    emoji: '🛠️',
    gradient: 'from-amber-400 via-orange-400 to-rose-400',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  },
  Cultural: {
    emoji: '🎭',
    gradient: 'from-fuchsia-500 via-pink-500 to-rose-400',
    badge: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
  },
  Sports: {
    emoji: '🏆',
    gradient: 'from-emerald-500 via-green-500 to-lime-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  Music: {
    emoji: '🎸',
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-400',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  },
  Career: {
    emoji: '💼',
    gradient: 'from-sky-500 via-teal-500 to-emerald-400',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  },
}

const FALLBACK = {
  emoji: '📅',
  gradient: 'from-slate-500 to-slate-400',
  badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] ?? FALLBACK
}
