import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { birdSkins } from '@/utils/birdSkins';
import { BirdSkin, ShopItem } from '@/types/game';

interface ShopScreenProps {
  onSkinChange?: (skinId: string) => void;
}

export default function ShopScreen({ onSkinChange }: ShopScreenProps) {
  const [coins, setCoins] = useState(150);
  const [ownedSkins, setOwnedSkins] = useState(['default']);
  const [selectedSkin, setSelectedSkin] = useState('default');

  const powerUpItems: ShopItem[] = [
    {
      id: 'shield_pack',
      name: 'Shield Pack (5x)',
      type: 'power_up',
      price: 100,
      owned: false,
      description: 'Get 5 shield power-ups for protection'
    },
    {
      id: 'magnet_pack',
      name: 'Magnet Pack (3x)',
      type: 'power_up',
      price: 75,
      owned: false,
      description: 'Attract coins automatically for 8 seconds'
    },
    {
      id: 'double_coins_pack',
      name: 'Double Coins (3x)',
      type: 'power_up',
      price: 90,
      owned: false,
      description: 'Double your coin earnings for 10 seconds'
    }
  ];

  // Load saved data on mount
  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    try {
      const savedCoins = await AsyncStorage.getItem('coins');
      const savedOwnedSkins = await AsyncStorage.getItem('ownedSkins');
      const savedSelectedSkin = await AsyncStorage.getItem('selectedSkin');
      
      if (savedCoins) setCoins(parseInt(savedCoins));
      if (savedOwnedSkins) setOwnedSkins(JSON.parse(savedOwnedSkins));
      if (savedSelectedSkin) setSelectedSkin(savedSelectedSkin);
    } catch (error) {
      console.error('Error loading shop data:', error);
    }
  };

  const saveShopData = async (newCoins: number, newOwnedSkins: string[], newSelectedSkin: string) => {
    try {
      await AsyncStorage.setItem('coins', newCoins.toString());
      await AsyncStorage.setItem('ownedSkins', JSON.stringify(newOwnedSkins));
      await AsyncStorage.setItem('selectedSkin', newSelectedSkin);
    } catch (error) {
      console.error('Error saving shop data:', error);
    }
  };

  const handleBuySkin = async (skin: BirdSkin) => {
    if (coins >= skin.price && !ownedSkins.includes(skin.id)) {
      const newCoins = coins - skin.price;
      const newOwnedSkins = [...ownedSkins, skin.id];
      const newSelectedSkin = skin.id;
      
      setCoins(newCoins);
      setOwnedSkins(newOwnedSkins);
      setSelectedSkin(newSelectedSkin);
      
      // Save instantly
      await saveShopData(newCoins, newOwnedSkins, newSelectedSkin);
      onSkinChange?.(newSelectedSkin);
      
      Alert.alert('Success!', `You unlocked the ${skin.name} bird!`);
    } else if (ownedSkins.includes(skin.id)) {
      setSelectedSkin(skin.id);
      await saveShopData(coins, ownedSkins, skin.id);
      onSkinChange?.(skin.id);
      Alert.alert('Selected!', `${skin.name} bird is now active!`);
    } else {
      Alert.alert('Not enough coins!', `You need ${skin.price - coins} more coins.`);
    }
  };

  const handleBuyPowerUp = (item: ShopItem) => {
    if (coins >= item.price) {
      setCoins(prev => prev - item.price);
      Alert.alert('Success!', `You bought ${item.name}!`);
    } else {
      Alert.alert('Not enough coins!', `You need ${item.price - coins} more coins.`);
    }
  };

  const renderSkinCard = (skin: BirdSkin) => {
    const isOwned = ownedSkins.includes(skin.id);
    const isSelected = selectedSkin === skin.id;
    const canAfford = coins >= skin.price;

    return (
      <TouchableOpacity
        key={skin.id}
        style={[
          styles.skinCard,
          isSelected && styles.selectedSkinCard,
          !canAfford && !isOwned && styles.unaffordableSkinCard
        ]}
        onPress={() => handleBuySkin(skin)}
        disabled={!canAfford && !isOwned}
      >
        <View style={[styles.skinPreview, { backgroundColor: skin.color }]}>
          <View style={[styles.skinAccent, { backgroundColor: skin.accentColor }]} />
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.skinName}>{skin.name}</Text>
        <Text style={styles.skinDescription}>{skin.description}</Text>
        
        {isOwned ? (
          <View style={[styles.skinButton, isSelected ? styles.selectedButton : styles.ownedButton]}>
            <Text style={styles.buttonText}>{isSelected ? 'Selected' : 'Select'}</Text>
          </View>
        ) : (
          <View style={[styles.skinButton, styles.buyButton]}>
            <Text style={styles.buttonText}>💰 {skin.price}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPowerUpCard = (item: ShopItem) => {
    const canAfford = coins >= item.price;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.powerUpCard, !canAfford && styles.unaffordableCard]}
        onPress={() => handleBuyPowerUp(item)}
        disabled={!canAfford}
      >
        <View style={styles.powerUpIcon}>
          <Text style={styles.powerUpEmoji}>
            {item.id.includes('shield') ? '🛡️' : 
             item.id.includes('magnet') ? '🧲' : '💰'}
          </Text>
        </View>
        <View style={styles.powerUpInfo}>
          <Text style={styles.powerUpName}>{item.name}</Text>
          <Text style={styles.powerUpDescription}>{item.description}</Text>
        </View>
        <View style={[styles.powerUpButton, styles.buyButton]}>
          <Text style={styles.buttonText}>💰 {item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bird Shop</Text>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinsText}>💰 {coins} Coins</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bird Skins Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🐦 Bird Skins</Text>
          <Text style={styles.sectionSubtitle}>Customize your bird's appearance</Text>
          
          <View style={styles.skinsGrid}>
            {birdSkins.map(renderSkinCard)}
          </View>
        </View>

        {/* Power-ups Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Power-up Packs</Text>
          <Text style={styles.sectionSubtitle}>Boost your flying abilities</Text>
          
          <View style={styles.powerUpsList}>
            {powerUpItems.map(renderPowerUpCard)}
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
  coinsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  coinsText: {
    fontSize: 18,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  skinsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'space-between',
  },
  skinCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
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
  selectedSkinCard: {
    borderWidth: 3,
    borderColor: '#4FC3F7',
  },
  unaffordableSkinCard: {
    opacity: 0.6,
  },
  skinPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  skinAccent: {
    width: 30,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
  },
  checkmark: {
    position: 'absolute',
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  skinName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  skinDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 10,
  },
  skinButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#4FC3F7',
  },
  ownedButton: {
    backgroundColor: '#81C784',
  },
  buyButton: {
    backgroundColor: '#FFD54F',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  powerUpsList: {
    gap: 15,
  },
  powerUpCard: {
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
  unaffordableCard: {
    opacity: 0.6,
  },
  powerUpIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  powerUpEmoji: {
    fontSize: 24,
  },
  powerUpInfo: {
    flex: 1,
    marginRight: 15,
  },
  powerUpName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  powerUpDescription: {
    fontSize: 14,
    color: '#666666',
  },
  powerUpButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
});