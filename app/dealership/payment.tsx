import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { formatINR } from '../../lib/mock/dealershipLifecycleData'

const methods = ['UPI', 'Credit Card', 'Wallet', 'Net Banking'] as const

export default function PaymentScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ amount?: string; emi?: string }>()
  const amount = Number(params.amount ?? 250000)
  const emi = Number(params.emi ?? 0)
  const [selectedMethod, setSelectedMethod] = useState<(typeof methods)[number]>('UPI')
  const [processing, setProcessing] = useState(false)
  const rewardPoints = Math.round(amount / 1000)

  const summary = useMemo(() => {
    const gst = Math.round(amount * 0.18)
    const base = amount - Math.round(amount * 0.05)
    const total = base + gst
    return { gst, base, total }
  }, [amount])

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      router.push('/dealership/delivery-tracking')
    }, 800)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Payment</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/dealership')}>
            <MaterialCommunityIcons name="wallet" size={18} color="#064E3B" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Billing Summary</Text>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Booking Amount</Text><Text style={styles.summaryValue}>{formatINR(amount)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>GST (18%)</Text><Text style={styles.summaryValue}>{formatINR(summary.gst)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Discounted Base</Text><Text style={styles.summaryValue}>{formatINR(summary.base)}</Text></View>
          <View style={styles.totalBox}><Text style={styles.totalLabel}>Total Payable</Text><Text style={styles.totalValue}>{formatINR(summary.total)}</Text></View>
          <View style={styles.badgeRow}>
            <MaterialCommunityIcons name="clipboard-check" size={16} color="#059669" />
            <Text style={styles.badgeText}>Secure payment badge</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.methodGrid}>
            {methods.map((method) => (
              <TouchableOpacity key={method} style={[styles.methodCard, selectedMethod === method && styles.methodCardActive]} onPress={() => setSelectedMethod(method)}>
                <MaterialCommunityIcons name={method === 'UPI' ? 'qrcode-scan' : method === 'Credit Card' ? 'credit-card' : method === 'Wallet' ? 'wallet' : 'cash'} size={18} color={selectedMethod === method ? '#FFFFFF' : '#059669'} />
                <Text style={[styles.methodText, selectedMethod === method && styles.methodTextActive]}>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rewards</Text>
          <View style={styles.rewardRow}><MaterialCommunityIcons name="chart-line" size={18} color="#059669" /><Text style={styles.rewardText}>{rewardPoints} reward points will be credited after successful payment.</Text></View>
          <View style={styles.rewardRow}><MaterialCommunityIcons name="cash" size={18} color="#059669" /><Text style={styles.rewardText}>EMI view: {emi ? formatINR(emi) : 'Monthly plan available after payment'}</Text></View>
        </View>

        <TouchableOpacity disabled={processing} style={[styles.button, processing && { opacity: 0.7 }]} onPress={handlePay}>
          <Text style={styles.buttonText}>{processing ? 'Processing...' : `Pay Now via ${selectedMethod}`}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: '#064E3B', fontSize: 24, fontWeight: '900' },
  iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  sectionTitle: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#047857', fontWeight: '800' },
  summaryValue: { color: '#064E3B', fontWeight: '900' },
  totalBox: { backgroundColor: '#ECFDF5', borderRadius: 16, padding: 14, marginTop: 8 },
  totalLabel: { color: '#047857', fontSize: 12, fontWeight: '900' },
  totalValue: { color: '#064E3B', fontSize: 22, fontWeight: '900', marginTop: 6 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  badgeText: { color: '#047857', fontWeight: '900' },
  methodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  methodCard: { width: '48%', backgroundColor: '#F8FFFB', borderWidth: 1, borderColor: '#D1FAE5', borderRadius: 16, padding: 12, alignItems: 'center', gap: 8 },
  methodCardActive: { backgroundColor: '#059669', borderColor: '#059669' },
  methodText: { color: '#064E3B', fontWeight: '900', fontSize: 12 },
  methodTextActive: { color: '#FFFFFF' },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  rewardText: { color: '#064E3B', flex: 1 },
  button: { backgroundColor: '#059669', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '900' },
})
