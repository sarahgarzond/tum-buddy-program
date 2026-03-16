import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { computeMatch } from '../matching.js'
import { PhaseIndicator } from './PhaseIndicator.jsx'

export function RankingInterface({
  currentUser,
  role,
  candidates,
  requests,
  ranking,
  onUpdateRanking,
  onSubmitRanking,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  // Get candidates this user can rank
  const eligibleCandidateIds = role === 'junior'
    ? requests.filter(r => r.juniorId === currentUser.id).map(r => r.seniorId)
    : requests.filter(r => r.seniorId === currentUser.id).map(r => r.juniorId)

  // Build ranked list with profile data
  const rankedCandidates = (ranking || eligibleCandidateIds).map((id, index) => {
    const candidate = candidates.find(c => c.id === id)
    if (!candidate) return null
    const match = computeMatch(
      role === 'junior' ? currentUser : candidate,
      role === 'junior' ? candidate : currentUser
    )
    return {
      ...candidate,
      rank: index + 1,
      score: match.score,
    }
  }).filter(Boolean)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newRanking = [...(ranking || eligibleCandidateIds)]
    const [removed] = newRanking.splice(draggedIndex, 1)
    newRanking.splice(dropIndex, 0, removed)
    
    onUpdateRanking(newRanking)
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const moveUp = (index) => {
    if (index === 0) return
    const newRanking = [...(ranking || eligibleCandidateIds)]
    ;[newRanking[index - 1], newRanking[index]] = [newRanking[index], newRanking[index - 1]]
    onUpdateRanking(newRanking)
  }

  const moveDown = (index) => {
    const currentRanking = ranking || eligibleCandidateIds
    if (index === currentRanking.length - 1) return
    const newRanking = [...currentRanking]
    ;[newRanking[index], newRanking[index + 1]] = [newRanking[index + 1], newRanking[index]]
    onUpdateRanking(newRanking)
  }

  const handleSubmit = () => {
    onSubmitRanking(ranking || eligibleCandidateIds)
    setSubmitted(true)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-tumBlue font-medium">
            Phase 2 - Ranking
          </p>
          <h2 className="text-lg font-bold text-tumSecondary">
            Rank Your Preferences
          </h2>
          <p className="text-xs text-tumSecondary/60 mt-1">
            {role === 'junior'
              ? 'Drag and drop to rank the seniors you requested. #1 is your top preference.'
              : 'Drag and drop to rank the juniors who requested you. #1 is your top preference.'}
          </p>
        </div>
        <PhaseIndicator currentPhase="ranking" />
      </div>

      {/* Instructions */}
      <div className="bg-tumBlue/5 border border-tumBlue/20 rounded-xl p-4 text-sm text-tumSecondary">
        <p className="font-medium text-tumBlue mb-1">How to rank:</p>
        <ul className="text-xs space-y-1 list-disc list-inside text-tumSecondary/70">
          <li>Drag and drop cards to reorder your preferences</li>
          <li>Or use the arrow buttons to move items up/down</li>
          <li>Position 1 is your highest preference</li>
          <li>Submit your ranking before the deadline</li>
        </ul>
      </div>

      {/* Current user info */}
      <div className="bg-white rounded-xl card-shadow border border-border p-4">
        <p className="text-xs uppercase tracking-wide text-tumBlue font-medium mb-2">
          {role === 'junior' ? 'Your Profile (Junior)' : 'Your Profile (Senior)'}
        </p>
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-semibold ${currentUser.avatarColor}`}
          >
            {currentUser.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-tumSecondary">{currentUser.name}</p>
            <p className="text-xs text-tumSecondary/60">{currentUser.studyProgram}</p>
          </div>
        </div>
      </div>

      {/* Ranking list */}
      {rankedCandidates.length === 0 ? (
        <div className="bg-white rounded-xl card-shadow border border-border p-6 text-center">
          <p className="text-sm text-tumSecondary/60">
            {role === 'junior'
              ? 'You have not requested any seniors yet. Go back to the request phase to browse and request buddies.'
              : 'No juniors have requested you yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {rankedCandidates.map((candidate, index) => (
            <div
              key={candidate.id}
              draggable={!submitted}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-xl card-shadow border p-4 flex items-center gap-4 transition ${
                draggedIndex === index
                  ? 'border-tumBlue opacity-50'
                  : 'border-border hover:border-tumBlue/30'
              } ${!submitted ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              {/* Rank number */}
              <div className="w-10 h-10 rounded-full bg-tumBlue text-white flex items-center justify-center font-bold text-lg shrink-0">
                {index + 1}
              </div>

              {/* Drag handle */}
              {!submitted && (
                <div className="text-tumSecondary/30 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-2 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8-14a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-2 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                  </svg>
                </div>
              )}

              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-semibold shrink-0 ${candidate.avatarColor}`}
              >
                {candidate.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-tumSecondary">{candidate.name}</p>
                <p className="text-xs text-tumSecondary/60 truncate">
                  {candidate.studyProgram} - {candidate.age} years
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {candidate.interests.slice(0, 3).map(interest => (
                    <span
                      key={interest}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-background text-tumSecondary/60"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-tumBlue/10">
                  <span className="text-lg font-bold text-tumBlue">{candidate.score}</span>
                </div>
                <p className="text-[10px] text-tumSecondary/50 mt-1">compatibility</p>
              </div>

              {/* Move buttons */}
              {!submitted && (
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-tumSecondary">
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === rankedCandidates.length - 1}
                    className="p-1 rounded hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-tumSecondary">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit button */}
      {rankedCandidates.length > 0 && (
        <div className="flex justify-end">
          {submitted ? (
            <div className="flex items-center gap-2 text-tumBlue">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="font-medium">Ranking submitted!</span>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-tumBlue text-white px-6 py-2.5 rounded-xl font-medium hover:bg-tumSecondary transition"
            >
              Submit Ranking
            </button>
          )}
        </div>
      )}
    </div>
  )
}

RankingInterface.propTypes = {
  currentUser: PropTypes.object.isRequired,
  role: PropTypes.oneOf(['junior', 'senior']).isRequired,
  candidates: PropTypes.array.isRequired,
  requests: PropTypes.array.isRequired,
  ranking: PropTypes.array,
  onUpdateRanking: PropTypes.func.isRequired,
  onSubmitRanking: PropTypes.func.isRequired,
}
