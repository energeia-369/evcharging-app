import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useShowroom } from '../../context/showroom-context'
import { comparePairs, showroomVehicles } from '../../lib/mock/showroomData'

export default function CompareScreen() {
  const router = useRouter()
  const { selectedVehicleId } = useShowroom()

  const compared = showroomVehicles.filter((item) => item.id === selectedVehicleId || item.id !== selectedVehicleId).slice(0, 2)

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#064E3B" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Compare vehicles</Text>
        </View>

        <View style={styles.topCards}>
          {compared.map((vehicle) => (
            <View key={vehicle.id} style={styles.carCard}>
              <Text style={styles.carName}>{vehicle.name}</Text>
              <Text style={styles.carMeta}>{vehicle.brand}</Text>
              <View style={styles.statRow}>
                <Text style={styles.statValue}>{vehicle.rangeKm} km</Text>
                <Text style={styles.statLabel}>Range</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statValue}>{vehicle.chargingTime}</Text>
                <Text style={styles.statLabel}>Charging</Text>
              </View>
            </View>
          ))}
        </View>

        <FlatList
          data={comparePairs}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <View style={styles.compareRow}>
              <Text style={styles.compareFeature}>{item.label}</Text>
              <Text style={styles.compareValue}>{item.v1}</Text>
              <Text style={styles.compareValue}>{item.v2}</Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.finishButton} onPress={() => router.push('/ev-showroom/booking')}>
          <Text style={styles.finishText}>Reserve the best fit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 12 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  pageTitle: { color: '#064E3B', fontSize: 20, fontWeight: '900' },
  topCards: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  carCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 14, elevation: 1 },
  carName: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginBottom: 6 },
  carMeta: { color: '#14532D', fontSize: 13, marginBottom: 12 },
  statRow: { marginBottom: 10 },
  statValue: { color: '#065F46', fontSize: 15, fontWeight: '900' },
  statLabel: { color: '#0F766E', fontSize: 12 },
  compareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 10, shadowColor: '#064E3B', shadowOpacity: 0.04, shadowRadius: 12, elevation: 1 },
  compareFeature: { flex: 1, color: '#064E3B', fontWeight: '900' },
  compareValue: { width: 90, color: '#14532D', textAlign: 'right' },
  finishButton: { marginTop: 20, backgroundColor: '#10B981', borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  finishText: { color: '#FFFFFF', fontWeight: '900' },
})
