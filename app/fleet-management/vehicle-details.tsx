import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { getVehicleStatusColor } from '../../lib/mock/fleetData'
import { useFleetOps } from './FleetOpsContext'

export default function VehicleDetailsScreen() {
  const router = useRouter()
  const { currentVehicle, getVehicleDrivers, setSelectedDriverForKycId } = useFleetOps()
  const selectedVehicle = currentVehicle
  const assignedDrivers = getVehicleDrivers(selectedVehicle.id)

  if (!selectedVehicle) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <Text style={styles.emptyText}>No vehicle selected</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={24} color="#1f2937" />
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  const statusColor = getVehicleStatusColor(selectedVehicle.status)

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header with Back Button */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={24} color="#1f2937" />
          </Pressable>
          <Text style={styles.headerTitle}>Vehicle Details</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Vehicle Image Placeholder */}
        <FleetCard style={styles.vehicleImageCard}>
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="car-electric" size={80} color="#10b981" />
          </View>
          <Text style={styles.imageLabel}>{selectedVehicle.imageLabel}</Text>
        </FleetCard>

        {/* Vehicle Identity */}
        <FleetCard style={styles.identityCard}>
          <Text style={styles.vehicleName}>{selectedVehicle.name}</Text>
          <Text style={styles.vehicleModel}>{selectedVehicle.model}</Text>
          <View style={styles.numberPlateContainer}>
            <Text style={styles.numberPlate}>{selectedVehicle.number}</Text>
          </View>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <MaterialCommunityIcons name="shield-check" size={10} color="#ffffff" />
              <Text style={styles.statusBadgeText}>{selectedVehicle.status.replace('-', ' ')}</Text>
            </View>
            <Text style={styles.mileageText}>{selectedVehicle.currentMileage.toLocaleString()} km</Text>
          </View>
        </FleetCard>

        {/* Battery Status */}
        <FleetCard>
          <SectionHeader title="Battery Status" />
          <View style={styles.batteryStatusContainer}>
            <View style={styles.batteryCircle}>
              <Text style={styles.batteryPercentage}>{selectedVehicle.battery}%</Text>
            </View>
            <View style={styles.batteryInfo}>
              <Text style={styles.batteryRangeLabel}>Estimated Range</Text>
              <Text style={styles.batteryRangeValue}>{selectedVehicle.estimatedRange} km</Text>
              <Text style={styles.batteryHealth}>Last charged: {selectedVehicle.lastChargeTime}</Text>
            </View>
          </View>
          <View style={styles.batteryBar}>
            <View style={[styles.batteryFill, { width: `${selectedVehicle.battery}%`, backgroundColor: statusColor }]} />
          </View>
        </FleetCard>

        {/* Location & Trip */}
        <FleetCard>
          <SectionHeader title="Location & Trip" />
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#10b981" />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Current Location</Text>
              <Text style={styles.infoValue}>{selectedVehicle.location}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker-path" size={18} color="#10b981" />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Trip Status</Text>
              <Text style={styles.infoValue}>{selectedVehicle.tripStatus}</Text>
            </View>
          </View>
        </FleetCard>

        {/* Driver Information */}
        <FleetCard>
          <SectionHeader title="Driver Assignment" />
          {assignedDrivers.length === 0 ? <Text style={styles.driverEmail}>No assigned drivers for this vehicle.</Text> : null}
          {assignedDrivers.map(driver => (
            <View key={driver.id} style={styles.driverInfoContainer}>
              <View style={styles.driverAvatar}>
                <MaterialCommunityIcons name="account-tie" size={50} color="#10b981" />
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverEmail}>Contact: +91 {driver.mobileNumber}</Text>
                <Text style={styles.driverStatus}>KYC: {driver.kycStatus} • Verification: {driver.verificationStatus}</Text>
                <Text style={styles.driverEmail}>Shift: {driver.shift ?? 'Not assigned'} • {driver.shiftDuration ?? 'Not set'}</Text>
                <Pressable
                  style={styles.kycLinkButton}
                  onPress={() => {
                    setSelectedDriverForKycId(driver.id)
                    router.push('/fleet-management/driver-kyc')
                  }}
                >
                  <Text style={styles.kycLinkText}>Open Driver KYC</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </FleetCard>

        {/* Maintenance Status */}
        <FleetCard>
          <SectionHeader title="Maintenance Status" />
          <View style={styles.maintenanceStatusRow}>
            <View
              style={[
                styles.maintenanceIcon,
                { backgroundColor: selectedVehicle.maintenanceStatus === 'good' ? '#d1fae5' : selectedVehicle.maintenanceStatus === 'warning' ? '#fef3c7' : '#fee2e2' },
              ]}
            >
              <MaterialCommunityIcons
                name={selectedVehicle.maintenanceStatus === 'good' ? 'shield-check' : selectedVehicle.maintenanceStatus === 'warning' ? 'clock-outline' : 'file-document'}
                size={20}
                color={selectedVehicle.maintenanceStatus === 'good' ? '#10b981' : selectedVehicle.maintenanceStatus === 'warning' ? '#f59e0b' : '#ef4444'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.maintenanceLabel}>Status: {selectedVehicle.maintenanceStatus}</Text>
              <Text style={styles.maintenanceDate}>Next service: {selectedVehicle.nextServiceDate}</Text>
            </View>
          </View>
        </FleetCard>

        {/* Action Buttons */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.actionButtonsContainer}>
          <Pressable
            style={styles.actionButtonLarge}
            onPress={() => {
              // Start charging flow
              router.push('/fleet-management/charging-session')
            }}
          >
            <MaterialCommunityIcons name="battery-charging" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Start Charging</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButtonLarge, styles.actionButtonSecondary]}
            onPress={() => {
              router.push('/fleet-management/live-tracking')
            }}
          >
            <MaterialCommunityIcons name="map-marker" size={20} color="#10b981" />
            <Text style={[styles.actionButtonText, styles.actionButtonSecondaryText]}>Track Vehicle</Text>
          </Pressable>

          <Pressable style={[styles.actionButtonLarge, styles.actionButtonSecondary]} onPress={() => router.push('/fleet-management/vehicles')}>
            <MaterialCommunityIcons name="account-tie" size={20} color="#10b981" />
            <Text style={[styles.actionButtonText, styles.actionButtonSecondaryText]}>Assign Driver</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButtonLarge, styles.actionButtonSecondary]}
            onPress={() => {
              router.push('/fleet-management/history')
            }}
          >
            <MaterialCommunityIcons name="clock-outline" size={20} color="#10b981" />
            <Text style={[styles.actionButtonText, styles.actionButtonSecondaryText]}>View History</Text>
          </Pressable>
        </View>
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
  emptyText: { fontSize: 16, color: '#6b7280', textAlign: 'center', fontWeight: '500' },
  vehicleImageCard: { alignItems: 'center', paddingVertical: 24, marginBottom: 12 },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  imageLabel: { fontSize: 12, color: '#6b7280' },
  identityCard: { marginBottom: 12 },
  vehicleName: { fontSize: 20, fontWeight: '900', color: '#0f5132' },
  vehicleModel: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  numberPlateContainer: { backgroundColor: '#fff3cd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 8 },
  numberPlate: { fontSize: 14, fontWeight: '900', color: '#f59e0b', textAlign: 'center', letterSpacing: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  statusBadgeText: { color: '#ffffff', fontWeight: '900', fontSize: 11, textTransform: 'capitalize' },
  mileageText: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  batteryStatusContainer: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  batteryCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  batteryPercentage: { fontSize: 28, fontWeight: '900', color: '#10b981' },
  batteryInfo: { flex: 1 },
  batteryRangeLabel: { fontSize: 12, color: '#6b7280' },
  batteryRangeValue: { fontSize: 18, fontWeight: '900', color: '#0f5132', marginTop: 2 },
  batteryHealth: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  batteryBar: { height: 8, backgroundColor: '#e2efe5', borderRadius: 4, overflow: 'hidden' },
  batteryFill: { height: '100%' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e2efe5' },
  infoLabel: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#0f5132', marginTop: 4 },
  driverInfoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  driverDetails: { flex: 1 },
  driverName: { fontSize: 14, fontWeight: '900', color: '#0f5132' },
  driverEmail: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  driverStatus: { fontSize: 11, color: '#10b981', fontWeight: '600', marginTop: 4 },
  kycLinkButton: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: '#edf9f1', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  kycLinkText: { fontSize: 11, fontWeight: '800', color: '#0f5132' },
  maintenanceStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  maintenanceIcon: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  maintenanceLabel: { fontSize: 12, fontWeight: '600', color: '#0f5132' },
  maintenanceDate: { fontSize: 11, color: '#6b7280', marginTop: 4 },
  actionButtonsContainer: { gap: 10, marginBottom: 20 },
  actionButtonLarge: { backgroundColor: '#10b981', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  actionButtonSecondary: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2efe5' },
  actionButtonText: { fontSize: 14, fontWeight: '900', color: '#ffffff' },
  actionButtonSecondaryText: { color: '#10b981' },
})
