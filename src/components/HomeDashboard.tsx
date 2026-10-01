import React from 'react';
import { BookOpen, Hash, PawPrint, Gamepad2, Palette, Shapes, Brain, Award, Play, Sparkles } from 'lucide-react';
import { TabType, UserProgress } from '../types';
import { sound } from '../utils/sound';

interface HomeDashboardProps {
  onSelectTab: (tab: TabType) => void;
  progress: UserProgress;
  onQuickPlaySong: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectTab,
  progress,
  onQuickPlaySong,
}) => {
  const cards = [
    {
      id: 'abc' as TabType,
      title: 'Learn ABC',
      subtitle: 'Letters A to Z, phonics & words',
      emoji: '🔤',
      color: 'from-amber-400 via-orange-400 to-rose-400',
      badgeColor: 'bg-amber-100 text-amber-900',
      icon: <BookOpen className="w-8 h-8 text-white" />,
      tag: 'A – Z Phonics',
      progress: `${progress.completedLetters.length}/26 Letters`
    },
    {
      id: 'numbers' as TabType,
      title: 'Numbers & Counting',
      subtitle: 'Count objects 1 to 20 & fun quizzes',
      emoji: '🔢',
      color: 'from-blue-400 via-sky-400 to-cyan-500',
      badgeColor: 'bg-blue-100 text-blue-900',
      icon: <Hash className="w-8 h-8 text-white" />,
      tag: '1 to 20',
      progress: `${progress.completedNumbers.length}/20 Counted`
    },
    {
      id: 'animals' as TabType,
      title: 'Animal World',
      subtitle: 'Farm, wild, sea & bird friends',
      emoji: '🦁',
      color: 'from-emerald-400 via-teal-400 to-green-500',
      badgeColor: 'bg-emerald-100 text-emerald-900',
      icon: <PawPrint className="w-8 h-8 text-white" />,
      tag: '24 Animals',
      progress: `${progress.completedAnimals.length}/24 Discovered`
    },
    {
      id: 'games' as TabType,
      title: 'Mini Games',
      subtitle: '10 exciting educational games',
      emoji: '🎮',
      color: 'from-purple-400 via-fuchsia-400 to-pink-500',
      badgeColor: 'bg-purple-100 text-purple-900',
      icon: <Gamepad2 className="w-8 h-8 text-white" />,
      tag: '10 Mini-Games',
      progress: `${progress.gamesPlayed} Played`
    },
    {
      id: 'create' as TabType,
      title: 'Creative Studio',
      subtitle: 'Turn into animals, stickers & filters',
      emoji: '🎨',
      color: 'from-rose-400 via-pink-400 to-red-400',
      badgeColor: 'bg-rose-100 text-rose-900',
      icon: <Palette className="w-8 h-8 text-white" />,
      tag: 'Photo Studio',
      progress: `${progress.photosCreated} Creations`
    },
    {
      id: 'shapes-colors' as TabType,
      title: 'Shapes & Colors',
      subtitle: 'Explore 8 shapes, 10 colors & fruits',
      emoji: '🧩',
      color: 'from-teal-400 via-emerald-400 to-cyan-500',
      badgeColor: 'bg-teal-100 text-teal-900',
      icon: <Shapes className="w-8 h-8 text-white" />,
      tag: 'Interactive Fun',
      progress: 'Explore & Match'
    },
    {
      id: 'games' as TabType,
      title: 'Memory Game',
      subtitle: 'Flip cards and find pairs',
      emoji: '🧠',
      color: 'from-indigo-400 via-purple-400 to-violet-500',
      badgeColor: 'bg-indigo-100 text-indigo-900',
      icon: <Brain className="w-8 h-8 text-white" />,
      tag: 'Brain Boost',
      progress: 'Cards Match'
    },
    {
      id: 'progress' as TabType,
      title: 'My Progress',
      subtitle: 'Earned stars, badges & trophies',
      emoji: '🏆',
      color: 'from-amber-500 via-yellow-400 to-orange-500',
      badgeColor: 'bg-amber-100 text-amber-900',
      icon: <Award className="w-8 h-8 text-white" />,
      tag: 'Achievements',
      progress: `⭐ ${progress.stars} Stars`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Friendly Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 sm:p-10 text-white shadow-lg">
        {/* Playful background decorative shapes */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/15 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/25 text-white text-xs sm:text-sm font-fun font-bold backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>Welcome to Your Adventure!</span>
            </div>
            <h1 className="font-fun text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-xs leading-tight">
              Let’s Learn, Play & Have Fun! 🚀
            </h1>
            <p className="text-sm sm:text-base text-amber-50/90 font-medium leading-relaxed">
              Explore ABC letters, practice counting, meet amazing animals, dress up funny photos, and earn shiny stars!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => {
                sound.playPop();
                onQuickPlaySong();
              }}
              className="px-6 py-3.5 rounded-2xl bg-white text-amber-700 hover:bg-amber-50 font-fun font-bold text-base sm:text-lg shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-amber-600 text-amber-600" />
              <span>Play ABC Song 🎵</span>
            </button>
            <button
              onClick={() => {
                sound.playPop();
                onSelectTab('abc');
              }}
              className="px-6 py-3.5 rounded-2xl bg-amber-950/20 hover:bg-amber-950/30 text-white border-2 border-white/40 font-fun font-bold text-base sm:text-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Start Learning A–Z
            </button>
          </div>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="font-fun text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span>Choose Your Adventure</span>
            <span className="text-2xl animate-float-slow">🎈</span>
          </h2>
          <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            Tap any card to play
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card, idx) => (
            <button
              key={`${card.title}-${idx}`}
              onClick={() => {
                sound.playPop();
                onSelectTab(card.id);
              }}
              className="group text-left bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${card.color}`} />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    <span className="text-2xl">{card.emoji}</span>
                  </div>
                  <span className={`text-xs font-fun font-bold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                    {card.tag}
                  </span>
                </div>

                <h3 className="font-fun text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-amber-500 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-snug">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>{card.progress}</span>
                <span className="text-amber-500 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Play →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
