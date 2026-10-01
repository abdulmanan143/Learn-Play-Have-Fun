export type TabType = 'home' | 'abc' | 'numbers' | 'animals' | 'games' | 'create' | 'shapes-colors' | 'progress';

export interface LetterData {
  letter: string;
  word: string;
  phonetic: string;
  emoji: string;
  sentence: string;
  color: string;
  secondaryColor: string;
  funFact: string;
}

export interface NumberData {
  number: number;
  word: string;
  emoji: string;
  pluralWord: string;
  sentence: string;
  color: string;
}

export type AnimalCategory = 'farm' | 'wild' | 'sea' | 'birds';

export interface AnimalData {
  id: string;
  name: string;
  category: AnimalCategory;
  emoji: string;
  soundName: string;
  soundEffect: string; // descriptive sound like "Moo!", "Roar!"
  fact: string;
  color: string;
}

export interface ShapeData {
  id: string;
  name: string;
  pronunciation: string;
  color: string;
  example: string;
  exampleEmoji: string;
}

export interface ColorData {
  id: string;
  name: string;
  hex: string;
  borderHex: string;
  textColor: string;
  example: string;
  exampleEmoji: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  category: 'fruits' | 'nature' | 'objects';
  emoji: string;
  color: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  requiredCount: number;
  isUnlocked: boolean;
}

export interface UserProgress {
  stars: number;
  completedLetters: string[];
  completedNumbers: number[];
  completedAnimals: string[];
  gamesPlayed: number;
  gameHighScores: Record<string, number>;
  unlockedBadges: string[];
  photosCreated: number;
}
