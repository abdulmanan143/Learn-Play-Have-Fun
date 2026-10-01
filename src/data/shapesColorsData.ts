import { ShapeData, ColorData, VocabularyItem } from '../types';

export const COLORS_DATA: ColorData[] = [
  {
    id: 'red',
    name: 'Red',
    hex: '#ef4444',
    borderHex: '#b91c1c',
    textColor: 'text-red-500',
    example: 'Red Apple & Firetruck',
    exampleEmoji: '🍎'
  },
  {
    id: 'blue',
    name: 'Blue',
    hex: '#3b82f6',
    borderHex: '#1d4ed8',
    textColor: 'text-blue-500',
    example: 'Blue Sky & Ocean Waves',
    exampleEmoji: '🌊'
  },
  {
    id: 'green',
    name: 'Green',
    hex: '#22c55e',
    borderHex: '#15803d',
    textColor: 'text-green-500',
    example: 'Green Leaf & Frog',
    exampleEmoji: '🐸'
  },
  {
    id: 'yellow',
    name: 'Yellow',
    hex: '#eab308',
    borderHex: '#a16207',
    textColor: 'text-yellow-500',
    example: 'Yellow Sun & Ripe Banana',
    exampleEmoji: '🍌'
  },
  {
    id: 'orange',
    name: 'Orange',
    hex: '#f97316',
    borderHex: '#c2410c',
    textColor: 'text-orange-500',
    example: 'Juicy Orange & Carrot',
    exampleEmoji: '🥕'
  },
  {
    id: 'purple',
    name: 'Purple',
    hex: '#a855f7',
    borderHex: '#7e22ce',
    textColor: 'text-purple-500',
    example: 'Purple Grapes & Royal Crown',
    exampleEmoji: '🍇'
  },
  {
    id: 'pink',
    name: 'Pink',
    hex: '#ec4899',
    borderHex: '#be185d',
    textColor: 'text-pink-500',
    example: 'Pink Flamingo & Sweet Cotton Candy',
    exampleEmoji: '🦩'
  },
  {
    id: 'brown',
    name: 'Brown',
    hex: '#854d0e',
    borderHex: '#543007',
    textColor: 'text-amber-800',
    example: 'Brown Teddy Bear & Chocolate',
    exampleEmoji: '🧸'
  },
  {
    id: 'black',
    name: 'Black',
    hex: '#1e293b',
    borderHex: '#0f172a',
    textColor: 'text-slate-900',
    example: 'Night Sky & Silly Penguin',
    exampleEmoji: '🐧'
  },
  {
    id: 'white',
    name: 'White',
    hex: '#f8fafc',
    borderHex: '#cbd5e1',
    textColor: 'text-slate-600',
    example: 'Fluffy Cloud & Snowman',
    exampleEmoji: '⛄'
  }
];

export const SHAPES_DATA: ShapeData[] = [
  {
    id: 'circle',
    name: 'Circle',
    pronunciation: 'sur-kuhl',
    color: '#3b82f6',
    example: 'Round Clock & Wheel',
    exampleEmoji: '⏰'
  },
  {
    id: 'square',
    name: 'Square',
    pronunciation: 'skwair',
    color: '#ef4444',
    example: 'Gift Box & Window Tile',
    exampleEmoji: '🎁'
  },
  {
    id: 'triangle',
    name: 'Triangle',
    pronunciation: 'try-ang-guhl',
    color: '#22c55e',
    example: 'Pizza Slice & Mountain Peak',
    exampleEmoji: '🍕'
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    pronunciation: 'rek-tang-guhl',
    color: '#f97316',
    example: 'Storybook & Tablet Screen',
    exampleEmoji: '📖'
  },
  {
    id: 'star',
    name: 'Star',
    pronunciation: 'stahr',
    color: '#eab308',
    example: 'Twinkling Night Star & Badge',
    exampleEmoji: '⭐'
  },
  {
    id: 'heart',
    name: 'Heart',
    pronunciation: 'hahrt',
    color: '#ec4899',
    example: 'Love & Caring Hug',
    exampleEmoji: '💖'
  },
  {
    id: 'oval',
    name: 'Oval',
    pronunciation: 'oh-vuhl',
    color: '#8b5cf6',
    example: 'Breakfast Egg & Mirror',
    exampleEmoji: '🥚'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    pronunciation: 'dy-muhnd',
    color: '#06b6d4',
    example: 'Flying Kite & Shiny Gem',
    exampleEmoji: '🪁'
  }
];

export const VOCABULARY_DATA: VocabularyItem[] = [
  // Fruits & Food
  { id: 'v_apple', word: 'Apple', category: 'fruits', emoji: '🍎', color: 'bg-red-50 text-red-700' },
  { id: 'v_banana', word: 'Banana', category: 'fruits', emoji: '🍌', color: 'bg-yellow-50 text-yellow-700' },
  { id: 'v_orange', word: 'Orange', category: 'fruits', emoji: '🍊', color: 'bg-orange-50 text-orange-700' },
  { id: 'v_grapes', word: 'Grapes', category: 'fruits', emoji: '🍇', color: 'bg-purple-50 text-purple-700' },
  { id: 'v_watermelon', word: 'Watermelon', category: 'fruits', emoji: '🍉', color: 'bg-emerald-50 text-emerald-700' },
  { id: 'v_mango', word: 'Mango', category: 'fruits', emoji: '🥭', color: 'bg-amber-50 text-amber-700' },
  { id: 'v_strawberry', word: 'Strawberry', category: 'fruits', emoji: '🍓', color: 'bg-rose-50 text-rose-700' },
  { id: 'v_pineapple', word: 'Pineapple', category: 'fruits', emoji: '🍍', color: 'bg-yellow-50 text-yellow-800' },

  // Nature
  { id: 'v_sun', word: 'Sun', category: 'nature', emoji: '☀️', color: 'bg-amber-50 text-amber-800' },
  { id: 'v_moon', word: 'Moon', category: 'nature', emoji: '🌙', color: 'bg-indigo-50 text-indigo-800' },
  { id: 'v_tree', word: 'Tree', category: 'nature', emoji: '🌳', color: 'bg-emerald-50 text-emerald-800' },
  { id: 'v_flower', word: 'Flower', category: 'nature', emoji: '🌸', color: 'bg-pink-50 text-pink-800' },

  // Objects
  { id: 'v_book', word: 'Book', category: 'objects', emoji: '📚', color: 'bg-blue-50 text-blue-800' },
  { id: 'v_ball', word: 'Ball', category: 'objects', emoji: '⚽', color: 'bg-cyan-50 text-cyan-800' },
  { id: 'v_chair', word: 'Chair', category: 'objects', emoji: '🪑', color: 'bg-stone-50 text-stone-800' },
  { id: 'v_table', word: 'Table', category: 'objects', emoji: '🪵', color: 'bg-amber-50 text-amber-900' }
];
