import React, { useState } from 'react';
import { X, Award, RotateCcw, Volume2, ShieldCheck, Heart, Sparkles, Printer } from 'lucide-react';
import { UserProgress } from '../types';
import { sound } from '../utils/sound';
import { resetAllProgress } from '../utils/storage';

interface ParentZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onResetProgress: () => void;
}

export const ParentZoneModal: React.FC<ParentZoneModalProps> = ({
  isOpen,
  onClose,
  progress,
  onResetProgress
}) => {
  const [speechRate, setSpeechRate] = useState(sound.getSpeechRate());
  const [confirmReset, setConfirmReset] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [childName, setChildName] = useState('Super Kid');

  if (!isOpen) return null;

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    sound.setSpeechRate(rate);
    sound.speak('Pronunciation speed updated. Great job learning!');
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-pop">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-fun text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Parent & Educator Zone
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Insights, settings, and learning milestones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Learning Highlights Dashboard */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 p-3.5 rounded-2xl text-center">
            <span className="text-2xl sm:text-3xl font-fun font-bold text-rose-600 dark:text-rose-400 block tabular-nums">
              {progress.completedLetters.length}/26
            </span>
            <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">ABC Letters</span>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-3.5 rounded-2xl text-center">
            <span className="text-2xl sm:text-3xl font-fun font-bold text-blue-600 dark:text-blue-400 block tabular-nums">
              {progress.completedNumbers.length}/20
            </span>
            <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">Numbers</span>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-3.5 rounded-2xl text-center">
            <span className="text-2xl sm:text-3xl font-fun font-bold text-emerald-600 dark:text-emerald-400 block tabular-nums">
              {progress.completedAnimals.length}/24
            </span>
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Animals</span>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 p-3.5 rounded-2xl text-center">
            <span className="text-2xl sm:text-3xl font-fun font-bold text-amber-600 dark:text-amber-400 block tabular-nums">
              ⭐ {progress.stars}
            </span>
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Total Stars</span>
          </div>
        </div>

        {/* Voice & Pronunciation Speed */}
        <div className="mt-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <Volume2 className="w-4 h-4 text-indigo-500" />
            <span>Speech & Phonics Speed</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Slow down the audio rate for younger toddlers or early language learners.
          </p>
          <div className="flex items-center gap-2">
            {[
              { label: 'Slow (0.7x)', val: 0.7 },
              { label: 'Normal (0.9x)', val: 0.9 },
              { label: 'Standard (1.0x)', val: 1.0 }
            ].map(item => (
              <button
                key={item.val}
                onClick={() => handleRateChange(item.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  Math.abs(speechRate - item.val) < 0.05
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Offline Activities Suggestions */}
        <div className="mt-6">
          <h3 className="font-fun text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Recommended Real-World Activities</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-xl">
              <span className="text-amber-500">💡</span>
              <span><strong>Sensory Tracing:</strong> Pour salt, sugar, or sand onto a baking sheet and have your child practice tracing today’s letter with their finger!</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-xl">
              <span className="text-emerald-500">🍎</span>
              <span><strong>Color & Count Hunt:</strong> Walk through the kitchen together and ask your child to find 4 green vegetables or 3 red apples.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-xl">
              <span className="text-blue-500">🦁</span>
              <span><strong>Animal Movement Game:</strong> Pretend to hop like a rabbit, stretch tall like a giraffe, and gallop like a horse!</span>
            </li>
          </ul>
        </div>

        {/* Certificate Generator */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="font-fun text-base font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Super Learner Certificate</span>
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-400">
                Reward your child with a personalized printable diploma!
              </p>
            </div>
            <button
              onClick={() => setShowCertificate(!showCertificate)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {showCertificate ? 'Hide Preview' : 'Generate Diploma'}
            </button>
          </div>

          {showCertificate && (
            <div className="mt-4 p-6 bg-white dark:bg-slate-800 border-4 border-amber-300 rounded-2xl shadow-inner text-center">
              <div className="text-3xl mb-1">🎓 🌟 🏆</div>
              <h3 className="font-fun text-2xl font-bold text-slate-800 dark:text-white">
                Certificate of Super Adventure
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 my-1">This award is proudly presented to:</p>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="my-2 px-3 py-1 font-fun text-xl font-bold text-amber-600 dark:text-amber-400 border-b-2 border-amber-400 text-center bg-transparent focus:outline-hidden"
              />
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                For demonstrating incredible curiosity, kindness, and learning excellence in Smart Kids Adventures!
              </p>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs font-semibold text-slate-500">
                <span>⭐ {progress.stars} Stars Earned</span>
                <span>•</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
              <button
                onClick={handlePrintCertificate}
                className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>
          )}
        </div>

        {/* Safety & Reset Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 text-center sm:text-left">
            100% Kid Safe • No external tracking • Local storage only
          </div>

          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Child Progress</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-rose-600 font-bold">Are you sure?</span>
              <button
                onClick={() => {
                  resetAllProgress();
                  onResetProgress();
                  setConfirmReset(false);
                  onClose();
                }}
                className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 cursor-pointer"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
