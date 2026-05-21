import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { formatCurrency, getBooking, getInvoice, trackingStages, updateBookingStatus } from '../../lib/mock/serviceData'

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export default function Tracking() {
  const params = useLocalSearchParams<{ bookingId?: string; invoiceId?: string }>()
  const router = useRouter()
  const bookingId = paramValue(params.bookingId)
  const invoiceId = paramValue(params.invoiceId)
  const booking = useMemo(() => getBooking(bookingId), [bookingId])
  const invoice = useMemo(() => getInvoice(invoiceId), [invoiceId])
  const [currentStage, setCurrentStage] = useState(0)
  const [lastUpdate, setLastUpdate] = useState('Just now')
  const progress = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    )
    pulseLoop.start()
    return () => pulseLoop.stop()
  }, [pulse])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage(stage => {
        const next = Math.min(stage + 1, trackingStages.length - 1)
        const status = next >= trackingStages.length - 1 ? 'completed' : 'in-progress'
        updateBookingStatus(bookingId, status)
        setLastUpdate(new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }))
        if (next >= trackingStages.length - 1) {
          clearInterval(timer)
        }
        return next
      })
    }, 1800)

    return () => clearInterval(timer)
  }, [bookingId])

  useEffect(() => {
    Animated.timing(progress, {
      toValue: trackingStages.length > 1 ? currentStage / (trackingStages.length - 1) : 0,
      duration: 350,
      useNativeDriver: false,
    }).start()
  }, [currentStage, progress])

  if (!booking) {
    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="alert-circle-outline" size={32} color="#1B7F4B" />
        <Text style={styles.emptyTitle}>Tracking unavailable</Text>
        <Text style={styles.emptySubtitle}>The booking could not be found in the mock store.</Text>
      </View>
    )
  }

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
  const completed = currentStage >= trackingStages.length - 1

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerKicker}>Step 7 of 7</Text>
            <Text style={styles.headerTitle}>Live service tracking</Text>
          </View>
          <Animated.View style={[styles.livePill, { transform: [{ scale: pulse }] }]}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </Animated.View>
        </View>
        <Text style={styles.headerSubtitle}>{booking.serviceTypeName ?? booking.services.join(' • ')} • {booking.centerName ?? 'Service center'}</Text>
        <Text style={styles.headerMeta}>Booking ID: {booking.id} • Updated {lastUpdate}</Text>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>

      <View style={styles.timelineCard}>
        {trackingStages.map((stage, index) => {
          const isDone = index <= currentStage
          const isCurrent = index === currentStage
          return (
            <View key={stage.key} style={styles.timelineRow}>
              <View style={[styles.timelineMarker, isDone && styles.timelineMarkerDone, isCurrent && styles.timelineMarkerCurrent]}>
                <MaterialCommunityIcons name={stage.icon as any} size={16} color={isDone ? '#FFFFFF' : '#1B7F4B'} />
              </View>
              <View style={styles.timelineBody}>
                <Text style={[styles.timelineTitle, isDone && styles.timelineTitleDone]}>{stage.title}</Text>
                <Text style={styles.timelineDetail}>{stage.detail}</Text>
              </View>
            </View>
          )
        })}
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <MaterialCommunityIcons name="car-electric-outline" size={20} color="#1B7F4B" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.summaryTitle}>{booking.vehicleName ?? 'Vehicle'} is being serviced</Text>
            <Text style={styles.summaryText}>{booking.date} • {booking.time}</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <MaterialCommunityIcons name="cash-check" size={20} color="#1B7F4B" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.summaryTitle}>{formatCurrency(booking.estimatedAmount)} paid</Text>
            <Text style={styles.summaryText}>{invoice ? `Invoice ${invoice.id}` : 'Invoice will be available after payment'}</Text>
          </View>
        </View>
      </View>

      {completed ? (
        <View style={styles.completeCard}>
          <MaterialCommunityIcons name="check-decagram" size={28} color="#1B7F4B" />
          <Text style={styles.completeTitle}>Service completed</Text>
          <Text style={styles.completeText}>Your EV is ready for pickup. Open the invoice for the final receipt.</Text>
          <Pressable style={styles.invoiceButton} onPress={() => router.push(`/service-center/invoice?invoiceId=${invoiceId}&bookingId=${bookingId}`)}>
            <Text style={styles.invoiceButtonText}>View invoice</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 36 },
  headerCard: { backgroundColor: '#0F5132', borderRadius: 28, padding: 18, marginBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerKicker: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '800' },
  headerTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', marginTop: 6 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#9EF7B7' },
  liveText: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
  headerSubtitle: { color: 'rgba(255,255,255,0.9)', marginTop: 12, lineHeight: 20 },
  headerMeta: { color: 'rgba(255,255,255,0.7)', marginTop: 6, fontSize: 12 },
  progressTrack: { height: 10, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999, overflow: 'hidden', marginTop: 16 },
  progressFill: { height: '100%', backgroundColor: '#9EF7B7', borderRadius: 999 },
  timelineCard: { backgroundColor: '#FFFFFF', borderRadius: 26, padding: 16, borderWidth: 1, borderColor: '#E3EFE6', shadowColor: '#0F5132', shadowOpacity: 0.06, shadowRadius: 16, elevation: 2 },
  timelineRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  timelineMarker: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, borderColor: '#B8D8C4', backgroundColor: '#F2FAF5', alignItems: 'center', justifyContent: 'center' },
  timelineMarkerDone: { backgroundColor: '#1B7F4B', borderColor: '#1B7F4B' },
  timelineMarkerCurrent: { transform: [{ scale: 1.05 }], shadowColor: '#1B7F4B', shadowOpacity: 0.18, shadowRadius: 8, elevation: 2 },
  timelineBody: { flex: 1, paddingTop: 2 },
  timelineTitle: { color: '#4F685B', fontSize: 15, fontWeight: '800' },
  timelineTitleDone: { color: '#0F5132' },
  timelineDetail: { color: '#6B7D72', fontSize: 12, marginTop: 5, lineHeight: 18 },
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, marginTop: 16, borderWidth: 1, borderColor: '#E3EFE6' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  summaryTitle: { color: '#0F5132', fontWeight: '900', fontSize: 15 },
  summaryText: { color: '#6B7D72', marginTop: 4 },
  completeCard: { backgroundColor: '#EAF8EE', borderRadius: 24, padding: 18, alignItems: 'center', marginTop: 16 },
  completeTitle: { color: '#0F5132', fontSize: 18, fontWeight: '900', marginTop: 8 },
  completeText: { color: '#4F685B', textAlign: 'center', marginTop: 6, lineHeight: 20 },
  invoiceButton: { marginTop: 14, backgroundColor: '#0F5132', borderRadius: 18, paddingHorizontal: 18, paddingVertical: 12 },
  invoiceButtonText: { color: '#FFFFFF', fontWeight: '900' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F4FBF6' },
  emptyTitle: { marginTop: 10, color: '#0F5132', fontSize: 18, fontWeight: '900' },
  emptySubtitle: { marginTop: 8, color: '#6B7D72', textAlign: 'center', lineHeight: 20 },
})
