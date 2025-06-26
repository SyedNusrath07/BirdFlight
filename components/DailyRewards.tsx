import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gift, X } from 'lucide-react-native';
import { getDailyReward } from '@/utils/gameLogic';

interface DailyRewardsProps {
  onRewardClaimed?: (coins: number) => void;
}

export default function DailyRewards({ onRewardClaimed }: DailyRewardsProps) {
  const [showModal, setShowModal] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [consecutiveDays, setConsecutiveDays] = useState(0);

  useEffect(() => {
    checkDailyReward();
  }, []);

  const checkDailyReward = async () => {
    try {
      const lastClaim = await AsyncStorage.getItem('lastDailyReward');
      const savedConsecutiveDays = await AsyncStorage.getItem('consecutiveDays');
      
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      let days = savedConsecutiveDays ? parseInt(savedConsecutiveDays) : 0;
      
      if (lastClaim !== today) {
        if (lastClaim === yesterday) {
          // Consecutive day
          days += 1;
        } else if (lastClaim && lastClaim !== yesterday) {
          // Streak broken, reset
          days = 1;
        } else {
          // First time or long gap
          days = 1;
        }
        
        setCanClaim(true);
        setCurrentDay(days);
        setConsecutiveDays(days);
      }
    } catch (error) {
      console.error('Error checking daily reward:', error);
    }
  };

  const claimReward = async () => {
    try {
      const reward = getDailyReward(currentDay - 1);
      const today = new Date().toDateString();
      
      await AsyncStorage.setItem('lastDailyReward', today);
      await AsyncStorage.setItem('consecutiveDays', consecutiveDays.toString());
      
      onRewardClaimed?.(reward.coins);
      setCanClaim(false);
      setShowModal(false);
      
      Alert.alert(
        'Daily Reward Claimed!',
        `You received ${reward.coins} coins!${reward.powerUps ? ` Plus ${reward.powerUps.join(', ')} power-ups!` : ''}`,
        [{ text: 'Awesome!', style: 'default' }]
      );
    } catch (error) {
      console.error('Error claiming daily reward:', error);
    }
  };

  const renderRewardDay = (day: number) => {
    const reward = getDailyReward(day - 1);
    const isToday = day === currentDay;
    const isPast = day < currentDay;
    const isFuture = day > currentDay;
    
    return (
      <View key={day} style={[
        styles.rewardDay,
        isToday && styles.todayReward,
        isPast && styles.pastReward
      ]}>
        <Text style={[styles.dayNumber, isToday && styles.todayText]}>
          Day {day}
        </Text>
        <Text style={[styles.rewardAmount, isToday && styles.todayText]}>
          💰 {reward.coins}
        </Text>
        {reward.powerUps && (
          <Text style={[styles.powerUpText, isToday && styles.todayText]}>
            + Power-ups
          </Text>
        )}
        {isPast && <Text style={styles.claimedText}>✓</Text>}
      </View>
    );
  };

  if (!canClaim) return null;

  return (
    <>
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => setShowModal(true)}
      >
        <Gift size={24} color="#FFFFFF" />
        <View style={styles.notificationDot} />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <X size={24} color="#666666" />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Daily Rewards</Text>
            <Text style={styles.modalSubtitle}>
              Consecutive Days: {consecutiveDays}
            </Text>
            
            <View style={styles.rewardsGrid}>
              {[1, 2, 3, 4, 5, 6, 7].map(renderRewardDay)}
            </View>
            
            <TouchableOpacity 
              style={styles.claimButton}
              onPress={claimReward}
            >
              <Text style={styles.claimButtonText}>Claim Today's Reward!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4FC3F7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rewardDay: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
  },
  todayReward: {
    backgroundColor: '#4FC3F7',
  },
  pastReward: {
    backgroundColor: '#E8F5E8',
  },
  dayNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666666',
  },
  rewardAmount: {
    fontSize: 8,
    color: '#333333',
    textAlign: 'center',
  },
  powerUpText: {
    fontSize: 6,
    color: '#666666',
    textAlign: 'center',
  },
  todayText: {
    color: '#FFFFFF',
  },
  claimedText: {
    position: 'absolute',
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  claimButton: {
    backgroundColor: '#4FC3F7',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  claimButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});