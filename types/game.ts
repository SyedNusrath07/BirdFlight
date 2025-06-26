export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Bird {
  position: Position;
  velocity: Velocity;
  rotation: number;
  isFlapping: boolean;
  skin: string;
  reactions: BirdReaction[];
  trail: Position[]; // For particle trail
}

export interface BirdReaction {
  type: 'coin_streak' | 'perfect_flight' | 'power_up';
  timestamp: number;
  duration: number;
}

export interface Obstacle {
  id: string;
  type: 'cloud_ring' | 'balloon' | 'tree_branch' | 'moving_platform';
  position: Position;
  size: { width: number; height: number };
  velocity?: Velocity;
  passed: boolean;
  color?: string;
}

export interface Coin {
  id: string;
  position: Position;
  collected: boolean;
  value: number;
  streak?: boolean;
}

export interface PowerUp {
  id: string;
  type: 'shield' | 'magnet' | 'double_coins' | 'slow_motion';
  position: Position;
  collected: boolean;
  duration: number;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  coins: number;
  level: number;
  experience: number;
  experienceToNext: number;
  highScore: number;
  currentTheme: 'spring' | 'summer' | 'autumn' | 'winter' | 'night';
  activePowerUps: ActivePowerUp[];
  coinStreak: number;
  perfectFlightCombo: number;
  liveAchievements: LiveAchievement[];
  selectedSkin: string;
  lastDailyReward: string; // ISO date string
  consecutiveDays: number;
}

export interface LiveAchievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  timestamp: number;
}

export interface ActivePowerUp {
  type: PowerUp['type'];
  timeRemaining: number;
}

export interface BirdSkin {
  id: string;
  name: string;
  color: string;
  accentColor: string;
  price: number;
  unlocked: boolean;
  description: string;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'skin' | 'power_up' | 'upgrade';
  price: number;
  owned: boolean;
  description: string;
  data: any;
}

export interface Theme {
  id: string;
  name: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  cloudColor: string;
  obstacleColors: string[];
}

export interface DailyReward {
  day: number;
  coins: number;
  powerUps?: string[];
  claimed: boolean;
}

export interface CloudSyncData {
  coins: number;
  highScore: number;
  level: number;
  experience: number;
  unlockedSkins: string[];
  selectedSkin: string;
  achievements: string[];
  lastSync: string;
}