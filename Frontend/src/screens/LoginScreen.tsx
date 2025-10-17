import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { authService } from '../services/api';

interface LoginScreenProps {
  onLogin: (userId: number) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login({
        email: email.trim(),
        authProvider: 'email',
      });
      await AsyncStorage.setItem('userId', user.id.toString());
      onLogin(user.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Configure Google Sign In
      GoogleSignin.configure({
        webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your actual web client ID
      });

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      const user = await authService.login({
        email: userInfo.data?.user.email || '',
        name: userInfo.data?.user.name,
        photoUrl: userInfo.data?.user.photo || undefined,
        authProvider: 'google',
      });

      await AsyncStorage.setItem('userId', user.id.toString());
      onLogin(user.id);
    } catch (error) {
      Alert.alert('Error', 'Google login failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Find your match</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.button, styles.emailButton]}
          onPress={handleEmailLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Continue with Email</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={handleGoogleLogin}
        disabled={loading}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#ff3b30',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 50,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  emailButton: {
    backgroundColor: '#ff3b30',
  },
  googleButton: {
    backgroundColor: '#4285f4',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
});
