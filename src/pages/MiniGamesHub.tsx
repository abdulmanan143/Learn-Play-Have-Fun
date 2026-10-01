import React, { useState, useEffect } from 'react';
import { Gamepad2, RotateCcw, Award, Check, Sparkles, Brain, Volume2 } from 'lucide-react';
import { sound } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import { recordGamePlayed } from '../utils/storage';
import { ABC_DATA } from '../data/abcData';
import { ANIMALS_DATA } from '../data/animalsData';
import { COLORS_DATA, SHAPES_DATA } from '../data/shapesColorsData';

interface MiniGamesHubProps {
  onEarnStars: (count: number) => void;
}

export const MiniGamesHub: React.FC<MiniGamesHubProps> = ({ onEarnStars }) => {
  const [selectedGameId, setSelectedGameId] = useState<number>(7); // Default to popular Memory Game or 1
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // GAME 1: ABC Letter Match (Uppercase to Lowercase)
  const [g1Target, setG1Target] = useState({ upper: 'A', lower: 'a' });
  const [g1Choices, setG1Choices] = useState<string[]>([]);

  // GAME 2: Find the Correct Letter
  const [g2Target, setG2Target] = useState('M');
  const [g2Choices, setG2Choices] = useState<string[]>([]);

  // GAME 3: Animal Guess
  const [g3Animal, setG3Animal] = useState(ANIMALS_DATA[0]);
  const [g3Choices, setG3Choices] = useState<string[]>([]);

  // GAME 4: Number Counting
  const [g4Count, setG4Count] = useState(4);
  const [g4Emoji, setG4Emoji] = useState('🍎');

  // GAME 5: Color Match
  const [g5Color, setG5Color] = useState(COLORS_DATA[0]);
  const [g5Choices, setG5Choices] = useState<string[]>([]);

  // GAME 6: Shape Match
  const [g6Shape, setG6Shape] = useState(SHAPES_DATA[0]);
  const [g6Choices, setG6Choices] = useState<string[]>([]);

  // GAME 7: Memory Cards Game
  interface Card {
    id: number;
    value: string;
    label: string;
    isFlipped: boolean;
    isMatched: boolean;
  }
  const [memoryCards, setMemoryCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);

  // GAME 8: Word & Picture Match
  const [g8Target, setG8Target] = useState({ word: 'Lion', emoji: '🦁' });
  const [g8Choices, setG8Choices] = useState<{ word: string; emoji: string }[]>([]);

  // GAME 9: Missing Letter
  const [g9Seq, setG9Seq] = useState(['C', 'D', '?', 'F']);
  const [g9Answer, setG9Answer] = useState('E');
  const [g9Choices, setG9Choices] = useState<string[]>([]);

  // GAME 10: Odd One Out
  const [g10Items, setG10Items] = useState<{ emoji: string; category: string; id: number }[]>([]);
  const [g10OddCategory, setG10OddCategory] = useState('');

  const gamesList = [
    { id: 1, name: 'ABC Letter Match', emoji: '🔤', desc: 'Match big letter with small letter' },
    { id: 2, name: 'Find The Letter', emoji: '🔍', desc: 'Listen and pick the matching letter' },
    { id: 3, name: 'Animal Sound Guess', emoji: '🦁', desc: 'Guess which animal makes the sound' },
    { id: 4, name: 'Number Counting', emoji: '🔢', desc: 'Count the items on screen' },
    { id: 5, name: 'Color Match', emoji: '🎨', desc: 'Match the item to its true color' },
    { id: 6, name: 'Shape Match', emoji: '🔷', desc: 'Find which geometric shape matches' },
    { id: 7, name: 'Memory Cards', emoji: '🧠', desc: 'Flip pairs of matching picture cards' },
    { id: 8, name: 'Word & Picture', emoji: '📚', desc: 'Match written word to emoji illustration' },
    { id: 9, name: 'Missing Alphabet', emoji: '🧩', desc: 'Find what letter comes next' },
    { id: 10, name: 'Odd One Out', emoji: '👀', desc: 'Spot which item does not belong!' }
  ];

  // Initialize selected game
  useEffect(() => {
    initGame(selectedGameId);
  }, [selectedGameId]);

  const initGame = (id: number) => {
    setFeedback(null);
    if (id === 1) setupG1();
    if (id === 2) setupG2();
    if (id === 3) setupG3();
    if (id === 4) setupG4();
    if (id === 5) setupG5();
    if (id === 6) setupG6();
    if (id === 7) setupMemoryGame();
    if (id === 8) setupG8();
    if (id === 9) setupG9();
    if (id === 10) setupG10();
  };

  // Game 1 setup
  const setupG1 = () => {
    const randomLetter = ABC_DATA[Math.floor(Math.random() * ABC_DATA.length)].letter;
    const lower = randomLetter.toLowerCase();
    setG1Target({ upper: randomLetter, lower });

    const wrongLetters = ABC_DATA.filter(l => l.letter !== randomLetter)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(l => l.letter.toLowerCase());

    setG1Choices([lower, ...wrongLetters].sort(() => 0.5 - Math.random()));
  };

  // Game 2 setup
  const setupG2 = () => {
    const item = ABC_DATA[Math.floor(Math.random() * ABC_DATA.length)];
    setG2Target(item.letter);

    const wrong = ABC_DATA.filter(l => l.letter !== item.letter)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(l => l.letter);

    setG2Choices([item.letter, ...wrong].sort(() => 0.5 - Math.random()));
    sound.speak(`Find the letter ${item.letter}!`);
  };

  // Game 3 setup
  const setupG3 = () => {
    const animal = ANIMALS_DATA[Math.floor(Math.random() * ANIMALS_DATA.length)];
    setG3Animal(animal);

    const wrong = ANIMALS_DATA.filter(a => a.id !== animal.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(a => a.name);

    setG3Choices([animal.name, ...wrong].sort(() => 0.5 - Math.random()));
  };

  // Game 4 setup
  const setupG4 = () => {
    const count = Math.floor(Math.random() * 10) + 1;
    const emojis = ['🍎', '⭐', '🎈', '🐱', '🍓', '🚗', '🌸'];
    setG4Count(count);
    setG4Emoji(emojis[Math.floor(Math.random() * emojis.length)]);
  };

  // Game 5 setup
  const setupG5 = () => {
    const col = COLORS_DATA[Math.floor(Math.random() * COLORS_DATA.length)];
    setG5Color(col);

    const wrong = COLORS_DATA.filter(c => c.id !== col.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(c => c.name);

    setG5Choices([col.name, ...wrong].sort(() => 0.5 - Math.random()));
  };

  // Game 6 setup
  const setupG6 = () => {
    const shape = SHAPES_DATA[Math.floor(Math.random() * SHAPES_DATA.length)];
    setG6Shape(shape);

    const wrong = SHAPES_DATA.filter(s => s.id !== shape.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(s => s.name);

    setG6Choices([shape.name, ...wrong].sort(() => 0.5 - Math.random()));
  };

  // Game 7: Memory Cards Setup
  const setupMemoryGame = () => {
    const items = [
      { value: '🐶', label: 'Dog' },
      { value: '🍎', label: 'Apple' },
      { value: '⭐', label: 'Star' },
      { value: '🐱', label: 'Cat' },
      { value: '🚗', label: 'Car' },
      { value: '🎈', label: 'Balloon' }
    ];

    const deck: Card[] = [];
    items.forEach((item, idx) => {
      deck.push({ id: idx * 2, value: item.value, label: item.label, isFlipped: false, isMatched: false });
      deck.push({ id: idx * 2 + 1, value: item.value, label: item.label, isFlipped: false, isMatched: false });
    });

    setMemoryCards(deck.sort(() => 0.5 - Math.random()));
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || memoryCards[index].isFlipped || memoryCards[index].isMatched) {
      return;
    }

    sound.playCardFlip();
    const newCards = [...memoryCards];
    newCards[index].isFlipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (memoryCards[first].value === memoryCards[second].value) {
        sound.playSuccess();
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setMemoryCards(newCards);
        setFlippedCards([]);
        setMatchedPairs(p => {
          const next = p + 1;
          if (next === 6) {
            sound.playFanfare();
            fireConfetti();
            onEarnStars(5);
            recordGamePlayed('memory', 10);
          }
          return next;
        });
      } else {
        setTimeout(() => {
          sound.playPop();
          const resetCards = [...memoryCards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setMemoryCards(resetCards);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  // Game 8 setup
  const setupG8 = () => {
    const list = [
      { word: 'Lion', emoji: '🦁' },
      { word: 'Apple', emoji: '🍎' },
      { word: 'Dog', emoji: '🐶' },
      { word: 'Sun', emoji: '☀️' },
      { word: 'Cat', emoji: '🐱' },
      { word: 'Star', emoji: '⭐' }
    ];
    const target = list[Math.floor(Math.random() * list.length)];
    setG8Target(target);
    setG8Choices(list.sort(() => 0.5 - Math.random()).slice(0, 4));
  };

  // Game 9 setup
  const setupG9 = () => {
    const startIdx = Math.floor(Math.random() * 21); // up to 21
    const missingOffset = 2;
    const seq = [
      ABC_DATA[startIdx].letter,
      ABC_DATA[startIdx + 1].letter,
      '?',
      ABC_DATA[startIdx + 3].letter
    ];
    const ans = ABC_DATA[startIdx + missingOffset].letter;
    setG9Seq(seq);
    setG9Answer(ans);

    const wrong = ABC_DATA.filter(l => l.letter !== ans)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(l => l.letter);

    setG9Choices([ans, ...wrong].sort(() => 0.5 - Math.random()));
  };

  // Game 10 setup
  const setupG10 = () => {
    // 3 animals and 1 fruit, OR 3 fruits and 1 vehicle
    const isAnimalGroup = Math.random() > 0.5;
    if (isAnimalGroup) {
      const animals = ['🐱', '🐶', '🦁', '🐘', '🐵'].sort(() => 0.5 - Math.random()).slice(0, 3);
      const fruit = ['🍎', '🍌', '🍓'][Math.floor(Math.random() * 3)];
      const combined = [
        ...animals.map((e, i) => ({ emoji: e, category: 'animal', id: i })),
        { emoji: fruit, category: 'odd', id: 99 }
      ].sort(() => 0.5 - Math.random());

      setG10Items(combined);
      setG10OddCategory('fruit');
    } else {
      const fruits = ['🍎', '🍌', '🍓', '🍊'].sort(() => 0.5 - Math.random()).slice(0, 3);
      const vehicle = ['🚗', '🚀', '⛵'][Math.floor(Math.random() * 3)];
      const combined = [
        ...fruits.map((e, i) => ({ emoji: e, category: 'fruit', id: i })),
        { emoji: vehicle, category: 'odd', id: 99 }
      ].sort(() => 0.5 - Math.random());

      setG10Items(combined);
      setG10OddCategory('vehicle');
    }
  };

  const handleGenericAnswer = (isCorrect: boolean, nextSetup: () => void) => {
    if (isCorrect) {
      sound.playSuccess();
      setFeedback('correct');
      fireConfetti();
      onEarnStars(2);
      setScore(s => s + 1);
      recordGamePlayed(`game_${selectedGameId}`, score + 1);
      setTimeout(() => {
        setFeedback(null);
        nextSetup();
      }, 1500);
    } else {
      sound.playTryAgain();
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-slate-800">
        <div>
          <h1 className="font-fun text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎮 10 Educational Mini-Games</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Fun brain games, memory match, ABC puzzles, and counting challenges!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-amber-100 text-amber-900 font-fun font-bold text-sm rounded-full">
            Score: {score} ⭐
          </div>
          <button
            onClick={() => initGame(selectedGameId)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
            title="Restart Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game Selector Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {gamesList.map(g => (
          <button
            key={g.id}
            onClick={() => {
              sound.playPop();
              setSelectedGameId(g.id);
            }}
            className={`px-3.5 py-2 rounded-2xl font-fun text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              selectedGameId === g.id
                ? 'bg-purple-600 text-white shadow-md scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{g.emoji}</span>
            <span>{g.name}</span>
          </button>
        ))}
      </div>

      {/* Active Game Arena */}
      <div className="bg-white dark:bg-slate-800 rounded-4xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-md text-center max-w-2xl mx-auto space-y-6">
        {/* GAME 1: ABC Letter Match */}
        {selectedGameId === 1 && (
          <div className="space-y-6">
            <h3 className="font-fun text-2xl font-bold text-slate-800 dark:text-white">
              Match Big Letter with Small Letter
            </h3>
            <div className="w-28 h-28 mx-auto rounded-3xl bg-amber-400 text-amber-950 font-fun text-6xl font-black flex items-center justify-center shadow-lg animate-float-slow">
              {g1Target.upper}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {g1Choices.map((opt, i) => (
                <button
                  key={`${opt}-${i}`}
                  onClick={() => handleGenericAnswer(opt === g1Target.lower, setupG1)}
                  className="h-16 rounded-2xl bg-amber-50 dark:bg-slate-700 border-2 border-amber-200 font-fun text-4xl font-black hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAME 2: Find The Letter */}
        {selectedGameId === 2 && (
          <div className="space-y-6">
            <h3 className="font-fun text-2xl font-bold text-slate-800 dark:text-white">
              Listen & Find: “{g2Target}”
            </h3>
            <button
              onClick={() => sound.speak(`Find the letter ${g2Target}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-900 rounded-xl font-fun text-xs font-bold cursor-pointer"
            >
              <Volume2 className="w-4 h-4" /> <span>🔊 Hear Letter Again</span>
            </button>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {g2Choices.map((opt, i) => (
                <button
                  key={`${opt}-${i}`}
                  onClick={() => handleGenericAnswer(opt === g2Target, setupG2)}
                  className="h-18 rounded-2xl bg-indigo-50 dark:bg-slate-700 border-2 border-indigo-200 font-fun text-4xl font-black hover:bg-indigo-100 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAME 3: Animal Sound Guess */}
        {selectedGameId === 3 && (
          <div className="space-y-6">
            <h3 className="font-fun text-2xl font-bold text-slate-800 dark:text-white">
              What animal makes this sound?
            </h3>
            <div className="text-4xl font-fun font-bold text-amber-600 bg-amber-50 py-3 rounded-2xl border border-amber-200">
              “{g3Animal.soundEffect}”
            </div>
            <button
              onClick={() => sound.playAnimalSound(g3Animal.soundEffect, 'Mystery animal')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-amber-950 rounded-xl font-fun text-xs font-bold cursor-pointer shadow-xs"
            >
              <Volume2 className="w-4 h-4" /> <span>🔊 Listen To Animal Sound</span>
            </button>
            <div className="grid grid-cols-2 gap-3">
              {g3Choices.map((opt, i) => (
                <button
                  key={`${opt}-${i}`}
                  onClick={() => handleGenericAnswer(opt === g3Animal.name, setupG3)}
                  className="py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 font-fun text-xl font-bold hover:bg-amber-100 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAME 4: Number Counting */}
        {selectedGameId === 4 && (
          <div className="space-y-6">
            <h3 className="font-fun text-2xl font-bold text-slate-800 dark:text-white">
              How many {g4Emoji} are there?
            </h3>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-center gap-3 min-h-[100px]">
              {Array.from({ length: g4Count }).map((_, idx) => (
                <span key={idx} className="text-4xl animate-float-slow select-none">
                  {g4Emoji}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(() => {
                const choices = [g4Count, g4Count + 1, Math.max(1, g4Count - 1), g4Count + 2].sort(() => 0.5 - Math.random());
                return choices.map((opt, i) => (
                  <button
                    key={`${opt}-${i}`}
                    onClick={() => handleGenericAnswer(opt === g4Count, setupG4)}
                    className="h-16 rounded-2xl bg-emerald-50 dark:bg-slate-700 border-2 border-emerald-300 font-fun text-3xl font-extrabold hover:bg-emerald-100 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
                  >
                    {opt}
                  </button>
                ));
              })()}
            </div>
          </div>
        )}

        {/* GAME 5: Color Match */}
        {selectedGameId === 5 && (
          <div className="space-y-6">
            <h3 className="font-fun text-2xl font-bold text-slate-800 dark:text-white">
              What color is this item?
            </h3>
            <div className="text-8xl animate-float-slow">
              {g5Color.exampleEmoji}
            </div>
            <p className="text-sm font-semibold text-slate-500">
              {g5Color.example}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {g5Choices.map((opt, i) => (
                <button
                  key={`${opt}-${i}`}
                  onClick={() => handleGenericAnswer(opt === g5Color.name, setupG5)}
                  className="py-3 px-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 font-fun text-lg font-bold hover:bg-teal-50 hover:border-teal-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAME 6: Shape Match */}
        {selectedGameId === 6 && (
          <div className="space-y-6">
            <h3 className="font-fun text-2xl font-bold text-slate-800 dark:text-white">
              What shape is this object?
            </h3>
            <div className="text-7xl animate-float-slow">
              {g6Shape.exampleEmoji}
            </div>
            <p className="text-sm font-semibold text-slate-500">
              “{g6Shape.example}”
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {g6Choices.map((opt, i) => (
                <button
                  key={`${opt}-${i}`}
                  onClick={() => handleGenericAnswer(opt === g6Shape.name, setupG6)}
                  className="py-3 px-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 font-fun text-lg font-bold hover:bg-blue-50 hover:border-blue-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAME 7: Memory Cards */}
        {selectedGameId === 7 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500">
              <span>Moves: {moves}</span>
              <span>Matched: {matchedPairs}/6 Pairs</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
              {memoryCards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`h-24 sm:h-28 rounded-2xl font-fun text-4xl sm:text-5xl flex items-center justify-center transition-all duration-300 cursor-pointer select-none shadow-xs ${
                    card.isFlipped || card.isMatched
                      ? 'bg-amber-100 dark:bg-amber-950 border-2 border-amber-300 rotate-y-180 scale-100'
                      : 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  {card.isFlipped || card.isMatched ? card.value : '❓'}
                </button>
              ))}
            </div>

            {matchedPairs === 6 && (
              <div className="font-fun text-2xl font-bold text-emerald-600 animate-bounce">
                🎉 Woohoo! You cleared the entire memory board! ⭐ +5
              </div>
            )}
          </div>
        )}

        {/* GAME 8: Word & Picture Match */}
        {selectedGameId === 8 && (
          <div className="space-y-6">
            <h3 className="font-fun text-2xl font-bold text-slate-800 dark:text-white">
              Which picture matches “{g8Target.word}”?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {g8Choices.map((opt, i) => (
                <button
                  key={`${opt.word}-${i}`}
                  onClick={() => handleGenericAnswer(opt.word === g8Target.word, setupG8)}
                  className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50 text-5xl hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  {opt.emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAME 9: Missing Letter */}
        {selectedGameId === 9 && (
          <div className="space-y-6">
            <h3 className="font-fun text-2xl font-bold text-slate-800 dark:text-white">
              What letter fills the blank?
            </h3>
            <div className="flex items-center justify-center gap-3">
              {g9Seq.map((c, i) => (
                <div
                  key={i}
                  className={`w-14 h-16 rounded-2xl font-fun text-3xl font-extrabold flex items-center justify-center border-2 ${
                    c === '?'
                      ? 'border-dashed border-rose-400 bg-rose-50 text-rose-600 animate-pulse'
                      : 'border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  {c}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {g9Choices.map((opt, i) => (
                <button
                  key={`${opt}-${i}`}
                  onClick={() => handleGenericAnswer(opt === g9Answer, setupG9)}
                  className="h-16 rounded-2xl bg-rose-50 dark:bg-slate-700 border-2 border-rose-200 font-fun text-3xl font-bold hover:bg-rose-100 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAME 10: Odd One Out */}
        {selectedGameId === 10 && (
          <div className="space-y-6">
            <h3 className="font-fun text-2xl font-bold text-slate-800 dark:text-white">
              Tap the Odd One Out! 👀
            </h3>
            <p className="text-xs text-slate-500">
              One of these does not belong with the others!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {g10Items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleGenericAnswer(item.category === 'odd', setupG10)}
                  className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-6xl hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {feedback === 'correct' && (
          <div className="font-fun text-2xl font-bold text-emerald-600 animate-bounce">
            🎉 Great Job! You Won 2 Stars! ⭐
          </div>
        )}
        {feedback === 'incorrect' && (
          <div className="font-fun text-xl font-bold text-amber-600">
            😊 Try Again! You can do it!
          </div>
        )}
      </div>
    </div>
  );
};
