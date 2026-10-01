import { UserProgress, Badge } from '../types';

const STORAGE_KEY = 'smart_kids_adventures_progress';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'abc_beginner',
    title: 'ABC Explorer',
    description: 'Learned first 5 letters',
    icon: '🔤',
    category: 'ABC',
    requiredCount: 5,
    isUnlocked: false
  },
  {
    id: 'abc_master',
    title: 'ABC Master',
    description: 'Completed all 26 letters from A to Z',
    icon: '👑',
    category: 'ABC',
    requiredCount: 26,
    isUnlocked: false
  },
  {
    id: 'counting_star',
    title: 'Counting Star',
    description: 'Mastered numbers 1 to 20',
    icon: '⭐',
    category: 'Numbers',
    requiredCount: 10,
    isUnlocked: false
  },
  {
    id: 'animal_explorer',
    title: 'Animal Explorer',
    description: 'Discovered 10 amazing animals',
    icon: '🦁',
    category: 'Animals',
    requiredCount: 10,
    isUnlocked: false
  },
  {
    id: 'game_champion',
    title: 'Game Champion',
    description: 'Played 10 educational mini-games',
    icon: '🏆',
    category: 'Games',
    requiredCount: 10,
    isUnlocked: false
  },
  {
    id: 'creative_artist',
    title: 'Creative Artist',
    description: 'Created and saved custom animal photos',
    icon: '🎨',
    category: 'Creativity',
    requiredCount: 3,
    isUnlocked: false
  },
  {
    id: 'memory_master',
    title: 'Memory Wizard',
    description: 'Completed memory match cards game',
    icon: '🧠',
    category: 'Memory',
    requiredCount: 1,
    isUnlocked: false
  },
  {
    id: 'shape_scholar',
    title: 'Shape & Color Hero',
    description: 'Explored all shapes and colors',
    icon: '🔷',
    category: 'Shapes',
    requiredCount: 8,
    isUnlocked: false
  }
];

export const DEFAULT_PROGRESS: UserProgress = {
  stars: 10, // Starting gift stars for excitement!
  completedLetters: ['A', 'B'],
  completedNumbers: [1, 2, 3],
  completedAnimals: ['cat', 'dog'],
  gamesPlayed: 0,
  gameHighScores: {},
  unlockedBadges: ['abc_beginner'],
  photosCreated: 0
};

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedLetters: parsed.completedLetters || [],
      completedNumbers: parsed.completedNumbers || [],
      completedAnimals: parsed.completedAnimals || [],
      gameHighScores: parsed.gameHighScores || {},
      unlockedBadges: parsed.unlockedBadges || ['abc_beginner'],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // quota exceeded or private mode
  }
}

export function addStars(count: number): { newTotal: number; justEarned: number } {
  const current = loadProgress();
  const updated = {
    ...current,
    stars: current.stars + count
  };
  saveProgress(updated);
  return { newTotal: updated.stars, justEarned: count };
}

export function recordLetterCompletion(letter: string): { justEarnedStars: boolean } {
  const current = loadProgress();
  if (!current.completedLetters.includes(letter)) {
    const updated = {
      ...current,
      completedLetters: [...current.completedLetters, letter],
      stars: current.stars + 2
    };
    saveProgress(updated);
    return { justEarnedStars: true };
  }
  return { justEarnedStars: false };
}

export function recordNumberCompletion(num: number): { justEarnedStars: boolean } {
  const current = loadProgress();
  if (!current.completedNumbers.includes(num)) {
    const updated = {
      ...current,
      completedNumbers: [...current.completedNumbers, num],
      stars: current.stars + 2
    };
    saveProgress(updated);
    return { justEarnedStars: true };
  }
  return { justEarnedStars: false };
}

export function recordAnimalExplored(animalId: string): { justEarnedStars: boolean } {
  const current = loadProgress();
  if (!current.completedAnimals.includes(animalId)) {
    const updated = {
      ...current,
      completedAnimals: [...current.completedAnimals, animalId],
      stars: current.stars + 2
    };
    saveProgress(updated);
    return { justEarnedStars: true };
  }
  return { justEarnedStars: false };
}

export function recordGamePlayed(gameId: string, score: number): { newHighScore: boolean; earnedStars: number } {
  const current = loadProgress();
  const prevHigh = current.gameHighScores[gameId] || 0;
  const isHigh = score > prevHigh;
  const earned = Math.max(1, Math.min(10, Math.floor(score / 2) || 2));
  
  const updated: UserProgress = {
    ...current,
    gamesPlayed: current.gamesPlayed + 1,
    stars: current.stars + earned,
    gameHighScores: {
      ...current.gameHighScores,
      [gameId]: Math.max(prevHigh, score)
    }
  };
  saveProgress(updated);
  return { newHighScore: isHigh, earnedStars: earned };
}

export function resetAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
