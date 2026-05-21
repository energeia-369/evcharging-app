import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { chargingSessions, vehicles } from '../../lib/mock/fleetData'

export default function ChargingScreen() {
  const availableVehicles = useMemo(() => vehicles.filter(vehicle => vehicle.status !== 'maintenance'), [])
  const [selectedVehicleId, setSelectedVehicleId] = useState(availableVehicles[0]?.id ?? vehicles[0]?.id ?? '')
  const selectedVehicle = useMemo(() => vehicles.find(vehicle => vehicle.id === selectedVehicleId) ?? availableVehicles[0] ?? vehicles[0], [availableVehicles, selectedVehicleId])
  const activeSession = chargingSessions.find(session => session.status === 'in-progress') ?? chargingSessions[0]

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>Vehicle Charging</Text>
            <Text style={styles.headerTitle}>Charging operations</Text>
            <Text style={styles.headerSubtitle}>Monitor chargers, vehicle queues, and battery health predictions.</Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name={'battery-charging' as any} size={24} color="#ffffff" />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'flash' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Fast Charging</Text>
            <Text style={styles.statValue}>Available</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'chart-line' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Battery Health</Text>
            <Text style={styles.statValue}>82%</Text>
          </View>
        </View>

        <FleetCard style={styles.sessionCard}>
          <View style={styles.sessionRow}>
            <View style={styles.sessionIcon}>
              <MaterialCommunityIcons name={'battery-charging' as any} size={22} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionLabel}>Current Charging Session</Text>
              <Text style={styles.sessionTitle}>{activeSession.stationName}</Text>
              <Text style={styles.sessionSubtitle}>{activeSession.stationLocation}</Text>
            </View>
            <View style={styles.sessionBadge}>
              <Text style={styles.sessionBadgeText}>{activeSession.status}</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${activeSession.batteryEnd}%` }]} />
          </View>
        </FleetCard>

        <SectionHeader title="Available Chargers" subtitle="Pick a vehicle and start or schedule charging." />
        <View style={styles.vehiclePicker}>
          {availableVehicles.map(vehicle => {
            const isSelected = vehicle.id === selectedVehicleId
            return (
              <Pressable key={vehicle.id} style={[styles.vehicleOption, isSelected && styles.vehicleOptionActive]} onPress={() => setSelectedVehicleId(vehicle.id)}>
                <View style={styles.vehicleOptionHeader}>
                  <MaterialCommunityIcons name={'truck' as any} size={18} color="#10b981" />
                  <Text style={styles.vehicleOptionTitle}>{vehicle.number}</Text>
                </View>
                <Text style={styles.vehicleOptionText}>{vehicle.name}</Text>
                <Text style={styles.vehicleOptionText}>{vehicle.battery}% battery • {vehicle.status}</Text>
              </Pressable>
            )
          })}
        </View>

        <FleetCard style={styles.selectedCard}>
          <Text style={styles.sectionCardTitle}>Charging Estimate</Text>
          <View style={styles.estimateRow}>
            <View style={styles.estimatePill}>
              <MaterialCommunityIcons name={'clock-outline' as any} size={14} color="#10b981" />
              <Text style={styles.estimateText}>45 mins</Text>
            </View>
            <View style={styles.estimatePill}>
              <MaterialCommunityIcons name={'cash' as any} size={14} color="#10b981" />
              <Text style={styles.estimateText}>₹{Math.round((100 - selectedVehicle.battery) * 9).toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.estimatePill}>
              <MaterialCommunityIcons name={'shield-check' as any} size={14} color="#10b981" />
              <Text style={styles.estimateText}>Health {selectedVehicle.maintenanceStatus}</Text>
            </View>
          </View>
          <View style={styles.healthBox}>
            <Text style={styles.healthText}>Battery prediction: ready for next trip after a rapid DC charge cycle.</Text>
          </View>
        </FleetCard>

        <FleetCard style={styles.historyCard}>
          <Text style={styles.sectionCardTitle}>Charging History</Text>
          {chargingSessions.map(session => (
            <View key={session.id} style={styles.historyRow}>
              <View style={styles.historyIcon}>
                <MaterialCommunityIcons name={'battery-charging' as any} size={18} color="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>{session.stationName}</Text>
                <Text style={styles.historyMeta}>{session.startTime} • {session.endTime}</Text>
              </View>
              <Text style={styles.historyValue}>{session.batteryEnd}%</Text>
            </View>
          ))}
        </FleetCard>

        <View style={styles.buttonRow}>
          <Pressable style={styles.secondaryButton} onPress={() => Alert.alert('Mock charging', `Start charging ${selectedVehicle.number} at the selected station.`)}>
            <MaterialCommunityIcons name={'battery-charging' as any} size={16} color="#ffffff" />
            <Text style={styles.secondaryButtonText}>Start Charging</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={() => Alert.alert('Mock charging', `Schedule charging for ${selectedVehicle.number} in the next available slot.`)}>
            <MaterialCommunityIcons name={'clock-outline' as any} size={16} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Schedule Charging</Text>
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
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#dbe7dd' },
  statLabel: { color: '#6b7280', fontSize: 11, marginTop: 8 },
  statValue: { color: '#0f5132', fontSize: 15, fontWeight: '900', marginTop: 4 },
  sessionCard: { marginBottom: 16 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  sessionIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  sessionLabel: { color: '#6b7280', fontSize: 11, fontWeight: '800' },
  sessionTitle: { color: '#0f5132', fontSize: 14, fontWeight: '900', marginTop: 4 },
  sessionSubtitle: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  sessionBadge: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  sessionBadgeText: { color: '#059669', fontSize: 11, fontWeight: '900', textTransform: 'capitalize' },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: '#e2efe5', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#10b981' },
  vehiclePicker: { gap: 10, marginBottom: 16 },
  vehicleOption: { backgroundColor: '#ffffff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#dbe7dd' },
  vehicleOptionActive: { backgroundColor: '#f0fbf5', borderColor: '#10b981' },
  vehicleOptionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  vehicleOptionTitle: { color: '#0f5132', fontSize: 14, fontWeight: '900' },
  vehicleOptionText: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  selectedCard: { marginBottom: 16 },
  sectionCardTitle: { color: '#0f5132', fontSize: 14, fontWeight: '900', marginBottom: 12 },
  estimateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  estimatePill: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  estimateText: { color: '#0f5132', fontSize: 11, fontWeight: '800' },
  healthBox: { borderRadius: 16, backgroundColor: '#f8fcf9', borderWidth: 1, borderColor: '#e2efe5', padding: 12 },
  healthText: { color: '#4f6952', fontSize: 12, lineHeight: 18, fontWeight: '700' },
  historyCard: { marginBottom: 16 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  historyIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  historyTitle: { color: '#0f5132', fontSize: 13, fontWeight: '900' },
  historyMeta: { color: '#6b7280', fontSize: 11, marginTop: 2 },
  historyValue: { color: '#10b981', fontSize: 13, fontWeight: '900' },
  buttonRow: { flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, backgroundColor: '#0f5132', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  primaryButton: { flex: 1, backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
})
