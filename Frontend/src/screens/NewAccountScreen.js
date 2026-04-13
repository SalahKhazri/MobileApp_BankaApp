// src/screens/NewAccountScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as api from '../services/api';
import { Button } from '../components';
import { colors, spacing, radius } from '../utils/theme';

const ACCOUNT_TYPES = [
  {
    type: 'courant',
    icon: 'card-outline',
    title: 'Compte Courant',
    description: 'Pour vos opérations quotidiennes, virements et dépôts.',
    color: colors.primary,
  },
  {
    type: 'epargne',
    icon: 'wallet-outline',
    title: 'Compte Épargne',
    description: 'Mettez de côté et faites fructifier votre argent.',
    color: colors.purple,
  },
];

export default function NewAccountScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState('courant');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.createAccount({ type: selectedType });
      Alert.alert('Compte créé !', `Votre compte ${selectedType} a été créé avec succès.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouveau compte</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>Choisissez le type de compte à ouvrir.</Text>

      {ACCOUNT_TYPES.map((item) => (
        <TouchableOpacity
          key={item.type}
          style={[styles.typeCard, selectedType === item.type && { borderColor: item.color, borderWidth: 2 }]}
          onPress={() => setSelectedType(item.type)}
          activeOpacity={0.8}
        >
          <View style={[styles.typeIconBox, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon} size={28} color={item.color} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.typeTitle}>{item.title}</Text>
            <Text style={styles.typeDesc}>{item.description}</Text>
          </View>
          <View style={[styles.radio, selectedType === item.type && { backgroundColor: item.color, borderColor: item.color }]}>
            {selectedType === item.type && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      ))}

      {/* Currency info */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
        <Text style={styles.infoText}>
          Tous les comptes sont en <Text style={{ color: colors.primary, fontWeight: '600' }}>MAD</Text> (Dirham marocain).
        </Text>
      </View>

      <Button title="Créer le compte" onPress={handleCreate} loading={loading} style={{ marginTop: spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginBottom: spacing.lg },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  typeIconBox: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  typeDesc: { color: colors.textSecondary, fontSize: 13, marginTop: 3, lineHeight: 18 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F610',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 8,
  },
  infoText: { color: colors.textSecondary, fontSize: 13, flex: 1, lineHeight: 18 },
});