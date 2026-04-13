// src/components/index.js
import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { colors, radius, spacing } from '../utils/theme';

// ─── Button ───────────────────────────────────────────────────────────────────
export const Button = ({ title, onPress, loading, variant = 'primary', style }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.8}
    style={[styles.btn, variant === 'outline' && styles.btnOutline, style]}
  >
    {loading
      ? <ActivityIndicator color={variant === 'outline' ? colors.primary : '#fff'} />
      : <Text style={[styles.btnText, variant === 'outline' && styles.btnTextOutline]}>
          {title}
        </Text>}
  </TouchableOpacity>
);

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = ({ label, error, ...props }) => (
  <View style={styles.inputWrap}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <TextInput
      placeholderTextColor={colors.textMuted}
      style={[styles.input, error && styles.inputError]}
      {...props}
    />
    {error && <Text style={styles.inputErrorText}>{error}</Text>}
  </View>
);

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ label, type = 'success' }) => {
  const bg = { success: '#10B98120', danger: '#EF444420', warning: '#F59E0B20', info: '#3B82F620' };
  const fg = { success: colors.success, danger: colors.danger, warning: colors.warning, info: colors.primary };
  return (
    <View style={[styles.badge, { backgroundColor: bg[type] }]}>
      <Text style={[styles.badgeText, { color: fg[type] }]}>{label}</Text>
    </View>
  );
};

// ─── Separator ────────────────────────────────────────────────────────────────
export const Sep = () => <View style={styles.sep} />;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  btnTextOutline: {
    color: colors.primary,
  },
  inputWrap: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: colors.textPrimary,
    fontSize: 15,
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputErrorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sep: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});