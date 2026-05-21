import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { useFleetContext } from '../../context/fleet-context'

export default function LiveTrackingScreen() {
  const router = useRouter()
  const { selectedVehicle } = useFleetContext()
  const [tripProgress, setTripProgress] = useState(0)
  const [currentBattery, setCurrentBattery] = useState(selectedVehicle?.battery ?? 85)
  const [eta, setEta] = useState('12 mins')
  const statusColor = '#0ea5e9'

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTripProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 8
      })

      setCurrentBattery(prev => Math.max(prev - Math.random() * 0.5, 20))

      // Update ETA
      const remaining = Math.max(100 - tripProgress - Math.random() * 8, 0)
      setEta(`${Math.ceil(remaining / 10)} mins`)
    }, 2000)

    return () => clearInterval(interval)
  }, [tripProgress])

  if (!selectedVehicle) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="file-document" size={24} color="#1f2937" />
        </Pressable>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={24} color="#1f2937" />
          </Pressable>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <View style={styles.liveBadge}>
            <MaterialCommunityIcons name="shield-check" size={10} color="#ef4444" />
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <MaterialCommunityIcons name="map" size={60} color="#9ca3af" />
          <Text style={styles.mapPlaceholderText}>Route Map Placeholder</Text>
          <Text style={styles.mapPlaceholderSubtext}>{selectedVehicle.location}</Text>
        </View>

        {/* Vehicle Status */}
        <FleetCard style={styles.statusCard}>
          <View style={styles.statusRow}>
            <MaterialCommunityIcons name="car-electric" size={24} color={statusColor} />
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>{selectedVehicle.name}</Text>
              <Text style={styles.statusValue}>{selectedVehicle.tripStatus}</Text>
            </View>
            <View style={styles.liveDot} />
          </View>
        </FleetCard>

        {/* Trip Progress */}
        <SectionHeader title="Trip Progress" />
        <FleetCard>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min(tripProgress, 100)}%` }]} />
          </View>
          <Text style={styles.progressPercentage}>{Math.min(Math.round(tripProgress), 100)}% Complete</Text>
        </FleetCard>

        {/* ETA and Battery */}
        <View style={styles.metricsGrid}>
          <FleetCard style={styles.metricCard}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={statusColor} />
            <Text style={styles.metricLabel}>Estimated Time</Text>
            <Text style={styles.metricValue}>{eta}</Text>
          </FleetCard>

          <FleetCard style={styles.metricCard}>
            <MaterialCommunityIcons name="battery" size={20} color={currentBattery > 40 ? '#10b981' : '#f59e0b'} />
            <Text style={styles.metricLabel}>Battery Level</Text>
            <Text style={styles.metricValue}>{Math.round(currentBattery)}%</Text>
          </FleetCard>
        </View>

        {/* Driver Information */}
        <SectionHeader title="Driver Information" />
        <FleetCard>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <MaterialCommunityIcons name="account-tie" size={50} color="#10b981" />
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{selectedVehicle.driverName}</Text>
              <View style={styles.driverRating}>
                <MaterialCommunityIcons name="star" size={14} color="#f59e0b" />
                <Text style={styles.driverRatingText}>4.8 • 156 trips</Text>
              </View>
            </View>
            <Pressable style={styles.callButton}>
              <MaterialCommunityIcons name="phone" size={18} color="#10b981" />
            </Pressable>
          </View>
        </FleetCard>

        {/* Charging Stops */}
        <SectionHeader title="Upcoming Stops" />
        <FleetCard style={styles.stopCard}>
          <View style={styles.stopMarker}>
            <MaterialCommunityIcons name="battery-charging" size={20} color="#10b981" />
          </View>
          <View style={styles.stopInfo}>
            <Text style={styles.stopName}>Central Charging Hub</Text>
            <Text style={styles.stopDetail}>2.5 km away • 12 mins</Text>
          </View>
        </FleetCard>

        {/* Emergency Button */}
        <Pressable style={styles.emergencyButton}>
          <MaterialCommunityIcons name="shield-check" size={20} color="#ffffff" />
          <Text style={styles.emergencyButtonText}>Emergency Alert</Text>
        </Pressable>

        {/* Complete Trip Button */}
        <Pressable
          style={styles.completeButton}
          onPress={() => {
            router.push('/fleet-management/analytics')
          }}
        >
          <Text style={styles.completeButtonText}>End Tracking</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4fbf6' },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0f5132', flex: 1, textAlign: 'center' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  liveBadgeText: { fontSize: 10, fontWeight: '900', color: '#ef4444' },
  mapPlaceholder: { backgroundColor: '#ffffff', borderRadius: 16, height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#e2efe5' },
  mapPlaceholderText: { fontSize: 14, fontWeight: '600', color: '#0f5132', marginTop: 12 },
  mapPlaceholderSubtext: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  statusCard: { marginBottom: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusInfo: { flex: 1 },
  statusLabel: { fontSize: 12, color: '#6b7280' },
  statusValue: { fontSize: 14, fontWeight: '900', color: '#0f5132', marginTop: 2 },
  liveDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ef4444' },
  progressBarContainer: { height: 10, backgroundColor: '#e2efe5', borderRadius: 5, overflow: 'hidden', marginBottom: 10 },
  progressBar: { height: '100%', backgroundColor: '#0ea5e9' },
  progressPercentage: { fontSize: 14, fontWeight: '900', color: '#0f5132', textAlign: 'center' },
  metricsGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metricCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  metricLabel: { fontSize: 11, color: '#6b7280', marginTop: 8 },
  metricValue: { fontSize: 18, fontWeight: '900', color: '#0f5132', marginTop: 4 },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  driverDetails: { flex: 1 },
  driverName: { fontSize: 14, fontWeight: '900', color: '#0f5132' },
  driverRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  driverRatingText: { fontSize: 11, color: '#6b7280' },
  callButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  stopCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  stopMarker: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  stopInfo: { flex: 1 },
  stopName: { fontSize: 14, fontWeight: '900', color: '#0f5132' },
  stopDetail: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  emergencyButton: { backgroundColor: '#ef4444', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 },
  emergencyButtonText: { fontSize: 14, fontWeight: '900', color: '#ffffff' },
  completeButton: { backgroundColor: '#10b981', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  completeButtonText: { fontSize: 14, fontWeight: '900', color: '#ffffff' },
})
