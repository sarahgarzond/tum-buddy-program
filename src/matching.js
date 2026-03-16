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

/**
 * Gale-Shapley based matching algorithm with senior capacity constraints
 * 
 * @param {Array} juniors - List of junior profiles
 * @param {Array} seniors - List of senior profiles  
 * @param {Object} juniorRankings - Map of juniorId -> [seniorId1, seniorId2, ...] (preference order)
 * @param {Object} seniorRankings - Map of seniorId -> [juniorId1, juniorId2, ...] (preference order)
 * @param {number} seniorCapacity - Max juniors per senior (default 5)
 * @returns {Object} - { matches: {seniorId: [juniorIds]}, unmatched: [juniorIds] }
 */
export const runGaleShapleyMatching = (
  juniors,
  seniors,
  juniorRankings,
  seniorRankings,
  seniorCapacity = 5
) => {
  // Initialize data structures
  const unmatchedJuniors = new Set(juniors.map(j => j.id))
  const juniorMatch = {} // juniorId -> seniorId
  const seniorMatches = {} // seniorId -> [juniorIds]
  const juniorProposalIndex = {} // juniorId -> next index to propose in their ranking
  
  // Initialize seniors with empty match arrays
  seniors.forEach(s => {
    seniorMatches[s.id] = []
  })
  
  // Initialize junior proposal indices
  juniors.forEach(j => {
    juniorProposalIndex[j.id] = 0
  })
  
  // Helper: get senior's rank of a junior (lower is better)
  const getSeniorRankOfJunior = (seniorId, juniorId) => {
    const ranking = seniorRankings[seniorId] || []
    const idx = ranking.indexOf(juniorId)
    return idx === -1 ? Infinity : idx
  }
  
  // Main loop: while there are unmatched juniors who haven't exhausted preferences
  let iterations = 0
  const maxIterations = juniors.length * seniors.length + 100 // Safety limit
  
  while (unmatchedJuniors.size > 0 && iterations < maxIterations) {
    iterations++
    
    // Get next unmatched junior
    const juniorId = [...unmatchedJuniors][0]
    const juniorPrefs = juniorRankings[juniorId] || []
    const proposalIdx = juniorProposalIndex[juniorId]
    
    // Check if junior has exhausted their preference list
    if (proposalIdx >= juniorPrefs.length) {
      unmatchedJuniors.delete(juniorId)
      continue
    }
    
    // Junior proposes to their next preferred senior
    const targetSeniorId = juniorPrefs[proposalIdx]
    juniorProposalIndex[juniorId]++
    
    // Check if senior exists and has capacity
    if (!seniorMatches[targetSeniorId]) {
      continue // Senior doesn't exist in our data
    }
    
    const currentMatches = seniorMatches[targetSeniorId]
    
    if (currentMatches.length < seniorCapacity) {
      // Senior has capacity - accept junior
      seniorMatches[targetSeniorId].push(juniorId)
      juniorMatch[juniorId] = targetSeniorId
      unmatchedJuniors.delete(juniorId)
    } else {
      // Senior is at capacity - check if they prefer this junior over any current match
      const newJuniorRank = getSeniorRankOfJunior(targetSeniorId, juniorId)
      
      // Find the worst-ranked current match
      let worstMatchId = null
      let worstRank = -1
      
      for (const matchedJuniorId of currentMatches) {
        const rank = getSeniorRankOfJunior(targetSeniorId, matchedJuniorId)
        if (rank > worstRank) {
          worstRank = rank
          worstMatchId = matchedJuniorId
        }
      }
      
      // If new junior is ranked better than the worst current match, swap
      if (newJuniorRank < worstRank) {
        // Remove worst match
        seniorMatches[targetSeniorId] = currentMatches.filter(id => id !== worstMatchId)
        delete juniorMatch[worstMatchId]
        unmatchedJuniors.add(worstMatchId)
        
        // Add new junior
        seniorMatches[targetSeniorId].push(juniorId)
        juniorMatch[juniorId] = targetSeniorId
        unmatchedJuniors.delete(juniorId)
      }
      // Otherwise, junior stays unmatched and will try next preference
    }
  }
  
  // Collect unmatched juniors
  const unmatched = juniors
    .filter(j => !juniorMatch[j.id])
    .map(j => j.id)
  
  return {
    matches: seniorMatches,
    juniorMatch,
    unmatched
  }
}

/**
 * Generate automatic rankings based on compatibility scores
 * Used when users haven't manually ranked
 */
export const generateAutoRankings = (juniors, seniors, requests) => {
  const juniorRankings = {}
  const seniorRankings = {}
  
  // For each junior, rank seniors they requested by compatibility score
  juniors.forEach(junior => {
    const requestedSeniorIds = requests
      .filter(r => r.juniorId === junior.id)
      .map(r => r.seniorId)
    
    const scored = requestedSeniorIds
      .map(seniorId => {
        const senior = seniors.find(s => s.id === seniorId)
        if (!senior) return null
        return {
          seniorId,
          score: computeMatch(junior, senior).score
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
    
    juniorRankings[junior.id] = scored.map(s => s.seniorId)
  })
  
  // For each senior, rank juniors who requested them by compatibility score
  seniors.forEach(senior => {
    const requestingJuniorIds = requests
      .filter(r => r.seniorId === senior.id)
      .map(r => r.juniorId)
    
    const scored = requestingJuniorIds
      .map(juniorId => {
        const junior = juniors.find(j => j.id === juniorId)
        if (!junior) return null
        return {
          juniorId,
          score: computeMatch(junior, senior).score
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
    
    seniorRankings[senior.id] = scored.map(j => j.juniorId)
  })
  
  return { juniorRankings, seniorRankings }
}

