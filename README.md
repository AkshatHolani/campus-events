# CampusPulse: Campus Event Discovery

A responsive website where students browse college events, search and filter them by category, open full details and save the ones they're interested in.

Frontend only. Event data comes from a local JSON file (`public/events.json`); there is no backend.

**Live demo:** https://campus-events-eight.vercel.app/

## Features

- **Landing page:** sticky navbar, hero section with live stats, and event cards
- **Search:** matches the event name, description, venue, organising club and tags. Press `/` to jump to the search box and `Esc` to clear it
- **Category filters:** Tech, Workshop, Cultural, Sports, Music and Career, with live counts that update as you search
- **Sorting:** soonest first, latest first, or A–Z
- **Event details modal:** date, time, venue, organiser, capacity, highlights and tags
  - Closes with `Esc`, the ✕ button or a click outside
  - Each event has its own URL (`#event-3`), so a shared link opens straight into that event
- **Working buttons:**
  - **Save** bookmarks the event
  - **Add to calendar** opens a pre-filled Google Calendar event
  - **Share** uses the phone's share sheet, or copies the link on desktop
- **Bookmarks** are saved in `localStorage` and stay after a page refresh. There's a "Saved" filter too
- **Dark / light mode:** follows the system setting at first, then remembers your choice
- **Loading, empty and error states:** skeleton cards while loading, friendly messages when nothing matches or you have no saved events, and a retry button if loading fails
- **Past events** stay visible but are dimmed, marked "Ended" and moved to the end of the list
- **Responsive:** 1, 2 or 3 columns depending on screen width; mobile menu; the category chips scroll sideways on phones
- **Smooth animations:** staggered card fade-in, hover lift, modal pop-in. Animations are turned off for users who enable "reduce motion"

## Tech stack

| Tool | Why |
| --- | --- |
| [React 18](https://react.dev) | UI components and state |
| [Vite](https://vitejs.dev) | Dev server and production build |
| [Tailwind CSS 3](https://tailwindcss.com) | Styling, dark mode (`class` strategy) and responsive design |
| `localStorage` | Saves bookmarks and the theme choice |

No UI or icon libraries. The icons are small inline SVGs (`src/components/Icons.jsx`).

## Getting started

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone <your-repo-url>
cd campus-events
npm install
npm run dev
```

Then open http://localhost:5173.

To make a production build:

```bash
npm run build     # outputs to dist/
npm run preview   # serves the build locally
```

## Project structure

```
campus-events/
├── public/
│   └── events.json          # event data (edit this to add events)
├── src/
│   ├── App.jsx              # page layout + search / filter / sort / bookmark logic
│   ├── main.jsx             # React entry point
│   ├── index.css            # Tailwind layers + reusable button/chip classes
│   ├── components/
│   │   ├── Navbar.jsx       # sticky navbar, theme toggle, mobile menu
│   │   ├── Hero.jsx         # hero section with stats
│   │   ├── Filters.jsx      # search box, category chips, sort, saved toggle
│   │   ├── EventCard.jsx    # one event card
│   │   ├── EventModal.jsx   # event details dialog
│   │   ├── States.jsx       # skeleton, empty and error states
│   │   ├── Toast.jsx        # small notification ("Event saved")
│   │   ├── Footer.jsx
│   │   └── Icons.jsx        # inline SVG icons
│   ├── hooks/
│   │   ├── useEvents.js     # fetches events.json, tracks loading/error
│   │   ├── useLocalStorage.js  # useState that persists to localStorage
│   │   └── useTheme.js      # dark/light mode
│   └── utils/
│       ├── categories.js    # colours + emoji for each category
│       └── date.js          # date formatting, "In 3 days", Google Calendar link
└── index.html
```

## How it works

1. **Loading data:** `useEvents` fetches `/events.json` (with a short artificial delay so the loading skeleton is visible, like a real API) and exposes `status` as `loading`, `success` or `error`.
2. **Filtering:** `App.jsx` derives the visible list with `useMemo` in three steps: search + saved filter → category filter → sort. Category counts are computed after the search step, so the chips always show how many results each category would give.
3. **Bookmarks:** an array of event IDs stored through the `useLocalStorage` hook. Reads and writes are wrapped in `try/catch`, so the site still works when storage is blocked (e.g. some private windows).
4. **Theme:** a tiny inline script in `index.html` applies the `dark` class *before* React loads, which avoids a white flash on dark-mode reloads. `useTheme` then keeps the class and the saved preference in sync.
5. **Modal ↔ URL:** opening an event sets the URL hash to `#event-<id>`. On page load (or a hash change) the app reads the hash and opens that event, which makes events shareable.

## Adding an event

Add an object to `public/events.json`:

```json
{
  "id": 17,
  "title": "My Event",
  "category": "Tech",
  "date": "2026-12-20",
  "startTime": "10:00",
  "endTime": "13:00",
  "venue": "Seminar Hall 1",
  "organizer": "Techspace",
  "seats": 100,
  "description": "One-line summary shown on the card.",
  "details": "Longer description shown in the modal.",
  "highlights": ["Point one", "Point two"],
  "tags": ["tag1", "tag2"]
}
```

`category` must be one of: `Tech`, `Workshop`, `Cultural`, `Sports`, `Music`, `Career`.
