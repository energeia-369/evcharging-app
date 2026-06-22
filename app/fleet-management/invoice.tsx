import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { useFleetOps } from './FleetOpsContext'

export default function InvoiceScreen() {
  const { bookingDraft, completeSettlement, currentDriver, currentVehicle, invoiceState, tripSummary } = useFleetOps()
  const [settlementDone, setSettlementDone] = useState(invoiceState.settlementComplete)

  const invoiceTotals = useMemo(() => {
    const fare = tripSummary?.fareAmount ?? bookingDraft.estimatedFare
    const gst = Math.round(fare * 0.12)
    const base = Math.max(fare - gst, 0)
    return {
      base,
      gst,
      total: fare + gst,
    }
  }, [bookingDraft.estimatedFare, tripSummary?.fareAmount])

  function handleCompleteSettlement() {
    completeSettlement()
    setSettlementDone(true)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>Invoice & Settlement</Text>
            <Text style={styles.headerTitle}>Fleet billing summary</Text>
            <Text style={styles.headerSubtitle}>Mock invoice, GST, and wallet settlement for the completed trip.</Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name={'file-document' as any} size={24} color="#ffffff" />
          </View>
        </View>

        <FleetCard style={styles.invoiceCard}>
          <View style={styles.invoiceHeader}>
            <View>
              <Text style={styles.invoiceLabel}>Invoice Number</Text>
              <Text style={styles.invoiceNumber}>{invoiceState.invoiceNumber}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{settlementDone ? 'Settled' : 'Pending'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name={'map-marker' as any} size={16} color="#10b981" />
            <Text style={styles.detailText}>{bookingDraft.pickupLocation} → {bookingDraft.dropLocation}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name={'account-tie' as any} size={16} color="#10b981" />
            <Text style={styles.detailText}>Driver: {currentDriver.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name={'car-electric' as any} size={16} color="#10b981" />
            <Text style={styles.detailText}>Vehicle: {currentVehicle.number}</Text>
          </View>
        </FleetCard>

        <SectionHeader title="Fare Breakdown" subtitle="Split fare, GST, and settlement summary." />
        <FleetCard style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Base fare</Text>
            <Text style={styles.breakdownValue}>₹{invoiceTotals.base.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>GST (12%)</Text>
            <Text style={styles.breakdownValue}>₹{invoiceTotals.gst.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Payment method</Text>
            <Text style={styles.breakdownValue}>Corporate wallet</Text>
          </View>
          <View style={styles.breakdownTotal}>
            <Text style={styles.breakdownTotalLabel}>Grand Total</Text>
            <Text style={styles.breakdownTotalValue}>₹{invoiceTotals.total.toLocaleString('en-IN')}</Text>
          </View>
        </FleetCard>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'wallet' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Wallet Balance</Text>
            <Text style={styles.statValue}>₹{invoiceState.walletBalance.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'cash' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Pending Settlements</Text>
            <Text style={styles.statValue}>{invoiceState.pendingSettlements}</Text>
          </View>
        </View>

        <FleetCard style={styles.settlementCard}>
          <Text style={styles.sectionCardTitle}>Settlement Summary</Text>
          <Text style={styles.settlementText}>The invoice is generated locally and the settlement button simulates wallet closure without any backend call.</Text>
          <View style={styles.settlementBadgeRow}>
            <View style={styles.settlementBadge}>
              <MaterialCommunityIcons name={'shield-check' as any} size={14} color="#10b981" />
              <Text style={styles.settlementBadgeText}>{settlementDone ? 'Settlement completed' : 'Settlement pending'}</Text>
            </View>
          </View>
        </FleetCard>

        <View style={styles.buttonRow}>
          <Pressable style={styles.secondaryButton} onPress={() => Alert.alert('Mock download', 'Invoice downloaded locally in this frontend-only demo.')}>
            <MaterialCommunityIcons name={'file-document' as any} size={16} color="#ffffff" />
            <Text style={styles.secondaryButtonText}>Download Invoice</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={handleCompleteSettlement}>
            <MaterialCommunityIcons name={'clipboard-check' as any} size={16} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Complete Settlement</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4fbf6' },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  kicker: { color: '#059669', fontSize: 11, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' },
  headerTitle: { color: '#0f5132', fontSize: 22, fontWeight: '900', marginTop: 4 },
  headerSubtitle: { color: '#6b7280', fontSize: 12, marginTop: 4, lineHeight: 18 },
  headerIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  invoiceCard: { marginBottom: 16 },
  invoiceHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center' },
  invoiceLabel: { color: '#6b7280', fontSize: 11, fontWeight: '800' },
  invoiceNumber: { color: '#0f5132', fontSize: 16, fontWeight: '900', marginTop: 4 },
  statusBadge: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  statusBadgeText: { color: '#059669', fontSize: 11, fontWeight: '900' },
  divider: { height: 1, backgroundColor: '#e2efe5', marginVertical: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  detailText: { color: '#4f6952', fontSize: 12, lineHeight: 17, fontWeight: '700' },
  breakdownCard: { marginBottom: 16 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  breakdownLabel: { color: '#6b7280', fontSize: 12, fontWeight: '700' },
  breakdownValue: { color: '#0f5132', fontSize: 12, fontWeight: '900' },
  breakdownTotal: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e2efe5' },
  breakdownTotalLabel: { color: '#0f5132', fontSize: 13, fontWeight: '900' },
  breakdownTotalValue: { color: '#10b981', fontSize: 14, fontWeight: '900' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#dbe7dd' },
  statLabel: { color: '#6b7280', fontSize: 11, marginTop: 8 },
  statValue: { color: '#0f5132', fontSize: 15, fontWeight: '900', marginTop: 4 },
  settlementCard: { marginBottom: 16 },
  sectionCardTitle: { color: '#0f5132', fontSize: 14, fontWeight: '900', marginBottom: 10 },
  settlementText: { color: '#4f6952', fontSize: 13, lineHeight: 19 },
  settlementBadgeRow: { marginTop: 12 },
  settlementBadge: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6 },
  settlementBadgeText: { color: '#059669', fontSize: 11, fontWeight: '900' },
  buttonRow: { flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, backgroundColor: '#0f5132', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  primaryButton: { flex: 1, backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
})
