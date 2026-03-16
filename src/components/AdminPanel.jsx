import PropTypes from 'prop-types'
import { useState } from 'react'
import { runGaleShapleyMatching, generateAutoRankings } from '../matching.js'

export function AdminPanel({
  juniors,
  seniors,
  requests,
  juniorRankings,
  seniorRankings,
  matchResults,
  onRunMatching,
  onSetPhase,
  currentPhase,
}) {
  const [isRunning, setIsRunning] = useState(false)
  const [log, setLog] = useState([])

  const addLog = (message) => {
    setLog(prev => [...prev, { time: new Date().toLocaleTimeString(), message }])
  }

  const handleRunMatching = () => {
    setIsRunning(true)
    setLog([])
    
    addLog('Starting matching algorithm...')
    
    // Generate auto rankings for users who haven't submitted
    addLog('Generating rankings for users who did not submit preferences...')
    const autoRankings = generateAutoRankings(juniors, seniors, requests)
    
    // Merge manual rankings with auto rankings
    const finalJuniorRankings = { ...autoRankings.juniorRankings }
    const finalSeniorRankings = { ...autoRankings.seniorRankings }
    
    // Override with manual rankings where they exist
    Object.entries(juniorRankings).forEach(([jId, ranking]) => {
      if (ranking && ranking.length > 0) {
        finalJuniorRankings[jId] = ranking
      }
    })
    Object.entries(seniorRankings).forEach(([sId, ranking]) => {
      if (ranking && ranking.length > 0) {
        finalSeniorRankings[sId] = ranking
      }
    })
    
    addLog(`Processing ${juniors.length} juniors and ${seniors.length} seniors`)
    addLog(`Total requests: ${requests.length}`)
    
    // Run matching
    setTimeout(() => {
      addLog('Running Gale-Shapley algorithm...')
      
      const results = runGaleShapleyMatching(
        juniors,
        seniors,
        finalJuniorRankings,
        finalSeniorRankings,
        5 // senior capacity
      )
      
      addLog('Matching complete!')
      addLog(`Matched juniors: ${Object.keys(results.juniorMatch).length}`)
      addLog(`Unmatched juniors: ${results.unmatched.length}`)
      
      // Count seniors with matches
      const seniorsWithMatches = Object.values(results.matches).filter(arr => arr.length > 0).length
      addLog(`Seniors with assigned juniors: ${seniorsWithMatches}`)
      
      onRunMatching(results)
      setIsRunning(false)
      addLog('Results saved. Users can now view their matches.')
    }, 1500)
  }

  // Calculate stats
  const totalRequests = requests.length
  const uniqueJuniorsWithRequests = new Set(requests.map(r => r.juniorId)).size
  const uniqueSeniorsWithRequests = new Set(requests.map(r => r.seniorId)).size
  const juniorsWhoRanked = Object.keys(juniorRankings).filter(k => juniorRankings[k]?.length > 0).length
  const seniorsWhoRanked = Object.keys(seniorRankings).filter(k => seniorRankings[k]?.length > 0).length

  const matchedJuniors = matchResults?.juniorMatch ? Object.keys(matchResults.juniorMatch).length : 0
  const unmatchedJuniors = matchResults?.unmatched?.length || 0

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-tumBlue font-medium">
            Admin Panel
          </p>
          <h2 className="text-lg font-bold text-tumSecondary">
            Buddy Program Management
          </h2>
          <p className="text-xs text-tumSecondary/60 mt-1">
            Manage phases and run the matching algorithm.
          </p>
        </div>
      </div>

      {/* Phase controls */}
      <div className="bg-white rounded-xl card-shadow border border-border p-4">
        <p className="text-xs uppercase tracking-wide text-tumBlue font-medium mb-3">Current Phase</p>
        <div className="flex flex-wrap gap-2">
          {['request', 'ranking', 'matched'].map(phase => (
            <button
              key={phase}
              onClick={() => onSetPhase(phase)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                currentPhase === phase
                  ? 'bg-tumBlue text-white'
                  : 'bg-background text-tumSecondary hover:bg-tumBlue/10'
              }`}
            >
              {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
            </button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl card-shadow border border-border p-4">
          <p className="text-[11px] uppercase tracking-wide text-tumBlue font-medium">Total Juniors</p>
          <p className="text-2xl font-bold text-tumSecondary">{juniors.length}</p>
        </div>
        <div className="bg-white rounded-xl card-shadow border border-border p-4">
          <p className="text-[11px] uppercase tracking-wide text-tumBlue font-medium">Total Seniors</p>
          <p className="text-2xl font-bold text-tumSecondary">{seniors.length}</p>
        </div>
        <div className="bg-white rounded-xl card-shadow border border-border p-4">
          <p className="text-[11px] uppercase tracking-wide text-tumBlue font-medium">Total Requests</p>
          <p className="text-2xl font-bold text-tumSecondary">{totalRequests}</p>
        </div>
        <div className="bg-white rounded-xl card-shadow border border-border p-4">
          <p className="text-[11px] uppercase tracking-wide text-tumBlue font-medium">Max Capacity</p>
          <p className="text-2xl font-bold text-tumSecondary">{seniors.length * 5}</p>
        </div>
      </div>

      {/* Detailed stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl card-shadow border border-border p-4">
          <p className="text-sm font-bold text-tumSecondary mb-3">Request Phase Stats</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-tumSecondary/70">Juniors who made requests</span>
              <span className="font-medium text-tumSecondary">{uniqueJuniorsWithRequests}/{juniors.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tumSecondary/70">Seniors who received requests</span>
              <span className="font-medium text-tumSecondary">{uniqueSeniorsWithRequests}/{seniors.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tumSecondary/70">Avg requests per junior</span>
              <span className="font-medium text-tumSecondary">
                {uniqueJuniorsWithRequests > 0 ? (totalRequests / uniqueJuniorsWithRequests).toFixed(1) : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl card-shadow border border-border p-4">
          <p className="text-sm font-bold text-tumSecondary mb-3">Ranking Phase Stats</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-tumSecondary/70">Juniors who submitted rankings</span>
              <span className="font-medium text-tumSecondary">{juniorsWhoRanked}/{uniqueJuniorsWithRequests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-tumSecondary/70">Seniors who submitted rankings</span>
              <span className="font-medium text-tumSecondary">{seniorsWhoRanked}/{uniqueSeniorsWithRequests}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matching results */}
      {matchResults && Object.keys(matchResults).length > 0 && (
        <div className="bg-white rounded-xl card-shadow border border-border p-4">
          <p className="text-sm font-bold text-tumSecondary mb-3">Matching Results</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-tumBlue/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-tumBlue">{matchedJuniors}</p>
              <p className="text-xs text-tumSecondary/70">Matched Juniors</p>
            </div>
            <div className="bg-amber-100 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-700">{unmatchedJuniors}</p>
              <p className="text-xs text-tumSecondary/70">Unmatched</p>
            </div>
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-tumSecondary">
                {Object.values(matchResults.matches || {}).filter(arr => arr.length > 0).length}
              </p>
              <p className="text-xs text-tumSecondary/70">Active Seniors</p>
            </div>
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-tumSecondary">
                {matchedJuniors > 0 ? ((matchedJuniors / juniors.length) * 100).toFixed(0) : 0}%
              </p>
              <p className="text-xs text-tumSecondary/70">Match Rate</p>
            </div>
          </div>
        </div>
      )}

      {/* Run matching */}
      <div className="bg-white rounded-xl card-shadow border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-tumSecondary">Run Matching Algorithm</p>
            <p className="text-xs text-tumSecondary/60">
              Execute Gale-Shapley algorithm to compute optimal buddy assignments.
            </p>
          </div>
          <button
            onClick={handleRunMatching}
            disabled={isRunning || totalRequests === 0}
            className={`px-6 py-2.5 rounded-xl font-medium transition ${
              isRunning || totalRequests === 0
                ? 'bg-border text-tumSecondary/50 cursor-not-allowed'
                : 'bg-tumBlue text-white hover:bg-tumSecondary'
            }`}
          >
            {isRunning ? 'Running...' : 'Run Matching'}
          </button>
        </div>
        
        {/* Log output */}
        {log.length > 0 && (
          <div className="bg-tumSecondary rounded-lg p-3 mt-3 max-h-48 overflow-auto font-mono text-xs">
            {log.map((entry, i) => (
              <div key={i} className="text-white/90">
                <span className="text-tumBlue/70">[{entry.time}]</span> {entry.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All matches table */}
      {matchResults && Object.keys(matchResults.matches || {}).length > 0 && (
        <div className="bg-white rounded-xl card-shadow border border-border p-4">
          <p className="text-sm font-bold text-tumSecondary mb-3">All Buddy Groups</p>
          <div className="space-y-3 max-h-96 overflow-auto">
            {Object.entries(matchResults.matches || {}).map(([seniorId, juniorIds]) => {
              if (juniorIds.length === 0) return null
              const senior = seniors.find(s => s.id === seniorId)
              const matchedJuniors = juniorIds.map(jId => juniors.find(j => j.id === jId)).filter(Boolean)
              
              return (
                <div key={seniorId} className="bg-background rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold ${senior?.avatarColor}`}
                    >
                      {senior?.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-tumSecondary text-sm">{senior?.name}</p>
                      <p className="text-[11px] text-tumSecondary/60">{senior?.studyProgram}</p>
                    </div>
                    <span className="ml-auto text-xs text-tumBlue font-medium">
                      {juniorIds.length} junior(s)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-10">
                    {matchedJuniors.map(junior => (
                      <span
                        key={junior.id}
                        className="text-xs px-2 py-1 rounded-lg bg-white border border-border text-tumSecondary"
                      >
                        {junior.name}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

AdminPanel.propTypes = {
  juniors: PropTypes.array.isRequired,
  seniors: PropTypes.array.isRequired,
  requests: PropTypes.array.isRequired,
  juniorRankings: PropTypes.object.isRequired,
  seniorRankings: PropTypes.object.isRequired,
  matchResults: PropTypes.object.isRequired,
  onRunMatching: PropTypes.func.isRequired,
  onSetPhase: PropTypes.func.isRequired,
  currentPhase: PropTypes.string.isRequired,
}
