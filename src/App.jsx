import './App.css'
import { useState } from 'react'
import { Layout } from './components/Layout.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { ActivitiesView } from './components/ActivitiesView.jsx'
import { MessagesView } from './components/MessagesView.jsx'
import { ProfileView } from './components/ProfileView.jsx'
import { Onboarding } from './components/Onboarding.jsx'
import { seniorBuddies, juniorBuddies, activitiesSeed, initialMessages } from './data.js'

function App() {
  const [mode, setMode] = useState('landing')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activities, setActivities] = useState(activitiesSeed)
  const [messages, setMessages] = useState(initialMessages)
  const [currentJunior, setCurrentJunior] = useState(null)
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)

  const baseJunior = juniorBuddies[0]

  const handleCreateActivity = (data) => {
    setActivities((prev) => [
      ...prev,
      {
        id: `a${prev.length + 1}`,
        ...data,
        participants: currentJunior ? [currentJunior.id] : [],
      },
    ])
  }

  const handleToggleJoin = (activityId) => {
    if (!currentJunior) return
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? {
              ...a,
              participants: a.participants.includes(currentJunior.id)
                ? a.participants.filter((id) => id !== currentJunior.id)
                : [...a.participants, currentJunior.id],
            }
          : a,
      ),
    )
  }

  const handleSendMessage = ({ from, to, text }) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `m${prev.length + 1}`,
        from,
        to,
        text,
        timestamp: new Date().toISOString(),
      },
    ])
  }

  const handleOnboardingComplete = ({ name, program, bio, expectations, interests }) => {
    const junior = {
      ...baseJunior,
      name,
      studyProgram: program,
      relatedPrograms: baseJunior.relatedPrograms,
      bio: bio,
      bioKeywords: [...new Set([...bio.split(/\s+/), ...expectations.split(/\s+/)])],
      interests,
    }

    setCurrentJunior(junior)

    setActiveTab('dashboard')
  }

  if (mode === 'landing') {
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
          <div className="max-w-xl w-full bg-white border border-border rounded-2xl card-shadow px-6 py-8 md:px-8 md:py-10 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-[0.16em] text-tumBlue font-medium">
                Welcome to the
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-tumSecondary">
                Buddy Program
              </h1>
              <p className="text-sm text-tumSecondary/70 max-w-md mx-auto">
                Connect with senior students who can help guide you through your first semester at TUM Campus Heilbronn.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setMode('onboarding')}
                className="w-full text-left rounded-xl border-2 border-tumBlue/20 px-5 py-4 text-sm hover:border-tumBlue hover:bg-tumBlue/5 transition group"
              >
                <span className="block font-semibold text-tumSecondary group-hover:text-tumBlue transition">
                  Sign up as a new junior buddy
                </span>
                <span className="block text-xs text-tumSecondary/60 mt-1">
                  Enter your own profile, study program and interests to generate personal suggestions.
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentJunior(baseJunior)
                  setMode('demo')
                }}
                className="w-full text-left rounded-xl border-2 border-border px-5 py-4 text-sm hover:border-tumSecondary/30 transition"
              >
                <span className="block font-semibold text-tumSecondary">
                  Continue as Maximilian Bauer (demo)
                </span>
                <span className="block text-xs text-tumSecondary/60 mt-1">
                  Use a prefilled profile to quickly show how matching, activities and messages work.
                </span>
              </button>
            </div>
          </div>
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

  if (mode === 'onboarding' && !currentJunior) {
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
                Buddy Program
              </p>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-start md:items-center justify-center px-4 py-10">
          <Onboarding onComplete={handleOnboardingComplete} />
        </main>
      </div>
    )
  }

  if (!currentJunior) {
    return null
  }

  let content = null

  if (activeTab === 'dashboard') {
    content = (
      <Dashboard
        junior={currentJunior}
        seniors={seniorBuddies}
        activities={activities}
        messages={messages}
      />
    )
  } else if (activeTab === 'activities') {
    content = (
      <ActivitiesView
        activities={activities}
        onToggleJoin={handleToggleJoin}
        currentUser={currentJunior}
        seniors={seniorBuddies}
      />
    )
  } else if (activeTab === 'profile') {
    content = <ProfileView junior={currentJunior} seniors={seniorBuddies} />
  }

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onToggleMessages={() => setIsMessagesOpen((v) => !v)}
    >
      {content}
      {isMessagesOpen && (
        <aside className="fixed inset-y-16 right-0 w-full max-w-md bg-white shadow-xl border-l border-slate-200 z-20 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-700">Messages</p>
            <button
              onClick={() => setIsMessagesOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-3">
            <MessagesView
              juniors={juniorBuddies}
              seniors={seniorBuddies}
              currentJunior={currentJunior}
              messages={messages}
              onSendMessage={handleSendMessage}
              compact
            />
          </div>
        </aside>
      )}
    </Layout>
  )
}

export default App
