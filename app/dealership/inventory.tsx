import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { formatINR, sampleVehicles } from '../../lib/mock/dealershipLifecycleData'

type InventoryFilter = 'all' | 'available' | 'low' | 'sold'

export default function InventoryScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<InventoryFilter>('all')
  const [vehicles, setVehicles] = useState(sampleVehicles)

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = [vehicle.model, vehicle.variant, vehicle.color].join(' ').toLowerCase().includes(query.trim().toLowerCase())
      const matchesFilter =
        filter === 'all' ||
        (filter === 'available' && vehicle.stock > 10) ||
        (filter === 'low' && vehicle.stock <= 10 && vehicle.stock > 0) ||
        (filter === 'sold' && vehicle.stock === 0)
      return matchesSearch && matchesFilter
    })
  }, [filter, query, vehicles])

  const totalVehicles = vehicles.length
  const availableStock = vehicles.reduce((sum, item) => sum + item.stock, 0)
  const soldVehicles = totalVehicles * 20 - availableStock

  const addVehicle = () => {
    setVehicles((current) => [
      ...current,
      {
        id: `veh-${Date.now()}`,
        model: 'Energeia Nova',
        variant: 'Launch Edition',
        color: 'Pearl Silver',
        price: 2799000,
        rangeKm: 530,
        chargingSpeedKw: 130,
        stock: 12,
        image: 'EV',
      },
    ])
  }

  const editVehicle = (id: string) => {
    setVehicles((current) => current.map((vehicle) => vehicle.id === id ? { ...vehicle, stock: vehicle.stock + 1, price: vehicle.price + 10000 } : vehicle))
  }

  const deleteVehicle = (id: string) => {
    setVehicles((current) => current.filter((vehicle) => vehicle.id !== id))
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Inventory Management</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/dealership')}>
            <MaterialCommunityIcons name="clipboard-check" size={18} color="#064E3B" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statValue}>{totalVehicles}</Text><Text style={styles.statLabel}>Total Vehicles</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>{availableStock}</Text><Text style={styles.statLabel}>Available Stock</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>{soldVehicles}</Text><Text style={styles.statLabel}>Sold Vehicles</Text></View>
        </View>

        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="car-electric" size={18} color="#059669" />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search vehicles" style={styles.searchInput} placeholderTextColor="#7C8B93" />
        </View>

        <View style={styles.filterRow}>
          {(['all', 'available', 'low', 'sold'] as InventoryFilter[]).map((item) => (
            <TouchableOpacity key={item} style={[styles.filterChip, filter === item && styles.filterChipActive]} onPress={() => setFilter(item)}>
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addVehicle}>
          <MaterialCommunityIcons name="file-document" size={18} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Vehicle</Text>
        </TouchableOpacity>

        {filteredVehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicleCard}>
            <View style={styles.vehicleImage}>
              <MaterialCommunityIcons name="car-electric" size={24} color="#059669" />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicle.model}</Text>
              <Text style={styles.vehicleMeta}>{vehicle.variant}</Text>
              <Text style={styles.vehicleMeta}>Battery range {vehicle.rangeKm} km</Text>
              <Text style={styles.vehicleMeta}>Charging speed {vehicle.chargingSpeedKw} kW</Text>
              <Text style={styles.vehicleMeta}>{formatINR(vehicle.price)}</Text>
              <Text style={styles.stockText}>Stock: {vehicle.stock}</Text>
            </View>
            <View style={styles.buttonStack}>
              <TouchableOpacity style={styles.smallButton} onPress={() => editVehicle(vehicle.id)}><Text style={styles.smallButtonText}>Edit</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.smallButton, styles.deleteButton]} onPress={() => deleteVehicle(vehicle.id)}><Text style={styles.smallButtonText}>Delete</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.smallButton, styles.salesButton]} onPress={() => router.push('/dealership/vehicle-sales')}><Text style={styles.smallButtonText}>View Sales</Text></TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: '#064E3B', fontSize: 24, fontWeight: '900' },
  iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, alignItems: 'center', shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
  statValue: { color: '#064E3B', fontSize: 18, fontWeight: '900' },
  statLabel: { color: '#14532D', fontSize: 11, marginTop: 4, textAlign: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, color: '#064E3B' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  filterChip: { borderWidth: 1, borderColor: '#D1FAE5', backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  filterChipActive: { backgroundColor: '#059669', borderColor: '#059669' },
  filterText: { color: '#064E3B', fontSize: 11, fontWeight: '900' },
  filterTextActive: { color: '#FFFFFF' },
  addButton: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#059669', borderRadius: 16, paddingVertical: 14, marginBottom: 12 },
  addButtonText: { color: '#FFFFFF', fontWeight: '900' },
  vehicleCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  vehicleImage: { height: 90, borderRadius: 16, backgroundColor: '#F8FFFB', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  vehicleInfo: { marginBottom: 10 },
  vehicleName: { color: '#064E3B', fontSize: 16, fontWeight: '900' },
  vehicleMeta: { color: '#14532D', fontSize: 12, marginTop: 4 },
  stockText: { color: '#047857', fontWeight: '900', marginTop: 8 },
  buttonStack: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  smallButton: { flexGrow: 1, backgroundColor: '#ECFDF5', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  deleteButton: { backgroundColor: '#FEF2F2' },
  salesButton: { backgroundColor: '#DBFCE7' },
  smallButtonText: { color: '#064E3B', fontWeight: '900', fontSize: 12 },
})
