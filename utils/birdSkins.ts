import { BirdSkin } from '@/types/game';

export const birdSkins: BirdSkin[] = [
  {
    id: 'default',
    name: 'Classic',
    color: '#FFD700',
    accentColor: '#FFA500',
    price: 0,
    unlocked: true,
    description: 'The classic golden bird'
  },
  {
    id: 'cardinal',
    name: 'Cardinal',
    color: '#DC143C',
    accentColor: '#8B0000',
    price: 50,
    unlocked: false,
    description: 'A fiery red cardinal'
  },
  {
    id: 'bluebird',
    name: 'Bluebird',
    color: '#4169E1',
    accentColor: '#191970',
    price: 75,
    unlocked: false,
    description: 'A peaceful blue bird'
  },
  {
    id: 'robin',
    name: 'Robin',
    color: '#FF6347',
    accentColor: '#CD5C5C',
    price: 100,
    unlocked: false,
    description: 'A cheerful spring robin'
  },
  {
    id: 'canary',
    name: 'Canary',
    color: '#FFFF00',
    accentColor: '#DAA520',
    price: 125,
    unlocked: false,
    description: 'A bright yellow canary'
  },
  {
    id: 'peacock',
    name: 'Peacock',
    color: '#008B8B',
    accentColor: '#006666',
    price: 200,
    unlocked: false,
    description: 'An elegant teal peacock'
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    color: '#FF4500',
    accentColor: '#FF8C00',
    price: 500,
    unlocked: false,
    description: 'A mythical fire phoenix'
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    color: '#9370DB',
    accentColor: '#8A2BE2',
    price: 1000,
    unlocked: false,
    description: 'A magical rainbow bird'
  }
];

export const getUnlockedSkins = (coins: number, ownedSkins: string[]): BirdSkin[] => {
  return birdSkins.map(skin => ({
    ...skin,
    unlocked: skin.unlocked || ownedSkins.includes(skin.id) || coins >= skin.price
  }));
};