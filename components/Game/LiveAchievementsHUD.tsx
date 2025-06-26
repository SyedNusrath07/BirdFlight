import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { LiveAchievement } from '@/types/game';

interface LiveAchievementsHUDProps {
  achievements: LiveAchievement[];
}

export default function LiveAchievementsHUD({ achievements }: LiveAchievementsHUDProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-50);

  useEffect(() => {
    if (achievements.length > 0) {
      opacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(2000, withTiming(0, { duration: 300 }))
      );
      translateY.value = withSequence(
        withTiming(0, { duration: 300 }),
        withDelay(2000, withTiming(-50, { duration: 300 }))
      );
    }
  }, [achievements]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  if (achievements.length === 0) return null;

  const latestAchievement = achievements[achievements.length - 1];

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.achievementCard}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🏆</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{latestAchievement.title}</Text>
          <Text style={styles.description}>{latestAchievement.description}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(latestAchievement.progress / latestAchievement.target) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 200,
    left: 20,
    right: 20,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  achievementCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4FC3F7',
    borderRadius: 2,
  },
});