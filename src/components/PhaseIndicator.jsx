import PropTypes from 'prop-types'

const phases = [
  { id: 'request', label: 'Request', number: 1 },
  { id: 'ranking', label: 'Ranking', number: 2 },
  { id: 'matched', label: 'Matched', number: 3 },
]

export function PhaseIndicator({ currentPhase }) {
  const currentIndex = phases.findIndex(p => p.id === currentPhase)
  
  return (
    <div className="flex items-center justify-center gap-2">
      {phases.map((phase, index) => {
        const isActive = phase.id === currentPhase
        const isCompleted = index < currentIndex
        
        return (
          <div key={phase.id} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  isActive
                    ? 'bg-tumBlue text-white'
                    : isCompleted
                    ? 'bg-tumBlue/20 text-tumBlue'
                    : 'bg-border text-tumSecondary/50'
                }`}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  phase.number
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-tumBlue' : 'text-tumSecondary/50'
                }`}
              >
                {phase.label}
              </span>
            </div>
            {index < phases.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  isCompleted ? 'bg-tumBlue/30' : 'bg-border'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

PhaseIndicator.propTypes = {
  currentPhase: PropTypes.oneOf(['request', 'ranking', 'matched']).isRequired,
}
