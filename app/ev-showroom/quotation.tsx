import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ActionButton } from '../../components/showroom-ui'
import { useShowroom } from '../../context/showroom-context'
import { getVehicleById, quoteBreakdown, showroomVehicles } from '../../lib/mock/showroomData'

export default function QuotationScreen() {
  const router = useRouter()
  const { selectedVehicleId } = useShowroom()
  const [loading, setLoading] = useState(true)

  const vehicle = useMemo(() => getVehicleById(selectedVehicleId) || showroomVehicles[0], [selectedVehicleId])
  const total = quoteBreakdown.reduce((sum, item) => sum + item.amount, 0)
  const emi = vehicle.emi

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#064E3B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicle quotation</Text>
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteTitle}>On-road price</Text>
          <Text style={styles.quoteAmount}>₹{(total / 100000).toFixed(1)}L</Text>
          <Text style={styles.quoteMeta}>Smart pricing for {vehicle.name}</Text>
        </View>

        {quoteBreakdown.map((item) => (
          <View key={item.label} style={styles.rowItem}>
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={[styles.rowValue, item.amount < 0 ? styles.discountText : null]}>{item.amount < 0 ? `-₹${Math.abs(item.amount).toLocaleString()}` : `₹${item.amount.toLocaleString()}`}</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total on-road price</Text>
          <Text style={styles.totalValue}>₹{(total / 100000).toFixed(1)}L</Text>
        </View>

        <View style={styles.financingCard}>
          <View style={styles.financeHeader}>
            <Text style={styles.financeTitle}>Financing options</Text>
            <MaterialCommunityIcons name="wallet" size={20} color="#10B981" />
          </View>
          <View style={styles.financeRow}>
            <Text style={styles.financeLabel}>Standard EMI</Text>
            <Text style={styles.financeAmount}>₹{emi.toLocaleString()}</Text>
          </View>
          <Text style={styles.financeDetail}>Estimated monthly payment for 3 years with premium lender offers.</Text>
        </View>

        <View style={styles.calculatorCard}>
          <Text style={styles.calculatorTitle}>Smart financing calculator</Text>
          <Text style={styles.calculatorText}>Adjust your booking amount and projected monthly payment directly from the booking screen.</Text>
        </View>

        <View style={styles.actionRow}>
          <ActionButton label="Download quote" icon="download" onPress={() => alert('Quote download simulated')} />
          <ActionButton variant="secondary" label="Proceed To Booking" icon="clipboard-check" onPress={() => router.push('/ev-showroom/booking')} />
        </View>

        {loading ? <Text style={styles.loading}>Generating the quotation summary...</Text> : null}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 36 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#064E3B' },
  quoteCard: { backgroundColor: '#DCFCE7', borderRadius: 28, padding: 22, marginBottom: 18, shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 18, elevation: 2 },
  quoteTitle: { color: '#065F46', fontSize: 13, fontWeight: '900', textTransform: 'uppercase', marginBottom: 10 },
  quoteAmount: { color: '#064E3B', fontSize: 28, fontWeight: '900' },
  quoteMeta: { color: '#14532D', marginTop: 8, fontSize: 13 },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, marginBottom: 10, shadowColor: '#064E3B', shadowOpacity: 0.04, shadowRadius: 12, elevation: 1 },
  rowLabel: { color: '#064E3B', fontSize: 14, fontWeight: '700' },
  rowValue: { color: '#0F766E', fontSize: 14, fontWeight: '900' },
  discountText: { color: '#15803D' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 22, backgroundColor: '#ECFDF5', marginTop: 10, marginBottom: 18 },
  totalLabel: { color: '#064E3B', fontSize: 15, fontWeight: '900' },
  totalValue: { color: '#065F46', fontSize: 18, fontWeight: '900' },
  financingCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, marginBottom: 18, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 14, elevation: 1 },
  financeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
  financeTitle: { fontSize: 16, fontWeight: '900', color: '#064E3B' },
  financeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  financeLabel: { color: '#0F766E', fontWeight: '700' },
  financeAmount: { color: '#064E3B', fontWeight: '900' },
  financeDetail: { color: '#14532D', fontSize: 12, lineHeight: 18 },
  calculatorCard: { backgroundColor: '#ECFDF5', borderRadius: 24, padding: 18, marginBottom: 20 },
  calculatorTitle: { color: '#065F46', fontSize: 16, fontWeight: '900', marginBottom: 8 },
  calculatorText: { color: '#14532D', fontSize: 13, lineHeight: 20 },
  actionRow: { gap: 12, marginBottom: 20 },
  loading: { color: '#064E3B', fontSize: 13, textAlign: 'center' },
})
