import React, { useState } from 'react';
import { Volume2, VolumeX, Moon, Sun, Menu, X, Users, Sparkles, BookOpen, Hash, PawPrint, Gamepad2, Palette, Shapes, Award } from 'lucide-react';
import { TabType } from '../types';
import { sound } from '../utils/sound';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  stars: number;
  onOpenParentZone: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  stars,
  onOpenParentZone,
  isDark,
  onToggleDark
}) => {
  const [soundOn, setSoundOn] = useState(sound.isSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    sound.setSoundEnabled(nextState);
    if (nextState) {
      sound.playSuccess();
    }
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" />, color: 'hover:text-amber-500' },
    { id: 'abc', label: 'Learn ABC', icon: <BookOpen className="w-4 h-4" />, color: 'hover:text-rose-500' },
    { id: 'numbers', label: 'Numbers', icon: <Hash className="w-4 h-4" />, color: 'hover:text-blue-500' },
    { id: 'animals', label: 'Animals', icon: <PawPrint className="w-4 h-4" />, color: 'hover:text-emerald-500' },
    { id: 'games', label: 'Games', icon: <Gamepad2 className="w-4 h-4" />, color: 'hover:text-purple-500' },
    { id: 'create', label: 'Create', icon: <Palette className="w-4 h-4" />, color: 'hover:text-pink-500' },
    { id: 'shapes-colors', label: 'Shapes & Colors', icon: <Shapes className="w-4 h-4" />, color: 'hover:text-teal-500' },
    { id: 'progress', label: 'Progress', icon: <Award className="w-4 h-4" />, color: 'hover:text-amber-500' }
  ];

  const handleNavClick = (tab: TabType) => {
    sound.playPop();
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-amber-200/60 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-left cursor-pointer group focus:outline-hidden"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-xl sm:text-2xl shadow-sm group-hover:scale-105 group-hover:rotate-6 transition-transform">
              🌟
            </div>
            <div>
              <span className="font-fun text-lg sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 via-rose-500 to-purple-600 bg-clip-text text-transparent block leading-tight">
                Smart Kids Adventures
              </span>
              <span className="hidden sm:block text-[11px] font-semibold text-slate-400 dark:text-slate-400 tracking-wider uppercase">
                Learn • Play • Create • Explore
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-fun font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-100 text-amber-900 shadow-xs dark:bg-amber-900/40 dark:text-amber-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                } ${item.color}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Stars Counter */}
          <button
            onClick={() => handleNavClick('progress')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-fun font-bold shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Your Stars"
          >
            <span className="text-base sm:text-lg animate-wiggle inline-block">⭐</span>
            <span className="tabular-nums">{stars}</span>
          </button>

          {/* Sound On / Off */}
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Sound On' : 'Sound Off'}
            className={`p-2 rounded-xl border cursor-pointer transition-all ${
              soundOn
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400'
            }`}
            title={soundOn ? 'Sound On (Click to Mute)' : 'Sound Off (Click to Unmute)'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              sound.playPop();
              onToggleDark();
            }}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />}
          </button>

          {/* Parent Zone Button */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenParentZone();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors cursor-pointer"
            title="Parent Zone (Progress & Settings)"
          >
            <Users className="w-4 h-4" />
            <span className="whitespace-nowrap">Parents</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open Navigation Menu"
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-amber-200 dark:border-slate-800 px-4 py-4 shadow-lg animate-pop">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-sm font-fun font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <button
              onClick={() => {
                sound.playPop();
                setMobileMenuOpen(false);
                onOpenParentZone();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Parent / Teacher Zone</span>
            </button>
            <span className="text-xs text-slate-400">v1.0 • Ready for GitHub Pages</span>
          </div>
        </div>
      )}
    </header>
  );
};
