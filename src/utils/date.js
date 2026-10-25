// Dates in events.json are "YYYY-MM-DD". Parse them as local dates
// (new Date("2026-11-07") would be treated as UTC midnight and can shift a day).
export function parseDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDate(isoDate, options = {}) {
  return parseDate(isoDate).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...options,
  })
}

export function formatTime(time) {
  // "14:00" -> "2:00 PM"; leaves free text like "09:00 (next day)" readable too
  const match = /^(\d{1,2}):(\d{2})(.*)$/.exec(time)
  if (!match) return time
  const [, h, m, rest] = match
  const hour = Number(h)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  return `${hour % 12 || 12}:${m} ${suffix}${rest}`
}

export function daysUntil(isoDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((parseDate(isoDate) - today) / 86_400_000)
}

export function relativeLabel(isoDate) {
  const days = daysUntil(isoDate)
  if (days < 0) return 'Ended'
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days <= 7) return `In ${days} days`
  return null
}

// Builds a Google Calendar "add event" link (all-day if times aren't simple HH:MM)
export function googleCalendarUrl(event) {
  const day = event.date.replaceAll('-', '')
  const toStamp = (t) => {
    const m = /^(\d{2}):(\d{2})$/.exec(t)
    return m ? `${day}T${m[1]}${m[2]}00` : null
  }
  const start = toStamp(event.startTime)
  const end = toStamp(event.endTime)
  let dates
  if (start && end) {
    dates = `${start}/${end}`
  } else {
    const next = parseDate(event.date)
    next.setDate(next.getDate() + 1)
    const nextDay = `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, '0')}${String(next.getDate()).padStart(2, '0')}`
    dates = `${day}/${nextDay}`
  }
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates,
    details: event.description,
    location: event.venue,
    ctz: 'Asia/Kolkata',
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
