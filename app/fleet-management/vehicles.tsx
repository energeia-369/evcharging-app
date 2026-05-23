import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { useFleetOps } from './FleetOpsContext'

type VehicleTab = 'all' | 'available' | 'in-trip' | 'charging' | 'maintenance'
type DriverTab = 'all' | 'available' | 'on-trip' | 'off-duty'

const vehicleTabs: VehicleTab[] = ['all', 'available', 'in-trip', 'charging', 'maintenance']
const driverTabs: DriverTab[] = ['all', 'available', 'on-trip', 'off-duty']

export default function VehiclesScreen() {
  const router = useRouter()
  const {
    addDriver,
    assignDriverShift,
    fleetDrivers,
    fleetVehicles,
    removeDriver,
    setAssignment,
    setSelectedDriverForKycId,
    setSelectedVehicleForKycId,
    shiftDurations,
    shiftSlots,
    updateDriver,
  } = useFleetOps()
  const [query, setQuery] = useState('')
  const [vehicleTab, setVehicleTab] = useState<VehicleTab>('all')
  const [driverTab, setDriverTab] = useState<DriverTab>('all')
  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(null)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null)
  const [driverNameInput, setDriverNameInput] = useState('')
  const [mobileInput, setMobileInput] = useState('')
  const [aadhaarInput, setAadhaarInput] = useState('')
  const [licenseInput, setLicenseInput] = useState('')
  const [bankInput, setBankInput] = useState('')
  const [emergencyInput, setEmergencyInput] = useState('')
  const [selectedVehicleIdForDriver, setSelectedVehicleIdForDriver] = useState<string | null>(null)
  const [selectedShift, setSelectedShift] = useState<(typeof shiftSlots)[number]>('Morning shift')
  const [selectedDuration, setSelectedDuration] = useState<(typeof shiftDurations)[number]>('8 hour shift')

  const filteredVehicles = useMemo(() => {
    return fleetVehicles.filter(vehicle => {
      const driverNames = fleetDrivers.filter(driver => driver.vehicleId === vehicle.id).map(driver => driver.name).join(' ')
      const matchesQuery = [vehicle.name, vehicle.number, driverNames, vehicle.model].some(value =>
        value.toLowerCase().includes(query.trim().toLowerCase()),
      )
      const matchesTab = vehicleTab === 'all' || vehicle.status === vehicleTab
      return matchesQuery && matchesTab
    })
  }, [fleetDrivers, fleetVehicles, query, vehicleTab])

  const filteredDrivers = useMemo(() => {
    return fleetDrivers.filter(driver => {
      const matchesQuery = [driver.name, driver.email, driver.phone].some(value => value.toLowerCase().includes(query.trim().toLowerCase()))
      const matchesTab = driverTab === 'all' || driver.availability === driverTab
      return matchesQuery && matchesTab
    })
  }, [driverTab, fleetDrivers, query])

  function handleAssign(vehicleId: string, driverId: string) {
    setAssignment({ vehicleId, driverId })
    router.push('/fleet-management/assign-vehicle')
  }

  function openDriverModal(vehicleId: string | null, driverId?: string) {
    if (driverId) {
      const selectedDriver = fleetDrivers.find(driver => driver.id === driverId)
      if (selectedDriver) {
        setEditingDriverId(driverId)
        setDriverNameInput(selectedDriver.name)
        setMobileInput(selectedDriver.mobileNumber)
        setAadhaarInput(selectedDriver.aadhaarNumber)
        setLicenseInput(selectedDriver.licenseNumber)
        setBankInput(selectedDriver.bankDetails)
        setEmergencyInput(selectedDriver.emergencyContact)
        setSelectedVehicleIdForDriver(selectedDriver.vehicleId)
        setSelectedShift(selectedDriver.shift ?? 'Morning shift')
        setSelectedDuration(selectedDriver.shiftDuration ?? '8 hour shift')
      }
    } else {
      setEditingDriverId(null)
      setDriverNameInput('')
      setMobileInput('')
      setAadhaarInput('')
      setLicenseInput('')
      setBankInput('')
      setEmergencyInput('')
      setSelectedVehicleIdForDriver(vehicleId)
      setSelectedShift('Morning shift')
      setSelectedDuration('8 hour shift')
    }

    setShowDriverModal(true)
  }

  function closeDriverModal() {
    setShowDriverModal(false)
    setEditingDriverId(null)
  }

  function saveDriver() {
    const payload = {
      driverName: driverNameInput,
      mobileNumber: mobileInput,
      aadhaarNumber: aadhaarInput,
      licenseNumber: licenseInput,
      bankDetails: bankInput,
      emergencyContact: emergencyInput,
      vehicleId: selectedVehicleIdForDriver,
      shift: selectedShift,
      shiftDuration: selectedDuration,
    }

    const result = editingDriverId ? updateDriver(editingDriverId, payload) : addDriver(payload)
    if (!result.ok) {
      Alert.alert('Validation', result.message)
      return
    }

    const targetDriverId = editingDriverId ?? result.driverId
    if (targetDriverId && selectedVehicleIdForDriver) {
      assignDriverShift({
        driverId: targetDriverId,
        vehicleId: selectedVehicleIdForDriver,
        shift: selectedShift,
        shiftDuration: selectedDuration,
      })
    }

    Alert.alert('Saved', result.message)
    closeDriverModal()
  }

  function onAddVehicle() {
    setSelectedVehicleForKycId(null)
    router.push('/fleet-management/vehicle-kyc')
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.kicker}>Fleet Operations</Text>
            <Text style={styles.headerTitle}>Vehicles & Drivers</Text>
            <Text style={styles.headerSubtitle}>Manage your connected EV fleet, availability, and assignments.</Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name={'truck' as any} size={24} color="#ffffff" />
          </View>
        </View>

        <FleetCard style={styles.searchCard}>
          <View style={styles.searchInputRow}>
            <MaterialCommunityIcons name={'map-marker' as any} size={18} color="#059669" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search vehicles, drivers, numbers"
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
            />
          </View>
        </FleetCard>

        <SectionHeader title="Vehicle Filters" subtitle="Filter by live operational status." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {vehicleTabs.map(tab => (
            <Pressable key={tab} style={[styles.chip, vehicleTab === tab && styles.chipActive]} onPress={() => setVehicleTab(tab)}>
              <Text style={[styles.chipText, vehicleTab === tab && styles.chipTextActive]}>{tab.replace('-', ' ')}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton} onPress={onAddVehicle}>
            <MaterialCommunityIcons name={'car-electric' as any} size={16} color="#ffffff" />
            <Text style={styles.actionButtonText}>Add Vehicle</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => openDriverModal(null)}>
            <MaterialCommunityIcons name={'account-tie' as any} size={16} color="#ffffff" />
            <Text style={styles.actionButtonText}>Add Driver</Text>
          </Pressable>
        </View>

        <SectionHeader title="Vehicle Cards" subtitle="Expandable cards with driver list sections and KYC status." />
        {filteredVehicles.map(vehicle => {
          const assignedDrivers = fleetDrivers.filter(driver => driver.vehicleId === vehicle.id)
          const isExpanded = expandedVehicleId === vehicle.id
          const statusColor = vehicle.status === 'available' ? '#10b981' : vehicle.status === 'charging' ? '#0ea5e9' : vehicle.status === 'maintenance' ? '#ef4444' : vehicle.status === 'in-trip' ? '#8b5cf6' : '#f59e0b'
          return (
            <View key={vehicle.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.cardIconWrap}>
                  <MaterialCommunityIcons name={'car-electric' as any} size={20} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{vehicle.number}</Text>
                  <Text style={styles.cardSubtitle}>{vehicle.name}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusBadgeText}>{vehicle.status.replace('-', ' ')}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <MaterialCommunityIcons name={'battery-charging' as any} size={16} color="#059669" />
                <Text style={styles.detailText}>{vehicle.battery}% battery</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name={'map-marker' as any} size={16} color="#059669" />
                <Text style={styles.detailText}>{vehicle.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name={'account-tie' as any} size={16} color="#059669" />
                <Text style={styles.detailText}>Assigned Drivers: {assignedDrivers.length}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name={'clipboard-check' as any} size={16} color="#059669" />
                <Text style={styles.detailText}>Vehicle KYC: {vehicle.kycStatus}</Text>
              </View>

              <View style={styles.vehicleActionRow}>
                <Pressable style={styles.secondaryButton} onPress={() => openDriverModal(vehicle.id)}>
                  <MaterialCommunityIcons name={'plus-circle' as any} size={16} color="#ffffff" />
                  <Text style={styles.secondaryButtonText}>Add Driver</Text>
                </Pressable>
                <Pressable style={styles.secondaryButton} onPress={() => setExpandedVehicleId(isExpanded ? null : vehicle.id)}>
                  <MaterialCommunityIcons name={(isExpanded ? 'chevron-up' : 'chevron-down') as any} size={16} color="#ffffff" />
                  <Text style={styles.secondaryButtonText}>{isExpanded ? 'Hide Drivers' : 'View Drivers'}</Text>
                </Pressable>
              </View>

              {isExpanded ? (
                <View style={styles.driverSection}>
                  <Text style={styles.driverSectionTitle}>Assigned Drivers</Text>
                  {assignedDrivers.length === 0 ? <Text style={styles.emptyDriverText}>No drivers assigned yet.</Text> : null}
                  {assignedDrivers.map(driver => (
                    <View key={driver.id} style={styles.assignedDriverCard}>
                      <View style={styles.driverRowTop}>
                        <Text style={styles.assignedDriverName}>{driver.name}</Text>
                        <View style={styles.kycBadge}>
                          <Text style={styles.kycBadgeText}>{driver.kycStatus}</Text>
                        </View>
                      </View>
                      <Text style={styles.assignedDriverMeta}>Shift: {driver.shift ?? 'Not assigned'} • {driver.shiftDuration ?? 'Not set'}</Text>
                      <Text style={styles.assignedDriverMeta}>Verification: {driver.verificationStatus}</Text>
                      <Text style={styles.assignedDriverMeta}>Contact: +91 {driver.mobileNumber}</Text>
                      <View style={styles.rowButtons}>
                        <Pressable
                          style={styles.miniButton}
                          onPress={() => {
                            setSelectedDriverForKycId(driver.id)
                            router.push('/fleet-management/driver-kyc')
                          }}
                        >
                          <Text style={styles.miniButtonText}>KYC</Text>
                        </Pressable>
                        <Pressable style={styles.miniButton} onPress={() => openDriverModal(vehicle.id, driver.id)}>
                          <Text style={styles.miniButtonText}>Edit</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.miniButton, styles.miniButtonDanger]}
                          onPress={() => {
                            const removeResult = removeDriver(driver.id)
                            if (!removeResult.ok) {
                              Alert.alert('Error', removeResult.message)
                              return
                            }
                            Alert.alert('Updated', removeResult.message)
                          }}
                        >
                          <Text style={styles.miniButtonText}>Remove</Text>
                        </Pressable>
                        <Pressable style={styles.miniButton} onPress={() => handleAssign(vehicle.id, driver.id)}>
                          <Text style={styles.miniButtonText}>Assign Trip</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}

              <Pressable style={styles.secondaryButton} onPress={() => handleAssign(vehicle.id, assignedDrivers[0]?.id ?? vehicle.driverId)}>
                <MaterialCommunityIcons name={'clipboard-check' as any} size={16} color="#ffffff" />
                <Text style={styles.secondaryButtonText}>Assign Driver</Text>
              </Pressable>
            </View>
          )
        })}

        <SectionHeader title="Driver Cards" subtitle="Availability and shift readiness." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.driverTabRow}>
          {driverTabs.map(tab => (
            <Pressable key={tab} style={[styles.chip, driverTab === tab && styles.chipActive]} onPress={() => setDriverTab(tab)}>
              <Text style={[styles.chipText, driverTab === tab && styles.chipTextActive]}>{tab.replace('-', ' ')}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {filteredDrivers.map(driver => {
          const availabilityColor = driver.availability === 'available' ? '#10b981' : driver.availability === 'on-trip' ? '#0ea5e9' : '#f59e0b'
          return (
            <View key={driver.id} style={styles.driverCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.driverAvatar}>
                  <MaterialCommunityIcons name={'account-tie' as any} size={22} color="#10b981" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{driver.name}</Text>
                  <Text style={styles.cardSubtitle}>{driver.phone}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: availabilityColor }]}>
                  <Text style={styles.statusBadgeText}>{driver.availability.replace('-', ' ')}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <MaterialCommunityIcons name={'shield-check' as any} size={16} color="#059669" />
                <Text style={styles.detailText}>Rating: {driver.rating.toFixed(1)}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name={'clock-outline' as any} size={16} color="#059669" />
                <Text style={styles.detailText}>Assigned vehicle: {driver.vehicleId ?? 'Unassigned'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name={'truck' as any} size={16} color="#059669" />
                <Text style={styles.detailText}>Trips completed: {driver.totalTrips}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name={'clock-outline' as any} size={16} color="#059669" />
                <Text style={styles.detailText}>Shift: {driver.shift ?? 'Not assigned'} • {driver.shiftDuration ?? 'Not set'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name={'shield-check' as any} size={16} color="#059669" />
                <Text style={styles.detailText}>KYC: {driver.kycStatus}</Text>
              </View>
            </View>
          )
        })}

        <Modal visible={showDriverModal} animationType="slide" transparent onRequestClose={closeDriverModal}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{editingDriverId ? 'Edit Driver' : 'Add Driver'}</Text>
              <TextInput style={styles.modalInput} value={driverNameInput} onChangeText={setDriverNameInput} placeholder="Driver name" placeholderTextColor="#9ca3af" />
              <TextInput style={styles.modalInput} value={mobileInput} onChangeText={setMobileInput} keyboardType="phone-pad" placeholder="Mobile number" placeholderTextColor="#9ca3af" />
              <TextInput style={styles.modalInput} value={aadhaarInput} onChangeText={setAadhaarInput} keyboardType="number-pad" placeholder="Aadhaar number" placeholderTextColor="#9ca3af" />
              <TextInput style={styles.modalInput} value={licenseInput} onChangeText={setLicenseInput} placeholder="License number" placeholderTextColor="#9ca3af" autoCapitalize="characters" />
              <TextInput style={styles.modalInput} value={bankInput} onChangeText={setBankInput} placeholder="Bank details" placeholderTextColor="#9ca3af" />
              <TextInput style={styles.modalInput} value={emergencyInput} onChangeText={setEmergencyInput} keyboardType="phone-pad" placeholder="Emergency contact" placeholderTextColor="#9ca3af" />

              <Text style={styles.modalSectionTitle}>Select Vehicle</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modalChipRow}>
                {fleetVehicles.map(vehicle => (
                  <Pressable key={vehicle.id} style={[styles.modalChip, selectedVehicleIdForDriver === vehicle.id && styles.modalChipActive]} onPress={() => setSelectedVehicleIdForDriver(vehicle.id)}>
                    <Text style={[styles.modalChipText, selectedVehicleIdForDriver === vehicle.id && styles.modalChipTextActive]}>{vehicle.number}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={styles.modalSectionTitle}>Shift</Text>
              <View style={styles.modalChipRowWrap}>
                {shiftSlots.map(shift => (
                  <Pressable key={shift} style={[styles.modalChip, selectedShift === shift && styles.modalChipActive]} onPress={() => setSelectedShift(shift)}>
                    <Text style={[styles.modalChipText, selectedShift === shift && styles.modalChipTextActive]}>{shift}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.modalSectionTitle}>Duration</Text>
              <View style={styles.modalChipRowWrap}>
                {shiftDurations.map(duration => (
                  <Pressable key={duration} style={[styles.modalChip, selectedDuration === duration && styles.modalChipActive]} onPress={() => setSelectedDuration(duration)}>
                    <Text style={[styles.modalChipText, selectedDuration === duration && styles.modalChipTextActive]}>{duration}</Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.modalActions}>
                <Pressable style={styles.modalButtonGhost} onPress={closeDriverModal}>
                  <Text style={styles.modalButtonGhostText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.modalButtonPrimary} onPress={saveDriver}>
                  <Text style={styles.modalButtonPrimaryText}>Save Driver</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4fbf6' },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  headerCopy: { flex: 1 },
  kicker: { color: '#059669', fontSize: 11, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' },
  headerTitle: { color: '#0f5132', fontSize: 22, fontWeight: '900', marginTop: 4 },
  headerSubtitle: { color: '#6b7280', fontSize: 12, marginTop: 4, lineHeight: 18 },
  headerIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  searchCard: { marginBottom: 16 },
  searchInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: { flex: 1, paddingVertical: 2, color: '#0f172a', fontSize: 14 },
  chipRow: { gap: 10, paddingBottom: 4, marginBottom: 12 },
  driverTabRow: { gap: 10, paddingBottom: 4, marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: '#edf9f1' },
  chipActive: { backgroundColor: '#10b981' },
  chipText: { color: '#0f5132', fontSize: 12, fontWeight: '800', textTransform: 'capitalize' },
  chipTextActive: { color: '#ffffff' },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionButton: { flex: 1, backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionButtonText: { color: '#ffffff', fontSize: 12, fontWeight: '900' },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 14, borderWidth: 1, borderColor: '#dbe7dd', marginBottom: 12 },
  driverCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 14, borderWidth: 1, borderColor: '#dbe7dd', marginBottom: 12 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cardIconWrap: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#059669', alignItems: 'center', justifyContent: 'center' },
  driverAvatar: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#0f5132', fontSize: 15, fontWeight: '900' },
  cardSubtitle: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  statusBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  detailText: { flex: 1, color: '#4f6952', fontSize: 12, lineHeight: 17 },
  vehicleActionRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  driverSection: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#e2efe5', paddingTop: 10 },
  driverSectionTitle: { color: '#0f5132', fontWeight: '900', fontSize: 12, marginBottom: 8 },
  emptyDriverText: { color: '#6b7280', fontSize: 12, marginBottom: 10 },
  assignedDriverCard: { borderWidth: 1, borderColor: '#e2efe5', borderRadius: 14, padding: 10, marginBottom: 8, backgroundColor: '#f7fcf8' },
  driverRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  assignedDriverName: { color: '#0f5132', fontSize: 13, fontWeight: '900' },
  assignedDriverMeta: { color: '#4f6952', fontSize: 11, marginTop: 4 },
  kycBadge: { backgroundColor: '#dcfce7', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  kycBadgeText: { color: '#059669', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  rowButtons: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 8 },
  miniButton: { backgroundColor: '#10b981', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  miniButtonDanger: { backgroundColor: '#dc2626' },
  miniButtonText: { color: '#ffffff', fontSize: 10, fontWeight: '900' },
  secondaryButton: { marginTop: 14, backgroundColor: '#0f5132', borderRadius: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, maxHeight: '92%' },
  modalTitle: { color: '#0f5132', fontSize: 18, fontWeight: '900', marginBottom: 10 },
  modalInput: { borderWidth: 1, borderColor: '#dbe7dd', borderRadius: 12, backgroundColor: '#fbfdfb', color: '#0f172a', paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, marginBottom: 8 },
  modalSectionTitle: { color: '#0f5132', fontWeight: '800', fontSize: 12, marginTop: 6, marginBottom: 6 },
  modalChipRow: { gap: 8, paddingBottom: 2 },
  modalChipRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 2 },
  modalChip: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 },
  modalChipActive: { backgroundColor: '#10b981' },
  modalChipText: { color: '#0f5132', fontSize: 11, fontWeight: '800' },
  modalChipTextActive: { color: '#ffffff' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  modalButtonGhost: { flex: 1, borderWidth: 1, borderColor: '#10b981', borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  modalButtonGhostText: { color: '#10b981', fontWeight: '900', fontSize: 12 },
  modalButtonPrimary: { flex: 1, backgroundColor: '#10b981', borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  modalButtonPrimaryText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
})
