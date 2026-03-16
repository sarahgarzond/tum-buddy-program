import PropTypes from 'prop-types'

export function ProfileCard({ profile, highlightRole }) {
  if (!profile) return null

  return (
    <div className="bg-white rounded-2xl card-shadow border border-border p-4 flex gap-4">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-semibold shrink-0 ${profile.avatarColor}`}
      >
        {profile.name
          .split(' ')
          .slice(0, 2)
          .map((p) => p[0])
          .join('')}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-tumSecondary">{profile.name}</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-background text-tumSecondary/70 border border-border">
            {profile.age} · {profile.studyProgram}
          </span>
          {highlightRole && (
            <span className="text-[11px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-tumBlue/10 text-tumBlue font-semibold">
              {profile.role === 'senior' ? 'Senior Buddy' : 'Junior Buddy'}
            </span>
          )}
        </div>
        <p className="text-xs text-tumSecondary/70 line-clamp-3">{profile.bio}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {profile.interests.map((interest) => (
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
  )
}

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    studyProgram: PropTypes.string.isRequired,
    interests: PropTypes.arrayOf(PropTypes.string).isRequired,
    bio: PropTypes.string.isRequired,
    avatarColor: PropTypes.string.isRequired,
  }),
  highlightRole: PropTypes.bool,
}

