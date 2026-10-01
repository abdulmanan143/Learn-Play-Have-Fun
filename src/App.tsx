import React, { useState, useEffect } from 'react';
import { TabType, UserProgress } from './types';
import { loadProgress, saveProgress, addStars } from './utils/storage';
import { Header } from './components/Header';
import { ParentZoneModal } from './components/ParentZoneModal';
import { HomeDashboard } from './components/HomeDashboard';
import { LearnABC } from './pages/LearnABC';
import { LearnNumbers } from './pages/LearnNumbers';
import { AnimalsWorld } from './pages/AnimalsWorld';
import { MiniGamesHub } from './pages/MiniGamesHub';
import { CreativeStudio } from './pages/CreativeStudio';
import { ShapesAndColors } from './pages/ShapesAndColors';
import { ProgressDashboard } from './pages/ProgressDashboard';
import { sound } from './utils/sound';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [isDark, setIsDark] = useState(false);
  const [parentZoneOpen, setParentZoneOpen] = useState(false);
  const [autoPlaySong, setAutoPlaySong] = useState(false);

  // Initialize theme
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('ska_theme');
      if (savedTheme === 'dark') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleDark = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('ska_theme', 'dark'); } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('ska_theme', 'light'); } catch {}
    }
  };

  const handleEarnStars = (count: number) => {
    const res = addStars(count);
    setProgress(loadProgress());
  };

  const handleSelectTab = (tab: TabType) => {
    setAutoPlaySong(false);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickPlaySong = () => {
    setAutoPlaySong(true);
    setCurrentTab('abc');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    setProgress(loadProgress());
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${isDark ? 'dark bg-slate-900 text-slate-100' : 'bg-amber-50/40 text-slate-800'}`}>
      {/* Header with Navigation and Audio Controls */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        stars={progress.stars}
        onOpenParentZone={() => setParentZoneOpen(true)}
        isDark={isDark}
        onToggleDark={handleToggleDark}
      />

      {/* Main Interactive Screen */}
      <main className="flex-1 pb-12">
        {currentTab === 'home' && (
          <HomeDashboard
            onSelectTab={handleSelectTab}
            progress={progress}
            onQuickPlaySong={handleQuickPlaySong}
          />
        )}

        {currentTab === 'abc' && (
          <LearnABC
            onEarnStars={handleEarnStars}
            startSongImmediately={autoPlaySong}
          />
        )}

        {currentTab === 'numbers' && (
          <LearnNumbers
            onEarnStars={handleEarnStars}
          />
        )}

        {currentTab === 'animals' && (
          <AnimalsWorld
            onEarnStars={handleEarnStars}
          />
        )}

        {currentTab === 'games' && (
          <MiniGamesHub
            onEarnStars={handleEarnStars}
          />
        )}

        {currentTab === 'create' && (
          <CreativeStudio
            onEarnStars={handleEarnStars}
          />
        )}

        {currentTab === 'shapes-colors' && (
          <ShapesAndColors
            onEarnStars={handleEarnStars}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressDashboard
            progress={progress}
            onOpenParentZone={() => setParentZoneOpen(true)}
          />
        )}
      </main>

      {/* Parent Zone Modal */}
      <ParentZoneModal
        isOpen={parentZoneOpen}
        onClose={() => setParentZoneOpen(false)}
        progress={progress}
        onResetProgress={handleResetProgress}
      />

      {/* Friendly Bottom Footer */}
      <footer className="mt-auto border-t border-amber-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌟</span>
            <span className="font-fun font-bold text-slate-800 dark:text-white">Smart Kids Adventures</span>
            <span>•</span>
            <span>Learn • Play • Create • Explore</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSelectTab('abc')}
              className="hover:text-amber-600 transition-colors cursor-pointer"
            >
              Learn ABC
            </button>
            <button
              onClick={() => handleSelectTab('numbers')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Numbers
            </button>
            <button
              onClick={() => handleSelectTab('animals')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Animals
            </button>
            <button
              onClick={() => handleSelectTab('games')}
              className="hover:text-purple-600 transition-colors cursor-pointer"
            >
              Mini Games
            </button>
            <button
              onClick={() => handleSelectTab('create')}
              className="hover:text-pink-600 transition-colors cursor-pointer"
            >
              Create
            </button>
            <button
              onClick={() => setParentZoneOpen(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Parent Zone
            </button>
          </div>

          <div className="text-center sm:text-right">
            100% Safe For Children • No External Data Tracking
          </div>
        </div>
      </footer>
    </div>
  );
}
