import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native'
import { PremiumCard, ProgressBar, SectionHeader, SkeletonCard } from '../../components/ev-service/Shared'
import { useEvServiceBooking } from '../../context/booking-context'
import { addMinutesToTime, buildBookingPricing, getServiceCategory, getServiceCenter, getVehicle, serviceCategories, vehicles } from '../../lib/mock/evServiceData'

function buildDates() {
  const today = new Date()
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index + 1)
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
    }
  })
}

const timeSlots = ['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM']

export default function BookServiceScreen() {
  const router = useRouter()
  const { width } = useWindowDimensions()
  const { draft, setDraft } = useEvServiceBooking()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [draft.centerId])

  const center = useMemo(() => getServiceCenter(draft.centerId), [draft.centerId])
  const selectedService = useMemo(() => getServiceCategory(draft.serviceId), [draft.serviceId])
  const selectedVehicle = useMemo(() => getVehicle(draft.vehicleId), [draft.vehicleId])
  const dates = useMemo(() => buildDates(), [])
  const pricing = buildBookingPricing(draft.serviceId, draft.pickupDrop)

  const completionTime = addMinutesToTime(draft.time, selectedService.durationMins + (draft.pickupDrop ? 50 : 0))

  if (loading) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
        <SkeletonCard />
        <View style={{ height: 12 }} />
        <SkeletonCard />
        <View style={{ height: 12 }} />
        <SkeletonCard />
      </ScrollView>
    )
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <PremiumCard>
        <Text style={styles.sectionLabel}>Selected center</Text>
        <Text style={styles.centerName}>{center.name}</Text>
        <Text style={styles.centerMeta}>{center.address}</Text>
      </PremiumCard>

      <SectionHeader title="Select vehicle" subtitle="Choose the EV that needs service" />
      <View style={styles.grid}>
        {vehicles.map(vehicle => {
          const active = vehicle.id === draft.vehicleId
          return (
            <Pressable key={vehicle.id} style={({ pressed }) => [styles.tile, width >= 720 && styles.halfTile, active && styles.tileActive, pressed && styles.pressed]} onPress={() => setDraft(previous => ({ ...previous, vehicleId: vehicle.id }))}>
              <MaterialCommunityIcons name="car-electric-outline" size={22} color={active ? '#ffffff' : '#10b981'} />
              <Text style={[styles.tileTitle, active && styles.tileTitleActive]}>{vehicle.name}</Text>
              <Text style={[styles.tileMeta, active && styles.tileMetaActive]}>{vehicle.model} • {vehicle.battery}</Text>
            </Pressable>
          )
        })}
      </View>

      <SectionHeader title="Select service category" subtitle="Premium maintenance and diagnostics options" />
      <View style={styles.grid}>
        {serviceCategories.map(service => {
          const active = service.id === draft.serviceId
          return (
            <Pressable key={service.id} style={({ pressed }) => [styles.tile, width >= 720 && styles.halfTile, active && styles.tileActive, pressed && styles.pressed]} onPress={() => setDraft(previous => ({ ...previous, serviceId: service.id }))}>
              <MaterialCommunityIcons name={service.icon as any} size={22} color={active ? '#ffffff' : '#10b981'} />
              <Text style={[styles.tileTitle, active && styles.tileTitleActive]}>{service.name}</Text>
              <Text style={[styles.tileMeta, active && styles.tileMetaActive]}>{service.durationMins} mins • {service.price}</Text>
            </Pressable>
          )
        })}
      </View>

      <SectionHeader title="Choose date" subtitle="Fake loading and local state only" />
      <View style={styles.pillRow}>
        {dates.map(date => {
          const active = date.key === draft.date
          return (
            <Pressable key={date.key} onPress={() => setDraft(previous => ({ ...previous, date: date.key }))} style={({ pressed }) => [styles.datePill, active && styles.datePillActive, pressed && styles.pressed]}>
              <Text style={[styles.datePillText, active && styles.datePillTextActive]}>{date.label}</Text>
            </Pressable>
          )
        })}
      </View>

      <SectionHeader title="Choose time slot" subtitle="Available appointment window" />
      <View style={styles.pillRow}>
        {timeSlots.map(slot => {
          const active = slot === draft.time
          return (
            <Pressable key={slot} onPress={() => setDraft(previous => ({ ...previous, time: slot }))} style={({ pressed }) => [styles.timePill, active && styles.timePillActive, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={active ? '#ffffff' : '#10b981'} />
              <Text style={[styles.timePillText, active && styles.timePillTextActive]}>{slot}</Text>
            </Pressable>
          )
        })}
      </View>

      <SectionHeader title="Pickup & drop" subtitle="Convenience toggle for doorstep service" />
      <View style={styles.toggleRow}>
        <Pressable style={[styles.toggleCard, !draft.pickupDrop && styles.toggleCardActive]} onPress={() => setDraft(previous => ({ ...previous, pickupDrop: false }))}>
          <MaterialCommunityIcons name="garage-open" size={20} color={!draft.pickupDrop ? '#ffffff' : '#10b981'} />
          <Text style={[styles.toggleText, !draft.pickupDrop && styles.toggleTextActive]}>Self drop-off</Text>
        </Pressable>
        <Pressable style={[styles.toggleCard, draft.pickupDrop && styles.toggleCardActive]} onPress={() => setDraft(previous => ({ ...previous, pickupDrop: true }))}>
          <MaterialCommunityIcons name="truck-delivery-outline" size={20} color={draft.pickupDrop ? '#ffffff' : '#10b981'} />
          <Text style={[styles.toggleText, draft.pickupDrop && styles.toggleTextActive]}>Pickup & drop</Text>
        </Pressable>
      </View>

      <SectionHeader title="Problem description" subtitle="Tell the technician what feels off" />
      <TextInput
        value={draft.description}
        onChangeText={text => setDraft(previous => ({ ...previous, description: text }))}
        placeholder="Battery drain, brake noise, charging issue, software glitch..."
        placeholderTextColor="#8da197"
        multiline
        style={styles.input}
      />

      <SectionHeader title="Service estimate" subtitle="Live pricing preview from local mock data" />
      <PremiumCard>
        <View style={styles.estimateRow}>
          <Text style={styles.estimateLabel}>Estimated cost</Text>
          <Text style={styles.estimateValue}>₹ {pricing.total.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.progressBlock}>
          <Text style={styles.progressText}>Repair progress estimate</Text>
          <ProgressBar value={Math.min(0.92, pricing.total / 3000)} />
        </View>
        <View style={styles.summaryChipRow}>
          <View style={styles.summaryChip}><Text style={styles.summaryChipText}>{selectedService.durationMins} mins</Text></View>
          <View style={styles.summaryChip}><Text style={styles.summaryChipText}>ETA {completionTime}</Text></View>
          <View style={styles.summaryChip}><Text style={styles.summaryChipText}>Rewards {pricing.rewardPoints}</Text></View>
        </View>
      </PremiumCard>

      <Pressable
        style={styles.continueButton}
        onPress={() => {
          setDraft(previous => ({ ...previous }))
          router.push('/ev-service/booking-summary')
        }}
      >
        <Text style={styles.continueText}>Continue</Text>
        <MaterialCommunityIcons name="arrow-right" size={18} color="#ffffff" />
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4fbf6' },
  container: { padding: 16, paddingBottom: 36 },
  sectionLabel: { color: '#10b981', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.1 },
  centerName: { color: '#0f5132', fontSize: 18, fontWeight: '900', marginTop: 8 },
  centerMeta: { color: '#6b7d72', marginTop: 6, lineHeight: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { flexBasis: '100%', backgroundColor: '#ffffff', borderRadius: 22, padding: 14, borderWidth: 1, borderColor: '#e2efe5' },
  halfTile: { flexBasis: '48%' },
  tileActive: { backgroundColor: '#0f5132', borderColor: '#0f5132' },
  pressed: { transform: [{ scale: 0.99 }] },
  tileTitle: { color: '#0f5132', fontWeight: '900', marginTop: 10 },
  tileTitleActive: { color: '#ffffff' },
  tileMeta: { color: '#6b7d72', marginTop: 4, fontSize: 12 },
  tileMetaActive: { color: 'rgba(255,255,255,0.82)' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  datePill: { backgroundColor: '#ffffff', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#e2efe5' },
  datePillActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  datePillText: { color: '#0f5132', fontWeight: '800', fontSize: 12 },
  datePillTextActive: { color: '#ffffff' },
  timePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#e2efe5' },
  timePillActive: { backgroundColor: '#0f5132', borderColor: '#0f5132' },
  timePillText: { color: '#10b981', fontWeight: '900', fontSize: 12 },
  timePillTextActive: { color: '#ffffff' },
  toggleRow: { flexDirection: 'row', gap: 12 },
  toggleCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#ffffff', borderRadius: 18, paddingVertical: 14, borderWidth: 1, borderColor: '#e2efe5' },
  toggleCardActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  toggleText: { color: '#0f5132', fontWeight: '900' },
  toggleTextActive: { color: '#ffffff' },
  input: { minHeight: 110, borderRadius: 22, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2efe5', padding: 14, color: '#0f5132', textAlignVertical: 'top' },
  estimateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  estimateLabel: { color: '#6b7d72', fontWeight: '800' },
  estimateValue: { color: '#0f5132', fontWeight: '900', fontSize: 18 },
  progressBlock: { marginTop: 14 },
  progressText: { color: '#6b7d72', fontWeight: '700', marginBottom: 8 },
  summaryChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  summaryChip: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8 },
  summaryChipText: { color: '#0f5132', fontWeight: '900', fontSize: 12 },
  continueButton: { marginTop: 18, backgroundColor: '#0f5132', borderRadius: 20, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  continueText: { color: '#ffffff', fontWeight: '900', fontSize: 16 },
})
