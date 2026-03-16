import PropTypes from 'prop-types'
import { useState } from 'react'
import { computeMatch } from '../matching.js'
import { PhaseIndicator } from './PhaseIndicator.jsx'

export function SeniorBrowser({ 
  currentJunior, 
  seniors, 
  requests, 
  onRequestBuddy 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [programFilter, setProgramFilter] = useState('')
  
  // Get unique programs for filter
  const programs = [...new Set(seniors.map(s => s.studyProgram))].sort()
  
  // Calculate compatibility scores and filter
  const seniorsWithScores = seniors
    .map(senior => {
      const match = computeMatch(currentJunior, senior)
      const hasRequested = requests.some(
        r => r.juniorId === currentJunior.id && r.seniorId === senior.id
      )
      return {
        ...senior,
        score: match.score,
        breakdown: match.breakdown,
        hasRequested,
      }
    })
    .filter(senior => {
      const matchesSearch = 
        senior.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        senior.interests.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesProgram = !programFilter || senior.studyProgram === programFilter
      return matchesSearch && matchesProgram
    })
    .sort((a, b) => b.score - a.score)
  
  const requestedCount = requests.filter(r => r.juniorId === currentJunior.id).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-tumBlue font-medium">
            Phase 1 - Request
          </p>
          <h2 className="text-lg font-bold text-tumSecondary">
            Browse Senior Buddies
          </h2>
          <p className="text-xs text-tumSecondary/60 mt-1">
            Review profiles and request buddies you would like to be matched with.
            You can request multiple seniors.
          </p>
        </div>
        <PhaseIndicator currentPhase="request" />
      </div>
      
      {/* Stats */}
      <div className="flex gap-3">
        <div className="bg-white rounded-xl card-shadow border border-border px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-tumBlue font-medium">Requests Sent</p>
          <p className="text-2xl font-bold text-tumSecondary">{requestedCount}</p>
        </div>
        <div className="bg-white rounded-xl card-shadow border border-border px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-tumBlue font-medium">Available Seniors</p>
          <p className="text-2xl font-bold text-tumSecondary">{seniors.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search by name or interest..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tumBlue/20 focus:border-tumBlue min-w-[200px]"
        />
        <select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="rounded-lg border border-border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tumBlue/20 focus:border-tumBlue"
        >
          <option value="">All Programs</option>
          {programs.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Senior cards grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {seniorsWithScores.map(senior => (
          <div
            key={senior.id}
            className={`bg-white rounded-xl card-shadow border p-4 transition ${
              senior.hasRequested ? 'border-tumBlue/30 bg-tumBlue/5' : 'border-border hover:border-tumBlue/30'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-semibold shrink-0 ${senior.avatarColor}`}
                >
                  {senior.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-tumSecondary">{senior.name}</p>
                  <p className="text-xs text-tumSecondary/60">{senior.studyProgram}</p>
                  <p className="text-xs text-tumSecondary/60">{senior.age} years old</p>
                </div>
              </div>
              
              {/* Compatibility score */}
              <div className="text-right">
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-tumBlue/10">
                  <span className="text-lg font-bold text-tumBlue">{senior.score}</span>
                  <span className="text-[10px] text-tumBlue/70">match</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-tumSecondary/70 mt-3 line-clamp-2">{senior.bio}</p>
            
            {/* Interests */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {senior.interests.slice(0, 4).map(interest => {
                const isShared = currentJunior.interests.includes(interest)
                return (
                  <span
                    key={interest}
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      isShared
                        ? 'bg-tumBlue/10 text-tumBlue border-tumBlue/30'
                        : 'bg-background text-tumSecondary/60 border-border'
                    }`}
                  >
                    {interest}
                    {isShared && <span className="ml-1 text-[9px] font-medium">shared</span>}
                  </span>
                )
              })}
            </div>
            
            {/* Match breakdown */}
            <div className="mt-3 pt-3 border-t border-border text-[11px] text-tumSecondary/60">
              <span className="font-medium text-tumBlue">Score breakdown:</span>{' '}
              Interests {senior.breakdown.interests.score}% + 
              Program {senior.breakdown.studyProgram.score}% + 
              Bio {senior.breakdown.bio.score}%
            </div>
            
            {/* Request button */}
            <button
              onClick={() => onRequestBuddy(senior.id)}
              disabled={senior.hasRequested}
              className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition ${
                senior.hasRequested
                  ? 'bg-tumBlue/10 text-tumBlue border border-tumBlue/30 cursor-default'
                  : 'bg-tumBlue text-white hover:bg-tumSecondary'
              }`}
            >
              {senior.hasRequested ? 'Requested' : 'Request Buddy'}
            </button>
          </div>
        ))}
      </div>
      
      {seniorsWithScores.length === 0 && (
        <div className="text-center py-10 text-tumSecondary/60 text-sm">
          No seniors found matching your search criteria.
        </div>
      )}
    </div>
  )
}

SeniorBrowser.propTypes = {
  currentJunior: PropTypes.object.isRequired,
  seniors: PropTypes.array.isRequired,
  requests: PropTypes.array.isRequired,
  onRequestBuddy: PropTypes.func.isRequired,
}
