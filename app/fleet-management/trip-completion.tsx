import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { useFleetOps } from './FleetOpsContext'

export default function TripCompletionScreen() {
  const router = useRouter()
  const { bookingDraft, currentDriver, currentVehicle, tripSummary } = useFleetOps()

  const summary = useMemo(() => {
    return (
      tripSummary ?? {
        totalDistance: bookingDraft.distance,
        totalDuration: '42 mins',
        driverRating: currentDriver.rating,
        customerFeedback: 'Trip completed successfully with smooth EV routing.',
        fareAmount: bookingDraft.estimatedFare,
        batteryConsumed: Math.max(8, Math.round(bookingDraft.distance * 0.4)),
        carbonSavings: `${Math.round(bookingDraft.distance * 1.8)} kg CO2 saved`,
      }
    )
  }, [bookingDraft.distance, bookingDraft.estimatedFare, currentDriver.rating, tripSummary])

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>Trip Completed</Text>
            <Text style={styles.headerTitle}>Ride summary</Text>
            <Text style={styles.headerSubtitle}>Review the trip outcome, battery usage, and carbon savings.</Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name={'clipboard-check' as any} size={24} color="#ffffff" />
          </View>
        </View>

        <FleetCard style={styles.successCard}>
          <View style={styles.successRow}>
            <View style={styles.successIcon}>
              <MaterialCommunityIcons name={'shield-check' as any} size={22} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.successTitle}>Trip completed successfully</Text>
              <Text style={styles.successSubtitle}>{currentVehicle.number} • {currentDriver.name}</Text>
            </View>
            <View style={styles.successBadge}>
              <Text style={styles.successBadgeText}>Approved</Text>
            </View>
          </View>
        </FleetCard>

        <SectionHeader title="Trip Summary" subtitle="Key outcomes from the completed booking." />
        <View style={styles.summaryGrid}>
          <View style={styles.metricCard}>
            <MaterialCommunityIcons name={'map-marker' as any} size={20} color="#10b981" />
            <Text style={styles.metricLabel}>Distance</Text>
            <Text style={styles.metricValue}>{summary.totalDistance} km</Text>
          </View>
          <View style={styles.metricCard}>
            <MaterialCommunityIcons name={'clock-outline' as any} size={20} color="#10b981" />
            <Text style={styles.metricLabel}>Duration</Text>
            <Text style={styles.metricValue}>{summary.totalDuration}</Text>
          </View>
          <View style={styles.metricCard}>
            <MaterialCommunityIcons name={'battery-charging' as any} size={20} color="#10b981" />
            <Text style={styles.metricLabel}>Battery Consumed</Text>
            <Text style={styles.metricValue}>{summary.batteryConsumed}%</Text>
          </View>
          <View style={styles.metricCard}>
            <MaterialCommunityIcons name={'chart-line' as any} size={20} color="#10b981" />
            <Text style={styles.metricLabel}>Carbon Savings</Text>
            <Text style={styles.metricValue}>{summary.carbonSavings}</Text>
          </View>
        </View>

        <FleetCard style={styles.feedbackCard}>
          <Text style={styles.sectionCardTitle}>Customer Feedback</Text>
          <Text style={styles.feedbackText}>{summary.customerFeedback}</Text>
          <View style={styles.ratingRow}>
            <MaterialCommunityIcons name={'shield-check' as any} size={16} color="#10b981" />
            <Text style={styles.ratingText}>Driver rating {summary.driverRating.toFixed(1)} / 5</Text>
          </View>
        </FleetCard>

        <FleetCard style={styles.fareCard}>
          <Text style={styles.sectionCardTitle}>Fare Summary</Text>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Base Fare</Text>
            <Text style={styles.fareValue}>₹{Math.round(summary.fareAmount * 0.78).toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Trip Charges</Text>
            <Text style={styles.fareValue}>₹{Math.round(summary.fareAmount * 0.22).toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>NXL Reward Cashback (5%)</Text>
            <Text style={[styles.fareValue, { color: '#059669', fontWeight: '900' }]}>+{Math.round(summary.fareAmount * 0.05)} NXL</Text>
          </View>
          <View style={styles.fareRowTotal}>
            <Text style={styles.totalLabel}>Total Trip Fare</Text>
            <Text style={styles.totalValue}>₹{summary.fareAmount.toLocaleString('en-IN')}</Text>
          </View>
        </FleetCard>

        <View style={styles.buttonRow}>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/fleet-management/invoice')}>
            <MaterialCommunityIcons name={'file-document' as any} size={16} color="#ffffff" />
            <Text style={styles.secondaryButtonText}>Generate Invoice</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={() => router.replace('/fleet-management/dashboard')}>
            <MaterialCommunityIcons name={'car-electric' as any} size={16} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Back To Dashboard</Text>
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
  successCard: { marginBottom: 16 },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  successIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  successTitle: { color: '#0f5132', fontSize: 15, fontWeight: '900' },
  successSubtitle: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  successBadge: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  successBadgeText: { color: '#059669', fontSize: 11, fontWeight: '900' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  metricCard: { width: '48.5%', backgroundColor: '#ffffff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#dbe7dd' },
  metricLabel: { color: '#6b7280', fontSize: 11, marginTop: 8 },
  metricValue: { color: '#0f5132', fontSize: 14, fontWeight: '900', marginTop: 4, lineHeight: 18 },
  feedbackCard: { marginBottom: 16 },
  sectionCardTitle: { color: '#0f5132', fontSize: 14, fontWeight: '900', marginBottom: 10 },
  feedbackText: { color: '#4f6952', fontSize: 13, lineHeight: 19 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  ratingText: { color: '#0f5132', fontSize: 12, fontWeight: '800' },
  fareCard: { marginBottom: 16 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  fareLabel: { color: '#6b7280', fontSize: 12, fontWeight: '700' },
  fareValue: { color: '#0f5132', fontSize: 12, fontWeight: '900' },
  fareRowTotal: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e2efe5' },
  totalLabel: { color: '#0f5132', fontSize: 13, fontWeight: '900' },
  totalValue: { color: '#10b981', fontSize: 14, fontWeight: '900' },
  buttonRow: { flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, backgroundColor: '#0f5132', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  primaryButton: { flex: 1, backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
})
