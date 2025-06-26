import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import {
  Bird as BirdType,
  GameState,
  Obstacle as ObstacleType,
  Coin,
  PowerUp,
  BirdSkin,
  LiveAchievement,
} from '@/types/game';
import {
  updateBirdPhysics,
  flapBird,
  generateObstacle,
  generateCoin,
  generatePowerUp,
  checkCollision,
  getThemeByTime,
  themes,
  checkAchievements,
  BIRD_SIZE,
} from '@/utils/gameLogic';
import { birdSkins } from '@/utils/birdSkins';
import Bird from './Bird';
import Obstacle from './Obstacle';
import Collectible from './Collectible';
import Background from './Background';
import GameUI from './GameUI';
import LiveAchievementsHUD from './LiveAchievementsHUD';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GameEngineProps {
  onGameStateChange: (gameState: GameState) => void;
  selectedSkin: string;
  onSkinChange: (skinId: string) => void;
}

export default function GameEngine({ onGameStateChange, selectedSkin, onSkinChange }: GameEngineProps) {
  const gameWidth = Math.min(screenWidth, 400);
  const gameHeight = Math.min(screenHeight, 700);

  const [bird, setBird] = useState<BirdType>({
    position: { x: gameWidth * 0.2, y: gameHeight * 0.5 },
    velocity: { x: 0, y: 0 },
    rotation: 0,
    isFlapping: false,
    skin: selectedSkin,
    reactions: [],
    trail: [],
  });

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    score: 0,
    coins: 0,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    highScore: 0,
    currentTheme: getThemeByTime().id as any,
    activePowerUps: [],
    coinStreak: 0,
    perfectFlightCombo: 0,
    liveAchievements: [],
    selectedSkin: selectedSkin,
    lastDailyReward: '',
    consecutiveDays: 0,
  });

  const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);

  const gameLoopRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef<number>(Date.now());
  const obstacleSpawnRef = useRef<number>(0);
  const coinSpawnRef = useRef<number>(0);
  const powerUpSpawnRef = useRef<number>(0);
  const trailUpdateRef = useRef<number>(0);

  const currentTheme = themes.find(t => t.id === gameState.currentTheme) || getThemeByTime();
  const currentSkin = birdSkins.find((skin) => skin.id === selectedSkin) || birdSkins[0];

  const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (Platform.OS !== 'web') {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    }
  };

  const addLiveAchievement = (title: string, description: string, progress: number, target: number) => {
    const achievement: LiveAchievement = {
      id: Math.random().toString(36),
      title,
      description,
      progress,
      target,
      timestamp: Date.now(),
    };
    
    setGameState(prev => ({
      ...prev,
      liveAchievements: [...prev.liveAchievements.slice(-2), achievement] // Keep only last 3
    }));
  };

  const handleFlap = useCallback(() => {
    if (!gameState.isPlaying) {
      startGame();
      return;
    }
    if (gameState.isPaused) return;
    
    setBird((prevBird) => flapBird(prevBird));
    triggerHapticFeedback('light');
  }, [gameState.isPlaying, gameState.isPaused]);

  const tapGesture = Gesture.Tap().onEnd(handleFlap);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.code === 'Space' || event.key === ' ') {
          event.preventDefault();
          handleFlap();
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [handleFlap]);

  const startGame = () => {
    setGameState((prev) => ({ ...prev, isPlaying: true, isPaused: false, liveAchievements: [] }));
    setBird((prev) => ({
      ...prev,
      position: { x: gameWidth * 0.2, y: gameHeight * 0.5 },
      velocity: { x: 0, y: 0 },
      rotation: 0,
      trail: [],
    }));
    setObstacles([]);
    setCoins([]);
    setPowerUps([]);
    lastUpdateRef.current = Date.now();
  };

  const gameOver = () => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: false,
      highScore: Math.max(prev.highScore, prev.score),
    }));
    triggerHapticFeedback('heavy');
  };

  const switchTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setGameState(prev => ({ ...prev, currentTheme: themeId as any }));
    }
  };

  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    gameLoopRef.current = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      setBird((prevBird) => {
        const updatedBird = updateBirdPhysics(prevBird, deltaTime);
        
        // Update particle trail
        trailUpdateRef.current += deltaTime;
        if (trailUpdateRef.current > 0.05) { // Update trail every 50ms
          const newTrail = [
            { x: updatedBird.position.x, y: updatedBird.position.y },
            ...updatedBird.trail.slice(0, 8) // Keep last 8 positions
          ];
          updatedBird.trail = newTrail;
          trailUpdateRef.current = 0;
        }
        
        if (updatedBird.position.y >= gameHeight - BIRD_SIZE) {
          gameOver();
          return prevBird;
        }
        return updatedBird;
      });

      obstacleSpawnRef.current += deltaTime;
      if (obstacleSpawnRef.current > 2.5) {
        setObstacles((prev) => [...prev, generateObstacle(gameWidth, gameHeight)]);
        obstacleSpawnRef.current = 0;
      }

      coinSpawnRef.current += deltaTime;
      if (coinSpawnRef.current > 1.8) {
        setCoins((prev) => [...prev, generateCoin(gameWidth, gameHeight)]);
        coinSpawnRef.current = 0;
      }

      powerUpSpawnRef.current += deltaTime;
      if (powerUpSpawnRef.current > 8) {
        setPowerUps((prev) => [...prev, generatePowerUp(gameWidth, gameHeight)]);
        powerUpSpawnRef.current = 0;
      }

      setObstacles((prev) =>
        prev
          .map((obstacle) => ({
            ...obstacle,
            position: {
              x: obstacle.position.x + (obstacle.velocity?.x || -2) * deltaTime * 60,
              y: obstacle.position.y + (obstacle.velocity?.y || 0) * deltaTime * 60,
            },
          }))
          .filter((obstacle) => obstacle.position.x > -obstacle.size.width)
      );

      setCoins((prev) =>
        prev
          .map((coin) => ({
            ...coin,
            position: {
              x: coin.position.x - 2 * deltaTime * 60,
              y: coin.position.y,
            },
          }))
          .filter((coin) => coin.position.x > -32 && !coin.collected)
      );

      setPowerUps((prev) =>
        prev
          .map((powerUp) => ({
            ...powerUp,
            position: {
              x: powerUp.position.x - 2 * deltaTime * 60,
              y: powerUp.position.y,
            },
          }))
          .filter((powerUp) => powerUp.position.x > -32 && !powerUp.collected)
      );
    }, 16);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameWidth, gameHeight]);

  useEffect(() => {
    if (!gameState.isPlaying) return;

    obstacles.forEach((obstacle) => {
      if (
        checkCollision(
          bird.position,
          { width: BIRD_SIZE, height: BIRD_SIZE },
          obstacle.position,
          obstacle.size
        )
      ) {
        gameOver();
      }
      if (!obstacle.passed && obstacle.position.x < bird.position.x) {
        obstacle.passed = true;
        setGameState((prev) => {
          const newScore = prev.score + 1;
          const newPerfectCombo = prev.perfectFlightCombo + 1;
          
          // Check for perfect flight achievements
          if (newPerfectCombo === 5) {
            addLiveAchievement('Perfect Flight!', '5 obstacles cleared perfectly', 5, 5);
          } else if (newPerfectCombo === 10) {
            addLiveAchievement('Flight Master!', '10 perfect flights in a row', 10, 10);
          }
          
          return { 
            ...prev, 
            score: newScore,
            perfectFlightCombo: newPerfectCombo
          };
        });
        triggerHapticFeedback('light');
      }
    });

    coins.forEach((coin) => {
      if (
        !coin.collected &&
        checkCollision(
          bird.position,
          { width: BIRD_SIZE, height: BIRD_SIZE },
          coin.position,
          { width: 32, height: 32 }
        )
      ) {
        coin.collected = true;
        setGameState((prev) => {
          const newCoins = prev.coins + coin.value;
          const newStreak = prev.coinStreak + 1;
          
          // Check for coin streak achievements
          if (newStreak === 5) {
            addLiveAchievement('Coin Streak!', '5 coins in a row', 5, 5);
          } else if (newStreak === 10) {
            addLiveAchievement('Coin Master!', '10 coins in a row', 10, 10);
          } else if (newStreak === 20) {
            addLiveAchievement('Golden Touch!', '20 coins in a row', 20, 20);
          }
          
          return {
            ...prev,
            coins: newCoins,
            coinStreak: newStreak,
          };
        });
        triggerHapticFeedback('medium');
      }
    });

    powerUps.forEach((powerUp) => {
      if (
        !powerUp.collected &&
        checkCollision(
          bird.position,
          { width: BIRD_SIZE, height: BIRD_SIZE },
          powerUp.position,
          { width: 32, height: 32 }
        )
      ) {
        powerUp.collected = true;
        addLiveAchievement('Power Up!', `${powerUp.type} activated`, 1, 1);
        triggerHapticFeedback('heavy');
      }
    });
  }, [bird.position, obstacles, coins, powerUps, gameState.isPlaying]);

  useEffect(() => {
    onGameStateChange(gameState);
  }, [gameState, onGameStateChange]);

  return (
    <View style={[styles.container, { width: gameWidth, height: gameHeight }]}>
      <Background theme={currentTheme} gameWidth={gameWidth} gameHeight={gameHeight} />
      <GestureDetector gesture={tapGesture}>
        <View style={styles.gameArea}>
          <Bird bird={bird} skin={currentSkin} gameWidth={gameWidth} gameHeight={gameHeight} />
          {obstacles.map((obstacle) => (
            <Obstacle key={obstacle.id} obstacle={obstacle} />
          ))}
          {coins.map((coin) => (
            <Collectible key={coin.id} item={coin} type="coin" />
          ))}
          {powerUps.map((powerUp) => (
            <Collectible key={powerUp.id} item={powerUp} type="powerup" />
          ))}
          <GameUI 
            gameState={gameState} 
            onThemeChange={switchTheme}
            availableThemes={themes}
          />
          <LiveAchievementsHUD achievements={gameState.liveAchievements} />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#87CEEB',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
});