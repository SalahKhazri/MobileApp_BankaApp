// src/screens/TransferScreen.js
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

export default function TransferScreen({ navigation, route }) {
  const { account } = route.params;
  const [form, setForm] = useState({ receiverAccountNumber: '', amount: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (v) => setForm({ ...form, [key]: v });

  const validate = () => {
    const e = {};
    if (!form.receiverAccountNumber) e.receiver = 'Numéro de compte obligatoire';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Montant invalide';
    if (Number(form.amount) > account.balance) e.amount = 'Solde insuffisant';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleTransfer = () => {
    if (!validate()) return;
    Alert.alert(
      'Confirmer le virement',
      `Virer ${Number(form.amount).toLocaleString('fr-MA')} MAD vers le compte ${form.receiverAccountNumber} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            setLoading(true);
            try {
              await api.transfer(account._id, form);
              Alert.alert('Succès !', 'Virement effectué avec succès.', [
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
          <Text style={styles.headerTitle}>Virement</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Source Account */}
        <Text style={styles.sectionLabel}>Compte source</Text>
        <View style={styles.accountCard}>
          <View style={[styles.accountIconBox, { backgroundColor: '#3B82F620' }]}>
            <Ionicons name="card" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.accountType}>
              Compte {account.type === 'epargne' ? 'Épargne' : 'Courant'}
            </Text>
            <Text style={styles.accountNumber}>•••• {account.accountNumber?.slice(-4)}</Text>
          </View>
          <Text style={styles.accountBalance}>
            {account.balance?.toLocaleString('fr-MA')} MAD
          </Text>
        </View>

        {/* Arrow */}
        <View style={styles.arrowBox}>
          <View style={styles.arrowLine} />
          <View style={styles.arrowCircle}>
            <Ionicons name="arrow-down" size={18} color={colors.primary} />
          </View>
          <View style={styles.arrowLine} />
        </View>

        {/* Receiver */}
        <Text style={styles.sectionLabel}>Compte destinataire</Text>
        <Input
          placeholder="Numéro de compte (ex: MA17082938471234)"
          value={form.receiverAccountNumber}
          onChangeText={set('receiverAccountNumber')}
          autoCapitalize="characters"
          error={errors.receiver}
        />

        {/* Amount */}
        <Text style={styles.sectionLabel}>Montant</Text>
        <View style={styles.quickRow}>
          {QUICK_AMOUNTS.map((q) => (
            <TouchableOpacity
              key={q}
              style={[styles.quickBtn, form.amount === String(q) && styles.quickBtnActive]}
              onPress={() => setForm({ ...form, amount: String(q) })}
            >
              <Text style={[styles.quickBtnText, form.amount === String(q) && styles.quickBtnTextActive]}>
                {q.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Input
          placeholder="Montant en MAD"
          keyboardType="numeric"
          value={form.amount}
          onChangeText={set('amount')}
          error={errors.amount}
        />

        <Input
          label="Motif (optionnel)"
          placeholder="Ex : Loyer, Remboursement..."
          value={form.description}
          onChangeText={set('description')}
        />

        <Button title="Effectuer le virement" onPress={handleTransfer} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  sectionLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '500', marginBottom: 8 },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  accountIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountType: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  accountNumber: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  accountBalance: { color: colors.success, fontSize: 14, fontWeight: '700' },
  arrowBox: { flexDirection: 'row', alignItems: 'center', marginVertical: 8, marginBottom: spacing.md },
  arrowLine: { flex: 1, height: 1, backgroundColor: colors.border },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
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