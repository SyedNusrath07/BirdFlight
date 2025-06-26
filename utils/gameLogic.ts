import { GameState, Bird, Obstacle, Coin, PowerUp, Theme, Position } from '@/types/game';

export const GRAVITY = 60; // Increased from 0.8 for better control
export const FLAP_STRENGTH = -60; // Slightly stronger to compensate
export const BIRD_SIZE = 40;
export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 600;
export const MAX_FALL_SPEED = 60; // Clamp fall speed for smooth gliding

export const themes: Theme[] = [
  {
    id: 'spring',
    name: 'Spring',
    backgroundColor: '#87CEEB',
    primaryColor: '#98FB98',
    secondaryColor: '#FFB6C1',
    accentColor: '#DDA0DD',
    cloudColor: '#FFFFFF',
    obstacleColors: ['#32CD32', '#FF69B4', '#9370DB']
  },
  {
    id: 'summer',
    name: 'Summer',
    backgroundColor: '#4FC3F7',
    primaryColor: '#81C784',
    secondaryColor: '#FFD54F',
    accentColor: '#FF8A65',
    cloudColor: '#FEFFE7',
    obstacleColors: ['#4CAF50', '#FF9800', '#2196F3']
  },
  {
    id: 'autumn',
    name: 'Autumn',
    backgroundColor: '#FF8A50',
    primaryColor: '#D4A574',
    secondaryColor: '#A0522D',
    accentColor: '#CD853F',
    cloudColor: '#F5DEB3',
    obstacleColors: ['#D2691E', '#B22222', '#FF4500']
  },
  {
    id: 'winter',
    name: 'Winter',
    backgroundColor: '#B8C6DB',
    primaryColor: '#E6F3FF',
    secondaryColor: '#C7E9FF',
    accentColor: '#A3D2FF',
    cloudColor: '#FFFFFF',
    obstacleColors: ['#87CEEB', '#B0E0E6', '#E0FFFE']
  },
  {
    id: 'night',
    name: 'Night',
    backgroundColor: '#2C3E50',
    primaryColor: '#34495E',
    secondaryColor: '#9B59B6',
    accentColor: '#F39C12',
    cloudColor: '#5D6D7E',
    obstacleColors: ['#8E44AD', '#3498DB', '#E74C3C']
  }
];

export const getThemeByTime = (): Theme => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return themes[0]; // Spring (morning)
  if (hour >= 12 && hour < 17) return themes[1]; // Summer (afternoon)
  if (hour >= 17 && hour < 20) return themes[2]; // Autumn (evening)
  if (hour >= 20 || hour < 2) return themes[4]; // Night
  return themes[3]; // Winter (late night/early morning)
};

export const updateBirdPhysics = (bird: Bird, deltaTime: number): Bird => {
  const newVelocity = {
    x: bird.velocity.x,
    y: Math.min(MAX_FALL_SPEED, bird.velocity.y + GRAVITY * deltaTime) // Clamp fall speed
  };

  const newPosition = {
    x: bird.position.x + newVelocity.x * deltaTime,
    y: Math.max(0, Math.min(GAME_HEIGHT - BIRD_SIZE, bird.position.y + newVelocity.y * deltaTime))
  };

  const rotation = Math.max(-30, Math.min(90, newVelocity.y * 2.5)); // Smoother rotation

  return {
    ...bird,
    position: newPosition,
    velocity: newVelocity,
    rotation,
    isFlapping: false
  };
};

export const flapBird = (bird: Bird): Bird => ({
  ...bird,
  velocity: { ...bird.velocity, y: FLAP_STRENGTH },
  isFlapping: true
});

