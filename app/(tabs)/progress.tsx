import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Dimensions
} from 'react-native';
import { Award, Trophy, Star, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  // Mock progress data
  const [playerStats] = useState({
    level: 12,
    experience: 750,
    experienceToNext: 1000,
    totalScore: 15420,
    highScore: 187,
    totalCoins: 2340,
    totalFlights: 156,
    totalDistance: 42500,
    perfectFlights: 23,
    coinStreaks: 89,
  });

  const achievements = [
    {
      id: 'first_flight',
      name: 'First Flight',
      description: 'Complete your first game',
      icon: '🐣',
      unlocked: true,
      progress: 1,
      target: 1,
    },
    {
      id: 'coin_collector',
      name: 'Coin Collector',
      description: 'Collect 100 coins',
      icon: '💰',
      unlocked: true,
      progress: 100,
      target: 100,
    },
    {
      id: 'sky_master',
      name: 'Sky Master',
      description: 'Reach score of 100',
      icon: '🌤️',
      unlocked: true,
      progress: 187,
      target: 100,
    },
    {
      id: 'distance_traveler',
      name: 'Distance Traveler',
      description: 'Fly 50,000 units',
      icon: '🗺️',
      unlocked: false,
      progress: 42500,
      target: 50000,
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Achieve 10 coin streaks',
      icon: '🔥',
      unlocked: true,
      progress: 89,
      target: 10,
    },
    {
      id: 'perfect_pilot',
      name: 'Perfect Pilot',
      description: 'Complete 50 perfect flights',
      icon: '✈️',
      unlocked: false,
      progress: 23,
      target: 50,
    },
  ];

  const milestones = [
    { level: 5, reward: 'Unlock new theme', completed: true },
    { level: 10, reward: 'Special bird skin', completed: true },
    { level: 15, reward: 'Power-up upgrade', completed: false },
    { level: 20, reward: 'Legendary bird', completed: false },
    { level: 25, reward: 'Master pilot badge', completed: false },
  ];

  const renderStatCard = (label: string, value: string | number, icon: React.ReactNode) => (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderAchievement = (achievement: any) => {
    const progressPercentage = Math.min((achievement.progress / achievement.target) * 100, 100);
    
    return (
      <View key={achievement.id} style={[styles.achievementCard, achievement.unlocked && styles.unlockedAchievement]}>
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementIcon}>{achievement.icon}</Text>
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementName, achievement.unlocked && styles.unlockedText]}>
              {achievement.name}
            </Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
          </View>
          {achievement.unlocked && <Award size={20} color="#FFD700" />}
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {achievement.progress}/{achievement.target}
          </Text>
        </View>
      </View>
    );
  };

  const renderMilestone = (milestone: any, index: number) => (
    <View key={index} style={[styles.milestoneCard, milestone.completed && styles.completedMilestone]}>
      <View style={styles.milestoneLevel}>
        <Text style={[styles.milestoneLevelText, milestone.completed && styles.completedText]}>
          {milestone.level}
        </Text>
      </View>
      <View style={styles.milestoneInfo}>
        <Text style={[styles.milestoneReward, milestone.completed && styles.completedText]}>
          {milestone.reward}
        </Text>
        <Text style={styles.milestoneStatus}>
          {milestone.completed ? 'Completed' : `${milestone.level - playerStats.level} levels to go`}
        </Text>
      </View>
      {milestone.completed && <Trophy size={20} color="#FFD700" />}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Level {playerStats.level}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Experience Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 Experience Progress</Text>
          <View style={styles.experienceCard}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceLevel}>Level {playerStats.level}</Text>
              <Text style={styles.experiencePoints}>
                {playerStats.experience}/{playerStats.experienceToNext} XP
              </Text>
            </View>
            <View style={styles.experienceBarContainer}>
              <View style={styles.experienceBar}>
                <View 
                  style={[
                    styles.experienceBarFill, 
                    { width: `${(playerStats.experience / playerStats.experienceToNext) * 100}%` }
                  ]} 
                />
              </View>
            </View>
            <Text style={styles.nextLevelText}>
              {playerStats.experienceToNext - playerStats.experience} XP to next level
            </Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Statistics</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('High Score', playerStats.highScore, <Target size={24} color="#4FC3F7" />)}
            {renderStatCard('Total Flights', playerStats.totalFlights, <Award size={24} color="#81C784" />)}
            {renderStatCard('Total Coins', playerStats.totalCoins, <Star size={24} color="#FFD54F" />)}
            {renderStatCard('Distance', `${(playerStats.totalDistance / 1000).toFixed(1)}km`, <Trophy size={24} color="#FF8A65" />)}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map(renderAchievement)}
          </View>
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Level Milestones</Text>
          <View style={styles.milestonesList}>
            {milestones.map(renderMilestone)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4FC3F7',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  levelContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  experienceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  experienceLevel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4FC3F7',
  },
  experiencePoints: {
    fontSize: 16,
    color: '#666666',
  },
  experienceBarContainer: {
    marginBottom: 10,
  },
  experienceBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  experienceBarFill: {
    height: '100%',
    backgroundColor: '#4FC3F7',
    borderRadius: 6,
  },
  nextLevelText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 55) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIcon: {
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  unlockedAchievement: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
  },
  unlockedText: {
    color: '#333333',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#888888',
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4FC3F7',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    minWidth: 50,
    textAlign: 'right',
  },
  milestonesList: {
    gap: 12,
  },
  milestoneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedMilestone: {
    backgroundColor: '#E8F5E8',
  },
  milestoneLevel: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4FC3F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  milestoneLevelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  completedText: {
    color: '#2E7D32',
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneReward: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  milestoneStatus: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
});