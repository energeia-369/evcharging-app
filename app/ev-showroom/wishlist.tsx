import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useShowroom } from '../../context/showroom-context'
import { showroomVehicles } from '../../lib/mock/showroomData'

export default function WishlistScreen() {
  const router = useRouter()
  const { favorites, toggleFavorite, setSelectedVehicleId } = useShowroom()

  const favoriteVehicles = showroomVehicles.filter((vehicle) => favorites.includes(vehicle.id))

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#064E3B" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Favorites</Text>
        </View>

        {favoriteVehicles.length ? (
          <FlatList
            data={favoriteVehicles}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.favCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.carName}>{item.name}</Text>
                    <Text style={styles.carSubtitle}>{item.brand}</Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                    <MaterialCommunityIcons name="heart" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.carPrice}>₹{(item.price / 100000).toFixed(1)}L</Text>
                <View style={styles.wishlistStats}>
                  <Text style={styles.wishlistStat}>{item.rangeKm} km range</Text>
                  <Text style={styles.wishlistStat}>{item.chargingTime}</Text>
                  <Text style={styles.wishlistStat}>{item.topSpeed} km/h</Text>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.favButton} onPress={() => {
                    setSelectedVehicleId(item.id)
                    router.push(`/ev-showroom/car-details?vehicleId=${item.id}`)
                  }}>
                    <Text style={styles.favButtonText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.favButton, styles.bookButton]} onPress={() => {
                    setSelectedVehicleId(item.id)
                    router.push('/ev-showroom/test-drive')
                  }}>
                    <Text style={[styles.favButtonText, styles.bookButtonText]}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="heart-off" size={60} color="#10B981" />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>Tap the heart icon on any car to save it here.</Text>
            <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/ev-showroom')}>
              <Text style={styles.exploreText}>Explore vehicles</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 12 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  pageTitle: { fontSize: 20, fontWeight: '900', color: '#064E3B' },
  favCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, marginBottom: 14, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 14, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  carName: { color: '#064E3B', fontSize: 16, fontWeight: '900' },
  carSubtitle: { color: '#14532D', fontSize: 13 },
  carPrice: { color: '#065F46', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  wishlistStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  wishlistStat: { color: '#0F766E', fontSize: 12, fontWeight: '700' },
  buttonRow: { flexDirection: 'row', gap: 10 },
  favButton: { flex: 1, borderRadius: 18, paddingVertical: 14, alignItems: 'center', backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#10B981' },
  favButtonText: { color: '#064E3B', fontWeight: '900' },
  bookButton: { backgroundColor: '#10B981' },
  bookButtonText: { color: '#FFFFFF' },
  emptyState: { alignItems: 'center', padding: 26, backgroundColor: '#ECFDF5', borderRadius: 24 },
  emptyTitle: { color: '#064E3B', fontSize: 18, fontWeight: '900', marginTop: 14 },
  emptyText: { color: '#14532D', fontSize: 13, textAlign: 'center', marginVertical: 12 },
  exploreButton: { backgroundColor: '#10B981', borderRadius: 18, paddingVertical: 14, paddingHorizontal: 28 },
  exploreText: { color: '#FFFFFF', fontWeight: '900' },
})
