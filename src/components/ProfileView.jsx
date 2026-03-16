import PropTypes from 'prop-types'
import { ProfileCard } from './ProfileCard.jsx'
import { getTopMatchesForJunior } from '../matching.js'

export function ProfileView({ junior, seniors }) {
  const topMatches = getTopMatchesForJunior(junior, seniors, 5)

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <section className="space-y-3 lg:col-span-2">
        <header className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-tumBlue font-medium">
              Your profile
            </p>
            <h2 className="text-lg font-bold text-tumSecondary">
              Junior Buddy: {junior.name}
            </h2>
          </div>
        </header>

        <ProfileCard profile={junior} highlightRole />

        <div className="bg-white rounded-2xl card-shadow border border-border p-4 space-y-2">
          <h3 className="text-sm font-bold text-tumSecondary">Profile details</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <Detail label="Name" value={junior.name} />
            <Detail label="Age" value={`${junior.age}`} />
            <Detail label="Study program" value={junior.studyProgram} />
            <Detail
              label="Related programs"
              value={junior.relatedPrograms?.join(', ') || '-'}
            />
          </dl>
        </div>
      </section>

      <section className="space-y-3">
        <div className="bg-white rounded-2xl card-shadow border border-border p-4">
          <h3 className="text-sm font-bold text-tumSecondary mb-1">
            Suggested senior buddies
          </h3>
          <p className="text-[11px] text-tumSecondary/60 mb-2">
            Based on shared interests, study program overlap, and profile keywords.
          </p>
          <div className="space-y-2">
            {topMatches.map((m) => (
              <div
                key={m.senior.id}
                className="border border-border rounded-xl p-2 text-xs bg-background hover:border-tumBlue/30 transition"
              >
                <p className="font-semibold text-tumSecondary flex items-center justify-between gap-2">
                  <span>{m.senior.name}</span>
                </p>
                <p className="text-[11px] text-tumSecondary/60 mb-1">
                  {m.senior.studyProgram}, {m.senior.age} years
                </p>
                <p className="text-[11px] text-tumSecondary/70">
                  <span className="font-medium text-tumBlue">Why this match:</span>{' '}
                  {!!m.breakdown.interests.shared.length && (
                    <>
                      shared interests{' '}
                      <span className="italic">
                        ({m.breakdown.interests.shared.join(', ')})
                      </span>
                      ;{' '}
                    </>
                  )}
                  {!!m.breakdown.studyProgram.score && (
                    <>
                      {m.breakdown.studyProgram.reason.toLowerCase()};{' '}
                    </>
                  )}
                  {!!m.breakdown.bio.shared.length && (
                    <>
                      overlapping bio keywords{' '}
                      <span className="italic">
                        ({m.breakdown.bio.shared.slice(0, 3).join(', ')})
                      </span>
                      .
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-[11px] text-tumSecondary/60">{label}</dt>
      <dd className="text-xs text-tumSecondary font-medium">{value}</dd>
    </div>
  )
}

Detail.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

ProfileView.propTypes = {
  junior: PropTypes.object.isRequired,
  seniors: PropTypes.array.isRequired,
}

