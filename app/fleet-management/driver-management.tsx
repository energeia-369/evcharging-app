import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DriverCard, SectionHeader } from '../../components/fleet/Shared'
import { useFleetOps } from './FleetOpsContext'

export default function DriverManagementScreen() {
  const router = useRouter()
  const { fleetDrivers, removeDriver, setSelectedDriverForKycId } = useFleetOps()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDrivers = fleetDrivers.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.email.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={24} color="#1f2937" />
          </Pressable>
          <Text style={styles.headerTitle}>Drivers</Text>
          <Pressable style={styles.addButton} onPress={() => router.push('/fleet-management/vehicles')}>
            <MaterialCommunityIcons name="plus" size={24} color="#10b981" />
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search drivers..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Drivers List */}
        <SectionHeader title={`All Drivers (${filteredDrivers.length})`} />
        <View style={styles.driversList}>
          {filteredDrivers.map(driver => (
            <View key={driver.id}>
              <DriverCard
                driver={driver}
                onPress={() => {
                  setSelectedDriverForKycId(driver.id)
                  router.push('/fleet-management/driver-kyc')
                }}
              />
              <View style={styles.driverMetaRow}>
                <Text style={styles.driverMeta}>KYC: {driver.kycStatus} • Shift: {driver.shift ?? 'Not assigned'} • Vehicle: {driver.vehicleId ?? 'Unassigned'}</Text>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => {
                    const result = removeDriver(driver.id)
                    if (!result.ok) {
                      Alert.alert('Error', result.message)
                      return
                    }
                    Alert.alert('Updated', result.message)
                  }}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          ))}
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
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0f5132', flex: 1, textAlign: 'center' },
  addButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, paddingHorizontal: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e2efe5' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#0f5132' },
  driversList: { gap: 0 },
  driverMetaRow: { marginTop: -4, marginBottom: 12, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  driverMeta: { flex: 1, color: '#4f6952', fontSize: 11 },
  removeButton: { backgroundColor: '#dc2626', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  removeText: { color: '#ffffff', fontSize: 10, fontWeight: '900' },
})
