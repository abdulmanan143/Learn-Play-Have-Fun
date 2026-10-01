import React, { useState } from 'react';
import { Volume2, Sparkles, Check } from 'lucide-react';
import { COLORS_DATA, SHAPES_DATA, VOCABULARY_DATA } from '../data/shapesColorsData';
import { ColorData, ShapeData } from '../types';
import { AudioButton } from '../components/AudioButton';
import { sound } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';

interface ShapesAndColorsProps {
  onEarnStars: (count: number) => void;
}

export const ShapesAndColors: React.FC<ShapesAndColorsProps> = ({ onEarnStars }) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'shapes' | 'vocabulary'>('colors');

  // Color Quiz State
  const [colorQuizIdx, setColorQuizIdx] = useState(0);
  const [colorFeedback, setColorFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Shape Quiz State
  const [shapeQuizIdx, setShapeQuizIdx] = useState(0);
  const [shapeFeedback, setShapeFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const currentColorQuiz = COLORS_DATA[colorQuizIdx % COLORS_DATA.length];
  const currentShapeQuiz = SHAPES_DATA[shapeQuizIdx % SHAPES_DATA.length];

  const handleColorAnswer = (colorName: string) => {
    if (colorName === currentColorQuiz.name) {
      sound.playSuccess();
      setColorFeedback('correct');
      fireConfetti();
      onEarnStars(2);
      setTimeout(() => {
        setColorFeedback(null);
        setColorQuizIdx(i => (i + 1) % COLORS_DATA.length);
      }, 1500);
    } else {
      sound.playTryAgain();
      setColorFeedback('incorrect');
      setTimeout(() => setColorFeedback(null), 1200);
    }
  };

  const handleShapeAnswer = (shapeName: string) => {
    if (shapeName === currentShapeQuiz.name) {
      sound.playSuccess();
      setShapeFeedback('correct');
      fireConfetti();
      onEarnStars(2);
      setTimeout(() => {
        setShapeFeedback(null);
        setShapeQuizIdx(i => (i + 1) % SHAPES_DATA.length);
      }, 1500);
    } else {
      sound.playTryAgain();
      setShapeFeedback('incorrect');
      setTimeout(() => setShapeFeedback(null), 1200);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-slate-800">
        <div>
          <h1 className="font-fun text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🧩 Shapes, Colors & Words</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Learn 10 beautiful colors, 8 classic shapes, and everyday vocabulary!
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-teal-100/70 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('colors');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'colors'
                ? 'bg-white dark:bg-slate-700 text-teal-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🎨 Colors (10)
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('shapes');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'shapes'
                ? 'bg-white dark:bg-slate-700 text-teal-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🔷 Shapes (8)
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('vocabulary');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'vocabulary'
                ? 'bg-white dark:bg-slate-700 text-teal-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🍎 Fruits & Words
          </button>
        </div>
      </div>

      {/* TAB 1: COLORS */}
      {activeTab === 'colors' && (
        <div className="space-y-8">
          {/* Colors Swatches Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {COLORS_DATA.map((col) => (
              <div
                key={col.id}
                onClick={() => {
                  sound.playPop();
                  sound.speak(`${col.name}! ${col.example}`);
                }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:scale-105 transition-all text-center cursor-pointer group"
              >
                <div
                  className="w-20 h-20 mx-auto rounded-full shadow-inner mb-3 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: col.hex, border: `3px solid ${col.borderHex}` }}
                >
                  <span className="drop-shadow-xs">{col.exampleEmoji}</span>
                </div>
                <h3 className="font-fun text-lg font-bold text-slate-800 dark:text-white">
                  {col.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {col.example}
                </p>
                <div className="mt-2 flex justify-center">
                  <AudioButton
                    textToSpeak={`${col.name}. ${col.example}`}
                    label="Hear"
                    size="sm"
                    variant="subtle"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Color Quiz Game */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-md text-center space-y-4 max-w-xl mx-auto">
            <div>
              <span className="text-xs font-fun font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                Color Quiz Activity
              </span>
              <h3 className="font-fun text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                What color is this {currentColorQuiz.example.split('&')[0]}?
              </h3>
            </div>

            <div className="py-2">
              <span className="text-8xl animate-float-slow inline-block">
                {currentColorQuiz.exampleEmoji}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(() => {
                const wrongOptions = COLORS_DATA.filter(c => c.name !== currentColorQuiz.name).slice(0, 3).map(c => c.name);
                const choices = [currentColorQuiz.name, ...wrongOptions].sort(() => 0.5 - Math.random());
                return choices.map((opt, i) => (
                  <button
                    key={`${opt}-${i}`}
                    onClick={() => handleColorAnswer(opt)}
                    className="py-3 px-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 font-fun font-bold text-base text-slate-800 dark:text-white hover:bg-teal-50 hover:border-teal-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
                  >
                    {opt}
                  </button>
                ));
              })()}
            </div>

            {colorFeedback === 'correct' && (
              <div className="font-fun text-xl font-bold text-emerald-600 animate-bounce">
                🎉 That’s right! It is {currentColorQuiz.name}! ⭐ +2
              </div>
            )}
            {colorFeedback === 'incorrect' && (
              <div className="font-fun text-base font-bold text-amber-600">
                😊 Try Again! Look at the color carefully!
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SHAPES */}
      {activeTab === 'shapes' && (
        <div className="space-y-8">
          {/* Shapes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SHAPES_DATA.map((shape) => (
              <div
                key={shape.id}
                onClick={() => {
                  sound.playPop();
                  sound.speak(`${shape.name}! Like a ${shape.example}`);
                }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:scale-105 transition-all text-center cursor-pointer group"
              >
                {/* SVG Geometric shape renderer */}
                <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg width="84" height="84" viewBox="0 0 100 100">
                    {shape.id === 'circle' && (
                      <circle cx="50" cy="50" r="42" fill={shape.color} stroke="#1e293b" strokeWidth="4" />
                    )}
                    {shape.id === 'square' && (
                      <rect x="12" y="12" width="76" height="76" rx="8" fill={shape.color} stroke="#1e293b" strokeWidth="4" />
                    )}
                    {shape.id === 'triangle' && (
                      <polygon points="50,10 90,88 10,88" fill={shape.color} stroke="#1e293b" strokeWidth="4" />
                    )}
                    {shape.id === 'rectangle' && (
                      <rect x="6" y="24" width="88" height="52" rx="8" fill={shape.color} stroke="#1e293b" strokeWidth="4" />
                    )}
                    {shape.id === 'star' && (
                      <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill={shape.color} stroke="#1e293b" strokeWidth="3" />
                    )}
                    {shape.id === 'heart' && (
                      <path d="M50 85 C20 60 5 40 5 25 A 18 18 0 0 1 50 22 A 18 18 0 0 1 95 25 C95 40 80 60 50 85 Z" fill={shape.color} stroke="#1e293b" strokeWidth="3" />
                    )}
                    {shape.id === 'oval' && (
                      <ellipse cx="50" cy="50" rx="44" ry="28" fill={shape.color} stroke="#1e293b" strokeWidth="4" />
                    )}
                    {shape.id === 'diamond' && (
                      <polygon points="50,8 90,50 50,92 10,50" fill={shape.color} stroke="#1e293b" strokeWidth="4" />
                    )}
                  </svg>
                </div>

                <h3 className="font-fun text-xl font-bold text-slate-800 dark:text-white">
                  {shape.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {shape.exampleEmoji} {shape.example}
                </p>

                <div className="mt-3 flex justify-center">
                  <AudioButton
                    textToSpeak={`${shape.name}. Like a ${shape.example}.`}
                    label="Hear"
                    size="sm"
                    variant="subtle"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Shape Matching Quiz */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-md text-center space-y-4 max-w-xl mx-auto">
            <div>
              <span className="text-xs font-fun font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                Shape Quiz Challenge
              </span>
              <h3 className="font-fun text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Which shape is this?
              </h3>
            </div>

            <div className="w-24 h-24 mx-auto my-2 flex items-center justify-center animate-float-slow">
              <svg width="84" height="84" viewBox="0 0 100 100">
                {currentShapeQuiz.id === 'circle' && (
                  <circle cx="50" cy="50" r="42" fill={currentShapeQuiz.color} stroke="#1e293b" strokeWidth="4" />
                )}
                {currentShapeQuiz.id === 'square' && (
                  <rect x="12" y="12" width="76" height="76" rx="8" fill={currentShapeQuiz.color} stroke="#1e293b" strokeWidth="4" />
                )}
                {currentShapeQuiz.id === 'triangle' && (
                  <polygon points="50,10 90,88 10,88" fill={currentShapeQuiz.color} stroke="#1e293b" strokeWidth="4" />
                )}
                {currentShapeQuiz.id === 'rectangle' && (
                  <rect x="6" y="24" width="88" height="52" rx="8" fill={currentShapeQuiz.color} stroke="#1e293b" strokeWidth="4" />
                )}
                {currentShapeQuiz.id === 'star' && (
                  <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill={currentShapeQuiz.color} stroke="#1e293b" strokeWidth="3" />
                )}
                {currentShapeQuiz.id === 'heart' && (
                  <path d="M50 85 C20 60 5 40 5 25 A 18 18 0 0 1 50 22 A 18 18 0 0 1 95 25 C95 40 80 60 50 85 Z" fill={currentShapeQuiz.color} stroke="#1e293b" strokeWidth="3" />
                )}
                {currentShapeQuiz.id === 'oval' && (
                  <ellipse cx="50" cy="50" rx="44" ry="28" fill={currentShapeQuiz.color} stroke="#1e293b" strokeWidth="4" />
                )}
                {currentShapeQuiz.id === 'diamond' && (
                  <polygon points="50,8 90,50 50,92 10,50" fill={currentShapeQuiz.color} stroke="#1e293b" strokeWidth="4" />
                )}
              </svg>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(() => {
                const wrongOptions = SHAPES_DATA.filter(s => s.name !== currentShapeQuiz.name).slice(0, 3).map(s => s.name);
                const choices = [currentShapeQuiz.name, ...wrongOptions].sort(() => 0.5 - Math.random());
                return choices.map((opt, i) => (
                  <button
                    key={`${opt}-${i}`}
                    onClick={() => handleShapeAnswer(opt)}
                    className="py-3 px-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 font-fun font-bold text-base text-slate-800 dark:text-white hover:bg-blue-50 hover:border-blue-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
                  >
                    {opt}
                  </button>
                ));
              })()}
            </div>

            {shapeFeedback === 'correct' && (
              <div className="font-fun text-xl font-bold text-emerald-600 animate-bounce">
                🎉 Wonderful! You identified the {currentShapeQuiz.name}! ⭐ +2
              </div>
            )}
            {shapeFeedback === 'incorrect' && (
              <div className="font-fun text-base font-bold text-amber-600">
                😊 Try Again! Look at the edges and corners!
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: VOCABULARY & FRUITS */}
      {activeTab === 'vocabulary' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-fun text-xl font-bold text-slate-900 dark:text-white">
              Everyday Words & Delicious Fruits Flashcards
            </h3>
            <span className="text-xs text-slate-500">Tap to hear pronunciation</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {VOCABULARY_DATA.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  sound.playPop();
                  sound.speak(item.word);
                }}
                className={`p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:scale-105 transition-all text-center cursor-pointer bg-white dark:bg-slate-800 group`}
              >
                <div className="text-6xl mb-2 group-hover:scale-125 transition-transform">
                  {item.emoji}
                </div>
                <h4 className="font-fun text-xl font-bold text-slate-800 dark:text-white">
                  {item.word}
                </h4>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mt-1">
                  {item.category}
                </span>
                <div className="mt-2 flex justify-center">
                  <AudioButton
                    textToSpeak={item.word}
                    label="Pronounce"
                    size="sm"
                    variant="subtle"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
