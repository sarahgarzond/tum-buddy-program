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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
        <div className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-6 md:px-8 md:py-8 space-y-4">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Buddy Program – Demo access
          </h1>
          <p className="text-sm text-slate-600">
            Choose how you would like to explore the Buddy Program prototype.
          </p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setMode('onboarding')}
              className="w-full text-left rounded-md border border-slate-200 px-4 py-3 text-sm hover:border-blue-700 hover:bg-blue-50"
            >
              <span className="block font-semibold text-slate-900">
                Sign up as a new junior buddy
              </span>
              <span className="block text-xs text-slate-600">
                Enter your own profile, study program and interests to generate personal
                suggestions.
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentJunior(baseJunior)
                setMode('demo')
              }}
              className="w-full text-left rounded-md border border-slate-200 px-4 py-3 text-sm hover:border-slate-300"
            >
              <span className="block font-semibold text-slate-900">
                Continue as Maximilian Bauer (demo)
              </span>
              <span className="block text-xs text-slate-600">
                Use a prefilled profile to quickly show how matching, activities and
                messages work.
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'onboarding' && !currentJunior) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-start md:items-center justify-center px-4 py-10">
        <Onboarding onComplete={handleOnboardingComplete} />
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
