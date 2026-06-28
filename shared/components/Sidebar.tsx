import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAppState } from '@/hooks/useAppState';
import { Colors, Accent } from '@/constants/theme';
import { Home, Utensils, Camera, TrendingUp, User, LogOut, Flame } from 'lucide-react-native';

export default function Sidebar() {
  const { theme, logout, user } = useAppState();
  const router = useRouter();
  const pathname = usePathname();
  const c = Colors[theme];

  // Helper to determine if a route is active
  const isActive = (route: string) => {
    if (route === 'index') {
      return pathname === '/' || pathname === '/(tabs)';
    }
    return pathname.includes(route);
  };

  const navItems = [
    { name: 'index', label: 'Home', icon: Home, route: '/(tabs)' },
    { name: 'food', label: 'Diary', icon: Utensils, route: '/(tabs)/food' },
    { name: 'scan', label: 'Scan', icon: Camera, route: '/(tabs)/scan' },
    { name: 'progress', label: 'Charts', icon: TrendingUp, route: '/(tabs)/progress' },
    { name: 'settings', label: 'Profile', icon: User, route: '/(tabs)/settings' },
  ];

  const handleNavigate = (route: string) => {
    router.replace(route as any);
  };

  return (
    <View style={[s.container, { backgroundColor: c.surface, borderRightColor: c.border }]}>
      <View style={s.topSection}>
        {/* Brand Header */}
        <View style={s.brandContainer}>
          <Flame color={Accent.primary} size={28} style={s.logoIcon} />
          <View>
            <Text style={s.brandTitle}>BULK</Text>
            <Text style={[s.brandSubtitle, { color: c.textMuted }]}>@daffs_26</Text>
          </View>
        </View>

        {/* Navigation Items */}
        <View style={s.navGroup}>
          {navItems.map((item) => {
            const active = isActive(item.name);
            const Icon = item.icon;

            return (
              <Pressable
                key={item.name}
                onPress={() => handleNavigate(item.route)}
                style={({ pressed }) => [
                  s.navButton,
                  active && { backgroundColor: Accent.primary + '12' },
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Icon color={active ? Accent.primary : c.textMuted} size={20} />
                <Text
                  style={[
                    s.navText,
                    { color: active ? Accent.primary : c.textMuted },
                    active && s.navTextActive
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* User Footer and Logout */}
      <View style={[s.footer, { borderTopColor: c.border }]}>
        <View style={s.userInfo}>
          <Text style={s.userName} numberOfLines={1}>
            {user?.displayName || 'User'}
          </Text>
          <Text style={[s.userEmail, { color: c.textMuted }]} numberOfLines={1}>
            {user?.email || 'offline@bulk.app'}
          </Text>
        </View>

        <Pressable
          onPress={logout}
          style={({ pressed }) => [
            s.logoutButton,
            pressed && { opacity: 0.8 }
          ]}
        >
          <LogOut color="#FF3B30" size={16} />
          <Text style={s.logoutText}>Keluar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: 250,
    height: '100%',
    paddingTop: 36,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    gap: 36,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  logoIcon: {
    marginTop: -2,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  brandSubtitle: {
    fontSize: 10,
    fontFamily: 'Poppins_400Regular',
    marginTop: -2,
  },
  navGroup: {
    gap: 6,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  navText: {
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
  },
  navTextActive: {
    fontFamily: 'Outfit_600SemiBold',
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 16,
    gap: 14,
  },
  userInfo: {
    paddingHorizontal: 8,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
  },
  userEmail: {
    fontSize: 11,
    fontFamily: 'Outfit_400Regular',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF3B3012',
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
  },
});
