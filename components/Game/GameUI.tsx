import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Palette } from 'lucide-react-native';
import { GameState, Theme } from '@/types/game';

interface GameUIProps {
  gameState: GameState;
  onThemeChange?: (themeId: string) => void;
  availableThemes?: Theme[];
}

export default function GameUI({ gameState, onThemeChange, availableThemes = [] }: GameUIProps) {
  const [showThemeSelector, setShowThemeSelector] = React.useState(false);

  return (
    <View style={styles.container}>
      {/* Score display */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{gameState.score}</Text>
        <Text style={styles.scoreLabelText}>Score</Text>
      </View>
      
      {/* Coins display */}
      <View style={styles.coinsContainer}>
        <Text style={styles.coinsText}>💰 {gameState.coins}</Text>
      </View>
      
      {/* Theme selector button */}
      {gameState.isPlaying && (
        <TouchableOpacity 
          style={styles.themeButton}
          onPress={() => setShowThemeSelector(!showThemeSelector)}
        >
          <Palette size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
      {/* Theme selector */}
      {showThemeSelector && (
        <View style={styles.themeSelector}>
          {availableThemes.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeOption,
                { backgroundColor: theme.backgroundColor },
                gameState.currentTheme === theme.id && styles.selectedTheme
              ]}
              onPress={() => {
                onThemeChange?.(theme.id);
                setShowThemeSelector(false);
              }}
            >
              <Text style={styles.themeText}>{theme.name[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Level and progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.levelText}>Level {gameState.level}</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(gameState.experience / gameState.experienceToNext) * 100}%` }
            ]} 
          />
        </View>
      </View>
      
      {/* Active power-ups */}
      {gameState.activePowerUps.length > 0 && (
        <View style={styles.powerUpsContainer}>
          {gameState.activePowerUps.map((powerUp, index) => (
            <View key={index} style={styles.activePowerUp}>
              <Text style={styles.powerUpIcon}>
                {powerUp.type === 'shield' ? '🛡️' : 
                 powerUp.type === 'magnet' ? '🧲' : 
                 powerUp.type === 'double_coins' ? '💰' : '⏰'}
              </Text>
              <Text style={styles.powerUpTime}>{Math.ceil(powerUp.timeRemaining / 1000)}</Text>
            </View>
          ))}
        </View>
      )}
      
      {/* Streak indicators */}
      {gameState.coinStreak > 2 && (
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>🔥 {gameState.coinStreak} Streak!</Text>
        </View>
      )}
      
      {/* Perfect flight combo */}
      {gameState.perfectFlightCombo > 2 && (
        <View style={styles.comboContainer}>
          <Text style={styles.comboText}>✨ {gameState.perfectFlightCombo} Perfect!</Text>
        </View>
      )}
      
      {/* Game over screen */}
      {!gameState.isPlaying && gameState.score > 0 && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.finalScoreText}>Final Score: {gameState.score}</Text>
          <Text style={styles.highScoreText}>Best: {gameState.highScore}</Text>
          <Text style={styles.tapToRestartText}>Tap to play again</Text>
        </View>
      )}
      
      {/* Start screen */}
      {!gameState.isPlaying && gameState.score === 0 && (
        <View style={styles.startContainer}>
          <Text style={styles.startTitle}>Bird Flight</Text>
          <Text style={styles.startInstructions}>
            Tap to flap and fly through obstacles
          </Text>
          <Text style={styles.tapToStartText}>Tap to start!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  scoreContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  scoreLabelText: {
    fontSize: 12,
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  coinsContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  coinsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  themeButton: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    pointerEvents: 'auto',
  },
  themeSelector: {
    position: 'absolute',
    top: 110,
    right: 20,
    flexDirection: 'row',
    gap: 8,
    pointerEvents: 'auto',
  },
  themeOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTheme: {
    borderColor: '#FFFFFF',
  },
  themeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    alignItems: 'flex-start',
    minWidth: 100,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
  },
  progressBar: {
    width: 100,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  powerUpsContainer: {
    position: 'absolute',
    top: 120,
    right: 20,
    flexDirection: 'row',
    gap: 8,
  },
  activePowerUp: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    minWidth: 40,
  },
  powerUpIcon: {
    fontSize: 16,
  },
  powerUpTime: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  streakContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    backgroundColor: 'rgba(255, 100, 100, 0.9)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  comboContainer: {
    position: 'absolute',
    top: 160,
    left: 20,
    backgroundColor: 'rgba(138, 43, 226, 0.9)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  comboText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -80 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: 200,
    pointerEvents: 'none',
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  finalScoreText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  highScoreText: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 15,
  },
  tapToRestartText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  startContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -120 }, { translateY: -100 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: 240,
    pointerEvents: 'none',
  },
  startTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4FC3F7',
    marginBottom: 15,
  },
  startInstructions: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  tapToStartText: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});