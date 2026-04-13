// src/screens/DepositScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as api from '../services/api';
import { Button, Input } from '../components';
import { colors, spacing, radius } from '../utils/theme';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function DepositScreen({ navigation, route }) {
  const { account } = route.params;
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide.');
      return;
    }
    Alert.alert(
      'Confirmer le dépôt',
      `Déposer ${Number(amount).toLocaleString('fr-MA')} MAD sur votre compte ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            setLoading(true);
            try {
              await api.deposit(account._id, { amount, description: description || 'Dépôt' });
              Alert.alert('Succès !', 'Dépôt effectué avec succès.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (err) {
              Alert.alert('Erreur', err.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dépôt</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Account Info */}
        <View style={styles.accountCard}>
          <View style={styles.accountIconBox}>
            <Ionicons
              name={account.type === 'epargne' ? 'wallet' : 'card'}
              size={22}
              color={account.type === 'epargne' ? colors.purple : colors.primary}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.accountType}>
              Compte {account.type === 'epargne' ? 'Épargne' : 'Courant'}
            </Text>
            <Text style={styles.accountNumber}>•••• {account.accountNumber?.slice(-4)}</Text>
          </View>
          <View>
            <Text style={styles.accountBalanceLabel}>Solde actuel</Text>
            <Text style={styles.accountBalance}>
              {account.balance?.toLocaleString('fr-MA')} MAD
            </Text>
          </View>
        </View>

        {/* Amount */}
        <Text style={styles.sectionLabel}>Montant du dépôt</Text>
        <View style={styles.amountBox}>
          <Text style={styles.currency}>MAD</Text>
          <Text
            style={styles.amountDisplay}
            onPress={() => {}}
          >
            {amount || '0'}
          </Text>
        </View>

        {/* Quick amounts */}
        <View style={styles.quickRow}>
          {QUICK_AMOUNTS.map((q) => (
            <TouchableOpacity
              key={q}
              style={[styles.quickBtn, amount === String(q) && styles.quickBtnActive]}
              onPress={() => setAmount(String(q))}
            >
              <Text style={[styles.quickBtnText, amount === String(q) && styles.quickBtnTextActive]}>
                {q.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          placeholder="Montant personnalisé"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Input
          label="Description (optionnelle)"
          placeholder="Ex : Salaire, Remboursement..."
          value={description}
          onChangeText={setDescription}
        />

        <Button title="Effectuer le dépôt" onPress={handleDeposit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  accountIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountType: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  accountNumber: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  accountBalanceLabel: { color: colors.textSecondary, fontSize: 11, textAlign: 'right' },
  accountBalance: { color: colors.success, fontSize: 15, fontWeight: '700', textAlign: 'right' },
  sectionLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '500', marginBottom: 10 },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currency: { color: colors.textSecondary, fontSize: 18, marginRight: 8 },
  amountDisplay: { color: colors.textPrimary, fontSize: 40, fontWeight: '800' },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  quickBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.bgCard,
  },
  quickBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  quickBtnText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  quickBtnTextActive: { color: '#fff' },
});