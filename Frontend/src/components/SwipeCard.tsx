import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { UserProfile } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SwipeCardProps {
  profile: UserProfile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {profile.photoUrl ? (
          <Image source={{ uri: profile.photoUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>
              {profile.name?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {profile.name || 'Anonymous'}, {profile.age}
        </Text>
        {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.rejectButton} onPress={onSwipeLeft}>
          <Text style={styles.buttonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={onSwipeRight}>
          <Text style={styles.buttonText}>♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 40,
    height: 500,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 350,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#e1e4e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
    color: '#586069',
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rejectButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#34c759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
});
