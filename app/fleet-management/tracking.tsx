import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { useFleetOps } from './FleetOpsContext'

export default function TrackingScreen() {
  const router = useRouter()
  const { bookingDraft, currentDriver, currentVehicle, tripSession, startTrip, updateTripSession, completeTrip } = useFleetOps()
  const [markerPosition, setMarkerPosition] = useState({ left: 18, top: 122 })

  useEffect(() => {
<<<<<<< HEAD
    const nextProgress = tripSession.progress
    setMarkerPosition({
      left: 18 + nextProgress * 1.9,
      top: 122 - Math.sin(nextProgress / 12) * 18,
    })
  }, [tripSession.progress])

  useEffect(() => {
=======
>>>>>>> 6fd40c6f5515f9b35690b17707ff8f51705372eb
    startTrip()

    const timer = setInterval(() => {
      updateTripSession(previous => {
        const nextProgress = Math.min(previous.progress + 6, 96)
        const nextBattery = Math.max(previous.batteryLevel - 1, 15)
        const nextSpeed = 38 + ((nextProgress / 6) % 10) * 2
        const nextEtaMinutes = Math.max(4, 18 - Math.floor(nextProgress / 8))
        const nextDistance = Math.min(bookingDraft.distance, (bookingDraft.distance * nextProgress) / 100)

<<<<<<< HEAD
=======
        setMarkerPosition({
          left: 18 + nextProgress * 1.9,
          top: 122 - Math.sin(nextProgress / 12) * 18,
        })

>>>>>>> 6fd40c6f5515f9b35690b17707ff8f51705372eb
        return {
          progress: nextProgress,
          batteryLevel: nextBattery,
          currentSpeed: Math.round(nextSpeed),
          eta: `${nextEtaMinutes} mins`,
          distanceCovered: Number(nextDistance.toFixed(1)),
          pickupCompleted: nextProgress > 24,
          status: 'active',
        }
      })
    }, 1200)

    return () => clearInterval(timer)
<<<<<<< HEAD
  }, [])
=======
  }, [bookingDraft.distance, startTrip, updateTripSession])
