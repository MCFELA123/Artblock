import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { WelcomeScreen } from '../screens/WelcomScreen';
import { Home } from '../screens/Home';
import { styles } from '../components/styles/computed/styles';

export const AuthNavigator: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={[styles.parentLayout, styles.center]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return isAuthenticated ? <Home /> : <WelcomeScreen />;
};