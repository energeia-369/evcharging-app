import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { commissionData, formatINR } from '../../lib/mock/dealershipLifecycleData'

export default function CommissionScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Commission Wallet</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/dealership')}>
            <MaterialCommunityIcons name="wallet" size={18} color="#064E3B" />
          </TouchableOpacity>
        </View>

        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>Available Earnings</Text>
          <Text style={styles.walletValue}>{formatINR(commissionData.availableEarnings)}</Text>
          <Text style={styles.walletMeta}>Monthly commission and payout tracking.</Text>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.smallCard}><Text style={styles.smallLabel}>Monthly Commission</Text><Text style={styles.smallValue}>{formatINR(commissionData.monthlyCommission)}</Text></View>
          <View style={styles.smallCard}><Text style={styles.smallLabel}>Pending Payouts</Text><Text style={styles.smallValue}>{formatINR(commissionData.pendingPayouts)}</Text></View>
        </View>
        <View style={styles.cardRow}>
          <View style={styles.smallCard}><Text style={styles.smallLabel}>Wallet Balance</Text><Text style={styles.smallValue}>{formatINR(commissionData.walletBalance)}</Text></View>
          <View style={styles.smallCard}><Text style={styles.smallLabel}>Tax Withheld</Text><Text style={styles.smallValue}>{formatINR(commissionData.taxWithheld)}</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
          <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Vehicle Sales</Text><Text style={styles.breakdownValue}>60%</Text></View>
          <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Service Sales</Text><Text style={styles.breakdownValue}>25%</Text></View>
          <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Accessory Sales</Text><Text style={styles.breakdownValue}>15%</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tax Summary</Text>
          <Text style={styles.taxText}>Estimated tax and settlement amounts are shown for planning purposes only.</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/dealership')}>
          <Text style={styles.buttonText}>Withdraw Funds</Text>
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
  walletCard: { backgroundColor: '#064E3B', borderRadius: 24, padding: 18, marginBottom: 12 },
  walletLabel: { color: '#D1FAE5', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  walletValue: { color: '#FFFFFF', fontSize: 30, fontWeight: '900', marginTop: 6 },
  walletMeta: { color: '#D1FAE5', marginTop: 6 },
  cardRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  smallCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
  smallLabel: { color: '#047857', fontWeight: '900', fontSize: 12 },
  smallValue: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginTop: 6 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  sectionTitle: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  breakdownLabel: { color: '#047857', fontWeight: '800' },
  breakdownValue: { color: '#064E3B', fontWeight: '900' },
  taxText: { color: '#14532D', lineHeight: 20 },
  button: { backgroundColor: '#059669', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '900' },
})
