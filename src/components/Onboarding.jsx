import PropTypes from 'prop-types'

const INTEREST_OPTIONS = [
  // More social / recreational first
  'Trying new restaurants & cafés',
  'Campus parties & nightlife',
  'Sports (Football)',
  'Sports (Basketball)',
  'Sports (Running)',
  'Sports (Gym & Fitness)',
  'Sports (Climbing / Bouldering)',
  'Sports (Swimming)',
  'Yoga & Mindfulness',
  'Hiking & Nature',
  'City trips & Travel',
  'Board Games',
  'Video Games',
  'Cooking & Food',
  'Baking',
  'Music (listening / concerts)',
  'Playing an instrument',
  'Photography',
  'Film & Series evenings',
  'Reading',
  'Language tandems',
  'Student parties & events',
  'Student Initiatives',
  'Volunteering & social projects',
  'Campus Events',
  'Libraries & Quiet Study',
  'Group Study Sessions',
  'International Exchange',
  'Learning German',

  // More professional / academic towards the bottom
  'Startups & Entrepreneurship',
  'Business Analytics',
  'Finance & Accounting',
  'Marketing & Branding',
  'Consulting',
  'Supply Chain Management',
  'Strategy & Innovation',
  'Project Management',
  'Product Management',
  'Design Thinking',
  'User Experience (UX)',
  'Data Science',
  'Machine Learning',
  'Artificial Intelligence',
  'Software Engineering',
  'Web Development',
  'Cloud Computing',
  'Research Projects',
  'Hackathons',
  'Case Competitions',
  'Coding Competitions',
  'Networking Events',
  'Corporate Partnerships',
  'Public Speaking',
  'Leadership Development',
  'Tutoring / Mentoring',
  'Sustainability',
  'Social Impact',
  'Career in Germany',
  'Industry Talks',
]

const PROGRAMS = [
  'Bachelor of Management and Data Science (BMDS)',
  'Bachelor in Information Engineering (BiE)',
  'Master in Information Engineering (MiE)',
  'Master in Management & Digital Technology (MMDT)',
  'Master in Management (MIM)',
]

const DEFAULT_NAME = 'Maximilian Bauer'

export function Onboarding({ onComplete }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = (formData.get('name') || '').toString().trim() || DEFAULT_NAME
    const program = formData.get('program')?.toString() || PROGRAMS[0]
    const bio = (formData.get('bio') || '').toString().trim()
    const expectations = (formData.get('expectations') || '').toString().trim()

    const selectedInterests = INTEREST_OPTIONS.filter(
      (opt) => formData.get(`interest-${opt}`) === 'on',
    )

    const otherRaw = (formData.get('interestsOther') || '').toString().trim()
    const otherInterests = otherRaw
      ? otherRaw
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean)
      : []

    const interests =
      selectedInterests.length > 0 || otherInterests.length > 0
        ? [...selectedInterests, ...otherInterests]
        : ['Startups & Entrepreneurship', 'Board Games', 'Sports (Basketball)']

    onComplete({
      name,
      program,
      bio,
      expectations,
      interests,
    })
  }

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-6 md:px-8 md:py-8">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-1">
        Step 1 of 1
      </p>
      <h1 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
        Set up your buddy profile
      </h1>
      <p className="text-sm text-slate-600 mb-5">
        Tell us who you are and what you expect from your time at TUM Campus Heilbronn.
        We will use this information to suggest matching senior buddies and activities.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Name
              <span className="ml-1 text-[11px] text-slate-400">(for the demo)</span>
            </label>
            <input
              name="name"
              defaultValue={DEFAULT_NAME}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Study program
            </label>
            <select
              name="program"
              defaultValue={PROGRAMS[0]}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700"
            >
              {PROGRAMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Short description about you
          </label>
          <textarea
            name="bio"
            required
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700"
            placeholder="Example: I am starting my first semester in Management & Data Science and I am new to Heilbronn. I enjoy startups, team projects and meeting people from different backgrounds."
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            What do you expect from your university experience?
          </label>
          <textarea
            name="expectations"
            required
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-700"
            placeholder="Example: I want to build practical skills, join student initiatives and better understand the German working culture."
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-700">
            Which activities and topics are you interested in?
          </p>
          <div className="grid md:grid-cols-3 gap-2 max-h-64 overflow-auto pr-1">
            {INTEREST_OPTIONS.map((opt) => (
              <label
                key={opt}
                className="border border-slate-200 rounded-lg px-3 py-2 flex items-start gap-2 text-xs cursor-pointer hover:border-[#0065BD33]"
              >
                <input type="checkbox" name={`interest-${opt}`} className="mt-0.5" />
                <span className="text-slate-700">{opt}</span>
              </label>
            ))}
          </div>
          <div className="space-y-1 pt-1">
            <label className="block text-xs font-medium text-slate-700">
              Other interests (optional, comma separated)
            </label>
            <input
              name="interestsOther"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0065BD] focus:border-[#0065BD]"
              placeholder="e.g. chess, photography, podcasts"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-blue-700 text-white px-5 py-2 text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white"
          >
            Continue to dashboard
          </button>
        </div>
      </form>
    </div>
  )
}

Onboarding.propTypes = {
  onComplete: PropTypes.func.isRequired,
}

