import React from 'react';
import { View, Platform } from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import MatchesScreen from '../screens/MatchesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const insets = useSafeAreaInsets(); 

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: THEME.tabBar,
            borderTopColor: '#333',
            height: 60 + insets.bottom, 
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10, 
            paddingTop: 10, 
          },
          tabBarActiveTintColor: THEME.primary,
          tabBarInactiveTintColor: THEME.textSecondary,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = focused ? 'football' : 'football-outline';
            else if (route.name === 'Matches') iconName = focused ? 'calendar' : 'calendar-outline';
            else if (route.name === 'Favorites') iconName = focused ? 'star' : 'star-outline';
            else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Tab.Screen name="Matches" component={MatchesScreen} options={{ title: 'Matchs' }} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoris' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}