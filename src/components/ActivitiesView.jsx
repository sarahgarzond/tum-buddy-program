import PropTypes from 'prop-types'

export function ActivitiesView({ activities, onToggleJoin, currentUser, seniors }) {

  const activitiesWithMatch = activities.map((a) => {
    const interestOverlap = a.interests.filter((i) =>
      currentUser.interests.map((x) => x.toLowerCase()).includes(i.toLowerCase()),
    )

    const suggestedForPairs = seniors
      .map((s) => {
        const seniorOverlap = a.interests.filter((i) =>
          s.interests.map((x) => x.toLowerCase()).includes(i.toLowerCase()),
        )
        const score = interestOverlap.length + seniorOverlap.length
        return score > 0 ? { senior: s, score } : null
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1)

    return { activity: a, interestOverlap, suggestedForPairs }
  })

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-tumBlue font-medium">
            Activities & events
          </p>
          <h2 className="text-lg font-bold text-tumSecondary">Explore activities</h2>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          {activitiesWithMatch.map(({ activity, interestOverlap, suggestedForPairs }) => {
            const isJoined = activity.participants.includes(currentUser.id)
            const suggested = suggestedForPairs[0]
            return (
              <div
                key={activity.id}
                className="rounded-xl bg-white border border-border px-4 py-4 space-y-2 card-shadow hover:border-tumBlue/30 transition"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-sm font-semibold text-tumSecondary">
                      {activity.title}
                    </p>
                    <p className="text-xs text-tumSecondary/60 mb-1">
                      {new Date(activity.dateTime).toLocaleString()} ·{' '}
                      {activity.location}
                    </p>
                    <p className="text-xs text-tumSecondary/70 mb-1">
                      {activity.description}
                    </p>
                  </div>
                  <button
                    onClick={() => onToggleJoin(activity.id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition ${
                      isJoined
                        ? 'bg-tumBlue/10 text-tumBlue border-tumBlue/30'
                        : 'bg-tumBlue text-white border-tumBlue hover:bg-tumSecondary'
                    }`}
                  >
                    {isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {activity.interests.map((interest) => {
                    const matchesUser = interestOverlap.includes(interest)
                    return (
                      <span
                        key={interest}
                        className={`text-[11px] px-2 py-0.5 rounded-full border ${
                          matchesUser
                            ? 'bg-tumBlue/10 text-tumBlue border-tumBlue/30'
                            : 'bg-background text-tumSecondary/70 border-border'
                        }`}
                      >
                        {interest}
                        {matchesUser && (
                          <span className="ml-1 text-[9px] uppercase tracking-wide font-medium">
                            You
                          </span>
                        )}
                      </span>
                    )
                  })}
                </div>

                {suggested && (
                  <p className="text-[11px] text-tumSecondary/60">
                    Suggested for you together with{' '}
                    <span className="font-medium text-tumBlue">
                      {suggested.senior.name}
                    </span>{' '}
                    based on shared interests.
                  </p>
                )}

                <p className="text-[11px] text-tumSecondary/50">
                  Participants: {activity.participants.length}
                </p>
              </div>
            )
          })}
        </div>
        <aside className="space-y-3 text-xs text-tumSecondary/70">
          <div className="rounded-xl bg-white border border-border px-4 py-4 card-shadow">
            <h3 className="text-sm font-bold text-tumSecondary mb-2">
              Activities in this prototype
            </h3>
            <p className="mb-1">
              Activities are predefined examples to illustrate how a Buddy Program at TUM
              Campus Heilbronn could be structured.
            </p>
            <p className="mb-1">
              You can join and leave activities to see how they appear on your dashboard.
              Creating new activities is intentionally disabled in this demo.
            </p>
            <p>
              In a real system, student services or initiatives would publish official
              activities here.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

ActivitiesView.propTypes = {
  activities: PropTypes.array.isRequired,
  onToggleJoin: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  seniors: PropTypes.array.isRequired,
}

