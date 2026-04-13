// src/screens/HomeScreen.js
import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { colors, spacing, radius } from '../utils/theme';

const ACTION_ITEMS = [
  { icon: 'arrow-down-circle', label: 'Dépôt', color: '#10B981', screen: 'Deposit' },
  { icon: 'arrow-forward-circle', label: 'Virement', color: '#3B82F6', screen: 'Transfer' },
  { icon: 'time', label: 'Historique', color: '#8B5CF6', screen: 'History' },
  { icon: 'add-circle', label: 'Nouveau\ncompte', color: '#F59E0B', screen: 'NewAccount' },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const loadAccounts = async () => {
    try {
      const res = await api.getAccounts();
      setAccounts(res.data || []);
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { loadAccounts(); }, []));

  const selectedAccount = accounts[selectedIndex];

  const onAction = (item) => {
    if (!selectedAccount) {
      Alert.alert('Aucun compte', 'Créez d\'abord un compte bancaire.');
      if (item.screen === 'NewAccount') navigation.navigate('NewAccount');
      return;
    }
    navigation.navigate(item.screen, { account: selectedAccount });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadAccounts(); }} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>{user?.fullName?.split(' ')[0]} 👋</Text>
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={32} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      {accounts.length > 0 ? (
        <View style={styles.cardSection}>
          <LinearGradient
            colors={['#1D4ED8', '#3B82F6', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            {/* Decorative circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            <View style={styles.cardTop}>
              <View>
                <Text style={styles.cardLabel}>
                  {selectedAccount?.type === 'epargne' ? 'Compte Épargne' : 'Compte Courant'}
                </Text>
                <Text style={styles.cardNumber}>
                  •••• {selectedAccount?.accountNumber?.slice(-4)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
                <Ionicons
                  name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="rgba(255,255,255,0.8)"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.cardMiddle}>
              <Text style={styles.balanceLabel}>Solde disponible</Text>
              <Text style={styles.balanceAmount}>
                {balanceVisible
                  ? `${selectedAccount?.balance?.toLocaleString('fr-MA')} MAD`
                  : '•••••• MAD'}
              </Text>
            </View>

            <View style={styles.cardBottom}>
              <Text style={styles.cardOwner}>{user?.fullName}</Text>
              <View style={styles.currencyBadge}>
                <Text style={styles.currencyText}>{selectedAccount?.currency}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Account Selector Dots */}
          {accounts.length > 1 && (
            <View style={styles.dots}>
              {accounts.map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setSelectedIndex(i)}>
                  <View style={[styles.dot, i === selectedIndex && styles.dotActive]} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Account tabs */}
          {accounts.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountTabs}>
              {accounts.map((acc, i) => (
                <TouchableOpacity
                  key={acc._id}
                  onPress={() => setSelectedIndex(i)}
                  style={[styles.accountTab, i === selectedIndex && styles.accountTabActive]}
                >
                  <Text style={[styles.accountTabText, i === selectedIndex && styles.accountTabTextActive]}>
                    {acc.type === 'epargne' ? 'Épargne' : 'Courant'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      ) : (
        /* Empty state */
        <TouchableOpacity
          style={styles.emptyCard}
          onPress={() => navigation.navigate('NewAccount')}
        >
          <Ionicons name="add-circle-outline" size={48} color={colors.primary} />
          <Text style={styles.emptyTitle}>Aucun compte</Text>
          <Text style={styles.emptyText}>Créez votre premier compte bancaire</Text>
        </TouchableOpacity>
      )}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Actions rapides</Text>
      <View style={styles.actionsGrid}>
        {ACTION_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.actionItem}
            onPress={() => onAction(item)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={26} color={item.color} />
            </View>
            <Text style={styles.actionLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* All Accounts */}
      {accounts.length > 0 && (
        <>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Mes comptes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('NewAccount')}>
              <Text style={styles.sectionLink}>+ Nouveau</Text>
            </TouchableOpacity>
          </View>
          {accounts.map((acc) => (
            <TouchableOpacity
              key={acc._id}
              style={styles.accountRow}
              onPress={() => navigation.navigate('History', { account: acc })}
              activeOpacity={0.7}
            >
              <View style={[styles.accountIconBox, { backgroundColor: acc.type === 'epargne' ? '#8B5CF620' : '#3B82F620' }]}>
                <Ionicons
                  name={acc.type === 'epargne' ? 'wallet' : 'card'}
                  size={22}
                  color={acc.type === 'epargne' ? colors.purple : colors.primary}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.accountRowType}>
                  Compte {acc.type === 'epargne' ? 'Épargne' : 'Courant'}
                </Text>
                <Text style={styles.accountRowNumber}>•••• {acc.accountNumber?.slice(-4)}</Text>
              </View>
              <Text style={styles.accountRowBalance}>
                {acc.balance?.toLocaleString('fr-MA')} MAD
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: spacing.lg,
  },
  greeting: { color: colors.textSecondary, fontSize: 14 },
  userName: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  notifBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSection: { marginBottom: spacing.lg },
  balanceCard: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    minHeight: 180,
    overflow: 'hidden',
    position: 'relative',
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60,
    right: -40,
  },
  circle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -50,
    left: 20,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  cardLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' },
  cardNumber: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 },
  cardMiddle: { marginBottom: spacing.lg },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 },
  balanceAmount: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: 0.5 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardOwner: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '500' },
  currencyBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  currencyText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  accountTabs: { marginTop: 10 },
  accountTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  accountTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  accountTabText: { color: colors.textSecondary, fontSize: 13 },
  accountTabTextActive: { color: '#fff', fontWeight: '600' },
  emptyCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: spacing.lg,
  },
  emptyTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginTop: 12 },
  emptyText: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '700', marginBottom: 12 },
  sectionLink: { color: colors.primary, fontSize: 14 },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  actionItem: { alignItems: 'center', width: '22%' },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: { color: colors.textSecondary, fontSize: 11, textAlign: 'center' },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountIconBox: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountRowType: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  accountRowNumber: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  accountRowBalance: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
});