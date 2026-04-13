// src/screens/HistoryScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as api from '../services/api';
import { colors, spacing, radius } from '../utils/theme';

const TYPE_CONFIG = {
  virement: { icon: 'arrow-forward-circle', color: '#3B82F6', label: 'Virement' },
  depot: { icon: 'arrow-down-circle', color: '#10B981', label: 'Dépôt' },
  retrait: { icon: 'arrow-up-circle', color: '#EF4444', label: 'Retrait' },
};

const STATUS_CONFIG = {
  completee: { label: 'Complétée', type: 'success' },
  en_attente: { label: 'En attente', type: 'warning' },
  echouee: { label: 'Échouée', type: 'danger' },
  annulee: { label: 'Annulée', type: 'danger' },
};

const TxItem = ({ tx, accountId }) => {
  const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.virement;
  const isSender = tx.sender?._id === accountId || tx.sender === accountId;
  const isDeposit = tx.type === 'depot';
  const isPositive = !isSender || isDeposit;
  const sign = isPositive ? '+' : '-';
  const amountColor = isPositive ? colors.success : colors.danger;

  const date = new Date(tx.createdAt);
  const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.txItem}>
      <View style={[styles.txIcon, { backgroundColor: cfg.color + '20' }]}>
        <Ionicons name={cfg.icon} size={22} color={cfg.color} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.txType}>{cfg.label}</Text>
        <Text style={styles.txRef} numberOfLines={1}>
          {tx.description || tx.reference}
        </Text>
        <Text style={styles.txDate}>{dateStr} à {timeStr}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.txAmount, { color: amountColor }]}>
          {sign}{tx.amount?.toLocaleString('fr-MA')} MAD
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_CONFIG[tx.status]?.type === 'success' ? '#10B98120' : '#F59E0B20' }]}>
          <Text style={[styles.statusText, { color: STATUS_CONFIG[tx.status]?.type === 'success' ? colors.success : colors.warning }]}>
            {STATUS_CONFIG[tx.status]?.label || tx.status}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function HistoryScreen({ navigation, route }) {
  const { account } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadHistory = useCallback(async (page = 1, append = false) => {
    try {
      const res = await api.getHistory(account._id, { page, limit: 10 });
      const { transactions: txs, pagination: pg } = res.data;
      setTransactions(append ? (prev) => [...prev, ...txs] : txs);
      setPagination(pg);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
    setLoadingMore(false);
  }, [account._id]);

  useEffect(() => { loadHistory(1); }, []);

  const loadMore = () => {
    if (pagination.page < pagination.pages && !loadingMore) {
      setLoadingMore(true);
      loadHistory(pagination.page + 1, true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Historique</Text>
          <Text style={styles.headerSub}>
            Compte •••• {account.accountNumber?.slice(-4)} — {pagination.total} opération(s)
          </Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 60 }} />
      ) : transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={56} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Aucune transaction</Text>
          <Text style={styles.emptyText}>Vos opérations apparaîtront ici</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <TxItem tx={item} accountId={account._id} />}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); loadHistory(1); }}
              tintColor={colors.primary}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} /> : null
          }
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.lg,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  headerSub: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  txIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txType: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  txRef: { color: colors.textSecondary, fontSize: 12, marginTop: 1 },
  txDate: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '700' },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginTop: 4,
  },
  statusText: { fontSize: 10, fontWeight: '600' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptyText: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
});