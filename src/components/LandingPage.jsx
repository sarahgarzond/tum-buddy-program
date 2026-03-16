import { useState } from 'react'
import PropTypes from 'prop-types'

const demoOptions = [
  {
    id: 'junior-request',
    title: 'Junior Buddy (Request Phase)',
    description: 'Experience Phase 1: Browse senior profiles and submit buddy requests.',
    phase: 'request',
    role: 'junior',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'junior-ranking',
    title: 'Junior Buddy (Ranking Phase)',
    description: 'Experience Phase 2: Rank the seniors you requested by preference.',
    phase: 'ranking',
    role: 'junior',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 'senior-buddy',
    title: 'Senior Buddy',
    description: 'View incoming requests from juniors and rank them by preference.',
    phase: 'ranking',
    role: 'senior',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'admin',
    title: 'Admin Panel',
    description: 'Run the matching algorithm and view final buddy group assignments.',
    phase: 'admin',
    role: 'admin',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
]

export function LandingPage({ onSelectMode }) {
  const [step, setStep] = useState('intro') // 'intro' or 'choose'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="header-gradient">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
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
              Fachschaft Heilbronn
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {step === 'intro' ? (
          /* Step 1: How it works */
          <div className="max-w-2xl w-full bg-white border border-border rounded-2xl card-shadow px-6 py-8 md:px-10 md:py-12 space-y-8">
            <div className="text-center space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-tumBlue font-medium">
                Prototype Demo
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-tumSecondary">
                Buddy Program Matching System
              </h1>
              <p className="text-sm text-tumSecondary/70 max-w-md mx-auto">
                Experience the three-phase buddy matching process: Request, Rank, and Match.
                Choose a demo mode below to explore.
              </p>
            </div>

            {/* How it works section */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-tumSecondary text-center">
                How the matching works
              </h2>
              
              <div className="grid gap-3">
                <div className="flex items-start gap-3 bg-background rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full bg-tumBlue text-white flex items-center justify-center text-sm font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-tumSecondary text-sm">Each junior is assigned exactly 1 senior buddy</p>
                    <p className="text-xs text-tumSecondary/60 mt-0.5">Every new student gets personalized mentorship</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-background rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full bg-tumBlue text-white flex items-center justify-center text-sm font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-tumSecondary text-sm">Each senior can mentor up to 5 juniors</p>
                    <p className="text-xs text-tumSecondary/60 mt-0.5">Manageable groups for effective guidance</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-background rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full bg-tumBlue text-white flex items-center justify-center text-sm font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-tumSecondary text-sm">Matching respects preferences using the Gale-Shapley algorithm</p>
                    <p className="text-xs text-tumSecondary/60 mt-0.5">Fair allocation based on mutual rankings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase flow */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl bg-tumBlue/10 text-tumBlue flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-tumSecondary">Request</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-tumSecondary/30">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl bg-tumBlue/10 text-tumBlue flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-tumSecondary">Rank</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-tumSecondary/30">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl bg-tumBlue/10 text-tumBlue flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-tumSecondary">Match</span>
              </div>
            </div>

            {/* Continue button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setStep('choose')}
                className="inline-flex items-center gap-2 rounded-xl bg-tumBlue text-white px-8 py-3 text-sm font-medium hover:bg-tumSecondary transition"
              >
                Continue
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Choose your role */
          <div className="max-w-3xl w-full bg-white border border-border rounded-2xl card-shadow px-6 py-8 md:px-8 md:py-10 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-tumSecondary">
                Choose Your Role
              </h1>
              <p className="text-sm text-tumSecondary/70 max-w-md mx-auto">
                Select a demo mode to explore the buddy matching system from different perspectives.
              </p>
            </div>

            {/* Demo options grid */}
            <div className="grid md:grid-cols-2 gap-3">
              {demoOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSelectMode(option)}
                  className="w-full text-left rounded-xl border-2 border-border px-5 py-4 hover:border-tumBlue hover:bg-tumBlue/5 transition group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-tumBlue/10 text-tumBlue flex items-center justify-center group-hover:bg-tumBlue group-hover:text-white transition">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <span className="block font-semibold text-tumSecondary group-hover:text-tumBlue transition">
                        {option.title}
                      </span>
                      <span className="block text-xs text-tumSecondary/60 mt-1">
                        {option.description}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Back button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setStep('intro')}
                className="inline-flex items-center gap-2 text-sm text-tumSecondary/70 hover:text-tumBlue transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to overview
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-tumSecondary/60 flex flex-wrap justify-between gap-2">
          <span>Fachschaft Heilbronn - TUM Student Council</span>
          <span>Buddy Program Prototype</span>
        </div>
      </footer>
    </div>
  )
}

LandingPage.propTypes = {
  onSelectMode: PropTypes.func.isRequired,
}
