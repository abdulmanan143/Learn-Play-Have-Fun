import React, { useState } from 'react';
import { Volume2, Sparkles, Check, HelpCircle } from 'lucide-react';
import { ANIMALS_DATA } from '../data/animalsData';
import { AnimalCategory, AnimalData } from '../types';
import { AudioButton } from '../components/AudioButton';
import { sound } from '../utils/sound';
import { recordAnimalExplored } from '../utils/storage';
import { fireConfetti } from '../utils/confetti';

interface AnimalsWorldProps {
  onEarnStars: (count: number) => void;
}

export const AnimalsWorld: React.FC<AnimalsWorldProps> = ({ onEarnStars }) => {
  const [selectedCategory, setSelectedCategory] = useState<AnimalCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'safari' | 'quiz'>('safari');
  const [exploredAnimals, setExploredAnimals] = useState<string[]>([]);

  // Guessing quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const filteredAnimals = selectedCategory === 'all'
    ? ANIMALS_DATA
    : ANIMALS_DATA.filter(a => a.category === selectedCategory);

  const currentQuizAnimal = ANIMALS_DATA[quizIndex % ANIMALS_DATA.length];

  const handlePlaySound = (animal: AnimalData) => {
    sound.playAnimalSound(animal.soundEffect, animal.name);
    const res = recordAnimalExplored(animal.id);
    if (!exploredAnimals.includes(animal.id)) {
      setExploredAnimals([...exploredAnimals, animal.id]);
    }
    if (res.justEarnedStars) {
      onEarnStars(2);
      fireConfetti();
    }
  };

  const handleQuizAnswer = (selectedName: string) => {
    if (selectedName === currentQuizAnimal.name) {
      sound.playSuccess();
      setQuizFeedback('correct');
      fireConfetti();
      onEarnStars(2);
      setQuizScore(s => s + 1);
      setTimeout(() => {
        setQuizFeedback(null);
        setQuizIndex(i => (i + 1) % ANIMALS_DATA.length);
      }, 1500);
    } else {
      sound.playTryAgain();
      setQuizFeedback('incorrect');
      setTimeout(() => setQuizFeedback(null), 1200);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-slate-800">
        <div>
          <h1 className="font-fun text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🐾 Animal Kingdom Adventure</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Hear what animals say, discover fun facts, and play the animal guess quiz!
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-emerald-100/70 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('safari');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'safari'
                ? 'bg-white dark:bg-slate-700 text-emerald-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🦁 Animal Safari
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('quiz');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🎯 Animal Guess Quiz
          </button>
        </div>
      </div>

      {/* TAB 1: SAFARI EXPLORER */}
      {activeTab === 'safari' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Friends (24)', emoji: '🌍' },
              { id: 'farm', label: 'Farm Animals', emoji: '🐱' },
              { id: 'wild', label: 'Wild Animals', emoji: '🦁' },
              { id: 'sea', label: 'Sea Animals', emoji: '🐬' },
              { id: 'birds', label: 'Birds', emoji: '🦜' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playPop();
                  setSelectedCategory(cat.id as AnimalCategory | 'all');
                }}
                className={`px-4 py-2 rounded-2xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-white shadow-md scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Animals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAnimals.map((animal) => {
              const isExplored = exploredAnimals.includes(animal.id);
              return (
                <div
                  key={animal.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-start justify-between">
                    <div
                      onClick={() => handlePlaySound(animal)}
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${animal.color} text-white flex items-center justify-center text-5xl shadow-md cursor-pointer group-hover:scale-110 group-hover:rotate-6 transition-transform select-none`}
                      title="Tap to hear sound"
                    >
                      {animal.emoji}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-fun font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {animal.category}
                      </span>
                      {isExplored && (
                        <div className="text-xs font-fun font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-end gap-1">
                          <Check className="w-3.5 h-3.5" /> Discovered
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-fun text-2xl font-bold text-slate-900 dark:text-white">
                      {animal.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      💡 {animal.fact}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handlePlaySound(animal)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-fun font-bold text-xs sm:text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Hear {animal.soundName}!</span>
                    </button>
                    <AudioButton
                      textToSpeak={`${animal.name}. ${animal.fact}`}
                      label="Fact"
                      size="sm"
                      variant="subtle"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ANIMAL GUESS QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-md text-center space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <span className="text-xs font-fun font-bold text-amber-500 uppercase tracking-widest">
                Animal Guessing Challenge
              </span>
              <h3 className="font-fun text-2xl font-extrabold text-slate-900 dark:text-white">
                What animal is this?
              </h3>
            </div>
            <div className="font-fun font-bold text-sm px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
              Score: {quizScore} ⭐
            </div>
          </div>

          {/* Large Animal Avatar & Sound Clue */}
          <div className="py-4 space-y-3">
            <div className="text-8xl sm:text-9xl animate-float-slow select-none">
              {currentQuizAnimal.emoji}
            </div>
            <p className="text-sm text-slate-500 italic">
              “{currentQuizAnimal.fact}”
            </p>
            <button
              onClick={() => sound.playAnimalSound(currentQuizAnimal.soundEffect, 'This animal')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-fun text-xs font-bold cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 Listen to sound clue</span>
            </button>
          </div>

          {/* Multiple Choices */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {(() => {
              const wrongOptions = ANIMALS_DATA
                .filter(a => a.name !== currentQuizAnimal.name)
                .slice(0, 3)
                .map(a => a.name);
              const choices = [currentQuizAnimal.name, ...wrongOptions].sort(() => 0.5 - Math.random());

              return choices.map((opt, i) => (
                <button
                  key={`${opt}-${i}`}
                  onClick={() => handleQuizAnswer(opt)}
                  className="py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 font-fun text-lg font-bold text-slate-800 dark:text-white hover:bg-amber-100 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  {opt}
                </button>
              ));
            })()}
          </div>

          {quizFeedback === 'correct' && (
            <div className="font-fun text-2xl font-bold text-emerald-600 animate-bounce">
              🌟 Excellent! You guessed {currentQuizAnimal.name}! ⭐ +2
            </div>
          )}
          {quizFeedback === 'incorrect' && (
            <div className="font-fun text-xl font-bold text-amber-600">
              😊 Try Again! Look at the picture and listen to the clue!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