>>>>>>> 6fd40c6f5515f9b35690b17707ff8f51705372eb

  const progressLabel = useMemo(() => `${tripSession.progress}%`, [tripSession.progress])

  function handleCompleteTrip() {
    completeTrip({
      totalDistance: bookingDraft.distance,
      totalDuration: '42 mins',
      driverRating: currentDriver.rating,
      customerFeedback: 'Smooth ride, on-time pickup, and excellent charging-friendly routing.',
      fareAmount: bookingDraft.estimatedFare,
      batteryConsumed: Math.max(8, Math.round(bookingDraft.distance * 0.4)),
      carbonSavings: `${Math.round(bookingDraft.distance * 1.8)} kg CO2 saved`,
    })
    router.push('/fleet-management/trip-completion')
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>Live GPS Tracking</Text>
            <Text style={styles.headerTitle}>Trip in progress</Text>
            <Text style={styles.headerSubtitle}>Track movement, battery drain, and ETA using live mock updates.</Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name={'map-marker' as any} size={24} color="#ffffff" />
          </View>
        </View>

        <FleetCard style={styles.mapCard}>
          <View style={styles.mapHeader}>
            <View>
              <Text style={styles.mapLabel}>Vehicle {currentVehicle.number}</Text>
              <Text style={styles.mapTitle}>{bookingDraft.pickupLocation} → {bookingDraft.dropLocation}</Text>
            </View>
            <View style={styles.liveBadge}>
              <MaterialCommunityIcons name={'flash' as any} size={14} color="#ffffff" />
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          </View>
          <View style={styles.mapPlaceholder}>
            <View style={styles.routeLine} />
            <View style={[styles.mapMarker, { left: markerPosition.left, top: markerPosition.top }]}>
              <MaterialCommunityIcons name={'car-electric' as any} size={16} color="#ffffff" />
            </View>
            <View style={styles.mapPinsLeft}>
              <MaterialCommunityIcons name={'map-marker' as any} size={18} color="#10b981" />
              <Text style={styles.pinText}>Pickup</Text>
            </View>
            <View style={styles.mapPinsRight}>
              <MaterialCommunityIcons name={'map-marker' as any} size={18} color="#0ea5e9" />
              <Text style={styles.pinText}>Drop</Text>
            </View>
          </View>
        </FleetCard>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'clock-outline' as any} size={18} color="#10b981" />
            <Text style={styles.statLabel}>ETA</Text>
            <Text style={styles.statValue}>{tripSession.eta}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'battery-charging' as any} size={18} color="#10b981" />
            <Text style={styles.statLabel}>Battery</Text>
            <Text style={styles.statValue}>{tripSession.batteryLevel}%</Text>
          </View>
        </View>

        <FleetCard style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.sectionCardTitle}>Trip Progress</Text>
            <Text style={styles.progressLabel}>{progressLabel}</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${tripSession.progress}%` }]} />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.footerText}>Distance covered: {tripSession.distanceCovered.toFixed(1)} km</Text>
            <Text style={styles.footerText}>Current speed: {tripSession.currentSpeed} km/h</Text>
          </View>
        </FleetCard>

        <SectionHeader title="Driver Snapshot" subtitle="Driver and operational signals for the active trip." />
        <FleetCard style={styles.driverCard}>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <MaterialCommunityIcons name={'account-tie' as any} size={24} color="#10b981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>{currentDriver.name}</Text>
              <Text style={styles.driverMeta}>{currentDriver.phone}</Text>
              <Text style={styles.driverMeta}>Rating {currentDriver.rating.toFixed(1)} • {currentDriver.totalTrips} trips</Text>
            </View>
            <View style={styles.pickupBadge}>
              <MaterialCommunityIcons name={'shield-check' as any} size={14} color="#ffffff" />
              <Text style={styles.pickupBadgeText}>{tripSession.pickupCompleted ? 'Pickup complete' : 'Heading to pickup'}</Text>
            </View>
          </View>
        </FleetCard>

        <View style={styles.buttonRow}>
          <Pressable style={styles.secondaryButton} onPress={() => Alert.alert('Emergency Support', 'Mock emergency support request raised for the active trip.')}>
            <MaterialCommunityIcons name={'shield-check' as any} size={16} color="#ffffff" />
            <Text style={styles.secondaryButtonText}>Emergency Support</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={handleCompleteTrip}>
            <MaterialCommunityIcons name={'clipboard-check' as any} size={16} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Complete Trip</Text>
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
  mapCard: { marginBottom: 16 },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12 },
  mapLabel: { color: '#6b7280', fontSize: 11, fontWeight: '800' },
  mapTitle: { color: '#0f5132', fontSize: 14, fontWeight: '900', marginTop: 4 },
  liveBadge: { backgroundColor: '#10b981', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: '900' },
  mapPlaceholder: { height: 220, borderRadius: 22, backgroundColor: '#eef8f1', borderWidth: 1, borderColor: '#dbe7dd', overflow: 'hidden' },
  routeLine: { position: 'absolute', left: 22, right: 22, top: 128, height: 4, borderRadius: 999, backgroundColor: '#cfe8d5' },
  mapMarker: { position: 'absolute', width: 34, height: 34, borderRadius: 17, backgroundColor: '#0f5132', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  mapPinsLeft: { position: 'absolute', left: 18, top: 28, alignItems: 'center' },
  mapPinsRight: { position: 'absolute', right: 18, bottom: 24, alignItems: 'center' },
  pinText: { color: '#0f5132', fontSize: 11, fontWeight: '900', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#dbe7dd' },
  statLabel: { color: '#6b7280', fontSize: 11, marginTop: 8 },
  statValue: { color: '#0f5132', fontSize: 16, fontWeight: '900', marginTop: 4 },
  progressCard: { marginBottom: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionCardTitle: { color: '#0f5132', fontSize: 14, fontWeight: '900' },
  progressLabel: { color: '#10b981', fontWeight: '900', fontSize: 12 },
  progressBarTrack: { height: 10, borderRadius: 999, backgroundColor: '#e2efe5', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#10b981' },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 12, flexWrap: 'wrap' },
  footerText: { color: '#4f6952', fontSize: 12, fontWeight: '700' },
  driverCard: { marginBottom: 16 },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  driverName: { color: '#0f5132', fontSize: 15, fontWeight: '900' },
  driverMeta: { color: '#6b7280', fontSize: 12, marginTop: 2, lineHeight: 17 },
  pickupBadge: { backgroundColor: '#0f5132', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  pickupBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: '900' },
  buttonRow: { flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, backgroundColor: '#0f5132', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  primaryButton: { flex: 1, backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
})
