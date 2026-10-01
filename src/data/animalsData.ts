import { AnimalData } from '../types';

export const ANIMALS_DATA: AnimalData[] = [
  // Farm Animals
  {
    id: 'cat',
    name: 'Cat',
    category: 'farm',
    emoji: '🐱',
    soundName: 'Meow',
    soundEffect: 'Meow meow, purrrr!',
    fact: 'Cats can jump up to 6 times their height and love cozy naps!',
    color: 'from-amber-400 to-orange-400'
  },
  {
    id: 'cow',
    name: 'Cow',
    category: 'farm',
    emoji: '🐮',
    soundName: 'Moo',
    soundEffect: 'Moooooo!',
    fact: 'Cows have best friends and love grazing on fresh sweet green grass!',
    color: 'from-emerald-400 to-green-500'
  },
  {
    id: 'goat',
    name: 'Goat',
    category: 'farm',
    emoji: '🐐',
    soundName: 'Bleat',
    soundEffect: 'Maa-aa-aa!',
    fact: 'Goats are expert climbers with rectangular pupils that see all around!',
    color: 'from-stone-400 to-amber-600'
  },
  {
    id: 'horse',
    name: 'Horse',
    category: 'farm',
    emoji: '🐴',
    soundName: 'Neigh',
    soundEffect: 'Neighhh, whinny!',
    fact: 'Horses can run within hours after being born and sleep both lying and standing!',
    color: 'from-amber-600 to-yellow-700'
  },
  {
    id: 'sheep',
    name: 'Sheep',
    category: 'farm',
    emoji: '🐑',
    soundName: 'Baa',
    soundEffect: 'Baa-aa-aa!',
    fact: 'Sheep produce soft warm fluffy wool that keeps us cozy in winter sweaters!',
    color: 'from-sky-300 to-indigo-400'
  },
  {
    id: 'chicken',
    name: 'Chicken',
    category: 'farm',
    emoji: '🐔',
    soundName: 'Cluck',
    soundEffect: 'Cluck cluck cluck, bawk!',
    fact: 'Chickens have exceptional memories and can recognize over 100 faces!',
    color: 'from-red-400 to-amber-500'
  },

  // Wild Animals
  {
    id: 'lion',
    name: 'Lion',
    category: 'wild',
    emoji: '🦁',
    soundName: 'Roar',
    soundEffect: 'Rrrrroooaaar!',
    fact: 'The lion is known as the King of the Jungle and lives with family in a pride!',
    color: 'from-amber-400 to-yellow-600'
  },
  {
    id: 'tiger',
    name: 'Tiger',
    category: 'wild',
    emoji: '🐯',
    soundName: 'Growl',
    soundEffect: 'Grrrr-rawr!',
    fact: 'Tigers love water and are wonderful swimmers who play in cool jungle rivers!',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'elephant',
    name: 'Elephant',
    category: 'wild',
    emoji: '🐘',
    soundName: 'Trumpet',
    soundEffect: 'Paawoooo!',
    fact: 'Elephants are the largest land animals and communicate with deep gentle rumbles!',
    color: 'from-slate-400 to-indigo-500'
  },
  {
    id: 'bear',
    name: 'Bear',
    category: 'wild',
    emoji: '🐻',
    soundName: 'Growl',
    soundEffect: 'Grrrr-woof!',
    fact: 'Bears love sweet berries, fresh salmon, and taking long cozy winter hibernations!',
    color: 'from-amber-700 to-stone-800'
  },
  {
    id: 'monkey',
    name: 'Monkey',
    category: 'wild',
    emoji: '🐵',
    soundName: 'Chatter',
    soundEffect: 'Ooh ooh aah aah!',
    fact: 'Monkeys use their flexible tails like an extra arm to swing between branches!',
    color: 'from-lime-500 to-emerald-600'
  },
  {
    id: 'zebra',
    name: 'Zebra',
    category: 'wild',
    emoji: '🦓',
    soundName: 'Bark/Bray',
    soundEffect: 'Kwah-ha, kwah-ha!',
    fact: 'No two zebras have the same stripes; their coats are as unique as fingerprints!',
    color: 'from-slate-600 to-zinc-800'
  },

  // Sea Animals
  {
    id: 'fish',
    name: 'Fish',
    category: 'sea',
    emoji: '🐟',
    soundName: 'Bubble',
    soundEffect: 'Blub blub blub!',
    fact: 'Fish breathe underwater using gills and communicate with tiny colorful fin waves!',
    color: 'from-cyan-400 to-blue-500'
  },
  {
    id: 'dolphin',
    name: 'Dolphin',
    category: 'sea',
    emoji: '🐬',
    soundName: 'Click/Whistle',
    soundEffect: 'Click-click, eee-eee!',
    fact: 'Dolphins are super smart, love doing acrobatic backflips, and help each other!',
    color: 'from-sky-400 to-blue-600'
  },
  {
    id: 'whale',
    name: 'Whale',
    category: 'sea',
    emoji: '🐳',
    soundName: 'Song',
    soundEffect: 'Wuuuuum-ooooh!',
    fact: 'Blue whales are the largest creatures on Earth—their hearts are as big as a car!',
    color: 'from-blue-500 to-indigo-700'
  },
  {
    id: 'shark',
    name: 'Shark',
    category: 'sea',
    emoji: '🦈',
    soundName: 'Splash',
    soundEffect: 'Swish-splash-zoom!',
    fact: 'Sharks have existed since before dinosaurs and have skeletons made of soft cartilage!',
    color: 'from-teal-600 to-cyan-800'
  },
  {
    id: 'octopus',
    name: 'Octopus',
    category: 'sea',
    emoji: '🐙',
    soundName: 'Swish',
    soundEffect: 'Squelch-swish!',
    fact: 'An octopus has three hearts, blue blood, and 8 super flexible suction arms!',
    color: 'from-purple-400 to-fuchsia-600'
  },
  {
    id: 'turtle',
    name: 'Turtle',
    category: 'sea',
    emoji: '🐢',
    soundName: 'Puff',
    soundEffect: 'Puff-paddle!',
    fact: 'Sea turtles can navigate thousands of ocean miles using Earth’s magnetic field!',
    color: 'from-emerald-500 to-teal-700'
  },

  // Birds
  {
    id: 'parrot',
    name: 'Parrot',
    category: 'birds',
    emoji: '🦜',
    soundName: 'Squawk',
    soundEffect: 'Squaaawk, Hello friend!',
    fact: 'Parrots can imitate human words, whistle happy tunes, and love rainforest fruits!',
    color: 'from-green-400 to-red-500'
  },
  {
    id: 'eagle',
    name: 'Eagle',
    category: 'birds',
    emoji: '🦅',
    soundName: 'Screech',
    soundEffect: 'Kreeee-aaar!',
    fact: 'Eagles have incredibly sharp vision that can spot a tiny mouse from high in the sky!',
    color: 'from-amber-600 to-stone-800'
  },
  {
    id: 'owl',
    name: 'Owl',
    category: 'birds',
    emoji: '🦉',
    soundName: 'Hoot',
    soundEffect: 'Hoo-hoo, twit-twoo!',
    fact: 'Owls can turn their heads almost all the way around and fly in total silence!',
    color: 'from-amber-700 to-indigo-900'
  },
  {
    id: 'peacock',
    name: 'Peacock',
    category: 'birds',
    emoji: '🦚',
    soundName: 'Honk',
    soundEffect: 'May-awe, ka-link!',
    fact: 'Male peacocks spread their dazzling iridescent tail feathers like a giant rainbow fan!',
    color: 'from-teal-400 to-purple-600'
  },
  {
    id: 'sparrow',
    name: 'Sparrow',
    category: 'birds',
    emoji: '🐦',
    soundName: 'Chirp',
    soundEffect: 'Chirp chirp tweet tweet!',
    fact: 'Sparrows are friendly garden birds who love splashing in puddle bird baths!',
    color: 'from-amber-500 to-stone-600'
  }
];
