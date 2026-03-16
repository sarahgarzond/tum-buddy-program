import './App.css'
import { useState } from 'react'
import { seniorBuddies, juniorBuddies, activitiesSeed, initialMessages } from './data.js'

// Components
import { LandingPage } from './components/LandingPage.jsx'
import { SeniorBrowser } from './components/SeniorBrowser.jsx'
import { RequestManagement } from './components/RequestManagement.jsx'
import { RankingInterface } from './components/RankingInterface.jsx'
import { MatchResults } from './components/MatchResults.jsx'
import { AdminPanel } from './components/AdminPanel.jsx'
import { MessagesView } from './components/MessagesView.jsx'
import { ActivitiesView } from './components/ActivitiesView.jsx'
import { ProfileView } from './components/ProfileView.jsx'

// Demo data: pre-populate some requests for the demo
const initialRequests = [
  { id: 'r1', juniorId: 'j1', seniorId: 's1', timestamp: '2026-03-01T10:00' },
  { id: 'r2', juniorId: 'j1', seniorId: 's5', timestamp: '2026-03-01T10:05' },
  { id: 'r3', juniorId: 'j1', seniorId: 's2', timestamp: '2026-03-01T10:10' },
  { id: 'r4', juniorId: 'j2', seniorId: 's2', timestamp: '2026-03-01T11:00' },
  { id: 'r5', juniorId: 'j2', seniorId: 's4', timestamp: '2026-03-01T11:05' },
  { id: 'r6', juniorId: 'j3', seniorId: 's3', timestamp: '2026-03-01T12:00' },
  { id: 'r7', juniorId: 'j3', seniorId: 's1', timestamp: '2026-03-01T12:05' },
  { id: 'r8', juniorId: 'j4', seniorId: 's4', timestamp: '2026-03-01T13:00' },
  { id: 'r9', juniorId: 'j4', seniorId: 's2', timestamp: '2026-03-01T13:05' },
  { id: 'r10', juniorId: 'j5', seniorId: 's5', timestamp: '2026-03-01T14:00' },
  { id: 'r11', juniorId: 'j5', seniorId: 's1', timestamp: '2026-03-01T14:05' },
  { id: 'r12', juniorId: 'j6', seniorId: 's2', timestamp: '2026-03-01T15:00' },
  { id: 'r13', juniorId: 'j6', seniorId: 's4', timestamp: '2026-03-01T15:05' },
  { id: 'r14', juniorId: 'j7', seniorId: 's3', timestamp: '2026-03-01T16:00' },
  { id: 'r15', juniorId: 'j7', seniorId: 's1', timestamp: '2026-03-01T16:05' },
  { id: 'r16', juniorId: 'j8', seniorId: 's2', timestamp: '2026-03-01T17:00' },
  { id: 'r17', juniorId: 'j9', seniorId: 's3', timestamp: '2026-03-01T18:00' },
  { id: 'r18', juniorId: 'j9', seniorId: 's5', timestamp: '2026-03-01T18:05' },
  { id: 'r19', juniorId: 'j10', seniorId: 's4', timestamp: '2026-03-01T19:00' },
  { id: 'r20', juniorId: 'j10', seniorId: 's5', timestamp: '2026-03-01T19:05' },
]

