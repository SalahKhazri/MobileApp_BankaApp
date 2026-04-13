// src/screens/ProfileScreen.js
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, radius } from '../utils/theme';

const MenuItem = ({ icon, label, value, onPress, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, { backgroundColor: danger ? '#EF444420' : colors.bgMuted }]}>
      <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.textSecondary} />
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={[styles.menuLabel, danger && { color: colors.danger }]}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
    </View>
    {!danger && <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon profil</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role === 'admin' ? 'Administrateur' : 'Client'}</Text>
        </View>
      </View>

      {/* Info */}
      <Text style={styles.sectionLabel}>Informations personnelles</Text>
      <View style={styles.card}>
        <MenuItem icon="person-outline" label="Nom complet" value={user?.fullName} />
        <View style={styles.sep} />
        <MenuItem icon="mail-outline" label="Email" value={user?.email} />
        <View style={styles.sep} />
        <MenuItem icon="call-outline" label="Téléphone" value={user?.phone} />
      </View>

      {/* Security */}
      <Text style={styles.sectionLabel}>Sécurité</Text>
      <View style={styles.card}>
        <MenuItem icon="shield-checkmark-outline" label="Changer le mot de passe" onPress={() => {}} />
        <View style={styles.sep} />
        <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
      </View>

      {/* Sign out */}
      <View style={styles.card}>
        <MenuItem
          icon="log-out-outline"
          label="Se déconnecter"
          onPress={handleSignOut}
          danger
        />
      </View>

      <Text style={styles.version}>Banka v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  userName: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  userEmail: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  roleBadge: {
    marginTop: 8,
    backgroundColor: '#3B82F620',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  roleText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  sectionLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '500', marginBottom: 8 },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { color: colors.textPrimary, fontSize: 14, fontWeight: '500' },
  menuValue: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  sep: { height: 1, backgroundColor: colors.border, marginLeft: 62 },
  version: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: spacing.md },
});