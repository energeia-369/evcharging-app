import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFleetOps } from './FleetOpsContext'

export default function AssignVehicleScreen() {
  const router = useRouter()
  const { bookingDraft, assignment, currentDriver, currentVehicle, fleetDrivers, fleetVehicles, setAssignment, startTrip } = useFleetOps()
  const availableVehicles = useMemo(() => fleetVehicles.filter(vehicle => vehicle.status !== 'maintenance'), [fleetVehicles])
  const availableDrivers = useMemo(() => fleetDrivers.filter(driver => driver.availability !== 'off-duty'), [fleetDrivers])
  const recommendedVehicle = useMemo(() => [...availableVehicles].sort((left, right) => right.battery - left.battery)[0] ?? currentVehicle, [availableVehicles, currentVehicle])
  const recommendedDriver = useMemo(() => [...availableDrivers].sort((left, right) => right.rating - left.rating)[0] ?? currentDriver, [availableDrivers, currentDriver])
  const [selectedVehicleId, setSelectedVehicleId] = useState(assignment.vehicleId)
  const [selectedDriverId, setSelectedDriverId] = useState(assignment.driverId)
  const selectableDrivers = useMemo(
    () => availableDrivers.filter(driver => !driver.vehicleId || driver.vehicleId === selectedVehicleId),
    [availableDrivers, selectedVehicleId],
  )

  function handleAssignNow() {
    setAssignment({ vehicleId: selectedVehicleId, driverId: selectedDriverId })
  }

  function handleStartTrip() {
    setAssignment({ vehicleId: selectedVehicleId, driverId: selectedDriverId })
    startTrip()
    router.push('/fleet-management/tracking')
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>Smart Assignment</Text>
            <Text style={styles.headerTitle}>Assign vehicle and driver</Text>
            <Text style={styles.headerSubtitle}>Choose the best EV, driver, and shift pairing for this trip.</Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name={'clipboard-check' as any} size={24} color="#ffffff" />
          </View>
        </View>

        <View style={styles.recommendationRow}>
          <View style={styles.recommendationBadge}>
            <MaterialCommunityIcons name={'shield-check' as any} size={16} color="#10b981" />
            <Text style={styles.recommendationText}>AI Recommended Assignment</Text>
          </View>
        </View>

        <View style={styles.dualCardRow}>
          <View style={styles.quickCard}>
            <MaterialCommunityIcons name={'car-electric' as any} size={20} color="#10b981" />
            <Text style={styles.quickCardLabel}>Recommended Vehicle</Text>
            <Text style={styles.quickCardValue}>{recommendedVehicle.number}</Text>
          </View>
          <View style={styles.quickCard}>
            <MaterialCommunityIcons name={'account-tie' as any} size={20} color="#10b981" />
            <Text style={styles.quickCardLabel}>Recommended Driver</Text>
            <Text style={styles.quickCardValue}>{recommendedDriver.name}</Text>
          </View>
        </View>

        <View style={styles.bookingPreview}>
          <Text style={styles.previewTitle}>Trip Request</Text>
          <Text style={styles.previewText}>{bookingDraft.passengerName} • {bookingDraft.pickupLocation} → {bookingDraft.dropLocation}</Text>
          <View style={styles.previewMetrics}>
            <View style={styles.previewPill}><MaterialCommunityIcons name={'flash' as any} size={14} color="#10b981" /><Text style={styles.previewPillText}>{bookingDraft.vehicleType}</Text></View>
            <View style={styles.previewPill}><MaterialCommunityIcons name={'cash' as any} size={14} color="#10b981" /><Text style={styles.previewPillText}>₹{bookingDraft.estimatedFare.toLocaleString('en-IN')}</Text></View>
            <View style={styles.previewPill}><MaterialCommunityIcons name={'clock-outline' as any} size={14} color="#10b981" /><Text style={styles.previewPillText}>{bookingDraft.scheduledAt}</Text></View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Available Vehicles</Text>
        {availableVehicles.map(vehicle => {
          const isSelected = vehicle.id === selectedVehicleId
          return (
            <Pressable key={vehicle.id} style={[styles.optionCard, isSelected && styles.optionCardSelected]} onPress={() => setSelectedVehicleId(vehicle.id)}>
              <View style={styles.optionHeader}>
                <View style={styles.optionIcon}>
                  <MaterialCommunityIcons name={'truck' as any} size={18} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>{vehicle.number}</Text>
                  <Text style={styles.optionSubtitle}>{vehicle.name}</Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreBadgeText}>{vehicle.battery}%</Text>
                </View>
              </View>
              <View style={styles.optionDetailRow}>
                <MaterialCommunityIcons name={'battery-charging' as any} size={16} color="#10b981" />
                <Text style={styles.optionDetailText}>Battery level</Text>
              </View>
              <View style={styles.optionDetailRow}>
                <MaterialCommunityIcons name={'clipboard-check' as any} size={16} color="#10b981" />
                <Text style={styles.optionDetailText}>Condition: {vehicle.maintenanceStatus}</Text>
              </View>
              <View style={styles.optionDetailRow}>
                <MaterialCommunityIcons name={'map-marker' as any} size={16} color="#10b981" />
                <Text style={styles.optionDetailText}>Range: {vehicle.estimatedRange} km</Text>
              </View>
            </Pressable>
          )
        })}

        <Text style={styles.sectionTitle}>Available Drivers</Text>
        {selectableDrivers.map(driver => {
          const isSelected = driver.id === selectedDriverId
          return (
            <Pressable key={driver.id} style={[styles.optionCard, isSelected && styles.optionCardSelected]} onPress={() => setSelectedDriverId(driver.id)}>
              <View style={styles.optionHeader}>
                <View style={styles.optionIcon}>
                  <MaterialCommunityIcons name={'account-tie' as any} size={18} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>{driver.name}</Text>
                  <Text style={styles.optionSubtitle}>{driver.email}</Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreBadgeText}>{driver.rating.toFixed(1)}</Text>
                </View>
              </View>
              <View style={styles.optionDetailRow}>
                <MaterialCommunityIcons name={'shield-check' as any} size={16} color="#10b981" />
                <Text style={styles.optionDetailText}>Shift: {driver.shift ?? driver.availability.replace('-', ' ')}</Text>
              </View>
              <View style={styles.optionDetailRow}>
                <MaterialCommunityIcons name={'clock-outline' as any} size={16} color="#10b981" />
                <Text style={styles.optionDetailText}>Assigned vehicle: {driver.vehicleId ?? 'None'}</Text>
              </View>
            </Pressable>
          )
        })}

        <View style={styles.buttonRow}>
          <Pressable style={styles.secondaryButton} onPress={handleAssignNow}>
            <MaterialCommunityIcons name={'clipboard-check' as any} size={16} color="#ffffff" />
            <Text style={styles.secondaryButtonText}>Assign Now</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={handleStartTrip}>
            <MaterialCommunityIcons name={'qrcode-scan' as any} size={16} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Start Trip</Text>
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
  recommendationRow: { marginBottom: 12 },
  recommendationBadge: { alignSelf: 'flex-start', backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  recommendationText: { color: '#059669', fontWeight: '900', fontSize: 11 },
  dualCardRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  quickCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#dbe7dd' },
  quickCardLabel: { color: '#6b7280', fontSize: 11, marginTop: 8 },
  quickCardValue: { color: '#0f5132', fontSize: 13, fontWeight: '900', marginTop: 4 },
  bookingPreview: { backgroundColor: '#0f5132', borderRadius: 20, padding: 16, marginBottom: 16 },
  previewTitle: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
  previewText: { color: '#d5f4e7', fontSize: 12, lineHeight: 18, marginTop: 6 },
  previewMetrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  previewPill: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 6 },
  previewPillText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  sectionTitle: { color: '#0f5132', fontSize: 15, fontWeight: '900', marginBottom: 10 },
  optionCard: { backgroundColor: '#ffffff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#dbe7dd', marginBottom: 12 },
  optionCardSelected: { borderColor: '#10b981', backgroundColor: '#f0fbf5' },
  optionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  optionIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  optionTitle: { color: '#0f5132', fontSize: 14, fontWeight: '900' },
  optionSubtitle: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  scoreBadge: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  scoreBadgeText: { color: '#059669', fontSize: 11, fontWeight: '900' },
  optionDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  optionDetailText: { color: '#4f6952', fontSize: 12, lineHeight: 17 },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  secondaryButton: { flex: 1, backgroundColor: '#0f5132', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  primaryButton: { flex: 1, backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
})
