const normalizeList = (items = []) =>
  [...new Set(items.map((i) => i.toString().toLowerCase().trim()))].filter(Boolean)

const tokenizeBio = (bio = '', explicitKeywords = []) => {
  const base = explicitKeywords.length
    ? explicitKeywords
    : bio
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
  return normalizeList(base).filter((w) => w.length > 3)
}

const jaccardScore = (aArr, bArr) => {
  const a = new Set(normalizeList(aArr))
  const b = new Set(normalizeList(bArr))
  if (!a.size && !b.size) return { score: 0, shared: [], union: [] }
  const shared = [...a].filter((x) => b.has(x))
  const union = [...new Set([...a, ...b])]
  const ratio = shared.length / union.length
  return { score: ratio * 100, shared, union }
}

const studyProgramComponent = (junior, senior) => {
  const j = junior.studyProgram
  const s = senior.studyProgram
  const jRelated = junior.relatedPrograms || []
  const sRelated = senior.relatedPrograms || []

  if (j === s) {
    return { score: 30, reason: 'Same study program' }
  }

  const related =
    jRelated.includes(s) ||
    sRelated.includes(j) ||
    jRelated.some((r) => sRelated.includes(r))

  if (related) {
    return { score: 15, reason: 'Related study programs' }
  }

  return { score: 0, reason: 'Different study programs' }
}

export const computeMatch = (junior, senior) => {
  const interestRes = jaccardScore(junior.interests, senior.interests)
  const interestsScore = (interestRes.score / 100) * 50

  const juniorBioTokens = tokenizeBio(junior.bio, junior.bioKeywords)
  const seniorBioTokens = tokenizeBio(senior.bio, senior.bioKeywords)
  const bioRes = jaccardScore(juniorBioTokens, seniorBioTokens)
  const bioScore = (bioRes.score / 100) * 20

  const programRes = studyProgramComponent(junior, senior)

  const total = Math.round(interestsScore + programRes.score + bioScore)

  return {
    score: total,
    breakdown: {
      interests: {
        score: Math.round(interestsScore),
        shared: interestRes.shared,
        union: interestRes.union,
      },
      studyProgram: programRes,
      bio: {
        score: Math.round(bioScore),
        shared: bioRes.shared,
        union: bioRes.union,
      },
    },
  }
}

export const getTopMatchesForJunior = (junior, seniors, limit = 3) => {
  const scored = seniors
    .map((s) => ({
      senior: s,
      ...computeMatch(junior, s),
    }))
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit)
}

