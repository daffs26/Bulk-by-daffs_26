import React from 'react';
import { Tabs } from 'expo-router';
import { useAppState } from '@/hooks/useAppState';
import { Home, Utensils, Camera, TrendingUp, User } from 'lucide-react-native';

export default function TabLayout() {
  const { theme } = useAppState();

  const isDark = theme === 'dark';
  const activeColor = isDark ? '#F97316' : '#2563EB'; // Orange vs Blue
  const inactiveColor = isDark ? '#6B7280' : '#9CA3AF';
  const tabBgColor = isDark ? '#141416' : '#FFFFFF';
  const borderColor = isDark ? '#1E1F24' : '#E5E7EB';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBgColor,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          title: 'Diary',
          tabBarIcon: ({ color, size }) => <Utensils color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => <Camera color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Charts',
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
