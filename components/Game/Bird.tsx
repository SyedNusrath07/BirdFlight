import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';
import { Bird as BirdType, BirdSkin } from '@/types/game';

interface BirdProps {
  bird: BirdType;
  skin: BirdSkin;
  gameWidth: number;
  gameHeight: number;
}

export default function Bird({ bird, skin, gameWidth, gameHeight }: BirdProps) {
  const wingRotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Wing flapping animation
    wingRotation.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 150 }),
        withTiming(15, { duration: 150 })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (bird.isFlapping) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }
  }, [bird.isFlapping]);

  useEffect(() => {
    // Show glow effect for reactions
    if (bird.reactions.length > 0) {
      glowOpacity.value = withSequence(
        withTiming(0.8, { duration: 200 }),
        withTiming(0, { duration: 800 })
      );
    }
  }, [bird.reactions]);

  const birdAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: bird.position.x },
        { translateY: bird.position.y },
        { rotate: `${bird.rotation}deg` },
        { scale: scale.value }
      ],
    };
  });

  const wingAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${wingRotation.value}deg` }],
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  const bodyAnimatedStyle = useAnimatedStyle(() => {
    const bounce = interpolate(
      Math.sin(Date.now() * 0.005),
      [-1, 1],
      [-2, 2]
    );
    
    return {
      transform: [{ translateY: bounce }],
    };
  });

  // Render particle trail
  const renderTrail = () => {
    return bird.trail.map((position, index) => (
      <View
        key={index}
        style={[
          styles.trailParticle,
          {
            left: position.x + 16,
            top: position.y + 16,
            opacity: (index + 1) / bird.trail.length * 0.6,
            backgroundColor: skin.accentColor,
          }
        ]}
      />
    ));
  };

  return (
    <>
      {/* Particle trail */}
      {renderTrail()}
      
      <Animated.View style={[styles.container, birdAnimatedStyle]}>
        {/* Glow effect for reactions */}
        <Animated.View style={[styles.glow, glowAnimatedStyle, { backgroundColor: skin.accentColor }]} />
        
        {/* Bird body */}
        <Animated.View style={[styles.body, bodyAnimatedStyle, { backgroundColor: skin.color }]}>
          {/* Wing */}
          <Animated.View style={[styles.wing, wingAnimatedStyle, { backgroundColor: skin.accentColor }]} />
          
          {/* Eye */}
          <View style={styles.eye}>
            <View style={styles.pupil} />
          </View>
          
          {/* Beak */}
          <View style={[styles.beak, { backgroundColor: '#FFA500' }]} />
          
          {/* Tail */}
          <View style={[styles.tail, { backgroundColor: skin.accentColor }]} />
        </Animated.View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 40,
    height: 40,
    zIndex: 10,
  },
  glow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -10,
    left: -10,
    opacity: 0.3,
  },
  body: {
    width: 32,
    height: 28,
    borderRadius: 16,
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
  wing: {
    position: 'absolute',
    width: 20,
    height: 16,
    borderRadius: 10,
    top: 6,
    left: 8,
    transformOrigin: '50% 50%',
  },
  eye: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    top: 6,
    right: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pupil: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#000000',
  },
  beak: {
    position: 'absolute',
    width: 8,
    height: 6,
    top: 11,
    right: -4,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  tail: {
    position: 'absolute',
    width: 12,
    height: 8,
    borderRadius: 6,
    top: 10,
    left: -8,
  },
  trailParticle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    zIndex: 5,
  },
});