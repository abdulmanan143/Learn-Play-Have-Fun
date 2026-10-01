import React from 'react';
import { Award, Star, CheckCircle2, Lock, Sparkles, BookOpen, Hash, PawPrint, Gamepad2 } from 'lucide-react';
import { UserProgress } from '../types';
import { INITIAL_BADGES } from '../utils/storage';
import { sound } from '../utils/sound';
import { fireBigConfetti } from '../utils/confetti';

interface ProgressDashboardProps {
  progress: UserProgress;
  onOpenParentZone: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onOpenParentZone
}) => {
  const abcPct = Math.min(100, Math.round((progress.completedLetters.length / 26) * 100));
  const numPct = Math.min(100, Math.round((progress.completedNumbers.length / 20) * 100));
  const animalPct = Math.min(100, Math.round((progress.completedAnimals.length / 24) * 100));
  const gamesCompleted = progress.gamesPlayed;

  // Compute unlocked status
  const badges = INITIAL_BADGES.map(b => {
    let unlocked = false;
    if (b.id === 'abc_beginner') unlocked = progress.completedLetters.length >= 5;
    if (b.id === 'abc_master') unlocked = progress.completedLetters.length >= 26;
    if (b.id === 'counting_star') unlocked = progress.completedNumbers.length >= 10;
    if (b.id === 'animal_explorer') unlocked = progress.completedAnimals.length >= 10;
    if (b.id === 'game_champion') unlocked = progress.gamesPlayed >= 10;
    if (b.id === 'creative_artist') unlocked = progress.photosCreated >= 2;
    if (b.id === 'memory_master') unlocked = progress.gamesPlayed >= 1;
    if (b.id === 'shape_scholar') unlocked = progress.stars >= 30;

    return { ...b, isUnlocked: unlocked };
  });

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  const handleCelebrate = () => {
    sound.playFanfare();
    fireBigConfetti();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Banner */}
      <div className="rounded-4xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-fun font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Achievement Headquarters</span>
          </div>
          <h1 className="font-fun text-3xl sm:text-4xl font-black">
            My Learning Superpowers! 🌟
          </h1>
          <p className="text-sm text-amber-50/90 font-medium">
            You are doing fantastic! Keep exploring to collect all badges and stars.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="px-6 py-4 rounded-3xl bg-white text-amber-900 text-center shadow-md">
            <span className="text-3xl sm:text-4xl font-fun font-black block tabular-nums animate-wiggle">
              ⭐ {progress.stars}
            </span>
            <span className="text-xs font-fun font-bold uppercase tracking-wider text-slate-500">
              Total Stars
            </span>
          </div>

          <button
            onClick={handleCelebrate}
            className="px-5 py-4 rounded-3xl bg-amber-950/30 hover:bg-amber-950/40 text-white border-2 border-white/50 font-fun font-bold text-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
          >
            <span className="text-2xl">🎉</span>
            <span>Celebrate!</span>
          </button>
        </div>
      </div>

      {/* Progress Bars Section */}
      <div className="bg-white dark:bg-slate-800 rounded-4xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <h2 className="font-fun text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Subject Mastery Progress</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ABC Learning Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-fun font-bold">
              <span className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <BookOpen className="w-4 h-4" />
                <span>ABC Alphabet: {progress.completedLetters.length}/26 Letters</span>
              </span>
              <span className="text-slate-600 dark:text-slate-300 tabular-nums">{abcPct}%</span>
            </div>
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${abcPct}%` }}
              />
            </div>
          </div>

          {/* Numbers Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-fun font-bold">
              <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Hash className="w-4 h-4" />
                <span>Numbers & Counting: {progress.completedNumbers.length}/20 Numbers</span>
              </span>
              <span className="text-slate-600 dark:text-slate-300 tabular-nums">{numPct}%</span>
            </div>
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${numPct}%` }}
              />
            </div>
          </div>

          {/* Animals Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-fun font-bold">
              <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <PawPrint className="w-4 h-4" />
                <span>Animal World: {progress.completedAnimals.length}/24 Animals</span>
              </span>
              <span className="text-slate-600 dark:text-slate-300 tabular-nums">{animalPct}%</span>
            </div>
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${animalPct}%` }}
              />
            </div>
          </div>

          {/* Mini Games Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-fun font-bold">
              <span className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Gamepad2 className="w-4 h-4" />
                <span>Mini Games Played</span>
              </span>
              <span className="text-slate-600 dark:text-slate-300 tabular-nums">{gamesCompleted} rounds</span>
            </div>
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-fuchsia-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, gamesCompleted * 10)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badges Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-fun text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Trophy Badges</span>
            <span className="text-sm font-fun font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
              {unlockedCount}/{badges.length} Unlocked
            </span>
          </h2>
          <button
            onClick={onOpenParentZone}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline cursor-pointer"
          >
            View Educator Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border transition-all text-center flex flex-col justify-between items-center relative overflow-hidden ${
                badge.isUnlocked
                  ? 'bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-700 shadow-md hover:scale-105'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
              }`}
            >
              {badge.isUnlocked && (
                <div className="absolute top-3 right-3 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {!badge.isUnlocked && (
                <div className="absolute top-3 right-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
              )}

              <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-slate-700 flex items-center justify-center text-4xl mb-3 shadow-inner">
                {badge.icon}
              </div>

              <div>
                <h3 className="font-fun text-lg font-bold text-slate-800 dark:text-white">
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 w-full text-[11px] font-bold text-amber-700 dark:text-amber-400">
                {badge.isUnlocked ? '🏆 Earned!' : '🔒 Keep Learning!'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
