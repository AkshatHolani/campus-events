export default function Footer() {
  return (
    <footer id="about" className="mt-20 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="text-lg font-extrabold">
            Campus<span className="text-indigo-600 dark:text-indigo-400">Pulse</span>
          </p>
          <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
            One place for every hackathon, fest, workshop and tournament on campus. Built so students spend less time
            scrolling group chats and more time showing up.
          </p>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Under the hood</p>
          <ul className="mt-2 space-y-1">
            <li>React + Vite</li>
            <li>Tailwind CSS</li>
            <li>Data from a local JSON file</li>
            <li>Bookmarks saved in localStorage</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-slate-200 py-5 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
        © {new Date().getFullYear()} CampusPulse · Frontend project
      </p>
    </footer>
  )
}
