import PropTypes from 'prop-types'
import { PhaseIndicator } from './PhaseIndicator.jsx'

export function MatchResults({
  currentUser,
  role,
  juniors,
  seniors,
  matchResults,
}) {
  // Find match for current user
  let matchedGroup = null
  
  if (role === 'junior') {
    // Find which senior the junior was matched to
    const juniorMatch = matchResults.juniorMatch?.[currentUser.id]
    if (juniorMatch) {
      const senior = seniors.find(s => s.id === juniorMatch)
      const fellowJuniors = Object.entries(matchResults.juniorMatch || {})
        .filter(([jId, sId]) => sId === juniorMatch && jId !== currentUser.id)
        .map(([jId]) => juniors.find(j => j.id === jId))
        .filter(Boolean)
      
      matchedGroup = {
        senior,
        juniors: [currentUser, ...fellowJuniors],
      }
    }
  } else {
    // Senior: find all juniors matched to them
    const matchedJuniorIds = matchResults.matches?.[currentUser.id] || []
    const matchedJuniors = matchedJuniorIds
      .map(jId => juniors.find(j => j.id === jId))
      .filter(Boolean)
    
    if (matchedJuniors.length > 0) {
      matchedGroup = {
        senior: currentUser,
        juniors: matchedJuniors,
      }
    }
  }

  const isUnmatched = !matchedGroup && (
    (role === 'junior' && matchResults.unmatched?.includes(currentUser.id)) ||
    (role === 'senior' && (!matchResults.matches?.[currentUser.id] || matchResults.matches[currentUser.id].length === 0))
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-tumBlue font-medium">
            Phase 3 - Results
          </p>
          <h2 className="text-lg font-bold text-tumSecondary">
            Your Buddy Match
          </h2>
          <p className="text-xs text-tumSecondary/60 mt-1">
            The matching algorithm has run. Here is your assigned buddy group.
          </p>
        </div>
        <PhaseIndicator currentPhase="matched" />
      </div>

      {/* Match status */}
      {matchedGroup ? (
        <div className="space-y-4">
          {/* Success message */}
          <div className="bg-tumBlue/10 border border-tumBlue/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tumBlue text-white flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-tumBlue">You have been matched!</p>
              <p className="text-xs text-tumSecondary/70">
                {role === 'junior'
                  ? `You have been assigned to ${matchedGroup.senior.name} as your senior buddy.`
                  : `You have been assigned ${matchedGroup.juniors.length} junior(s) to mentor.`}
              </p>
            </div>
          </div>

          {/* Group card */}
          <div className="bg-white rounded-2xl card-shadow border border-border overflow-hidden">
            {/* Senior header */}
            <div className="bg-tumBlue/5 border-b border-border p-4">
              <p className="text-xs uppercase tracking-wide text-tumBlue font-medium mb-2">Senior Buddy</p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-semibold ${matchedGroup.senior.avatarColor}`}
                >
                  {matchedGroup.senior.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-tumSecondary text-lg">{matchedGroup.senior.name}</p>
                  <p className="text-sm text-tumSecondary/60">{matchedGroup.senior.studyProgram}</p>
                  <p className="text-xs text-tumSecondary/50">{matchedGroup.senior.age} years old</p>
                </div>
                {role === 'senior' && (
                  <span className="ml-auto px-3 py-1 rounded-full bg-tumBlue text-white text-xs font-medium">
                    You
                  </span>
                )}
              </div>
              <p className="text-sm text-tumSecondary/70 mt-3">{matchedGroup.senior.bio}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {matchedGroup.senior.interests.map(interest => (
                  <span
                    key={interest}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-tumBlue/10 text-tumBlue border border-tumBlue/20"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Junior buddies */}
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-tumBlue font-medium mb-3">
                Junior Buddies ({matchedGroup.juniors.length})
              </p>
              <div className="space-y-3">
                {matchedGroup.juniors.map(junior => (
                  <div
                    key={junior.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      role === 'junior' && junior.id === currentUser.id
                        ? 'bg-tumBlue/5 border border-tumBlue/20'
                        : 'bg-background'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-semibold ${junior.avatarColor}`}
                    >
                      {junior.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-tumSecondary">{junior.name}</p>
                        {role === 'junior' && junior.id === currentUser.id && (
                          <span className="px-2 py-0.5 rounded-full bg-tumBlue text-white text-[10px] font-medium">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-tumSecondary/60">{junior.studyProgram}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
                      {junior.interests.slice(0, 2).map(interest => (
                        <span
                          key={interest}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-background text-tumSecondary/60 border border-border"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-background rounded-xl p-4 text-sm">
            <p className="font-medium text-tumSecondary mb-2">Next Steps</p>
            <ul className="space-y-1 text-xs text-tumSecondary/70 list-disc list-inside">
              <li>Introduce yourself to your buddy group via the Messages tab</li>
              <li>Schedule your first meetup</li>
              <li>Check out upcoming activities you can join together</li>
            </ul>
          </div>
        </div>
      ) : isUnmatched ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-amber-800">No match found</p>
            <p className="text-xs text-amber-700/70">
              Unfortunately, you could not be matched this round. Please contact the student council for assistance.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl card-shadow border border-border p-6 text-center">
          <p className="text-sm text-tumSecondary/60">
            Matching has not been run yet. Please wait for the admin to run the matching algorithm.
          </p>
        </div>
      )}
    </div>
  )
}

MatchResults.propTypes = {
  currentUser: PropTypes.object.isRequired,
  role: PropTypes.oneOf(['junior', 'senior']).isRequired,
  juniors: PropTypes.array.isRequired,
  seniors: PropTypes.array.isRequired,
  matchResults: PropTypes.object.isRequired,
}
