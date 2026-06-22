import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { PremiumCard, ProgressBar, SectionHeader, SkeletonCard } from '../../components/ev-service/Shared'
import { useEvServiceBooking } from '../../context/booking-context'
import { addMinutesToTime, buildBookingPricing, formatCurrency, getServiceCategory, getServiceCenter, getVehicle } from '../../lib/mock/evServiceData'

export default function BookingSummaryScreen() {
  const router = useRouter()
  const { draft } = useEvServiceBooking()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(timer)
  }, [draft.centerId, draft.serviceId])

  const center = useMemo(() => getServiceCenter(draft.centerId), [draft.centerId])
  const vehicle = useMemo(() => getVehicle(draft.vehicleId), [draft.vehicleId])
  const service = useMemo(() => getServiceCategory(draft.serviceId), [draft.serviceId])
  const pricing = buildBookingPricing(draft.serviceId, draft.pickupDrop)
  const completionTime = addMinutesToTime(draft.time, service.durationMins + (draft.pickupDrop ? 50 : 0))

  if (loading) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
        <SkeletonCard />
        <View style={{ height: 12 }} />
        <SkeletonCard />
      </ScrollView>
    )
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.summaryHero}>
        <Text style={styles.summaryKicker}>Step 4 of 8</Text>
        <Text style={styles.summaryTitle}>Booking summary</Text>
        <Text style={styles.summaryAmount}>{formatCurrency(pricing.total)}</Text>
        <Text style={styles.summarySubtitle}>Reward points: {pricing.rewardPoints} • Estimated completion: {completionTime}</Text>
      </View>

      <PremiumCard>
        <View style={styles.itemRow}>
          <MaterialCommunityIcons name="garage" size={20} color="#10b981" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.itemTitle}>{center.name}</Text>
            <Text style={styles.itemMeta}>{center.address}</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <MaterialCommunityIcons name="car-electric-outline" size={20} color="#10b981" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.itemTitle}>{vehicle.name}</Text>
            <Text style={styles.itemMeta}>{vehicle.model} • {vehicle.plate}</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <MaterialCommunityIcons name={service.icon as any} size={20} color="#10b981" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.itemTitle}>{service.name}</Text>
            <Text style={styles.itemMeta}>{service.durationMins} mins • {draft.pickupDrop ? 'Pickup & drop enabled' : 'Self drop-off'}</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <MaterialCommunityIcons name="calendar-clock" size={20} color="#10b981" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.itemTitle}>{draft.date}</Text>
            <Text style={styles.itemMeta}>{draft.time}</Text>
          </View>
        </View>
      </PremiumCard>

      <SectionHeader title="Price breakdown" subtitle="Taxes and rewards are calculated from local state only" />
      <PremiumCard>
        <BreakdownRow label="Service fee" value={formatCurrency(pricing.serviceFee)} />
        <BreakdownRow label="Pickup & drop" value={formatCurrency(pricing.pickupFee)} />
        <BreakdownRow label="Subtotal" value={formatCurrency(pricing.subtotal)} />
        <BreakdownRow label="Taxes (18%)" value={formatCurrency(pricing.tax)} />
        <View style={styles.divider} />
        <BreakdownRow label="Total amount" value={formatCurrency(pricing.total)} emphasize />
        <View style={styles.progressWrap}>
          <Text style={styles.progressLabel}>Reward points progress</Text>
          <ProgressBar value={Math.min(1, pricing.rewardPoints / 300)} />
        </View>
      </PremiumCard>

      <View style={styles.buttonRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Pressable style={styles.proceedButton} onPress={() => router.push('/ev-service/payment')}>
          <Text style={styles.proceedText}>Proceed To Payment</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#ffffff" />
        </Pressable>
      </View>
    </ScrollView>
  )
}

function BreakdownRow({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <View style={styles.breakdownRow}>
      <Text style={[styles.breakdownLabel, emphasize && styles.breakdownLabelEmphasis]}>{label}</Text>
      <Text style={[styles.breakdownValue, emphasize && styles.breakdownValueEmphasis]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4fbf6' },
  container: { padding: 16, paddingBottom: 36 },
  summaryHero: { backgroundColor: '#0f5132', borderRadius: 28, padding: 18, marginBottom: 14 },
  summaryKicker: { color: 'rgba(255,255,255,0.75)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '900' },
  summaryTitle: { color: '#ffffff', fontSize: 24, fontWeight: '900', marginTop: 8 },
  summaryAmount: { color: '#ffffff', fontSize: 32, fontWeight: '900', marginTop: 10 },
  summarySubtitle: { color: 'rgba(255,255,255,0.85)', marginTop: 8, lineHeight: 19 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  itemTitle: { color: '#0f5132', fontWeight: '900' },
  itemMeta: { color: '#6b7d72', marginTop: 4, fontSize: 12 },
  sectionHeader: { marginTop: 18, marginBottom: 12 },
  sectionTitle: { color: '#0f5132', fontSize: 18, fontWeight: '900' },
  sectionSubtitle: { color: '#6b7d72', marginTop: 4, fontSize: 12 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  breakdownLabel: { color: '#4f685b', fontWeight: '700' },
  breakdownLabelEmphasis: { color: '#0f5132', fontWeight: '900' },
  breakdownValue: { color: '#0f5132', fontWeight: '800' },
  breakdownValueEmphasis: { color: '#10b981', fontSize: 16, fontWeight: '900' },
  divider: { height: 1, backgroundColor: '#e8f2eb', marginVertical: 8 },
  progressWrap: { marginTop: 10 },
  progressLabel: { color: '#6b7d72', marginBottom: 8, fontWeight: '700' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  backButton: { flex: 1, backgroundColor: '#ffffff', borderRadius: 18, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#e2efe5' },
  backText: { color: '#0f5132', fontWeight: '900' },
  proceedButton: { flex: 2, backgroundColor: '#0f5132', borderRadius: 18, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  proceedText: { color: '#ffffff', fontWeight: '900' },
})
