import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { GameState } from '@/types/game';
import GameEngine from '@/components/Game/GameEngine';
import DailyRewards from '@/components/DailyRewards';

export default function GameScreen() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    score: 0,
    coins: 0,
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
  });

  const [selectedSkin, setSelectedSkin] = useState('default');

  const handleGameStateChange = useCallback((newGameState: GameState) => {
    setGameState(newGameState);
  }, []);

  const handleSkinChange = useCallback((skinId: string) => {
    setSelectedSkin(skinId);
  }, []);

  const handleDailyRewardClaimed = useCallback((coins: number) => {
    setGameState(prev => ({ ...prev, coins: prev.coins + coins }));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4FC3F7" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Bird Flight Adventure</Text>
        <Text style={styles.subtitle}>Soar through the skies and collect treasures!</Text>
      </View>
      
      <View style={styles.gameContainer}>
        <GameEngine 
          onGameStateChange={handleGameStateChange}
          selectedSkin={selectedSkin}
          onSkinChange={handleSkinChange}
        />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{gameState.highScore}</Text>
            <Text style={styles.statLabel}>Best Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{gameState.coins}</Text>
            <Text style={styles.statLabel}>Total Coins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{gameState.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>
      </View>
      
      <DailyRewards onRewardClaimed={handleDailyRewardClaimed} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4FC3F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: '#2196F3',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    textAlign: 'center',
    marginTop: 5,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#E3F2FD',
    marginTop: 2,
  },
});