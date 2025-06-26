import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Obstacle as ObstacleType } from '@/types/game';

interface ObstacleProps {
  obstacle: ObstacleType;
}

export default function Obstacle({ obstacle }: ObstacleProps) {
  const animationValue = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Different animations for different obstacle types
    switch (obstacle.type) {
      case 'balloon':
        animationValue.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 2000 }),
            withTiming(0, { duration: 2000 })
          ),
          -1,
          true
        );
        break;
      case 'moving_platform':
        animationValue.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 1500 }),
            withTiming(-1, { duration: 1500 })
          ),
          -1,
          true
        );
        break;
      case 'cloud_ring':
        scale.value = withRepeat(
          withSequence(
            withTiming(1.05, { duration: 1000 }),
            withTiming(0.95, { duration: 1000 })
          ),
          -1,
          true
        );
        break;
    }
  }, [obstacle.type]);

  const animatedStyle = useAnimatedStyle(() => {
    let translateY = 0;
    
    if (obstacle.type === 'balloon') {
      translateY = interpolate(animationValue.value, [0, 1], [-10, 10]);
    } else if (obstacle.type === 'moving_platform') {
      translateY = interpolate(animationValue.value, [-1, 1], [-20, 20]);
    }

    return {
      transform: [
        { translateX: obstacle.position.x },
        { translateY: obstacle.position.y + translateY },
        { scale: scale.value }
      ],
    };
  });

  const renderObstacleContent = () => {
    switch (obstacle.type) {
      case 'cloud_ring':
        return (
          <View style={[styles.cloudRing, { borderColor: obstacle.color }]}>
            <View style={styles.cloudRingInner} />
          </View>
        );
      
      case 'balloon':
        return (
          <View style={styles.balloonContainer}>
            <View style={[styles.balloon, { backgroundColor: obstacle.color }]} />
            <View style={styles.balloonString} />
          </View>
        );
      
      case 'tree_branch':
        return (
          <View style={[styles.treeBranch, { backgroundColor: obstacle.color }]}>
            <View style={styles.leaf1} />
            <View style={styles.leaf2} />
            <View style={styles.leaf3} />
          </View>
        );
      
      case 'moving_platform':
        return (
          <View style={[styles.movingPlatform, { backgroundColor: obstacle.color }]}>
            <View style={styles.platformGlow} />
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: obstacle.size.width,
          height: obstacle.size.height,
        },
        animatedStyle,
      ]}
    >
      {renderObstacleContent()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  cloudRing: {
    flex: 1,
    borderRadius: 40,
    borderWidth: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cloudRingInner: {
    width: '60%',
    height: '60%',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  balloonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  balloon: {
    width: 50,
    height: 65,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  balloonString: {
    width: 2,
    height: 15,
    backgroundColor: '#8B4513',
    marginTop: -2,
  },
  treeBranch: {
    flex: 1,
    borderRadius: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leaf1: {
    position: 'absolute',
    width: 12,
    height: 8,
    backgroundColor: '#32CD32',
    borderRadius: 6,
    top: -4,
    left: 20,
  },
  leaf2: {
    position: 'absolute',
    width: 10,
    height: 6,
    backgroundColor: '#228B22',
    borderRadius: 5,
    top: -3,
    left: 50,
  },
  leaf3: {
    position: 'absolute',
    width: 8,
    height: 5,
    backgroundColor: '#32CD32',
    borderRadius: 4,
    top: -2,
    left: 80,
  },
  movingPlatform: {
    flex: 1,
    borderRadius: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  platformGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: -1,
  },
});