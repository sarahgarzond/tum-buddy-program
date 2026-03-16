import PropTypes from 'prop-types'
import { computeMatch } from '../matching.js'
import { PhaseIndicator } from './PhaseIndicator.jsx'

export function RequestManagement({ 
  currentSenior, 
  juniors, 
  requests,
  currentPhase 
}) {
  // Get juniors who have requested this senior
  const requestingJuniorIds = requests
    .filter(r => r.seniorId === currentSenior.id)
    .map(r => r.juniorId)
  
  const requestingJuniors = juniors
    .filter(j => requestingJuniorIds.includes(j.id))
    .map(junior => {
      const match = computeMatch(junior, currentSenior)
      return {
        ...junior,
        score: match.score,
        breakdown: match.breakdown,
      }
    })
    .sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-tumBlue font-medium">
            Senior Dashboard
          </p>
          <h2 className="text-lg font-bold text-tumSecondary">
            Incoming Buddy Requests
          </h2>
          <p className="text-xs text-tumSecondary/60 mt-1">
            These juniors have requested you as their buddy. 
            {currentPhase === 'ranking' && ' You can now rank them by preference.'}
          </p>
        </div>
        <PhaseIndicator currentPhase={currentPhase} />
      </div>
      
      {/* Stats */}
      <div className="flex gap-3">
        <div className="bg-white rounded-xl card-shadow border border-border px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-tumBlue font-medium">Requests Received</p>
          <p className="text-2xl font-bold text-tumSecondary">{requestingJuniors.length}</p>
        </div>
        <div className="bg-white rounded-xl card-shadow border border-border px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-tumBlue font-medium">Your Capacity</p>
          <p className="text-2xl font-bold text-tumSecondary">5 juniors max</p>
        </div>
      </div>

      {/* Your profile card */}
      <div className="bg-white rounded-xl card-shadow border border-border p-4">
        <p className="text-xs uppercase tracking-wide text-tumBlue font-medium mb-2">Your Profile</p>
        <div className="flex items-start gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-semibold shrink-0 ${currentSenior.avatarColor}`}
          >
            {currentSenior.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-tumSecondary">{currentSenior.name}</p>
            <p className="text-xs text-tumSecondary/60">{currentSenior.studyProgram} - {currentSenior.age} years</p>
            <p className="text-xs text-tumSecondary/70 mt-1">{currentSenior.bio}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentSenior.interests.map(interest => (
                <span
                  key={interest}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-tumBlue/10 text-tumBlue border border-tumBlue/20"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Requesting juniors */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-tumSecondary">
          Juniors who requested you ({requestingJuniors.length})
        </h3>
        
        {requestingJuniors.length === 0 ? (
          <div className="bg-white rounded-xl card-shadow border border-border p-6 text-center">
            <p className="text-sm text-tumSecondary/60">
              No buddy requests yet. Juniors are currently browsing profiles.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {requestingJuniors.map(junior => (
              <div
                key={junior.id}
                className="bg-white rounded-xl card-shadow border border-border p-4 hover:border-tumBlue/30 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-semibold shrink-0 ${junior.avatarColor}`}
                    >
                      {junior.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-tumSecondary">{junior.name}</p>
                      <p className="text-xs text-tumSecondary/60">{junior.studyProgram}</p>
                    </div>
                  </div>
                  
                  {/* Compatibility score */}
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-tumBlue/10">
                    <span className="text-lg font-bold text-tumBlue">{junior.score}</span>
                    <span className="text-[10px] text-tumBlue/70">match</span>
                  </div>
                </div>
                
                <p className="text-xs text-tumSecondary/70 mt-2 line-clamp-2">{junior.bio}</p>
                
                {/* Shared interests */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {junior.interests.map(interest => {
                    const isShared = currentSenior.interests.includes(interest)
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
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

RequestManagement.propTypes = {
  currentSenior: PropTypes.object.isRequired,
  juniors: PropTypes.array.isRequired,
  requests: PropTypes.array.isRequired,
  currentPhase: PropTypes.string.isRequired,
}
