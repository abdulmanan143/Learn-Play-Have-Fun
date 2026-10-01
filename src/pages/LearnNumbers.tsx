import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Hash, Sparkles } from 'lucide-react';
import { NUMBERS_DATA } from '../data/numbersData';
import { AudioButton } from '../components/AudioButton';
import { sound } from '../utils/sound';
import { recordNumberCompletion } from '../utils/storage';
import { fireConfetti } from '../utils/confetti';

interface LearnNumbersProps {
  onEarnStars: (count: number) => void;
}

export const LearnNumbers: React.FC<LearnNumbersProps> = ({ onEarnStars }) => {
  const [activeTab, setActiveTab] = useState<'explorer' | 'game' | 'chart100'>('explorer');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tappedCount, setTappedCount] = useState<number[]>([]);
  const [completedList, setCompletedList] = useState<number[]>([]);

  // Counting Game state
  const [gameQuestionNum, setGameQuestionNum] = useState(3);
  const [gameFeedback, setGameFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const currentItem = NUMBERS_DATA[currentIndex];

  const handleSelectNumber = (idx: number) => {
    sound.playPop();
    setCurrentIndex(idx);
    setTappedCount([]);
    const item = NUMBERS_DATA[idx];
    sound.speak(`${item.number}. ${item.word}. ${item.sentence}`);
  };

  const handleNext = () => {
    const next = (currentIndex + 1) % NUMBERS_DATA.length;
    handleSelectNumber(next);
  };

  const handlePrev = () => {
    const prev = (currentIndex - 1 + NUMBERS_DATA.length) % NUMBERS_DATA.length;
    handleSelectNumber(prev);
  };

  // Interactive Tap to count
  const handleTapObject = (objIndex: number) => {
    if (!tappedCount.includes(objIndex)) {
      const nextTapped = [...tappedCount, objIndex];
      setTappedCount(nextTapped);
      const count = nextTapped.length;
      sound.playPop();
      sound.speak(`${count}`);
      if (count === currentItem.number) {
        sound.playSuccess();
        fireConfetti();
        onEarnStars(2);
      }
    }
  };

  const handleMarkLearned = () => {
    const res = recordNumberCompletion(currentItem.number);
    if (!completedList.includes(currentItem.number)) {
      setCompletedList([...completedList, currentItem.number]);
    }
    if (res.justEarnedStars) {
      sound.playSuccess();
      fireConfetti();
      onEarnStars(2);
    } else {
      sound.playSuccess();
    }
  };

  // Counting game answer check
  const handleGameAnswer = (val: number) => {
    if (val === gameQuestionNum) {
      sound.playSuccess();
      setGameFeedback('correct');
      fireConfetti();
      onEarnStars(2);
      setTimeout(() => {
        setGameFeedback(null);
        // pick new random number 1..15
        const next = Math.floor(Math.random() * 14) + 1;
        setGameQuestionNum(next);
      }, 1500);
    } else {
      sound.playTryAgain();
      setGameFeedback('incorrect');
      setTimeout(() => setGameFeedback(null), 1200);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-slate-800">
        <div>
          <h1 className="font-fun text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔢 Numbers & Counting Adventure</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Learn numbers 1 to 20, tap to count, and play counting games!
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-blue-100/70 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('explorer');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-white dark:bg-slate-700 text-blue-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Numbers 1–20
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('game');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🎯 Counting Game
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('chart100');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'chart100'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            📊 1–100 Chart
          </button>
        </div>
      </div>

      {/* TAB 1: NUMBERS 1-20 EXPLORER */}
      {activeTab === 'explorer' && (
        <div className="space-y-6">
          {/* Main Number Stage */}
          <div className="bg-white dark:bg-slate-800/90 rounded-4xl border border-slate-200 dark:border-slate-700 p-6 sm:p-10 shadow-lg relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${currentItem.color}`} />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Big Number Plate */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  onClick={() => sound.speak(`${currentItem.number}! ${currentItem.word}`)}
                  className={`w-36 h-36 sm:w-48 sm:h-48 rounded-4xl bg-gradient-to-tr ${currentItem.color} text-white flex flex-col items-center justify-center shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-transform group select-none`}
                  title="Click to pronounce"
                >
                  <span className="font-fun text-7xl sm:text-8xl font-black drop-shadow-md group-hover:scale-110 transition-transform">
                    {currentItem.number}
                  </span>
                  <span className="font-fun text-sm sm:text-base font-bold tracking-wider uppercase opacity-95">
                    {currentItem.word}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <AudioButton
                    textToSpeak={`${currentItem.number}. ${currentItem.word}. ${currentItem.sentence}`}
                    label={`Pronounce "${currentItem.word}"`}
                    size="md"
                    variant="secondary"
                  />
                  <button
                    onClick={handleMarkLearned}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 font-fun text-sm font-bold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Counted! ⭐ +2</span>
                  </button>
                </div>
              </div>

              {/* Countable Items Arena (Interactive Tap to Count!) */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="font-fun text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                      {currentItem.number} {currentItem.pluralWord}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Tap each {currentItem.pluralWord.toLowerCase()} to count them out loud!
                    </p>
                  </div>
                  <div className="font-fun text-sm font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full shrink-0">
                    Tapped: {tappedCount.length}/{currentItem.number}
                  </div>
                </div>

                {/* Grid of Countable Items */}
                <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-700/40 rounded-3xl border border-slate-200 dark:border-slate-600 min-h-[160px] flex flex-wrap items-center justify-center gap-3">
                  {Array.from({ length: currentItem.number }).map((_, idx) => {
                    const isTapped = tappedCount.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleTapObject(idx)}
                        className={`text-4xl sm:text-5xl p-2 rounded-2xl transition-all cursor-pointer select-none ${
                          isTapped
                            ? 'bg-amber-200 dark:bg-amber-900 scale-115 shadow-sm ring-2 ring-amber-400 rotate-6'
                            : 'hover:scale-110 active:scale-95 hover:bg-white/80'
                        }`}
                        title={`Tap object ${idx + 1}`}
                      >
                        {currentItem.emoji}
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-blue-50 dark:bg-slate-700/40 rounded-2xl border border-blue-200 dark:border-slate-600 text-xs sm:text-sm text-blue-900 dark:text-blue-200 font-medium">
                  💬 “{currentItem.sentence}”
                </div>
              </div>
            </div>

            {/* Prev / Next controls */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-fun font-bold text-sm text-slate-700 dark:text-white cursor-pointer transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <div className="font-fun text-sm font-bold text-slate-500">
                Number {currentIndex + 1} of 20
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-fun font-bold text-sm shadow-md cursor-pointer transition-all active:scale-95"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick jump 1-20 tiles */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700">
            <h3 className="font-fun text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              Choose Any Number:
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {NUMBERS_DATA.map((item, idx) => {
                const isSelected = idx === currentIndex;
                const isLearned = completedList.includes(item.number);
                return (
                  <button
                    key={item.number}
                    onClick={() => handleSelectNumber(idx)}
                    className={`h-12 rounded-xl font-fun text-lg font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-500 text-white scale-110 shadow-md ring-2 ring-blue-400'
                        : isLearned
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.number}</span>
                    {isLearned && <span className="text-[10px] text-emerald-500 leading-none">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COUNTING QUIZ GAME */}
      {activeTab === 'game' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-md text-center space-y-6">
          <div>
            <span className="text-xs font-fun font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Counting Quiz Challenge
            </span>
            <h3 className="font-fun text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              How many items do you see?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Count each object carefully, then tap the right number below!
            </p>
          </div>

          {/* Items to count */}
          <div className="p-6 bg-amber-50/60 dark:bg-slate-700/50 rounded-3xl border border-amber-200 dark:border-slate-600 max-w-xl mx-auto flex flex-wrap items-center justify-center gap-4 min-h-[140px]">
            {Array.from({ length: gameQuestionNum }).map((_, i) => (
              <span key={i} className="text-5xl animate-float-slow select-none">
                🍎
              </span>
            ))}
          </div>

          <AudioButton
            textToSpeak={`How many apples do you see? Count them!`}
            label="Read Question"
            size="sm"
          />

          {/* 4 Choices */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
            {(() => {
              const offsets = [-2, -1, 1, 2];
              const fakeChoices = offsets
                .map(o => gameQuestionNum + o)
                .filter(n => n > 0 && n !== gameQuestionNum)
                .slice(0, 3);
              const choices = [gameQuestionNum, ...fakeChoices].sort(() => 0.5 - Math.random());

              return choices.map((opt, i) => (
                <button
                  key={`${opt}-${i}`}
                  onClick={() => handleGameAnswer(opt)}
                  className="h-20 rounded-2xl bg-emerald-50 dark:bg-slate-700 border-2 border-emerald-300 dark:border-slate-600 font-fun text-4xl font-extrabold text-emerald-950 dark:text-white hover:bg-emerald-100 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  {opt}
                </button>
              ));
            })()}
          </div>

          {gameFeedback === 'correct' && (
            <div className="font-fun text-2xl font-bold text-emerald-600 animate-bounce">
              🎉 Exactly right! That is {gameQuestionNum}! ⭐ +2
            </div>
          )}
          {gameFeedback === 'incorrect' && (
            <div className="font-fun text-xl font-bold text-amber-600">
              😊 Almost! Touch each apple one by one to count again!
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NUMBERS 1-100 CHART */}
      {activeTab === 'chart100' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-fun text-xl font-bold text-slate-900 dark:text-white">
                Big Numbers 1 to 100 Chart
              </h3>
              <p className="text-xs text-slate-500">
                Click any number to hear it pronounced out loud!
              </p>
            </div>
            <AudioButton
              textToSpeak="Let's explore numbers 1 to 100!"
              label="Explore 1–100"
              size="sm"
            />
          </div>

          <div className="grid grid-cols-10 gap-1.5 sm:gap-2 max-h-[500px] overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
            {Array.from({ length: 100 }).map((_, i) => {
              const num = i + 1;
              return (
                <button
                  key={num}
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`${num}`);
                  }}
                  className="h-10 sm:h-12 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-purple-100 hover:text-purple-900 dark:hover:bg-purple-900/60 font-fun font-bold text-xs sm:text-sm border border-slate-200/80 dark:border-slate-700 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
