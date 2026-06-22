import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { useFleetContext } from '../../context/fleet-context'
import { formatCurrency } from '../../lib/mock/fleetData'

export default function ChargingSessionScreen() {
  const router = useRouter()
  const { selectedVehicle, setActiveChargingSession } = useFleetContext()
  const [selectedStation, setSelectedStation] = useState('station-1')
  const [selectedConnector, setSelectedConnector] = useState('type-2')
  const [selectedDuration, setSelectedDuration] = useState(45)
  const [isCharging, setIsCharging] = useState(false)
  const [chargingProgress, setChargingProgress] = useState(0)

  const stations = [
    { id: 'station-1', name: 'Downtown Hub Station', location: 'Sector 5', distance: 0.8 },
    { id: 'station-2', name: 'Central Charging Hub', location: 'Zone 3', distance: 2.5 },
    { id: 'station-3', name: 'West Side Fast Charge', location: 'Westside', distance: 4.2 },
  ]

  const connectors = [
    { id: 'type-2', name: 'Type 2 (AC)', speed: 'Standard', time: '1.5 - 2h' },
    { id: 'ccs', name: 'CCS (DC)', speed: 'Fast', time: '30 - 45min' },
    { id: 'tesla', name: 'Tesla Supercharger', speed: 'Ultra-fast', time: '20 - 30min' },
  ]

  const durations = [30, 45, 60, 90, 120]

  const estimatedBatteryGain = Math.round((selectedDuration / 60) * 30) // rough estimate
  const estimatedCost = selectedDuration * 12 // ₹12 per minute estimate
  const selectedStationData = stations.find(s => s.id === selectedStation)!

  const handleStartCharging = () => {
    setIsCharging(true)
    setChargingProgress(0)

    // Simulate charging progress
    const interval = setInterval(() => {
      setChargingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsCharging(false)
          // Create session and navigate
          setActiveChargingSession({
            id: 'session-' + Date.now(),
            vehicleId: selectedVehicle?.id || '',
            stationName: selectedStationData.name,
            stationLocation: selectedStationData.location,
            startTime: new Date().toLocaleString(),
            endTime: '',
            batteryStart: selectedVehicle?.battery || 0,
            batteryEnd: Math.min((selectedVehicle?.battery || 0) + estimatedBatteryGain, 100),
            energyDelivered: (estimatedBatteryGain / 100) * 50, // rough energy
            cost: estimatedCost,
            status: 'completed',
          })
          setTimeout(() => router.push('/fleet-management/live-tracking'), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 500)
  }

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
          <Text style={styles.headerTitle}>Charging Session</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Vehicle Info */}
        <FleetCard style={styles.vehicleInfoCard}>
          <Text style={styles.vehicleName}>{selectedVehicle.name}</Text>
          <Text style={styles.vehicleDetail}>{selectedVehicle.number}</Text>
          <View style={styles.batteryInfo}>
            <Text style={styles.batteryLabel}>Current Battery</Text>
            <Text style={styles.batteryValue}>{selectedVehicle.battery}%</Text>
          </View>
        </FleetCard>

        {/* Charging Station Selection */}
        <SectionHeader title="Select Station" />
        {stations.map(station => (
          <Pressable key={station.id} style={[styles.stationCard, selectedStation === station.id && styles.stationCardActive]} onPress={() => setSelectedStation(station.id)}>
            <View style={styles.stationInfo}>
              <Text style={styles.stationName}>{station.name}</Text>
              <View style={styles.stationDetailRow}>
                <MaterialCommunityIcons name="map-marker" size={14} color="#6b7280" />
                <Text style={styles.stationLocation}>{station.location}</Text>
              </View>
            </View>
            <View style={styles.distanceTag}>
              <Text style={styles.distanceText}>{station.distance} km</Text>
            </View>
          </Pressable>
        ))}

        {/* Connector Type Selection */}
        <SectionHeader title="Select Connector" />
        <View style={styles.connectorsGrid}>
          {connectors.map(connector => (
            <Pressable key={connector.id} style={[styles.connectorCard, selectedConnector === connector.id && styles.connectorCardActive]} onPress={() => setSelectedConnector(connector.id)}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color={selectedConnector === connector.id ? '#ffffff' : '#10b981'} />
              <Text style={[styles.connectorName, selectedConnector === connector.id && styles.connectorNameActive]}>{connector.name}</Text>
              <Text style={[styles.connectorSpeed, selectedConnector === connector.id && styles.connectorSpeedActive]}>{connector.speed}</Text>
              <Text style={[styles.connectorTime, selectedConnector === connector.id && styles.connectorTimeActive]}>{connector.time}</Text>
            </Pressable>
          ))}
        </View>

        {/* Duration Selection */}
        <SectionHeader title="Charging Duration" />
        <View style={styles.durationGrid}>
          {durations.map(duration => (
            <Pressable key={duration} style={[styles.durationBadge, selectedDuration === duration && styles.durationBadgeActive]} onPress={() => setSelectedDuration(duration)}>
              <Text style={[styles.durationText, selectedDuration === duration && styles.durationTextActive]}>{duration}m</Text>
            </Pressable>
          ))}
        </View>

        {/* Charging Progress */}
        {isCharging && (
          <FleetCard style={styles.progressCard}>
            <Text style={styles.progressTitle}>Charging in Progress</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${Math.min(chargingProgress, 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.min(Math.round(chargingProgress), 100)}%</Text>
          </FleetCard>
        )}

        {/* Cost Estimation */}
        <FleetCard style={styles.estimationCard}>
          <Text style={styles.estimationTitle}>Charging Estimation</Text>
          <View style={styles.estimationRow}>
            <Text style={styles.estimationLabel}>Battery gain</Text>
            <Text style={styles.estimationValue}>+{estimatedBatteryGain}%</Text>
          </View>
          <View style={styles.estimationRow}>
            <Text style={styles.estimationLabel}>Estimated cost</Text>
            <Text style={styles.estimationValue}>{formatCurrency(estimatedCost)}</Text>
          </View>
          <View style={styles.estimationRow}>
            <Text style={styles.estimationLabel}>Final battery</Text>
            <Text style={styles.estimationValue}>{Math.min(selectedVehicle.battery + estimatedBatteryGain, 100)}%</Text>
          </View>
        </FleetCard>

        {/* Start Button */}
        <Pressable style={[styles.startButton, isCharging && styles.startButtonDisabled]} disabled={isCharging} onPress={handleStartCharging}>
          <MaterialCommunityIcons name={isCharging ? 'timer' : 'battery-charging'} size={20} color="#ffffff" />
          <Text style={styles.startButtonText}>{isCharging ? 'Charging...' : 'Start Charging'}</Text>
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
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0f5132' },
  vehicleInfoCard: { marginBottom: 16 },
  vehicleName: { fontSize: 16, fontWeight: '900', color: '#0f5132' },
  vehicleDetail: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  batteryInfo: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e2efe5' },
  batteryLabel: { fontSize: 11, color: '#6b7280' },
  batteryValue: { fontSize: 18, fontWeight: '900', color: '#10b981', marginTop: 4 },
  stationCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderColor: '#e2efe5' },
  stationCardActive: { borderColor: '#10b981', backgroundColor: '#f0fdf4' },
  stationInfo: { flex: 1 },
  stationName: { fontSize: 14, fontWeight: '900', color: '#0f5132' },
  stationDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  stationLocation: { fontSize: 12, color: '#6b7280' },
  distanceTag: { backgroundColor: '#edf9f1', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  distanceText: { fontSize: 11, fontWeight: '600', color: '#10b981' },
  connectorsGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  connectorCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 12, padding: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#e2efe5' },
  connectorCardActive: { borderColor: '#10b981', backgroundColor: '#10b981' },
  connectorName: { fontSize: 12, fontWeight: '600', color: '#0f5132', marginTop: 8 },
  connectorNameActive: { color: '#ffffff' },
  connectorSpeed: { fontSize: 10, color: '#6b7280', marginTop: 2 },
  connectorSpeedActive: { color: 'rgba(255,255,255,0.8)' },
  connectorTime: { fontSize: 10, color: '#9ca3af', marginTop: 2 },
  connectorTimeActive: { color: 'rgba(255,255,255,0.7)' },
  durationGrid: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  durationBadge: { backgroundColor: '#ffffff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 2, borderColor: '#e2efe5' },
  durationBadgeActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  durationText: { fontSize: 13, fontWeight: '600', color: '#0f5132' },
  durationTextActive: { color: '#ffffff' },
  progressCard: { marginBottom: 16 },
  progressTitle: { fontSize: 14, fontWeight: '900', color: '#0f5132', marginBottom: 12 },
  progressBarContainer: { height: 10, backgroundColor: '#e2efe5', borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  progressBar: { height: '100%', backgroundColor: '#10b981' },
  progressText: { fontSize: 16, fontWeight: '900', color: '#10b981', textAlign: 'center' },
  estimationCard: { marginBottom: 16 },
  estimationTitle: { fontSize: 14, fontWeight: '900', color: '#0f5132', marginBottom: 12 },
  estimationRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e2efe5' },
  estimationLabel: { fontSize: 12, color: '#6b7280' },
  estimationValue: { fontSize: 14, fontWeight: '900', color: '#0f5132' },
  startButton: { backgroundColor: '#10b981', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  startButtonDisabled: { opacity: 0.6 },
  startButtonText: { fontSize: 14, fontWeight: '900', color: '#ffffff' },
})
