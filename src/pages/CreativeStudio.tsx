import React, { useState, useRef, useEffect } from 'react';
import { Upload, RotateCw, FlipHorizontal, Download, RotateCcw, Eye, Sparkles, Smile, Star, Heart, Trash2, Check } from 'lucide-react';
import { sound } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';

interface CreativeStudioProps {
  onEarnStars: (count: number) => void;
}

interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

const SAMPLE_PHOTOS = [
  { id: 'kid1', name: 'Happy Kid', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23fde68a"/><circle cx="200" cy="180" r="110" fill="%23fbcfe8"/><circle cx="160" cy="160" r="14" fill="%231e293b"/><circle cx="240" cy="160" r="14" fill="%231e293b"/><path d="M 160 210 Q 200 250 240 210" stroke="%23e11d48" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="130" cy="190" r="16" fill="%23fda4af" opacity="0.6"/><circle cx="270" cy="190" r="16" fill="%23fda4af" opacity="0.6"/><path d="M 120 380 Q 200 300 280 380" fill="%2338bdf8"/></svg>' },
  { id: 'kid2', name: 'Joyful Girl', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23bae6fd"/><circle cx="200" cy="180" r="110" fill="%23fed7aa"/><circle cx="160" cy="160" r="14" fill="%231e293b"/><circle cx="240" cy="160" r="14" fill="%231e293b"/><path d="M 160 210 Q 200 245 240 210" stroke="%23c2410c" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="130" cy="190" r="16" fill="%23fdba74" opacity="0.6"/><circle cx="270" cy="190" r="16" fill="%23fdba74" opacity="0.6"/><path d="M 120 380 Q 200 310 280 380" fill="%23ec4899"/></svg>' },
  { id: 'puppy', name: 'Cute Puppy', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23bbf7d0"/><circle cx="200" cy="200" r="110" fill="%23d6d3d1"/><ellipse cx="120" cy="130" rx="30" ry="60" fill="%2378716c"/><ellipse cx="280" cy="130" rx="30" ry="60" fill="%2378716c"/><circle cx="165" cy="185" r="12" fill="%231c1917"/><circle cx="235" cy="185" r="12" fill="%231c1917"/><ellipse cx="200" cy="220" rx="20" ry="14" fill="%231c1917"/><path d="M 185 235 Q 200 255 215 235" stroke="%231c1917" stroke-width="4" fill="none"/></svg>' },
  { id: 'cat', name: 'Playful Kitten', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23fed7aa"/><circle cx="200" cy="200" r="110" fill="%23fef08a"/><polygon points="120,130 160,70 180,120" fill="%23f59e0b"/><polygon points="280,130 240,70 220,120" fill="%23f59e0b"/><circle cx="165" cy="185" r="12" fill="%231c1917"/><circle cx="235" cy="185" r="12" fill="%231c1917"/><polygon points="195,215 205,215 200,225" fill="%23ec4899"/><line x1="120" y1="210" x2="180" y2="215" stroke="%2378716c" stroke-width="3"/><line x1="280" y1="210" x2="220" y2="215" stroke="%2378716c" stroke-width="3"/></svg>' }
];

export const CreativeStudio: React.FC<CreativeStudioProps> = ({ onEarnStars }) => {
  const [activeMode, setActiveMode] = useState<'animal' | 'filters' | 'stickers'>('animal');
  const [imageSrc, setImageSrc] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [originalImageSrc, setOriginalImageSrc] = useState<string>(SAMPLE_PHOTOS[0].url);

  // Filters state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [cartoon, setCartoon] = useState(false);

  // Transform state
  const [rotation, setRotation] = useState(0);
  const [flippedH, setFlippedH] = useState(false);

  // Stickers state
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  // Before/After comparison toggle
  const [showOriginal, setShowOriginal] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load image onto canvas with applied filters and stickers
  useEffect(() => {
    renderCanvas();
  }, [imageSrc, brightness, contrast, saturation, blur, grayscale, cartoon, rotation, flippedH, stickers, showOriginal]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = 500;
      canvas.height = 500;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      if (!showOriginal) {
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flippedH ? -1 : 1, 1);

        // Apply filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) grayscale(${grayscale}%)`;
      } else {
        ctx.filter = 'none';
      }

      ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      ctx.restore();

      // Cartoon effect outline if enabled and not showing original
      if (cartoon && !showOriginal) {
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#f59e0b';
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      }

      // Draw stickers if not showing original
      if (!showOriginal) {
        stickers.forEach((s) => {
          ctx.font = `${s.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(s.emoji, s.x, s.y);

          // highlight if selected
          if (s.id === selectedStickerId) {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
            ctx.setLineDash([]);
          }
        });
      }
    };
    img.src = showOriginal ? originalImageSrc : imageSrc;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Oops! Please choose a picture (JPEG or PNG).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const res = event.target.result as string;
          setImageSrc(res);
          setOriginalImageSrc(res);
          resetEffects();
          sound.playSuccess();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (url: string) => {
    sound.playPop();
    setImageSrc(url);
    setOriginalImageSrc(url);
    resetEffects();
  };

  const resetEffects = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setGrayscale(0);
    setCartoon(false);
    setRotation(0);
    setFlippedH(false);
    setStickers([]);
    setSelectedStickerId(null);
  };

  // Turn Me into an Animal Presets
  const applyAnimalPreset = (animalType: string) => {
    sound.playPop();
    setStickers([]); // clear previous overlay

    if (animalType === 'cat') {
      setStickers([
        { id: '1', emoji: '🐱', x: 250, y: 70, size: 100 },
        { id: '2', emoji: '👃', x: 250, y: 220, size: 45 },
        { id: '3', emoji: '〰️', x: 170, y: 220, size: 55 },
        { id: '4', emoji: '〰️', x: 330, y: 220, size: 55 }
      ]);
      sound.speak('Meow! You are now a cute fluffy cat!');
    } else if (animalType === 'dog') {
      setStickers([
        { id: '1', emoji: '🐶', x: 250, y: 80, size: 110 },
        { id: '2', emoji: '👅', x: 250, y: 250, size: 50 },
        { id: '3', emoji: '🐾', x: 100, y: 400, size: 60 },
        { id: '4', emoji: '🐾', x: 400, y: 400, size: 60 }
      ]);
      sound.speak('Woof! You are a happy adventure puppy!');
    } else if (animalType === 'lion') {
      setStickers([
        { id: '1', emoji: '🦁', x: 250, y: 80, size: 120 },
        { id: '2', emoji: '👑', x: 250, y: 40, size: 60 },
        { id: '3', emoji: '✨', x: 100, y: 150, size: 50 },
        { id: '4', emoji: '✨', x: 400, y: 150, size: 50 }
      ]);
      sound.speak('Roar! You are the mighty King of the Jungle!');
    } else if (animalType === 'rabbit') {
      setStickers([
        { id: '1', emoji: '🐰', x: 250, y: 75, size: 115 },
        { id: '2', emoji: '🥕', x: 360, y: 320, size: 70 },
        { id: '3', emoji: '🌸', x: 130, y: 90, size: 50 }
      ]);
      sound.speak('Hop hop! You are a speedy bunny rabbit!');
    } else if (animalType === 'panda') {
      setStickers([
        { id: '1', emoji: '🐼', x: 250, y: 80, size: 110 },
        { id: '2', emoji: '🎋', x: 120, y: 330, size: 75 }
      ]);
      sound.speak('Cuddly panda time!');
    } else if (animalType === 'tiger') {
      setStickers([
        { id: '1', emoji: '🐯', x: 250, y: 80, size: 115 },
        { id: '2', emoji: '⚡', x: 100, y: 180, size: 50 },
        { id: '3', emoji: '⚡', x: 400, y: 180, size: 50 }
      ]);
      sound.speak('Grrr! Fierce and friendly tiger!');
    } else if (animalType === 'fox') {
      setStickers([
        { id: '1', emoji: '🦊', x: 250, y: 80, size: 110 },
        { id: '2', emoji: '🍂', x: 110, y: 360, size: 60 }
      ]);
      sound.speak('Clever playful fox!');
    } else if (animalType === 'frog') {
      setStickers([
        { id: '1', emoji: '🐸', x: 250, y: 80, size: 110 },
        { id: '2', emoji: '💧', x: 370, y: 220, size: 50 }
      ]);
      sound.speak('Ribbit ribbit! Silly leaping frog!');
    }
  };

  const addSticker = (emoji: string) => {
    sound.playPop();
    const newSticker: Sticker = {
      id: Math.random().toString(),
      emoji,
      x: 250 + (Math.random() * 60 - 30),
      y: 200 + (Math.random() * 60 - 30),
      size: 70
    };
    setStickers([...stickers, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if clicked near any sticker
    const clicked = stickers.slice().reverse().find(s => {
      const dist = Math.hypot(s.x - x, s.y - y);
      return dist <= s.size / 1.5;
    });

    if (clicked) {
      sound.playPop();
      setSelectedStickerId(clicked.id);
    } else {
      setSelectedStickerId(null);
    }
  };

  const removeSelectedSticker = () => {
    if (!selectedStickerId) return;
    sound.playPop();
    setStickers(stickers.filter(s => s.id !== selectedStickerId));
    setSelectedStickerId(null);
  };

  const resizeSelectedSticker = (delta: number) => {
    if (!selectedStickerId) return;
    setStickers(stickers.map(s => {
      if (s.id === selectedStickerId) {
        return { ...s, size: Math.max(30, Math.min(160, s.size + delta)) };
      }
      return s;
    }));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sound.playSuccess();
    fireConfetti();
    onEarnStars(3);

    const link = document.createElement('a');
    link.download = `SmartKids-Creation-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-slate-800">
        <div>
          <h1 className="font-fun text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎨 Kids Photo Creative Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Turn into cute animals, add silly stickers, apply fun filters, and download!
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-pink-100/70 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => {
              sound.playPop();
              setActiveMode('animal');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeMode === 'animal'
                ? 'bg-white dark:bg-slate-700 text-pink-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            🐾 Turn Me Into Animal!
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveMode('stickers');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeMode === 'stickers'
                ? 'bg-white dark:bg-slate-700 text-pink-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            ⭐ Fun Stickers
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveMode('filters');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeMode === 'filters'
                ? 'bg-white dark:bg-slate-700 text-pink-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            ✨ Magic Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Canvas Stage & Quick Action Toolbar */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-4xl p-5 border border-slate-200 dark:border-slate-700 shadow-md flex flex-col items-center">
            {/* Canvas Viewport */}
            <div className="relative border-4 border-amber-300 rounded-3xl overflow-hidden shadow-inner max-w-full bg-slate-50 dark:bg-slate-900">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full max-w-[450px] aspect-square object-contain block cursor-pointer"
              />

              {showOriginal && (
                <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 text-white text-xs font-fun font-bold rounded-full">
                  Original Photo
                </div>
              )}
            </div>

            {/* Bottom Canvas Controls */}
            <div className="mt-4 w-full flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-fun text-xs font-bold hover:bg-slate-200 cursor-pointer select-none"
                  title="Hold to see original"
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  <span>Hold Before/After</span>
                </button>

                <button
                  onClick={() => setRotation(r => (r + 90) % 360)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
                  title="Rotate 90 degrees"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setFlippedH(f => !f)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
                  title="Flip horizontally"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>

                <button
                  onClick={resetEffects}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Reset all effects"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save & Download ⭐ +3</span>
              </button>
            </div>
          </div>

          {/* Sample Photos Selector or Custom Upload */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-fun font-bold text-slate-600 dark:text-slate-300">
                Choose Sample:
              </span>
              <div className="flex items-center gap-1.5">
                {SAMPLE_PHOTOS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSample(s.url)}
                    className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-slate-700 border border-amber-200 dark:border-slate-600 text-xs font-semibold hover:bg-amber-100 cursor-pointer"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold font-fun shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload My Photo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Tools & Customization Deck */}
        <div className="lg:col-span-5 space-y-4">
          {/* MODE 1: TURN ME INTO AN ANIMAL */}
          {activeMode === 'animal' && (
            <div className="bg-white dark:bg-slate-800 rounded-4xl p-6 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
              <div>
                <h3 className="font-fun text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🐾 Turn Me Into an Animal!</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tap an animal to transform your picture with cute ears, noses, and whiskers!
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'cat', name: 'Cat', emoji: '🐱', bg: 'hover:bg-amber-50' },
                  { id: 'dog', name: 'Dog', emoji: '🐶', bg: 'hover:bg-blue-50' },
                  { id: 'lion', name: 'Lion', emoji: '🦁', bg: 'hover:bg-orange-50' },
                  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', bg: 'hover:bg-pink-50' },
                  { id: 'panda', name: 'Panda', emoji: '🐼', bg: 'hover:bg-emerald-50' },
                  { id: 'tiger', name: 'Tiger', emoji: '🐯', bg: 'hover:bg-amber-50' },
                  { id: 'fox', name: 'Fox', emoji: '🦊', bg: 'hover:bg-orange-50' },
                  { id: 'frog', name: 'Frog', emoji: '🐸', bg: 'hover:bg-green-50' }
                ].map(a => (
                  <button
                    key={a.id}
                    onClick={() => applyAnimalPreset(a.id)}
                    className={`p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/60 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs ${a.bg}`}
                  >
                    <span className="text-3xl">{a.emoji}</span>
                    <span className="font-fun text-xs font-bold text-slate-800 dark:text-white">
                      {a.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 2: FUN STICKERS DRAWER */}
          {activeMode === 'stickers' && (
            <div className="bg-white dark:bg-slate-800 rounded-4xl p-6 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
              <div>
                <h3 className="font-fun text-xl font-bold text-slate-900 dark:text-white">
                  ⭐ Add Fun Stickers
                </h3>
                <p className="text-xs text-slate-500">
                  Tap any sticker to stamp it onto the picture!
                </p>
              </div>

              {/* Category: Hats, Faces, Decorations */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Hats & Glasses
                </span>
                <div className="flex flex-wrap gap-2">
                  {['👑', '🎩', '🥳', '🕶️', '⭐', '🎀'].map(e => (
                    <button
                      key={e}
                      onClick={() => addSticker(e)}
                      className="text-3xl p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-700 hover:bg-amber-100 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-slate-200 dark:border-slate-600"
                    >
                      {e}
                    </button>
                  ))}
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block pt-1">
                  Animal Ears & Noses
                </span>
                <div className="flex flex-wrap gap-2">
                  {['🐱', '🐶', '🐰', '🦁', '👃', '👅', '🐾'].map(e => (
                    <button
                      key={e}
                      onClick={() => addSticker(e)}
                      className="text-3xl p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-700 hover:bg-amber-100 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-slate-200 dark:border-slate-600"
                    >
                      {e}
                    </button>
                  ))}
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block pt-1">
                  Party Celebrations
                </span>
                <div className="flex flex-wrap gap-2">
                  {['🎈', '🎉', '💖', '🌈', '🍦', '🧁'].map(e => (
                    <button
                      key={e}
                      onClick={() => addSticker(e)}
                      className="text-3xl p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-700 hover:bg-amber-100 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-slate-200 dark:border-slate-600"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Sticker Controls */}
              {selectedStickerId && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Selected Sticker:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => resizeSelectedSticker(15)}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Bigger (+)
                    </button>
                    <button
                      onClick={() => resizeSelectedSticker(-15)}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Smaller (-)
                    </button>
                    <button
                      onClick={removeSelectedSticker}
                      className="p-1 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 cursor-pointer"
                      title="Delete sticker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: MAGIC FILTERS */}
          {activeMode === 'filters' && (
            <div className="bg-white dark:bg-slate-800 rounded-4xl p-6 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
              <div>
                <h3 className="font-fun text-xl font-bold text-slate-900 dark:text-white">
                  ✨ Photo Filters & Adjustments
                </h3>
                <p className="text-xs text-slate-500">
                  Slide or tap to add magic sparkle and color to your picture!
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    <span>☀️ Brightness</span>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    <span>🌈 Color Saturation</span>
                    <span>{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="220"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    <span>⚡ Contrast</span>
                    <span>{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="160"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => setCartoon(!cartoon)}
                    className={`px-3.5 py-1.5 rounded-xl font-fun text-xs font-bold border transition-all cursor-pointer ${
                      cartoon
                        ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    🎨 Golden Cartoon Border
                  </button>

                  <button
                    onClick={() => setGrayscale(g => (g > 0 ? 0 : 100))}
                    className={`px-3.5 py-1.5 rounded-xl font-fun text-xs font-bold border transition-all cursor-pointer ${
                      grayscale > 0
                        ? 'bg-slate-700 text-white border-slate-800 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    📷 Classic Vintage B&W
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
