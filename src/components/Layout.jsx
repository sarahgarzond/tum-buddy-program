import PropTypes from 'prop-types'

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'activities', label: 'Activities' },
  { id: 'profile', label: 'Profile' },
]

export function Layout({ activeTab, onTabChange, onToggleMessages, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* TUM Fachschaft Heilbronn inspired header */}
      <header className="header-gradient sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/fs-hn-logo.jpg" 
              alt="FS HN Logo" 
              className="h-10 w-10 rounded-lg object-cover"
            />
            <div>
              <p className="text-[11px] tracking-[0.16em] uppercase text-white/70">
                TUM Student Council
              </p>
              <p className="font-semibold text-white leading-tight text-sm">
                Buddy Program
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex gap-1 text-xs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 rounded-lg transition font-medium ${
                    activeTab === tab.id
                      ? 'bg-white text-tumBlue'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={onToggleMessages}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
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
      <footer className="border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-tumSecondary/70 flex flex-wrap justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src="/fs-hn-logo.jpg" alt="" className="h-6 w-6 rounded object-cover" />
            <span>Fachschaft Heilbronn - TUM Student Council</span>
          </div>
          <span>Buddy Program Prototype</span>
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

