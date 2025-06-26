import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Coin, PowerUp } from '@/types/game';

interface CollectibleProps {
  item: Coin | PowerUp;
  type: 'coin' | 'powerup';
}

export default function Collectible({ item, type }: CollectibleProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000 }),
      -1,
      false
    );

    // Pulsing scale animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(0.9, { duration: 800 })
      ),
      -1,
      true
    );

    // Glow effect
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: item.position.x },
        { translateY: item.position.y },
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ],
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  const renderCoin = (coin: Coin) => (
    <View style={styles.coinContainer}>
      <Animated.View style={[styles.coinGlow, glowAnimatedStyle]} />
      <View style={[styles.coin, coin.streak && styles.coinStreak]}>
        <Text style={styles.coinText}>$</Text>
      </View>
    </View>
  );

  const renderPowerUp = (powerUp: PowerUp) => {
    let powerUpStyle = styles.powerUpDefault;
    let icon = '⚡';
    
    switch (powerUp.type) {
      case 'shield':
        powerUpStyle = styles.powerUpShield;
        icon = '🛡️';
        break;
      case 'magnet':
        powerUpStyle = styles.powerUpMagnet;
        icon = '🧲';
        break;
      case 'double_coins':
        powerUpStyle = styles.powerUpDouble;
        icon = '💰';
        break;
      case 'slow_motion':
        powerUpStyle = styles.powerUpSlow;
        icon = '⏰';
        break;
    }

    return (
      <View style={styles.powerUpContainer}>
        <Animated.View style={[styles.powerUpGlow, glowAnimatedStyle, powerUpStyle]} />
        <View style={[styles.powerUp, powerUpStyle]}>
          <Text style={styles.powerUpIcon}>{icon}</Text>
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {type === 'coin' ? renderCoin(item as Coin) : renderPowerUp(item as PowerUp)}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 32,
    height: 32,
  },
  coinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    opacity: 0.5,
  },
  coin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  coinStreak: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF4757',
  },
  coinText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  powerUpContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerUpGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.3,
  },
  powerUp: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  powerUpDefault: {
    backgroundColor: '#9B59B6',
  },
  powerUpShield: {
    backgroundColor: '#3498DB',
  },
  powerUpMagnet: {
    backgroundColor: '#E74C3C',
  },
  powerUpDouble: {
    backgroundColor: '#F39C12',
  },
  powerUpSlow: {
    backgroundColor: '#2ECC71',
  },
  powerUpIcon: {
    fontSize: 12,
  },
});