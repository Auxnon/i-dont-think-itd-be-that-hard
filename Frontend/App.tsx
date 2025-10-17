import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginScreen } from './src/screens/LoginScreen';
import { SwipeScreen } from './src/screens/SwipeScreen';

function App() {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(parseInt(storedUserId, 10));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (id: number) => {
    setUserId(id);
  };

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {userId ? (
          <SwipeScreen userId={userId} />
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
