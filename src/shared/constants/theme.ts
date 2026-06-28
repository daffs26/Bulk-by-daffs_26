/**
 * BULK — Design Tokens (BodyFit-derived)
 * Black × Orange — Athletic Premium
 */

import '@/global.css';

import { Platform } from 'react-native';

/* ── Color System ── */
export const Colors = {
  dark: {
    bg:       '#0B0B0C',
    bg2:      '#111113',
    surface:  '#161618',
    surface2: '#1E1E21',
    surface3: '#252528',
    border:   '#2A2A2E',
    borderLt: '#333337',
    text:     '#FFFFFF',
    textSub:  '#A1A1AA',
    textMuted:'#52525B',
  },
  light: {
    bg:       '#F4F4F5',
    bg2:      '#E4E4E7',
    surface:  '#FFFFFF',
    surface2: '#F4F4F5',
    surface3: '#E4E4E7',
    border:   '#E4E4E7',
    borderLt: '#D4D4D8',
    text:     '#09090B',
    textSub:  '#71717A',
    textMuted:'#A1A1AA',
  },
} as const;

export const Accent = {
  primary:     '#FF6B00',
  primaryDark: '#E05C00',
  primaryLight:'#FF8C33',
  pale:        'rgba(255, 107, 0, 0.12)',
  glow:        'rgba(255, 107, 0, 0.25)',
} as const;

export const Semantic = {
  success:     '#22C55E',
  successPale: 'rgba(34, 197, 94, 0.12)',
  warning:     '#F59E0B',
  warningPale: 'rgba(245, 158, 11, 0.12)',
  danger:      '#EF4444',
  dangerPale:  'rgba(239, 68, 68, 0.12)',
  info:        '#3B82F6',
  infoPale:    'rgba(59, 130, 246, 0.12)',
} as const;

/* ── Typography ── */
export const Fonts = Platform.select({
  ios: {
    sans: 'Poppins',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Poppins',
    serif: 'serif',
    rounded: 'Poppins',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-family)',
    serif: 'Georgia, serif',
    rounded: 'var(--font-family)',
    mono: 'var(--font-mono)',
  },
});

export const FontWeight = {
  light:     '300' as const,
  medium:    '500' as const,
  semibold:  '600' as const,
  extrabold: '800' as const,
};

/* ── Spacing ── */
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/* ── Layout ── */
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 480;

/* ── Helper: get theme-aware colors ── */
export type ThemeMode = 'dark' | 'light';

export function getThemeColors(mode: ThemeMode) {
  const c = Colors[mode];
  return {
    ...c,
    accent: Accent.primary,
    accentDark: Accent.primaryDark,
    accentLight: Accent.primaryLight,
    accentPale: Accent.pale,
    accentGlow: Accent.glow,
    ...Semantic,
  };
}
