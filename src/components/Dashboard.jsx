import PropTypes from 'prop-types'
import { useState, useMemo } from 'react'
import { ProfileCard } from './ProfileCard.jsx'
import { getTopMatchesForJunior } from '../matching.js'

export function Dashboard({ junior, seniors, activities, messages }) {
  const [visibleCount, setVisibleCount] = useState(3)
  const [searchTerm, setSearchTerm] = useState('')
  const joinedActivities = activities.filter((a) => a.participants.includes(junior.id))
  const latestMessages = messages
    .filter((m) => m.from === junior.id || m.to === junior.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <section className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Your overview</p>
            <h2 className="text-lg font-semibold text-slate-900">
              Welcome, {junior.name.split(' ')[0]}
            </h2>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
            Junior Buddy · Demo profile
          </span>
        </div>

        <ProfileCard profile={junior} highlightRole />

        <div className="grid md:grid-cols-3 gap-3">
          <StatCard label="Suggested seniors" value={seniors.length} />
          <StatCard label="Joined activities" value={joinedActivities.length} />
          <StatCard label="Recent messages" value={latestMessages.length} />
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Senior buddy suggestions
              </h3>
              <p className="text-xs text-slate-500">
                Ordered by how well interests, study program and profile text align.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <input
                type="text"
                placeholder="Search by name or interest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700 min-w-[180px]"
              />
            </div>
          </header>

          <MatchesList
            junior={junior}
            seniors={seniors}
            visibleCount={visibleCount}
            searchTerm={searchTerm}
            onLoadMore={() => setVisibleCount((c) => c + 3)}
          />
        </section>
      </section>

      <section className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Joined activities</h3>
          {joinedActivities.length === 0 && (
            <p className="text-xs text-slate-500">
              You have not joined any activities yet. Use the Activities tab to explore
              events that match your interests.
            </p>
          )}
          <div className="space-y-2">
            {joinedActivities.map((a) => (
              <div
                key={a.id}
                className="border border-slate-100 rounded-lg px-3 py-2 text-xs bg-slate-50/60"
              >
                <p className="font-medium text-slate-900">{a.title}</p>
                <p className="text-slate-500">
                  {new Date(a.dateTime).toLocaleString()} · {a.location}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Recent messages</h3>
          {latestMessages.length === 0 && (
            <p className="text-xs text-slate-500">
              No messages yet. Start a conversation from the Messages tab.
            </p>
          )}
          <div className="space-y-2 max-h-64 overflow-auto pr-1">
            {latestMessages.map((m) => (
              <div key={m.id} className="text-xs border border-slate-100 rounded-lg p-2">
                <p className="text-[11px] text-slate-500 mb-0.5">
                  {new Date(m.timestamp).toLocaleString()}
                </p>
                <p className="text-slate-800">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function MatchesList({ junior, seniors, visibleCount, searchTerm, onLoadMore }) {
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    const allMatches = seniors.map((s) => ({
      senior: s,
      ...getTopMatchesForJunior(junior, [s], 1)[0],
    }))

    const searched = term
      ? allMatches.filter((m) => {
          const inName = m.senior.name.toLowerCase().includes(term)
          const inInterests = m.senior.interests.some((i) =>
            i.toLowerCase().includes(term),
          )
          return inName || inInterests
        })
      : allMatches

    return searched.sort((a, b) => b.score - a.score)
  }, [junior, seniors, searchTerm])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <>
      <div className="space-y-3">
        {visible.map((m) => (
          <div
            key={m.senior.id}
            className="border border-slate-100 rounded-xl p-3 flex flex-col gap-2 bg-slate-50/60"
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-semibold ${m.senior.avatarColor}`}
                >
                  {m.senior.name
                    .split(' ')
                    .slice(0, 2)
                    .map((p) => p[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {m.senior.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {m.senior.studyProgram} · {m.senior.age} years
                  </p>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-600">
              <span className="font-medium">Why this match:</span>{' '}
              {!!m.breakdown.interests.shared.length && (
                <>
                  shared interests{' '}
                  <span className="italic">
                    ({m.breakdown.interests.shared.slice(0, 3).join(', ')})
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
                  overlapping profile keywords{' '}
                  <span className="italic">
                    ({m.breakdown.bio.shared.slice(0, 3).join(', ')})
                  </span>
                  .
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-3">
          <button
            type="button"
            onClick={onLoadMore}
            className="text-xs font-medium text-blue-700 border border-blue-200 rounded-md px-3 py-1.5 hover:bg-blue-50"
          >
            Load more seniors
          </button>
        </div>
      )}
    </>
  )
}

MatchesList.propTypes = {
  junior: PropTypes.object.isRequired,
  seniors: PropTypes.array.isRequired,
  visibleCount: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onLoadMore: PropTypes.func.isRequired,
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3.5 py-2.5">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
}

function BreakdownPill({ label, score, max, items }) {
  const percent = Math.round((score / max) * 100)
  return (
    <div className="bg-slate-50 rounded-lg px-2.5 py-2">
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="text-[11px] font-medium text-slate-700">{label}</p>
        <p className="text-[11px] text-slate-500">
          {score}/{max}
        </p>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden mb-1">
        <div
          className="h-full bg-gradient-to-r from-tumBlue to-tumLightBlue"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {items.slice(0, 3).map((item) => (
          <span
            key={item}
            className="text-[10px] px-1.5 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

BreakdownPill.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
}

Dashboard.propTypes = {
  junior: PropTypes.object.isRequired,
  seniors: PropTypes.array.isRequired,
  activities: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
}

