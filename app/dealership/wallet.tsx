import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CommissionRecord, PendingPayout, formatINR, walletSummary } from '../../lib/mock/walletData'

export default function DealerWallet() {
  const router = useRouter()
  const [summary] = useState(walletSummary)
  const [withdrawing, setWithdrawing] = useState(false)

  const totalPending = useMemo(() => summary.pendingPayouts.reduce((s, p) => s + p.amount, 0), [summary])

  function handleWithdraw() {
    setWithdrawing(true)
    setTimeout(() => setWithdrawing(false), 1200)
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Commission Wallet</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}><MaterialCommunityIcons name="close" size={18} color="#064E3B" /></TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}><Text style={styles.summaryLabel}>Available Earnings</Text><Text style={styles.summaryValue}>{formatINR(summary.availableEarnings)}</Text></View>
          <View style={styles.summaryCard}><Text style={styles.summaryLabel}>Wallet Balance</Text><Text style={styles.summaryValue}>{formatINR(summary.walletBalance)}</Text></View>
          <View style={styles.summaryCard}><Text style={styles.summaryLabel}>Pending Payouts</Text><Text style={styles.summaryValue}>{formatINR(totalPending)}</Text></View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={handleWithdraw} style={[styles.primaryBtn, withdrawing && { opacity: 0.7 }]} disabled={withdrawing}><Text style={styles.primaryBtnText}>{withdrawing ? 'Processing...' : 'Withdraw Funds'}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.ghostBtn}><Text style={styles.ghostBtnText}>Payout History</Text></TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Monthly Commissions</Text>
          {summary.monthlyCommissions.map((m: CommissionRecord) => (
            <View key={m.month} style={styles.row}><Text style={styles.rowLabel}>{m.month}</Text><Text style={styles.rowValue}>{formatINR(m.amount)}</Text></View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Pending Payouts</Text>
          {summary.pendingPayouts.map((p: PendingPayout) => (
            <View key={p.id} style={styles.row}><Text style={styles.rowLabel}>#{p.id} • due {p.dueDate}</Text><Text style={styles.rowValue}>{formatINR(p.amount)}</Text></View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
          <View style={styles.row}><Text style={styles.rowLabel}>YTD Earnings</Text><Text style={styles.rowValue}>{formatINR(summary.totalEarningsYTD)}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Tax Withheld</Text><Text style={styles.rowValue}>{formatINR(summary.taxWithheld || 0)}</Text></View>
          <View style={styles.trendPlaceholder}><Text style={styles.trendText}>[Earnings trend placeholder]</Text></View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tax Summary</Text>
          <View style={styles.row}><Text style={styles.rowLabel}>Estimated Tax</Text><Text style={styles.rowValue}>{formatINR(Math.round(summary.totalEarningsYTD * 0.18))}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Withheld</Text><Text style={styles.rowValue}>{formatINR(summary.taxWithheld)}</Text></View>
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 48 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: '#064E3B', fontSize: 20, fontWeight: '900' },
  closeButton: { padding: 8, borderRadius: 8, backgroundColor: '#ECFDF5' },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#ECFDF5' },
  summaryLabel: { color: '#047857', fontSize: 12, fontWeight: '900' },
  summaryValue: { color: '#064E3B', fontSize: 18, fontWeight: '900', marginTop: 8 },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  primaryBtn: { flex: 1, backgroundColor: '#059669', padding: 12, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '900' },
  ghostBtn: { flex: 1, borderWidth: 1, borderColor: '#ECFDF5', padding: 12, borderRadius: 12, alignItems: 'center' },
  ghostBtnText: { color: '#064E3B', fontWeight: '900' },
  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  sectionTitle: { color: '#047857', fontWeight: '900', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F1F7F3' },
  rowLabel: { color: '#064E3B' },
  rowValue: { color: '#047857', fontWeight: '900' },
  trendPlaceholder: { height: 80, borderRadius: 8, backgroundColor: '#F8FFFB', alignItems: 'center', justifyContent: 'center', marginTop: 10, borderWidth: 1, borderColor: '#ECFDF5' },
  trendText: { color: '#0F172A' },
})