export const generateObstacle = (gameWidth: number, gameHeight: number): Obstacle => {
  const types: Obstacle['type'][] = ['cloud_ring', 'balloon', 'tree_branch', 'moving_platform'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const baseY = gameHeight * 0.3 + Math.random() * gameHeight * 0.4;
  
  let size: { width: number; height: number };
  let velocity: { x: number; y: number } = { x: -2, y: 0 };
  
  switch (type) {
    case 'cloud_ring':
      size = { width: 80, height: 80 };
      break;
    case 'balloon':
      size = { width: 60, height: 80 };
      velocity.y = Math.sin(Date.now() * 0.001) * 0.5;
      break;
    case 'tree_branch':
      size = { width: 100, height: 20 };
      break;
    case 'moving_platform':
      size = { width: 120, height: 20 };
      velocity.y = Math.sin(Date.now() * 0.002) * 1;
      break;
  }

  return {
    id: Math.random().toString(36),
    type,
    position: { x: gameWidth + size.width, y: baseY },
    size,
    velocity,
    passed: false,
    color: themes[Math.floor(Math.random() * themes.length)].obstacleColors[0]
  };
};

export const generateCoin = (gameWidth: number, gameHeight: number): Coin => ({
  id: Math.random().toString(36),
  position: {
    x: gameWidth + Math.random() * 100,
    y: gameHeight * 0.2 + Math.random() * gameHeight * 0.6
  },
  collected: false,
  value: 1,
  streak: false
});

export const generatePowerUp = (gameWidth: number, gameHeight: number): PowerUp => {
  const types: PowerUp['type'][] = ['shield', 'magnet', 'double_coins', 'slow_motion'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    id: Math.random().toString(36),
    type,
    position: {
      x: gameWidth + Math.random() * 100,
      y: gameHeight * 0.2 + Math.random() * gameHeight * 0.6
    },
    collected: false,
    duration: type === 'shield' ? 5000 : type === 'magnet' ? 8000 : type === 'double_coins' ? 10000 : 6000
  };
};

export const checkCollision = (
  pos1: Position,
  size1: { width: number; height: number },
  pos2: Position,
  size2: { width: number; height: number }
): boolean => {
  return (
    pos1.x < pos2.x + size2.width &&
    pos1.x + size1.width > pos2.x &&
    pos1.y < pos2.y + size2.height &&
    pos1.y + size1.height > pos2.y
  );
};

export const calculateExperience = (score: number, coinsCollected: number, level: number): number => {
  return Math.floor(score * 0.1 + coinsCollected * 2 + level * 10);
};

export const getExperienceForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.2, level - 1));
};

export const shouldLevelUp = (experience: number, level: number): boolean => {
  return experience >= getExperienceForLevel(level + 1);
};

export const getRandomTheme = (): Theme => {
  return themes[Math.floor(Math.random() * themes.length)];
};

// Daily rewards system
export const getDailyReward = (day: number): { coins: number; powerUps?: string[] } => {
  const baseReward = 50;
  const multiplier = Math.floor(day / 7) + 1;
  
  const rewards = [
    { coins: baseReward * multiplier },
    { coins: baseReward * multiplier + 25 },
    { coins: baseReward * multiplier + 50, powerUps: ['shield'] },
    { coins: baseReward * multiplier + 75 },
    { coins: baseReward * multiplier + 100, powerUps: ['magnet'] },
    { coins: baseReward * multiplier + 125 },
    { coins: baseReward * multiplier + 200, powerUps: ['shield', 'magnet', 'double_coins'] }
  ];
  
  return rewards[day % 7];
};

// Achievement checking
export const checkAchievements = (gameState: GameState): string[] => {
  const newAchievements: string[] = [];
  
  // Coin streak achievements
  if (gameState.coinStreak >= 5 && gameState.coinStreak < 10) {
    newAchievements.push('Coin Collector');
  } else if (gameState.coinStreak >= 10) {
    newAchievements.push('Coin Master');
  }
  
  // Perfect flight achievements
  if (gameState.perfectFlightCombo >= 3) {
    newAchievements.push('Perfect Pilot');
  }
  
  // Score achievements
  if (gameState.score >= 50 && gameState.score < 100) {
    newAchievements.push('Sky Explorer');
  } else if (gameState.score >= 100) {
    newAchievements.push('Sky Master');
  }
  
  return newAchievements;
};