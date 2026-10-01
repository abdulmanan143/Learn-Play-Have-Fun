import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface AudioButtonProps {
  textToSpeak?: string;
  onClick?: () => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'primary' | 'secondary' | 'subtle';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  textToSpeak,
  onClick,
  label = 'Listen',
  size = 'md',
  className = '',
  variant = 'primary',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();

    if (onClick) {
      onClick();
      return;
    }

    if (textToSpeak) {
      setIsPlaying(true);
      sound.speak(textToSpeak).finally(() => {
        setIsPlaying(false);
      });
    }
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg',
    md: 'px-3.5 py-2 text-sm gap-2 rounded-xl',
    lg: 'px-5 py-3 text-base gap-2.5 rounded-2xl'
  }[size];

  const variantClasses = {
    primary: 'bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold shadow-md hover:shadow-lg active:scale-95 transition-all',
    secondary: 'bg-sky-400 hover:bg-sky-500 text-sky-950 font-bold shadow-md hover:shadow-lg active:scale-95 transition-all',
    subtle: 'bg-white/80 hover:bg-white text-slate-700 font-semibold border border-slate-200 hover:border-slate-300 shadow-sm active:scale-95 transition-all dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
  }[variant];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={`inline-flex items-center justify-center cursor-pointer select-none font-fun tracking-wide ${sizeClasses} ${variantClasses} ${isPlaying ? 'ring-4 ring-amber-300 animate-pulse' : ''} ${className}`}
    >
      <Volume2 className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} ${isPlaying ? 'animate-bounce' : ''}`} />
      <span>{label}</span>
    </button>
  );
};
