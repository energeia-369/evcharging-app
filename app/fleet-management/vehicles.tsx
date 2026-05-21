import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { drivers, vehicles } from '../../lib/mock/fleetData'
import { useFleetOps } from './FleetOpsContext'

type VehicleTab = 'all' | 'available' | 'in-trip' | 'charging' | 'maintenance'
type DriverTab = 'all' | 'available' | 'on-trip' | 'off-duty'

const vehicleTabs: VehicleTab[] = ['all', 'available', 'in-trip', 'charging', 'maintenance']
const driverTabs: DriverTab[] = ['all', 'available', 'on-trip', 'off-duty']

export default function VehiclesScreen() {
  const router = useRouter()
  const { setAssignment } = useFleetOps()
  const [query, setQuery] = useState('')
  const [vehicleTab, setVehicleTab] = useState<VehicleTab>('all')
  const [driverTab, setDriverTab] = useState<DriverTab>('all')

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesQuery = [vehicle.name, vehicle.number, vehicle.driverName, vehicle.model].some(value =>
        value.toLowerCase().includes(query.trim().toLowerCase()),
      )
      const matchesTab = vehicleTab === 'all' || vehicle.status === vehicleTab
      return matchesQuery && matchesTab
    })
  }, [query, vehicleTab])

  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      const matchesQuery = [driver.name, driver.email, driver.phone].some(value => value.toLowerCase().includes(query.trim().toLowerCase()))
      const matchesTab = driverTab === 'all' || driver.availability === driverTab
      return matchesQuery && matchesTab
    })
  }, [driverTab, query])

  function handleAssign(vehicleId: string, driverId: string) {
    setAssignment({ vehicleId, driverId })
    router.push('/fleet-management/assign-vehicle')
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
          <Pressable style={styles.actionButton} onPress={() => Alert.alert('Mock action', 'Add vehicle is frontend-only in this demo.')}>
            <MaterialCommunityIcons name={'car-electric' as any} size={16} color="#ffffff" />
            <Text style={styles.actionButtonText}>Add Vehicle</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => Alert.alert('Mock action', 'Add driver is frontend-only in this demo.')}>
            <MaterialCommunityIcons name={'account-tie' as any} size={16} color="#ffffff" />
            <Text style={styles.actionButtonText}>Add Driver</Text>
          </Pressable>
        </View>

        <SectionHeader title="Vehicle Cards" subtitle="Battery, status, and assigned driver details." />
        {filteredVehicles.map(vehicle => {
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
                <Text style={styles.detailText}>Driver: {vehicle.driverName}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name={'clipboard-check' as any} size={16} color="#059669" />
                <Text style={styles.detailText}>Condition: {vehicle.maintenanceStatus}</Text>
              </View>

              <Pressable style={styles.secondaryButton} onPress={() => handleAssign(vehicle.id, vehicle.driverId)}>
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
                <Text style={styles.detailText}>Assigned vehicle: {driver.assignedVehicleId ?? 'Unassigned'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name={'truck' as any} size={16} color="#059669" />
                <Text style={styles.detailText}>Trips completed: {driver.totalTrips}</Text>
              </View>
            </View>
          )
        })}
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
  secondaryButton: { marginTop: 14, backgroundColor: '#0f5132', borderRadius: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
})
