import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SwipeCard } from '../components/SwipeCard';
import { swipeService } from '../services/api';
import { UserProfile, SwipeLimit } from '../types';

interface SwipeScreenProps {
  userId: number;
}

export const SwipeScreen: React.FC<SwipeScreenProps> = ({ userId }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeLimit, setSwipeLimit] = useState<SwipeLimit | null>(null);

  useEffect(() => {
    loadProfiles();
    loadSwipeLimit();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await swipeService.getProfiles(userId);
      setProfiles(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profiles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSwipeLimit = async () => {
    try {
      const limit = await swipeService.getSwipeLimit(userId);
      setSwipeLimit(limit);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwipe = async (isLike: boolean) => {
    if (currentIndex >= profiles.length) {
      return;
    }

    const currentProfile = profiles[currentIndex];

    try {
      const result = await swipeService.swipe(userId, currentProfile.id, isLike);
      setSwipeLimit(result);

      if (result.swipesRemaining === 0) {
        Alert.alert(
          'Daily Limit Reached',
          `You've used all ${result.swipesUsedToday} swipes for today. Come back tomorrow!`,
          [{ text: 'OK' }]
        );
      }

      setCurrentIndex(prev => prev + 1);
    } catch (error: any) {
      if (error.response?.data?.error === 'Daily swipe limit reached') {
        Alert.alert(
          'Daily Limit Reached',
          "You've reached your daily limit of 16 swipes. Come back tomorrow!",
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to process swipe');
      }
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ff3b30" />
      </View>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No more profiles to show</Text>
        <Text style={styles.emptySubtext}>Check back later for more!</Text>
      </View>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>♥</Text>
        {swipeLimit && (
          <Text style={styles.swipeCounter}>
            {swipeLimit.swipesRemaining} swipes left today
          </Text>
        )}
      </View>

      <View style={styles.cardContainer}>
        <SwipeCard
          profile={currentProfile}
          onSwipeLeft={() => handleSwipe(false)}
          onSwipeRight={() => handleSwipe(true)}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {currentIndex + 1} / {profiles.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    color: '#ff3b30',
  },
  swipeCounter: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
  },
});
