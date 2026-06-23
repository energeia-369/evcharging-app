import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { addBooking, estimateBookingAmount, formatCurrency, getServiceCenter, getServiceType, getVehicle } from '../../lib/mock/serviceData'

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

function formatDate(value: string) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })
}

export default function BookingSummary() {
  const params = useLocalSearchParams<{ centerId?: string; serviceTypeId?: string; vehicleId?: string; date?: string; time?: string; pickupDrop?: string }>()
  const router = useRouter()
  const centerId = paramValue(params.centerId)
  const serviceTypeId = paramValue(params.serviceTypeId)
  const vehicleId = paramValue(params.vehicleId)
  const date = paramValue(params.date)
  const time = paramValue(params.time)
  const pickupDrop = paramValue(params.pickupDrop) === '1' || paramValue(params.pickupDrop).toLowerCase() === 'true'
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [centerId, serviceTypeId, vehicleId])

  const center = useMemo(() => getServiceCenter(centerId), [centerId])
  const serviceType = useMemo(() => getServiceType(serviceTypeId), [serviceTypeId])
  const vehicle = useMemo(() => getVehicle(vehicleId), [vehicleId])
  const subtotal = estimateBookingAmount(serviceTypeId, pickupDrop)
  const serviceFee = serviceType?.price ?? 0
  const pickupFee = pickupDrop ? 299 : 0
  const gst = Math.round(subtotal * 0.18)
  const grandTotal = subtotal + gst

  if (!center || !serviceType || !vehicle) {
    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="alert-circle-outline" size={32} color="#1B7F4B" />
        <Text style={styles.emptyTitle}>Summary unavailable</Text>
        <Text style={styles.emptySubtitle}>One or more booking selections are missing.</Text>
      </View>
    )
  }

  const handleConfirm = () => {
    setProcessing(true)
    setTimeout(() => {
      const booking = addBooking({
        centerId,
        centerName: center.name,
        serviceTypeId,
        serviceTypeName: serviceType.name,
        vehicleId,
        vehicleName: vehicle.name,
        services: [serviceType.name],
        date,
        time,
        pickupDrop,
        estimatedAmount: grandTotal,
      })
      setProcessing(false)
      router.push(`/service-center/payment?bookingId=${booking.id}`)
    }, 900)
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.stepBadge}>
        <MaterialCommunityIcons name="numeric-4-circle-outline" size={18} color="#1B7F4B" />
        <Text style={styles.stepBadgeText}>Review booking summary</Text>
      </View>

      <View style={styles.summaryHero}>
        <Text style={styles.summaryLabel}>Estimated total</Text>
        <Text style={styles.summaryAmount}>{formatCurrency(grandTotal)}</Text>
        <Text style={styles.summaryCaption}>Includes service fee and the optional pickup & drop charge.</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color="#1B7F4B" />
        </View>
      ) : (
        <>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="garage" size={20} color="#1B7F4B" />
              <View style={styles.detailBody}>
                <Text style={styles.detailTitle}>{center.name}</Text>
                <Text style={styles.detailMeta}>{center.address}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name={serviceType.icon as any} size={20} color="#1B7F4B" />
              <View style={styles.detailBody}>
                <Text style={styles.detailTitle}>{serviceType.name}</Text>
                <Text style={styles.detailMeta}>{serviceType.durationMins} mins • {serviceType.badge}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="car-electric-outline" size={20} color="#1B7F4B" />
              <View style={styles.detailBody}>
                <Text style={styles.detailTitle}>{vehicle.name}</Text>
                <Text style={styles.detailMeta}>{vehicle.model} • {vehicle.year}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="calendar-clock" size={20} color="#1B7F4B" />
              <View style={styles.detailBody}>
                <Text style={styles.detailTitle}>{formatDate(date)} at {time}</Text>
                <Text style={styles.detailMeta}>{pickupDrop ? 'Pickup & drop enabled' : 'Self drop-off selected'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.priceCard}>
            <Text style={styles.sectionTitle}>Price estimation</Text>
            <View style={styles.priceRow}><Text style={styles.priceLabel}>Service fee</Text><Text style={styles.priceValue}>{formatCurrency(serviceFee)}</Text></View>
            <View style={styles.priceRow}><Text style={styles.priceLabel}>Pickup & drop</Text><Text style={styles.priceValue}>{formatCurrency(pickupFee)}</Text></View>
            <View style={styles.priceRow}><Text style={styles.priceLabel}>GST estimate</Text><Text style={styles.priceValue}>{formatCurrency(gst)}</Text></View>
            <View style={[styles.priceRow, styles.totalRow]}><Text style={styles.totalLabel}>Grand total</Text><Text style={styles.totalValue}>{formatCurrency(grandTotal)}</Text></View>
          </View>

          <Pressable style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]} onPress={handleConfirm} disabled={processing}>
            {processing ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.ctaText}>Confirm and pay</Text>}
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
  summaryHero: { backgroundColor: '#0F5132', borderRadius: 26, padding: 18, marginBottom: 16 },
  summaryLabel: { color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, fontWeight: '800' },
  summaryAmount: { color: '#FFFFFF', fontSize: 30, fontWeight: '900', marginTop: 8 },
  summaryCaption: { color: 'rgba(255,255,255,0.88)', marginTop: 8, lineHeight: 20 },
  loadingWrap: { minHeight: 180, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 20 },
  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, shadowColor: '#0F5132', shadowOpacity: 0.06, shadowRadius: 16, elevation: 2, borderWidth: 1, borderColor: '#EDF5EF' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  detailBody: { flex: 1 },
  detailTitle: { color: '#0F5132', fontSize: 15, fontWeight: '900' },
  detailMeta: { color: '#6B7D72', marginTop: 4, lineHeight: 18 },
  priceCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, marginTop: 16, borderWidth: 1, borderColor: '#DDEDE2' },
  sectionTitle: { color: '#0F5132', fontSize: 18, fontWeight: '900', marginBottom: 12 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  priceLabel: { color: '#4F685B', fontWeight: '700' },
  priceValue: { color: '#0F5132', fontWeight: '800' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#EDF5EF', marginTop: 6, paddingTop: 14 },
  totalLabel: { color: '#0F5132', fontSize: 16, fontWeight: '900' },
  totalValue: { color: '#1B7F4B', fontSize: 16, fontWeight: '900' },
  ctaButton: { backgroundColor: '#1B7F4B', borderRadius: 20, paddingVertical: 16, alignItems: 'center', marginTop: 18 },
  ctaButtonPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  ctaText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F4FBF6' },
  emptyTitle: { marginTop: 10, color: '#0F5132', fontSize: 18, fontWeight: '900' },
  emptySubtitle: { marginTop: 8, color: '#6B7D72', textAlign: 'center', lineHeight: 20 },
})
