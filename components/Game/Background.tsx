import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Theme } from '@/types/game';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface BackgroundProps {
  theme: Theme;
  gameWidth: number;
  gameHeight: number;
}

export default function Background({ theme, gameWidth, gameHeight }: BackgroundProps) {
  const cloudOffset1 = useSharedValue(0);
  const cloudOffset2 = useSharedValue(-100);
  const cloudOffset3 = useSharedValue(-200);
  const starTwinkle = useSharedValue(0);

  useEffect(() => {
    // Cloud animations
    cloudOffset1.value = withRepeat(
      withTiming(-gameWidth - 100, { duration: 15000 }),
      -1,
      false
    );
    cloudOffset2.value = withRepeat(
      withTiming(-gameWidth - 100, { duration: 18000 }),
      -1,
      false
    );
    cloudOffset3.value = withRepeat(
      withTiming(-gameWidth - 100, { duration: 20000 }),
      -1,
      false
    );

    // Star twinkling for night theme
    if (theme.id === 'night') {
      starTwinkle.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [theme.id, gameWidth]);

  const cloud1AnimatedStyle = useAnimatedStyle(() => {
    const x = interpolate(
      cloudOffset1.value,
      [-gameWidth - 100, gameWidth + 100],
      [gameWidth + 100, -100]
    );
    return {
      transform: [{ translateX: x }],
    };
  });

  const cloud2AnimatedStyle = useAnimatedStyle(() => {
    const x = interpolate(
      cloudOffset2.value,
      [-gameWidth - 100, gameWidth + 100],
      [gameWidth + 100, -100]
    );
    return {
      transform: [{ translateX: x }],
    };
  });

  const cloud3AnimatedStyle = useAnimatedStyle(() => {
    const x = interpolate(
      cloudOffset3.value,
      [-gameWidth - 100, gameWidth + 100],
      [gameWidth + 100, -100]
    );
    return {
      transform: [{ translateX: x }],
    };
  });

  const starAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: starTwinkle.value,
    };
  });

  const renderStars = () => {
    if (theme.id !== 'night') return null;

    const stars = [];
    for (let i = 0; i < 20; i++) {
      stars.push(
        <Animated.View
          key={i}
          style={[
            styles.star,
            starAnimatedStyle,
            {
              left: Math.random() * gameWidth,
              top: Math.random() * gameHeight * 0.6,
            }
          ]}
        />
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Stars for night theme */}
      {renderStars()}
      
      {/* Gradient overlay */}
      <View style={[styles.gradientOverlay, { backgroundColor: theme.primaryColor, opacity: 0.1 }]} />
      
      {/* Moving clouds */}
      <Animated.View style={[styles.cloud, cloud1AnimatedStyle, { backgroundColor: theme.cloudColor }]}>
        <View style={[styles.cloudPuff, { backgroundColor: theme.cloudColor }]} />
        <View style={[styles.cloudPuff, styles.cloudPuff2, { backgroundColor: theme.cloudColor }]} />
        <View style={[styles.cloudPuff, styles.cloudPuff3, { backgroundColor: theme.cloudColor }]} />
      </Animated.View>
      
      <Animated.View style={[styles.cloud, styles.cloud2, cloud2AnimatedStyle, { backgroundColor: theme.cloudColor }]}>
        <View style={[styles.cloudPuff, { backgroundColor: theme.cloudColor }]} />
        <View style={[styles.cloudPuff, styles.cloudPuff2, { backgroundColor: theme.cloudColor }]} />
      </Animated.View>
      
      <Animated.View style={[styles.cloud, styles.cloud3, cloud3AnimatedStyle, { backgroundColor: theme.cloudColor }]}>
        <View style={[styles.cloudPuff, { backgroundColor: theme.cloudColor }]} />
        <View style={[styles.cloudPuff, styles.cloudPuff2, { backgroundColor: theme.cloudColor }]} />
        <View style={[styles.cloudPuff, styles.cloudPuff3, { backgroundColor: theme.cloudColor }]} />
        <View style={[styles.cloudPuff, styles.cloudPuff4, { backgroundColor: theme.cloudColor }]} />
      </Animated.View>
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
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  cloud: {
    position: 'absolute',
    width: 80,
    height: 30,
    borderRadius: 15,
    opacity: 0.7,
  },
  cloud2: {
    top: 80,
    width: 60,
    height: 25,
  },
  cloud3: {
    top: 150,
    width: 100,
    height: 35,
  },
  cloudPuff: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    top: -8,
    left: 15,
  },
  cloudPuff2: {
    width: 30,
    height: 30,
    borderRadius: 15,
    left: 35,
    top: -10,
  },
  cloudPuff3: {
    width: 20,
    height: 20,
    borderRadius: 10,
    left: 55,
    top: -5,
  },
  cloudPuff4: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    left: 70,
    top: -8,
  },
});