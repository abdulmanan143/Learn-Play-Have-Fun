import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Check, Sparkles, Volume2, Award, Eraser } from 'lucide-react';
import { ABC_DATA } from '../data/abcData';
import { AudioButton } from '../components/AudioButton';
import { sound } from '../utils/sound';
import { recordLetterCompletion } from '../utils/storage';
import { fireConfetti } from '../utils/confetti';

interface LearnABCProps {
  onEarnStars: (count: number) => void;
  startSongImmediately?: boolean;
}

export const LearnABC: React.FC<LearnABCProps> = ({ onEarnStars, startSongImmediately = false }) => {
  const [activeTab, setActiveTab] = useState<'explorer' | 'song' | 'practice'>('explorer');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedList, setCompletedList] = useState<string[]>([]);

  // ABC Song Player State
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [songIndex, setSongIndex] = useState(0);
  const songTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Practice Activities State
  const [practiceActivity, setPracticeActivity] = useState<1 | 2 | 3 | 4>(1);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // Tracing Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasTraced, setHasTraced] = useState(false);

  const currentItem = ABC_DATA[currentIndex];

  useEffect(() => {
    if (startSongImmediately) {
      setActiveTab('song');
      handleStartSong();
    }
  }, [startSongImmediately]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (songTimerRef.current) clearInterval(songTimerRef.current);
    };
  }, []);

  const handleSelectLetter = (index: number) => {
    sound.playPop();
    setCurrentIndex(index);
    const item = ABC_DATA[index];
    sound.speak(`${item.letter}. ${item.letter} is for ${item.word}!`);
  };

  const handleNextLetter = () => {
    const nextIdx = (currentIndex + 1) % ABC_DATA.length;
    handleSelectLetter(nextIdx);
  };

  const handlePrevLetter = () => {
    const prevIdx = (currentIndex - 1 + ABC_DATA.length) % ABC_DATA.length;
    handleSelectLetter(prevIdx);
  };

  const handleMarkCompleted = () => {
    const res = recordLetterCompletion(currentItem.letter);
    if (!completedList.includes(currentItem.letter)) {
      setCompletedList([...completedList, currentItem.letter]);
    }
    if (res.justEarnedStars) {
      sound.playSuccess();
      fireConfetti();
      onEarnStars(2);
    } else {
      sound.playSuccess();
    }
  };

  // ABC Song karaoke logic
  const handleStartSong = () => {
    setIsPlayingSong(true);
    setSongIndex(0);

    let idx = 0;
    const playNextLetter = () => {
      if (idx >= ABC_DATA.length) {
        sound.speak("Now I know my ABCs, next time won't you sing with me!");
        setIsPlayingSong(false);
        sound.playFanfare();
        fireConfetti();
        onEarnStars(5);
        return;
      }
      setSongIndex(idx);
      const letter = ABC_DATA[idx];
      sound.speak(`${letter.letter}`, 1.0);
      idx++;
      songTimerRef.current = setTimeout(playNextLetter, 900);
    };

    playNextLetter();
  };

  const handleStopSong = () => {
    setIsPlayingSong(false);
    if (songTimerRef.current) clearTimeout(songTimerRef.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Canvas Tracing Setup
  useEffect(() => {
    if (activeTab === 'practice' && practiceActivity === 4) {
      drawTracingGuide();
    }
  }, [activeTab, practiceActivity, currentIndex]);

  const drawTracingGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw lined guide background
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 60);
    ctx.lineTo(canvas.width - 20, 60);
    ctx.moveTo(20, canvas.height / 2);
    ctx.lineTo(canvas.width - 20, canvas.height / 2);
    ctx.moveTo(20, canvas.height - 60);
    ctx.lineTo(canvas.width - 20, canvas.height - 60);
    ctx.stroke();

    // Draw dashed outline letter
    ctx.font = 'bold 180px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#cbd5e1';
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 4;
    ctx.strokeText(currentItem.letter, canvas.width / 2, canvas.height / 2);
    ctx.setLineDash([]); // reset

    setHasTraced(false);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasTraced(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;

    if ('touches' in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else if ('clientX' in e) {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#3b82f6'; // Bright crayon blue

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const finishTracing = () => {
    sound.playSuccess();
    fireConfetti();
    onEarnStars(3);
    setQuizFeedback('correct');
    setTimeout(() => setQuizFeedback(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Section Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-slate-800">
        <div>
          <h1 className="font-fun text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📚 Learn ABC Adventure</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Discover all 26 letters, sing the song, and practice spelling!
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-amber-100/70 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('explorer');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-white dark:bg-slate-700 text-amber-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            A–Z Explorer
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('song');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'song'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🎵 ABC Song
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('practice');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            ✨ Practice Activities
          </button>
        </div>
      </div>

      {/* TAB 1: LETTER EXPLORER */}
      {activeTab === 'explorer' && (
        <div className="space-y-6">
          {/* Main Flashcard Display */}
          <div className="bg-white dark:bg-slate-800/90 rounded-4xl border border-slate-200 dark:border-slate-700 p-6 sm:p-10 shadow-lg relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${currentItem.color}`} />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Giant Letter Badge & Phonics */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  onClick={() => sound.speak(`${currentItem.letter}! ${currentItem.letter} is for ${currentItem.word}`)}
                  className={`w-36 h-36 sm:w-48 sm:h-48 rounded-4xl bg-gradient-to-tr ${currentItem.color} text-white flex flex-col items-center justify-center shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-transform group select-none`}
                  title="Click to pronounce"
                >
                  <span className="font-fun text-6xl sm:text-8xl font-black drop-shadow-md group-hover:scale-110 transition-transform">
                    {currentItem.letter} {currentItem.letter.toLowerCase()}
                  </span>
                  <span className="text-xs font-bold tracking-widest uppercase opacity-90 mt-1">
                    Tap to hear
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <AudioButton
                    textToSpeak={`${currentItem.letter}. ${currentItem.letter} is for ${currentItem.word}.`}
                    label={`Say "${currentItem.letter}"`}
                    size="md"
                  />
                  <button
                    onClick={handleMarkCompleted}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 font-fun text-sm font-bold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>I Learned It! ⭐ +2</span>
                  </button>
                </div>
              </div>

              {/* Word, Illustration & Fun Fact */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div
                    onClick={() => sound.speak(currentItem.word)}
                    className="text-7xl sm:text-8xl cursor-pointer animate-float-slow hover:scale-125 transition-transform"
                    title={currentItem.word}
                  >
                    {currentItem.emoji}
                  </div>
                  <div>
                    <span className="text-xs font-fun font-bold uppercase tracking-wider text-slate-400">
                      Word of the letter
                    </span>
                    <h2 className="font-fun text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                      {currentItem.word}
                    </h2>
                    <span className="text-xs font-mono text-slate-400">
                      /{currentItem.phonetic}/
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-slate-700/50 border border-amber-200/80 dark:border-slate-600">
                  <p className="font-fun text-lg sm:text-xl font-bold text-amber-900 dark:text-amber-200">
                    “{currentItem.sentence}”
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    💡 <strong>Fun Fact:</strong> {currentItem.funFact}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <AudioButton
                    textToSpeak={currentItem.sentence}
                    label="Read Sentence"
                    size="sm"
                    variant="secondary"
                  />
                  <button
                    onClick={() => {
                      sound.playPop();
                      setActiveTab('practice');
                      setPracticeActivity(4); // trace this letter
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-fun text-xs font-bold border border-purple-200 cursor-pointer hover:bg-purple-100"
                  >
                    ✍️ Trace Letter {currentItem.letter}
                  </button>
                </div>
              </div>
            </div>

            {/* Previous & Next Control Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={handlePrevLetter}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-fun font-bold text-sm text-slate-700 dark:text-white cursor-pointer transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous Letter</span>
              </button>

              <div className="font-fun text-sm font-bold text-slate-500">
                Letter {currentIndex + 1} of 26
              </div>

              <button
                onClick={handleNextLetter}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 font-fun font-bold text-sm text-amber-950 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <span>Next Letter</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* A to Z Quick Jump Tiles Grid */}
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-5 border border-slate-200 dark:border-slate-700">
            <h3 className="font-fun text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              Select Any Letter (A to Z):
            </h3>
            <div className="grid grid-cols-6 sm:grid-cols-13 gap-2">
              {ABC_DATA.map((item, idx) => {
                const isSelected = idx === currentIndex;
                const isLearned = completedList.includes(item.letter);
                return (
                  <button
                    key={item.letter}
                    onClick={() => handleSelectLetter(idx)}
                    className={`h-12 rounded-xl font-fun text-lg font-bold flex flex-col items-center justify-center transition-all cursor-pointer select-none relative ${
                      isSelected
                        ? 'bg-amber-400 text-amber-950 scale-110 shadow-md ring-2 ring-amber-500 z-10'
                        : isLearned
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.letter}</span>
                    {isLearned && <span className="text-[10px] text-emerald-500 leading-none">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE ABC SONG */}
      {activeTab === 'song' && (
        <div className="bg-white dark:bg-slate-800 rounded-4xl border border-slate-200 dark:border-slate-700 p-6 sm:p-10 shadow-lg text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="font-fun text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              🎶 Sing The ABC Song!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Watch each letter light up as we sing together through the alphabet!
            </p>
          </div>

          {/* Current Singing Letter Showcase */}
          <div className="py-8">
            <div className="w-40 h-40 sm:w-56 sm:h-56 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-purple-500 text-white flex flex-col items-center justify-center shadow-2xl animate-float-slow">
              <span className="font-fun text-7xl sm:text-9xl font-black">
                {ABC_DATA[songIndex].letter}
              </span>
              <span className="font-fun text-base sm:text-xl font-bold opacity-90">
                {ABC_DATA[songIndex].emoji} {ABC_DATA[songIndex].word}
              </span>
            </div>
          </div>

          {/* Play/Pause Buttons */}
          <div className="flex items-center justify-center gap-4">
            {!isPlayingSong ? (
              <button
                onClick={handleStartSong}
                className="px-8 py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-fun font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-6 h-6 fill-white" />
                <span>Play ABC Song</span>
              </button>
            ) : (
              <button
                onClick={handleStopSong}
                className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-fun font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Pause className="w-6 h-6" />
                <span>Pause Song</span>
              </button>
            )}

            <button
              onClick={() => {
                handleStopSong();
                setSongIndex(0);
              }}
              className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 cursor-pointer"
              title="Reset Song"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          {/* Sequential Letters Strip */}
          <div className="mt-8 p-4 rounded-3xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
            <div className="grid grid-cols-6 sm:grid-cols-13 gap-2">
              {ABC_DATA.map((item, idx) => {
                const isCurrent = isPlayingSong && songIndex === idx;
                const isPassed = songIndex > idx;
                return (
                  <div
                    key={item.letter}
                    className={`h-12 rounded-xl font-fun font-bold text-base sm:text-lg flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-rose-500 text-white scale-125 shadow-lg z-10 animate-bounce'
                        : isPassed
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.letter}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ABC PRACTICE ACTIVITIES */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          {/* Practice Activity Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 1 as const, title: 'Find the Letter', icon: '🔍' },
              { id: 2 as const, title: 'Letter & Picture', icon: '🍎' },
              { id: 3 as const, title: 'Missing Letter', icon: '🧩' },
              { id: 4 as const, title: 'Letter Tracing', icon: '✍️' }
            ].map(act => (
              <button
                key={act.id}
                onClick={() => {
                  sound.playPop();
                  setPracticeActivity(act.id);
                  setQuizFeedback(null);
                }}
                className={`p-3.5 rounded-2xl font-fun font-bold text-sm text-left flex items-center gap-2.5 transition-all cursor-pointer border ${
                  practiceActivity === act.id
                    ? 'bg-purple-100 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-950 dark:text-purple-200 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">{act.icon}</span>
                <span>{act.title}</span>
              </button>
            ))}
          </div>

          {/* Activity 1: Find the Letter */}
          {practiceActivity === 1 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-md text-center space-y-6">
              <div>
                <span className="text-xs font-fun font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                  Activity 1: Listening & Finding
                </span>
                <h3 className="font-fun text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Find the Letter: <span className="text-amber-500 font-black text-4xl">{currentItem.letter}</span>
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Listen carefully and tap the matching letter below!
                </p>
              </div>

              <AudioButton
                textToSpeak={`Find the letter ${currentItem.letter}`}
                label={`Listen: "Find ${currentItem.letter}"`}
                size="md"
              />

              {/* 4 Choices */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto pt-4">
                {[
                  currentItem.letter,
                  ABC_DATA[(currentIndex + 3) % 26].letter,
                  ABC_DATA[(currentIndex + 7) % 26].letter,
                  ABC_DATA[(currentIndex + 12) % 26].letter
                ]
                  .sort(() => (currentItem.letter.charCodeAt(0) % 2 === 0 ? 0.3 - Math.random() : -0.3 + Math.random()))
                  .map((opt, i) => (
                    <button
                      key={`${opt}-${i}`}
                      onClick={() => {
                        if (opt === currentItem.letter) {
                          sound.playSuccess();
                          setQuizFeedback('correct');
                          fireConfetti();
                          onEarnStars(2);
                          setQuizScore(s => s + 1);
                          setTimeout(() => {
                            setQuizFeedback(null);
                            handleNextLetter();
                          }, 1500);
                        } else {
                          sound.playTryAgain();
                          setQuizFeedback('incorrect');
                          setTimeout(() => setQuizFeedback(null), 1200);
                        }
                      }}
                      className="h-20 rounded-2xl bg-amber-50 dark:bg-slate-700 border-2 border-amber-200 dark:border-slate-600 font-fun text-4xl font-extrabold text-slate-800 dark:text-white hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
              </div>

              {quizFeedback === 'correct' && (
                <div className="font-fun text-2xl font-bold text-emerald-600 animate-bounce">
                  🎉 Great Job! You Found It! ⭐ +2
                </div>
              )}
              {quizFeedback === 'incorrect' && (
                <div className="font-fun text-xl font-bold text-amber-600">
                  😊 Try Again! You can do it!
                </div>
              )}
            </div>
          )}

          {/* Activity 2: Match Letter With Picture */}
          {practiceActivity === 2 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-md text-center space-y-6">
              <div>
                <span className="text-xs font-fun font-bold text-rose-500 uppercase tracking-widest">
                  Activity 2: Picture Phonics
                </span>
                <h3 className="font-fun text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Which letter does this word start with?
                </h3>
              </div>

              <div className="text-8xl animate-float-slow py-2">
                {currentItem.emoji}
              </div>
              <p className="font-fun text-2xl font-bold text-slate-700 dark:text-slate-200">
                {currentItem.word}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
                {[
                  currentItem.letter,
                  ABC_DATA[(currentIndex + 2) % 26].letter,
                  ABC_DATA[(currentIndex + 5) % 26].letter,
                  ABC_DATA[(currentIndex + 11) % 26].letter
                ]
                  .sort(() => 0.5 - Math.random())
                  .map((opt, i) => (
                    <button
                      key={`${opt}-${i}`}
                      onClick={() => {
                        if (opt === currentItem.letter) {
                          sound.playSuccess();
                          setQuizFeedback('correct');
                          fireConfetti();
                          onEarnStars(2);
                          setTimeout(() => {
                            setQuizFeedback(null);
                            handleNextLetter();
                          }, 1500);
                        } else {
                          sound.playTryAgain();
                          setQuizFeedback('incorrect');
                          setTimeout(() => setQuizFeedback(null), 1200);
                        }
                      }}
                      className="h-20 rounded-2xl bg-rose-50 dark:bg-slate-700 border-2 border-rose-200 dark:border-slate-600 font-fun text-4xl font-extrabold text-rose-900 dark:text-white hover:bg-rose-100 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
              </div>

              {quizFeedback === 'correct' && (
                <div className="font-fun text-2xl font-bold text-emerald-600 animate-bounce">
                  🌟 Super Star! {currentItem.letter} is for {currentItem.word}!
                </div>
              )}
              {quizFeedback === 'incorrect' && (
                <div className="font-fun text-xl font-bold text-rose-600">
                  😊 Almost! Listen again!
                </div>
              )}
            </div>
          )}

          {/* Activity 3: Missing Letter */}
          {practiceActivity === 3 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-md text-center space-y-6">
              <div>
                <span className="text-xs font-fun font-bold text-blue-500 uppercase tracking-widest">
                  Activity 3: Alphabet Order
                </span>
                <h3 className="font-fun text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  What letter is missing?
                </h3>
              </div>

              {/* Sequential snippet: e.g. A B C _ E */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 my-6">
                {(() => {
                  const targetIdx = currentIndex < 2 ? 2 : currentIndex > 23 ? 23 : currentIndex;
                  const lettersToShow = [
                    ABC_DATA[targetIdx - 2].letter,
                    ABC_DATA[targetIdx - 1].letter,
                    '?',
                    ABC_DATA[targetIdx + 1].letter,
                    ABC_DATA[targetIdx + 2].letter
                  ];
                  return lettersToShow.map((char, i) => (
                    <div
                      key={i}
                      className={`w-14 h-16 sm:w-18 sm:h-20 rounded-2xl font-fun text-3xl sm:text-4xl font-extrabold flex items-center justify-center border-2 ${
                        char === '?'
                          ? 'border-dashed border-amber-400 bg-amber-50 text-amber-600 animate-pulse'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-800 dark:text-white'
                      }`}
                    >
                      {char}
                    </div>
                  ));
                })()}
              </div>

              {/* Choices */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
                {(() => {
                  const targetIdx = currentIndex < 2 ? 2 : currentIndex > 23 ? 23 : currentIndex;
                  const correctChar = ABC_DATA[targetIdx].letter;
                  const choices = [
                    correctChar,
                    ABC_DATA[(targetIdx + 4) % 26].letter,
                    ABC_DATA[(targetIdx + 9) % 26].letter,
                    ABC_DATA[(targetIdx + 14) % 26].letter
                  ].sort(() => 0.5 - Math.random());

                  return choices.map((opt, i) => (
                    <button
                      key={`${opt}-${i}`}
                      onClick={() => {
                        if (opt === correctChar) {
                          sound.playSuccess();
                          setQuizFeedback('correct');
                          fireConfetti();
                          onEarnStars(2);
                          setTimeout(() => {
                            setQuizFeedback(null);
                            handleNextLetter();
                          }, 1500);
                        } else {
                          sound.playTryAgain();
                          setQuizFeedback('incorrect');
                          setTimeout(() => setQuizFeedback(null), 1200);
                        }
                      }}
                      className="h-18 rounded-2xl bg-blue-50 dark:bg-slate-700 border-2 border-blue-200 dark:border-slate-600 font-fun text-3xl font-extrabold text-blue-900 dark:text-white hover:bg-blue-100 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      {opt}
                    </button>
                  ));
                })()}
              </div>

              {quizFeedback === 'correct' && (
                <div className="font-fun text-2xl font-bold text-emerald-600 animate-bounce">
                  🎉 Brilliant! You know your alphabet order!
                </div>
              )}
              {quizFeedback === 'incorrect' && (
                <div className="font-fun text-xl font-bold text-amber-600">
                  😊 Try Again! Sing the song in your head!
                </div>
              )}
            </div>
          )}

          {/* Activity 4: Letter Tracing Canvas */}
          {practiceActivity === 4 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-md text-center space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left">
                  <span className="text-xs font-fun font-bold text-indigo-500 uppercase tracking-widest">
                    Activity 4: Finger / Mouse Tracing
                  </span>
                  <h3 className="font-fun text-2xl font-extrabold text-slate-900 dark:text-white">
                    Trace Letter {currentItem.letter}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Use your finger or mouse to draw along the dashed lines!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={drawTracingGuide}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-fun text-xs font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    <Eraser className="w-4 h-4" />
                    <span>Clear Canvas</span>
                  </button>
                  <button
                    onClick={finishTracing}
                    disabled={!hasTraced}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-fun text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Finished! ⭐ +3</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="border-4 border-amber-300 dark:border-slate-600 rounded-3xl overflow-hidden bg-amber-50/20 touch-none shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={280}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    className="cursor-crosshair w-full max-w-[400px] h-[280px]"
                  />
                </div>
              </div>

              {quizFeedback === 'correct' && (
                <div className="font-fun text-2xl font-bold text-emerald-600 animate-bounce">
                  🌟 Magnificent Handwriting! You earned 3 Stars!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
