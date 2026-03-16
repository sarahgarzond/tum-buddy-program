import PropTypes from 'prop-types'

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'activities', label: 'Activities' },
  { id: 'profile', label: 'Profile' },
]

export function Layout({ activeTab, onTabChange, onToggleMessages, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-semibold">
              SC
            </div>
            <div>
              <p className="text-[11px] tracking-[0.16em] uppercase text-slate-500">
                Campus Heilbronn
              </p>
              <p className="font-semibold text-slate-900 leading-tight text-sm">
                Buddy Program
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex gap-2 text-xs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-1.5 rounded-full transition font-medium ${
                    activeTab === tab.id
                      ? 'bg-blue-700 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={onToggleMessages}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50"
              aria-label="Open messages"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v9A2.5 2.5 0 0 1 17.5 17H8.7L5.4 19.4A1 1 0 0 1 4 18.6z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 text-xs text-slate-500 flex flex-wrap justify-between gap-2">
          <span>Prototype for TUM Campus Heilbronn Buddy Program</span>
          <span>In-memory demo · Matching scores are simulated</span>
        </div>
      </footer>
    </div>
  )
}

Layout.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onToggleMessages: PropTypes.func.isRequired,
  children: PropTypes.node,
}

