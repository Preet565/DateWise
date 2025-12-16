import { UserProfile, BackendProfile, CompatibilityResult } from './store';
import { mockProfiles } from './mockProfiles';

const labelMap = {
  lookingFor: {
    casual: 'Casual',
    serious: 'Serious',
    'not-sure': 'Not Sure',
  },
  communicationStyle: {
    'text-a-lot': 'Frequent texting',
    balanced: 'Balanced communication',
    'only-when-needed': 'Minimal texting',
  },
  conflictHandling: {
    'talk-immediately': 'Address conflicts immediately',
    'take-time': 'Take time before discussing',
    avoid: 'Avoid confrontation',
  },
  corePriority: {
    trust: 'Trust',
    fun: 'Fun',
    stability: 'Stability',
    growth: 'Growth',
  },
};

function calculateScore(user: UserProfile, profile: BackendProfile): number {
  let score = 0;
  const maxScore = 10;

  // Looking for alignment (3 points)
  if (user.lookingFor === profile.lookingFor) {
    score += 3;
  } else if (user.lookingFor === 'not-sure' || profile.lookingFor === 'not-sure') {
    score += 1.5;
  }

  // Communication style (2 points)
  if (user.communicationStyle === profile.communicationStyle) {
    score += 2;
  } else if (
    (user.communicationStyle === 'balanced' && profile.communicationStyle !== 'balanced') ||
    (profile.communicationStyle === 'balanced' && user.communicationStyle !== 'balanced')
  ) {
    score += 1;
  }

  // Conflict handling (2 points)
  if (user.conflictHandling === profile.conflictHandling) {
    score += 2;
  } else if (
    (user.conflictHandling === 'take-time' && profile.conflictHandling === 'talk-immediately') ||
    (user.conflictHandling === 'talk-immediately' && profile.conflictHandling === 'take-time')
  ) {
    score += 1;
  }

  // Core priority (2 points)
  if (user.corePriority === profile.corePriority) {
    score += 2;
  } else {
    // Some priorities are more compatible
    const compatiblePairs = [
      ['trust', 'stability'],
      ['fun', 'growth'],
    ];
    for (const pair of compatiblePairs) {
      if (pair.includes(user.corePriority!) && pair.includes(profile.corePriority)) {
        score += 1;
        break;
      }
    }
  }

  // Non-negotiable check (1 point penalty if clash detected)
  const userNN = user.nonNegotiable.toLowerCase();
  const profileNN = profile.nonNegotiable.toLowerCase();
  if (userNN && profileNN) {
    // Simple keyword clash detection
    const clashKeywords = ['alone', 'space', 'independence', 'clingy', 'needy'];
    const togethernessKeywords = ['together', 'time', 'attention', 'priority'];
    
    const userWantsSpace = clashKeywords.some((k) => userNN.includes(k));
    const profileWantsTogether = togethernessKeywords.some((k) => profileNN.includes(k));
    
    if (userWantsSpace && profileWantsTogether) {
      score -= 1;
    }
  }

  return Math.max(0, Math.min(maxScore, Math.round(score * 10) / 10));
}

function generateAnalysis(user: UserProfile, profile: BackendProfile, score: number): Omit<CompatibilityResult, 'matchedProfile' | 'score'> {
  const greenSignals: string[] = [];
  const yellowSignals: string[] = [];
  const redSignals: string[] = [];

  // Analyze each dimension
  if (user.lookingFor === profile.lookingFor) {
    greenSignals.push(`Both seeking ${labelMap.lookingFor[user.lookingFor!]} connections`);
  } else if (user.lookingFor !== 'not-sure' && profile.lookingFor !== 'not-sure') {
    redSignals.push(`Different relationship intentions: You prefer ${labelMap.lookingFor[user.lookingFor!]}, they prefer ${labelMap.lookingFor[profile.lookingFor]}`);
  } else {
    yellowSignals.push('One or both parties are still exploring relationship intentions');
  }

  if (user.communicationStyle === profile.communicationStyle) {
    greenSignals.push(`Aligned communication preference: ${labelMap.communicationStyle[user.communicationStyle!]}`);
  } else if (profile.communicationStyle === 'balanced' || user.communicationStyle === 'balanced') {
    yellowSignals.push('Slight difference in communication frequency preferences');
  } else {
    redSignals.push(`Communication style mismatch: You prefer ${labelMap.communicationStyle[user.communicationStyle!]}, they prefer ${labelMap.communicationStyle[profile.communicationStyle]}`);
  }

  if (user.conflictHandling === profile.conflictHandling) {
    greenSignals.push(`Same approach to conflict: ${labelMap.conflictHandling[user.conflictHandling!]}`);
  } else if (user.conflictHandling === 'avoid' || profile.conflictHandling === 'avoid') {
    yellowSignals.push('One party tends to avoid conflict, which may require patience');
  } else {
    yellowSignals.push('Different conflict resolution timing preferences');
  }

  if (user.corePriority === profile.corePriority) {
    greenSignals.push(`Shared core value: ${labelMap.corePriority[user.corePriority!]}`);
  } else {
    yellowSignals.push(`Different core priorities: You value ${labelMap.corePriority[user.corePriority!]}, they value ${labelMap.corePriority[profile.corePriority]}`);
  }

  // Generate why selected
  let whySelected = `This profile was selected based on ${score >= 7 ? 'strong' : score >= 5 ? 'moderate' : 'partial'} alignment across key compatibility dimensions. `;
  
  if (greenSignals.length >= 2) {
    whySelected += `Notable strengths include shared values in ${greenSignals.length} areas. `;
  }
  
  if (yellowSignals.length > 0) {
    whySelected += `Some areas may benefit from discussion and understanding. `;
  }

  // Generate suggestion
  const suggestions = [
    'Consider discussing communication preferences early to set mutual expectations.',
    'Exploring how you each handle stress could reveal important compatibility insights.',
    'Sharing your long-term goals may help clarify alignment on important matters.',
    'Understanding each other\'s boundaries around personal time can prevent misunderstandings.',
  ];
  
  const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

  return {
    whySelected,
    greenSignals: greenSignals.length > 0 ? greenSignals : ['Openness to understanding different perspectives'],
    yellowSignals: yellowSignals.length > 0 ? yellowSignals : ['No significant areas of concern identified'],
    redSignals,
    suggestion,
  };
}

export function findBestMatch(userProfile: UserProfile, excludeIds: string[] = []): CompatibilityResult {
  const availableProfiles = mockProfiles.filter((p) => !excludeIds.includes(p.id));
  
  let bestProfile = availableProfiles[0];
  let bestScore = 0;

  for (const profile of availableProfiles) {
    const score = calculateScore(userProfile, profile);
    if (score > bestScore) {
      bestScore = score;
      bestProfile = profile;
    }
  }

  const analysis = generateAnalysis(userProfile, bestProfile, bestScore);

  return {
    matchedProfile: bestProfile,
    score: bestScore,
    ...analysis,
  };
}

export function findAlternativeMatch(userProfile: UserProfile, currentMatchId: string): CompatibilityResult {
  return findBestMatch(userProfile, [currentMatchId]);
}
