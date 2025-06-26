import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, BirdSkin } from '@/types/game';
import { birdSkins } from '@/utils/birdSkins';

const STORAGE_KEYS = {
  GAME_STATE: 'gameState',
  OWNED_SKINS: 'ownedSkins',
  SELECTED_SKIN: 'selectedSkin',
  COINS: 'coins',
  HIGH_SCORE: 'highScore',
  LEVEL: 'level',
  EXPERIENCE: 'experience',
  ACHIEVEMENTS: 'achievements',
  LAST_DAILY_REWARD: 'lastDailyReward',
  CONSECUTIVE_DAYS: 'consecutiveDays',
};

const initialGameState: GameState = {
  isPlaying: false,
  isPaused: false,
  score: 0,
  coins: 150,
  level: 1,
  experience: 0,
  experienceToNext: 100,
  highScore: 0,
  currentTheme: 'summer',
  activePowerUps: [],
  coinStreak: 0,
  perfectFlightCombo: 0,
  liveAchievements: [],
  selectedSkin: 'default',
  lastDailyReward: '',
  consecutiveDays: 0,
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [ownedSkins, setOwnedSkins] = useState<string[]>(['default']);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from storage
  const loadGameData = useCallback(async () => {
    try {
      const [
        savedGameState,
        savedOwnedSkins,
        savedSelectedSkin,
        savedCoins,
        savedHighScore,
        savedLevel,
        savedExperience,
        savedAchievements,
        savedLastDailyReward,
        savedConsecutiveDays,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE),
        AsyncStorage.getItem(STORAGE_KEYS.OWNED_SKINS),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_SKIN),
        AsyncStorage.getItem(STORAGE_KEYS.COINS),
        AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE),
        AsyncStorage.getItem(STORAGE_KEYS.LEVEL),
        AsyncStorage.getItem(STORAGE_KEYS.EXPERIENCE),
        AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_DAILY_REWARD),
        AsyncStorage.getItem(STORAGE_KEYS.CONSECUTIVE_DAYS),
      ]);

      const loadedState: GameState = {
        ...initialGameState,
        coins: savedCoins ? parseInt(savedCoins) : initialGameState.coins,
        highScore: savedHighScore ? parseInt(savedHighScore) : initialGameState.highScore,
        level: savedLevel ? parseInt(savedLevel) : initialGameState.level,
        experience: savedExperience ? parseInt(savedExperience) : initialGameState.experience,
        selectedSkin: savedSelectedSkin || initialGameState.selectedSkin,
        lastDailyReward: savedLastDailyReward || initialGameState.lastDailyReward,
        consecutiveDays: savedConsecutiveDays ? parseInt(savedConsecutiveDays) : initialGameState.consecutiveDays,
      };

      const loadedOwnedSkins = savedOwnedSkins ? JSON.parse(savedOwnedSkins) : ['default'];
      const loadedAchievements = savedAchievements ? JSON.parse(savedAchievements) : [];

      setGameState(loadedState);
      setOwnedSkins(loadedOwnedSkins);
      setAchievements(loadedAchievements);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading game data:', error);
      setIsLoaded(true);
    }
  }, []);

  // Save data to storage
  const saveGameData = useCallback(async (newState: Partial<GameState>, newOwnedSkins?: string[], newAchievements?: string[]) => {
    try {
      const updates: Promise<void>[] = [];

      if (newState.coins !== undefined) {
        updates.push(AsyncStorage.setItem(STORAGE_KEYS.COINS, newState.coins.toString()));
      }
      if (newState.highScore !== undefined) {
        updates.push(AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, newState.highScore.toString()));
      }
      if (newState.level !== undefined) {
        updates.push(AsyncStorage.setItem(STORAGE_KEYS.LEVEL, newState.level.toString()));
      }
      if (newState.experience !== undefined) {
        updates.push(AsyncStorage.setItem(STORAGE_KEYS.EXPERIENCE, newState.experience.toString()));
      }
      if (newState.selectedSkin !== undefined) {
        updates.push(AsyncStorage.setItem(STORAGE_KEYS.SELECTED_SKIN, newState.selectedSkin));
      }
      if (newState.lastDailyReward !== undefined) {
        updates.push(AsyncStorage.setItem(STORAGE_KEYS.LAST_DAILY_REWARD, newState.lastDailyReward));
      }
      if (newState.consecutiveDays !== undefined) {
        updates.push(AsyncStorage.setItem(STORAGE_KEYS.CONSECUTIVE_DAYS, newState.consecutiveDays.toString()));
      }
      if (newOwnedSkins) {
        updates.push(AsyncStorage.setItem(STORAGE_KEYS.OWNED_SKINS, JSON.stringify(newOwnedSkins)));
      }
      if (newAchievements) {
        updates.push(AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(newAchievements)));
      }

      await Promise.all(updates);
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  }, []);

  // Update game state with auto-save
  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      saveGameData(updates);
      return newState;
    });
  }, [saveGameData]);

  // Update owned skins with auto-save
  const updateOwnedSkins = useCallback((newOwnedSkins: string[]) => {
    setOwnedSkins(newOwnedSkins);
    saveGameData({}, newOwnedSkins);
  }, [saveGameData]);

  // Update achievements with auto-save
  const updateAchievements = useCallback((newAchievements: string[]) => {
    setAchievements(newAchievements);
    saveGameData({}, undefined, newAchievements);
  }, [saveGameData]);

  // Buy skin
  const buySkin = useCallback((skinId: string) => {
    const skin = birdSkins.find(s => s.id === skinId);
    if (!skin || ownedSkins.includes(skinId) || gameState.coins < skin.price) {
      return false;
    }

    const newCoins = gameState.coins - skin.price;
    const newOwnedSkins = [...ownedSkins, skinId];
    
    setGameState(prev => ({ ...prev, coins: newCoins, selectedSkin: skinId }));
    setOwnedSkins(newOwnedSkins);
    
    saveGameData({ coins: newCoins, selectedSkin: skinId }, newOwnedSkins);
    return true;
  }, [gameState.coins, ownedSkins, saveGameData]);

  // Select skin
  const selectSkin = useCallback((skinId: string) => {
    if (!ownedSkins.includes(skinId)) {
      return false;
    }

    setGameState(prev => ({ ...prev, selectedSkin: skinId }));
    saveGameData({ selectedSkin: skinId });
    return true;
  }, [ownedSkins, saveGameData]);

  // Add coins
  const addCoins = useCallback((amount: number) => {
    setGameState(prev => {
      const newCoins = prev.coins + amount;
      saveGameData({ coins: newCoins });
      return { ...prev, coins: newCoins };
    });
  }, [saveGameData]);

  // Update score and experience
  const updateScore = useCallback((newScore: number) => {
    setGameState(prev => {
      const newHighScore = Math.max(prev.highScore, newScore);
      const experienceGained = Math.floor(newScore * 0.1);
      const newExperience = prev.experience + experienceGained;
      
      let newLevel = prev.level;
      let newExperienceToNext = prev.experienceToNext;
      
      // Check for level up
      while (newExperience >= newExperienceToNext) {
        newLevel++;
        newExperienceToNext = Math.floor(100 * Math.pow(1.2, newLevel - 1));
      }

      const updates = {
        score: newScore,
        highScore: newHighScore,
        experience: newExperience,
        experienceToNext: newExperienceToNext,
        level: newLevel,
      };

      saveGameData(updates);
      return { ...prev, ...updates };
    });
  }, [saveGameData]);

  // Load data on mount
  useEffect(() => {
    loadGameData();
  }, [loadGameData]);

  return {
    gameState,
    ownedSkins,
    achievements,
    isLoaded,
    updateGameState,
    updateOwnedSkins,
    updateAchievements,
    buySkin,
    selectSkin,
    addCoins,
    updateScore,
    loadGameData,
  };
}