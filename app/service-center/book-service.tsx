import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { getServiceCenter, getServiceType, getVehicle, timeSlots, vehicles } from '../../lib/mock/serviceData'

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

function buildDates() {
  const today = new Date()
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index + 1)
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
    }
  })
}

export default function BookService() {
  const params = useLocalSearchParams<{ centerId?: string; serviceTypeId?: string }>()
  const router = useRouter()
  const centerId = paramValue(params.centerId)
  const serviceTypeId = paramValue(params.serviceTypeId)
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id ?? '')
  const [selectedDate, setSelectedDate] = useState(buildDates()[0]?.key ?? '')
  const [selectedTime, setSelectedTime] = useState(timeSlots[2] ?? timeSlots[0] ?? '')
  const [pickupDrop, setPickupDrop] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [centerId, serviceTypeId])

  const center = useMemo(() => getServiceCenter(centerId), [centerId])
  const serviceType = useMemo(() => getServiceType(serviceTypeId), [serviceTypeId])
  const dates = useMemo(() => buildDates(), [])
  const selectedVehicle = useMemo(() => getVehicle(selectedVehicleId), [selectedVehicleId])

  const price = (serviceType?.price ?? 0) + (pickupDrop ? 299 : 0)

  if (!center || !serviceType) {
    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="alert-circle-outline" size={32} color="#1B7F4B" />
        <Text style={styles.emptyTitle}>Missing booking context</Text>
        <Text style={styles.emptySubtitle}>Please choose a service center and service type again.</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.stepBadge}>
        <MaterialCommunityIcons name="numeric-3-circle-outline" size={18} color="#1B7F4B" />
        <Text style={styles.stepBadgeText}>Choose vehicle and schedule</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <MaterialCommunityIcons name={serviceType.icon as any} size={22} color="#0F5132" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.summaryTitle}>{serviceType.name}</Text>
          <Text style={styles.summarySubtitle}>{center.name}</Text>
        </View>
        <View style={styles.summaryPricePill}>
          <Text style={styles.summaryPriceText}>₹ {price}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Preparing vehicle and slot options...</Text>
        </View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select vehicle</Text>
            <Text style={styles.sectionMeta}>Pick the EV that needs service</Text>
          </View>

          <View style={styles.vehicleGrid}>
            {vehicles.map(vehicle => {
              const active = vehicle.id === selectedVehicleId
              return (
                <Pressable key={vehicle.id} style={({ pressed }) => [styles.vehicleCard, active && styles.vehicleCardActive, pressed && styles.pressedCard]} onPress={() => setSelectedVehicleId(vehicle.id)}>
                  <View style={styles.vehicleIconWrap}>
                    <MaterialCommunityIcons name="car-electric-outline" size={22} color="#1B7F4B" />
                  </View>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehicleMeta}>{vehicle.model} • {vehicle.year}</Text>
                  {active ? <View style={styles.selectedChip}><Text style={styles.selectedChipText}>Selected</Text></View> : null}
                </Pressable>
              )
            })}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Choose date & time</Text>
            <Text style={styles.sectionMeta}>Mock slot booking UI with instant feedback</Text>
          </View>

          <View style={styles.dateRow}>
            {dates.map(item => {
              const active = item.key === selectedDate
              return (
                <Pressable key={item.key} onPress={() => setSelectedDate(item.key)} style={({ pressed }) => [styles.dateChip, active && styles.dateChipActive, pressed && styles.pressedCard]}>
                  <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>{item.label}</Text>
                </Pressable>
              )
            })}
          </View>

          <View style={styles.slotGrid}>
            {timeSlots.map(slot => {
              const active = slot === selectedTime
              return (
                <Pressable key={slot} onPress={() => setSelectedTime(slot)} style={({ pressed }) => [styles.slotChip, active && styles.slotChipActive, pressed && styles.pressedCard]}>
                  <MaterialCommunityIcons name="clock-outline" size={14} color={active ? '#FFFFFF' : '#1B7F4B'} />
                  <Text style={[styles.slotText, active && styles.slotTextActive]}>{slot}</Text>
                </Pressable>
              )
            })}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pickup & drop</Text>
            <Text style={styles.sectionMeta}>Convenience toggle for doorstep service</Text>
          </View>

          <View style={styles.toggleCard}>
            <Pressable style={[styles.toggleOption, !pickupDrop && styles.toggleOptionActive]} onPress={() => setPickupDrop(false)}>
              <MaterialCommunityIcons name="garage-open" size={20} color={!pickupDrop ? '#FFFFFF' : '#1B7F4B'} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.toggleTitle, !pickupDrop && styles.toggleTitleActive]}>Self drop-off</Text>
                <Text style={[styles.toggleSubtitle, !pickupDrop && styles.toggleSubtitleActive]}>No pickup fee</Text>
              </View>
            </Pressable>

            <Pressable style={[styles.toggleOption, pickupDrop && styles.toggleOptionActive]} onPress={() => setPickupDrop(true)}>
              <MaterialCommunityIcons name="truck-delivery-outline" size={20} color={pickupDrop ? '#FFFFFF' : '#1B7F4B'} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.toggleTitle, pickupDrop && styles.toggleTitleActive]}>Pickup & drop</Text>
                <Text style={[styles.toggleSubtitle, pickupDrop && styles.toggleSubtitleActive]}>Adds doorstep convenience</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>Booking preview</Text>
            <Text style={styles.previewValue}>{selectedVehicle?.name ?? 'Vehicle'}</Text>
            <Text style={styles.previewMeta}>{selectedDate} • {selectedTime}</Text>
            <Text style={styles.previewMeta}>{pickupDrop ? 'Pickup & drop selected' : 'Self drop-off selected'}</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
            onPress={() => router.push(`/service-center/booking-summary?centerId=${center.id}&serviceTypeId=${serviceType.id}&vehicleId=${selectedVehicleId}&date=${selectedDate}&time=${selectedTime}&pickupDrop=${pickupDrop ? '1' : '0'}`)}
          >
            <Text style={styles.ctaText}>Review booking</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 36 },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDEDE2',
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  stepBadgeText: { color: '#1B7F4B', fontSize: 12, fontWeight: '800' },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    shadowColor: '#0F5132',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDF5EF',
  },
  summaryIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#EAF8EE', alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { color: '#0F5132', fontSize: 18, fontWeight: '900' },
  summarySubtitle: { color: '#6B7D72', marginTop: 4 },
  summaryPricePill: { backgroundColor: '#F2FAF5', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  summaryPriceText: { color: '#0F5132', fontWeight: '900' },
  loadingCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginTop: 16, alignItems: 'center' },
  loadingText: { color: '#6B7D72', fontWeight: '700' },
  sectionHeader: { marginTop: 18, marginBottom: 12 },
  sectionTitle: { color: '#0F5132', fontSize: 18, fontWeight: '900' },
  sectionMeta: { color: '#6B7D72', fontSize: 12, marginTop: 4 },
  vehicleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  vehicleCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6EFE9',
    shadowColor: '#0F5132',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  vehicleCardActive: { borderColor: '#1B7F4B', backgroundColor: '#EBFAEF' },
  pressedCard: { transform: [{ scale: 0.99 }] },
  vehicleIconWrap: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#F3FBF6', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  vehicleName: { color: '#0F5132', fontSize: 15, fontWeight: '900' },
  vehicleMeta: { color: '#6B7D72', fontSize: 12, marginTop: 6 },
  selectedChip: { alignSelf: 'flex-start', marginTop: 12, backgroundColor: '#1B7F4B', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  selectedChipText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  dateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dateChip: { backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#DDEDE2' },
  dateChipActive: { backgroundColor: '#1B7F4B', borderColor: '#1B7F4B' },
  dateChipText: { color: '#4F685B', fontWeight: '800', fontSize: 12 },
  dateChipTextActive: { color: '#FFFFFF' },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  slotChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#DDEDE2' },
  slotChipActive: { backgroundColor: '#0F5132', borderColor: '#0F5132' },
  slotText: { color: '#1B7F4B', fontWeight: '800', fontSize: 12 },
  slotTextActive: { color: '#FFFFFF' },
  toggleCard: { gap: 10 },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDEDE2',
  },
  toggleOptionActive: { backgroundColor: '#1B7F4B', borderColor: '#1B7F4B' },
  toggleTitle: { color: '#0F5132', fontWeight: '900', fontSize: 15 },
  toggleTitleActive: { color: '#FFFFFF' },
  toggleSubtitle: { color: '#6B7D72', marginTop: 4, fontSize: 12 },
  toggleSubtitleActive: { color: 'rgba(255,255,255,0.84)' },
  previewCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, marginTop: 16, borderWidth: 1, borderColor: '#DDEDE2' },
  previewLabel: { color: '#6B7D72', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  previewValue: { color: '#0F5132', fontSize: 18, fontWeight: '900', marginTop: 8 },
  previewMeta: { color: '#4F685B', marginTop: 6 },
  ctaButton: { marginTop: 18, backgroundColor: '#0F5132', borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
  ctaButtonPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  ctaText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F4FBF6' },
  emptyTitle: { marginTop: 10, color: '#0F5132', fontSize: 18, fontWeight: '900' },
  emptySubtitle: { marginTop: 8, color: '#6B7D72', textAlign: 'center', lineHeight: 20 },
})