function App() {
  // Core state
  const [mode, setMode] = useState('landing') // landing | demo
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null) // junior | senior | admin
  const [currentPhase, setCurrentPhase] = useState('request') // request | ranking | matched
  const [activeTab, setActiveTab] = useState('main')
  
  // Data state
  const [requests, setRequests] = useState(initialRequests)
  const [juniorRankings, setJuniorRankings] = useState({})
  const [seniorRankings, setSeniorRankings] = useState({})
  const [matchResults, setMatchResults] = useState({})
  const [activities, setActivities] = useState(activitiesSeed)
  const [messages, setMessages] = useState(initialMessages)
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)

  // Handle landing page mode selection
  const handleSelectMode = (option) => {
    if (option.role === 'admin') {
      setUserRole('admin')
      setCurrentUser({ id: 'admin', name: 'Administrator', role: 'admin' })
      setMode('demo')
      return
    }

    // Set the phase based on the selected option
    if (option.phase === 'request') {
      setCurrentPhase('request')
    } else if (option.phase === 'ranking') {
      setCurrentPhase('ranking')
    }

    if (option.role === 'junior') {
      setUserRole('junior')
      setCurrentUser(juniorBuddies[0]) // Use first junior as demo
    } else if (option.role === 'senior') {
      setUserRole('senior')
      setCurrentUser(seniorBuddies[0]) // Use first senior as demo
    }
    
    setMode('demo')
  }

  // Handle buddy request
  const handleRequestBuddy = (seniorId) => {
    if (!currentUser || userRole !== 'junior') return
    
    const existingRequest = requests.find(
      r => r.juniorId === currentUser.id && r.seniorId === seniorId
    )
    
    if (existingRequest) {
      // Remove request
      setRequests(prev => prev.filter(r => r.id !== existingRequest.id))
    } else {
      // Add request
      setRequests(prev => [
        ...prev,
        {
          id: `r${Date.now()}`,
          juniorId: currentUser.id,
          seniorId,
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }

  // Handle ranking updates
  const handleUpdateJuniorRanking = (ranking) => {
    setJuniorRankings(prev => ({
      ...prev,
      [currentUser.id]: ranking,
    }))
  }

  const handleUpdateSeniorRanking = (ranking) => {
    setSeniorRankings(prev => ({
      ...prev,
      [currentUser.id]: ranking,
    }))
  }

  const handleSubmitRanking = (ranking) => {
    if (userRole === 'junior') {
      handleUpdateJuniorRanking(ranking)
    } else if (userRole === 'senior') {
      handleUpdateSeniorRanking(ranking)
    }
  }

  // Handle activity join toggle
  const handleToggleJoin = (activityId) => {
    if (!currentUser) return
    setActivities(prev =>
      prev.map(a =>
        a.id === activityId
          ? {
              ...a,
              participants: a.participants.includes(currentUser.id)
                ? a.participants.filter(id => id !== currentUser.id)
                : [...a.participants, currentUser.id],
            }
          : a,
      ),
    )
  }

  // Handle send message
  const handleSendMessage = ({ from, to, text }) => {
    setMessages(prev => [
      ...prev,
      {
        id: `m${Date.now()}`,
        from,
        to,
        text,
        timestamp: new Date().toISOString(),
      },
    ])
  }

  // Handle matching
  const handleRunMatching = (results) => {
    setMatchResults(results)
    setCurrentPhase('matched')
  }

  // Back to landing
  const handleBackToLanding = () => {
    setMode('landing')
    setCurrentUser(null)
    setUserRole(null)
    setActiveTab('main')
  }

  // Render landing page
  if (mode === 'landing') {
    return <LandingPage onSelectMode={handleSelectMode} />
  }

  // Get tabs based on role and phase
  const getTabs = () => {
    if (userRole === 'admin') {
      return [
        { id: 'main', label: 'Dashboard' },
      ]
    }
    
    const tabs = [{ id: 'main', label: currentPhase === 'request' ? 'Browse' : currentPhase === 'ranking' ? 'Ranking' : 'Match' }]
    
    if (currentPhase === 'matched') {
      tabs.push({ id: 'activities', label: 'Activities' })
      tabs.push({ id: 'profile', label: 'Profile' })
    }
    
    return tabs
  }

  const tabs = getTabs()

  // Render main content based on role, phase, and active tab
  const renderContent = () => {
    // Admin panel
    if (userRole === 'admin') {
      return (
        <AdminPanel
          juniors={juniorBuddies}
          seniors={seniorBuddies}
          requests={requests}
          juniorRankings={juniorRankings}
          seniorRankings={seniorRankings}
          matchResults={matchResults}
          onRunMatching={handleRunMatching}
          onSetPhase={setCurrentPhase}
          currentPhase={currentPhase}
        />
      )
    }

    // Junior views
    if (userRole === 'junior') {
      if (activeTab === 'activities' && currentPhase === 'matched') {
        return (
          <ActivitiesView
            activities={activities}
            onToggleJoin={handleToggleJoin}
            currentUser={currentUser}
            seniors={seniorBuddies}
          />
        )
      }
      
      if (activeTab === 'profile' && currentPhase === 'matched') {
        return <ProfileView junior={currentUser} seniors={seniorBuddies} />
      }

      if (currentPhase === 'request') {
        return (
          <SeniorBrowser
            currentJunior={currentUser}
            seniors={seniorBuddies}
            requests={requests}
            onRequestBuddy={handleRequestBuddy}
          />
        )
      }
      
      if (currentPhase === 'ranking') {
        return (
          <RankingInterface
            currentUser={currentUser}
            role="junior"
            candidates={seniorBuddies}
            requests={requests}
            ranking={juniorRankings[currentUser.id]}
            onUpdateRanking={handleUpdateJuniorRanking}
            onSubmitRanking={handleSubmitRanking}
          />
        )
      }
      
      if (currentPhase === 'matched') {
        return (
          <MatchResults
            currentUser={currentUser}
            role="junior"
            juniors={juniorBuddies}
            seniors={seniorBuddies}
            matchResults={matchResults}
          />
        )
      }
    }

    // Senior views
    if (userRole === 'senior') {
      if (activeTab === 'activities' && currentPhase === 'matched') {
        return (
          <ActivitiesView
            activities={activities}
            onToggleJoin={handleToggleJoin}
            currentUser={currentUser}
            seniors={seniorBuddies}
          />
        )
      }

      if (currentPhase === 'request') {
        return (
          <RequestManagement
            currentSenior={currentUser}
            juniors={juniorBuddies}
            requests={requests}
            currentPhase={currentPhase}
          />
        )
      }
      
      if (currentPhase === 'ranking') {
        return (
          <RankingInterface
            currentUser={currentUser}
            role="senior"
            candidates={juniorBuddies}
            requests={requests}
            ranking={seniorRankings[currentUser.id]}
            onUpdateRanking={handleUpdateSeniorRanking}
            onSubmitRanking={handleSubmitRanking}
          />
        )
      }
      
      if (currentPhase === 'matched') {
        return (
          <MatchResults
            currentUser={currentUser}
            role="senior"
            juniors={juniorBuddies}
            seniors={seniorBuddies}
            matchResults={matchResults}
          />
        )
      }
    }

    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
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
                {userRole === 'admin' ? 'Admin' : userRole === 'senior' ? 'Senior Buddy' : 'Junior Buddy'}
              </p>
              <p className="font-semibold text-white leading-tight text-sm">
                Buddy Program
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Navigation tabs */}
            <nav className="hidden sm:flex gap-1 text-xs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
            
            {/* Messages button */}
            {userRole !== 'admin' && currentPhase === 'matched' && (
              <button
                type="button"
                onClick={() => setIsMessagesOpen(v => !v)}
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
            )}
            
            {/* Back button */}
            <button
              onClick={handleBackToLanding}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Current user info bar */}
      {currentUser && userRole !== 'admin' && (
        <div className="bg-white border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-semibold ${currentUser.avatarColor}`}
              >
                {currentUser.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
              </div>
              <div>
                <p className="text-xs font-medium text-tumSecondary">{currentUser.name}</p>
                <p className="text-[10px] text-tumSecondary/60">{currentUser.studyProgram}</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-tumBlue/10 text-tumBlue font-medium uppercase tracking-wide">
              {currentPhase} Phase
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-tumSecondary/60 flex flex-wrap justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src="/fs-hn-logo.jpg" alt="" className="h-6 w-6 rounded object-cover" />
            <span>Fachschaft Heilbronn - TUM Student Council</span>
          </div>
          <span>Buddy Program Prototype</span>
        </div>
      </footer>

      {/* Messages sidebar */}
      {isMessagesOpen && currentPhase === 'matched' && (
        <aside className="fixed inset-y-16 right-0 w-full max-w-md bg-white shadow-xl border-l border-border z-20 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <p className="text-xs font-semibold text-tumSecondary">Messages</p>
            <button
              onClick={() => setIsMessagesOpen(false)}
              className="text-xs text-tumSecondary/60 hover:text-tumSecondary"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-3">
            <MessagesView
              juniors={juniorBuddies}
              seniors={seniorBuddies}
              currentJunior={userRole === 'junior' ? currentUser : juniorBuddies[0]}
              messages={messages}
              onSendMessage={handleSendMessage}
              compact
            />
          </div>
        </aside>
      )}
    </div>
  )
}

export default App
