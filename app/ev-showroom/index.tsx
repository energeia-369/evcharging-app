import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ActionButton, SectionHeader, TagChip } from '../../components/showroom-ui'
import { useShowroom } from '../../context/showroom-context'
import { categories, filterBrands, offers, showroomVehicles } from '../../lib/mock/showroomData'

export default function ShowroomHomeScreen() {
  const router = useRouter()
  const { selectedVehicleId, setSelectedVehicleId, favorites, toggleFavorite } = useShowroom()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(timer)
  }, [])

  const filteredVehicles = useMemo(() => {
    return showroomVehicles.filter((vehicle) => {
      const matchBrand = selectedBrand === 'All' || vehicle.brand === selectedBrand
      const matchCategory = selectedCategory === 'All' || vehicle.category === selectedCategory
      const matchSearch = vehicle.name.toLowerCase().includes(search.toLowerCase()) || vehicle.model.toLowerCase().includes(search.toLowerCase())
      return matchBrand && matchCategory && matchSearch
    })
  }, [search, selectedBrand, selectedCategory])

  const featuredVehicles = showroomVehicles.filter((item) => item.badge === 'Featured' || item.badge === 'Popular')

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroAccent} />
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroKicker}>EV Showroom</Text>
              <Text style={styles.heroTitle}>Discover premium electric cars with smart quotes and live test drive booking.</Text>
            </View>
            <View style={styles.heroBadge}>
              <MaterialCommunityIcons name="car-electric" size={20} color="#10b981" />
              <Text style={styles.heroBadgeText}>EV Ecosystem</Text>
            </View>
          </View>
          <Text style={styles.heroSubtext}>Find your next EV in a curated collection of new launches, popular models, and premium offers.</Text>
          <View style={styles.heroActions}>
            <ActionButton label="Browse Car List" icon="arrow-right" onPress={() => router.push('/ev-showroom/car-details?vehicleId=v1')} />
            <ActionButton variant="secondary" label="View Wishlist" icon="heart" onPress={() => router.push('/ev-showroom/wishlist')} />
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={18} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search EV by name, model or feature"
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setSelectedBrand('All')}>
            <MaterialCommunityIcons name="tune" size={20} color="#10b981" />
          </TouchableOpacity>
        </View>

        <SectionHeader title="Filter by brand" subtitle="Select your favorite EV brand" />
        <View style={styles.brandRow}>
          {filterBrands.map((brand) => (
            <TouchableOpacity key={brand} onPress={() => setSelectedBrand(brand)}>
              <TagChip label={brand} active={brand === selectedBrand} />
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Vehicle categories" subtitle="Tap to explore by segment" />
        <View style={styles.categoryRow}>
          {categories.map((category) => (
            <TouchableOpacity key={category} onPress={() => setSelectedCategory(category)}>
              <TagChip label={category} active={category === selectedCategory} />
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Offers & discounts" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offerRow}>
          {offers.map((offer) => (
            <View key={offer.id} style={styles.offerCard}>
              <MaterialCommunityIcons name={offer.icon as any} size={24} color="#047857" />
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        <SectionHeader title="Featured vehicles" subtitle="Top EV picks for premium performance" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featureRow}>
          {featuredVehicles.map((vehicle) => {
            const active = vehicle.id === selectedVehicleId
            return (
              <TouchableOpacity
                key={vehicle.id}
                style={[styles.featureCard, active && styles.featureCardActive]}
                onPress={() => setSelectedVehicleId(vehicle.id)}
              >
                <View style={styles.featureHeader}>
                  <Text style={styles.featureBadge}>{vehicle.badge}</Text>
                  <TouchableOpacity onPress={() => toggleFavorite(vehicle.id)}>
                    <MaterialCommunityIcons
                      name={favorites.includes(vehicle.id) ? 'heart' : 'heart-outline'}
                      size={22}
                      color={favorites.includes(vehicle.id) ? '#ec4899' : '#0f766e'}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.featureImagePlaceholder}>
                  <MaterialCommunityIcons name="car-sports" size={48} color="#10b981" />
                </View>
                <Text style={styles.featureName}>{vehicle.name}</Text>
                <Text style={styles.featureMeta}>{vehicle.brand} • {vehicle.category}</Text>
                <Text style={styles.featurePrice}>₹{(vehicle.price / 100000).toFixed(1)}L</Text>
                <View style={styles.featureStats}>
                  <Text style={styles.featureStat}>{vehicle.rangeKm} km</Text>
                  <Text style={styles.featureStat}>{vehicle.topSpeed} km/h</Text>
                </View>
                <ActionButton label="View Details" icon="car-info" onPress={() => router.push(`/ev-showroom/car-details?vehicleId=${vehicle.id}`)} style={styles.featureAction} />
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        <SectionHeader title="Vehicle list" subtitle={`${filteredVehicles.length} vehicles available`} />

        {loading ? (
          <View style={styles.skeletonList}>
            {[0, 1, 2].map((item) => (
              <View key={item} style={styles.skeletonCard}>
                <View style={styles.skeletonThumbnail} />
                <View style={styles.skeletonRow} />
                <View style={styles.skeletonRowShort} />
              </View>
            ))}
          </View>
        ) : filteredVehicles.length ? (
          <FlatList
            data={filteredVehicles}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.vehicleList}
            renderItem={({ item }) => (
              <View style={styles.vehicleCard}>
                <View style={styles.vehicleTopRow}>
                  <View style={styles.vehicleThumbnail}>
                    <MaterialCommunityIcons name="car-electric" size={36} color="#10b981" />
                  </View>
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>{item.name}</Text>
                    <Text style={styles.vehicleMeta}>{item.brand} • ₹{(item.price / 100000).toFixed(1)}L</Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                    <MaterialCommunityIcons
                      name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                      size={24}
                      color={favorites.includes(item.id) ? '#ef4444' : '#475569'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.vehicleStatsRow}>
                  <Text style={styles.vehicleStat}>Range {item.rangeKm} km</Text>
                  <Text style={styles.vehicleStat}>Charge {item.chargingTime}</Text>
                  <Text style={styles.vehicleStat}>Top {item.topSpeed} km/h</Text>
                </View>

                <View style={styles.actionRow}>
                  <ActionButton variant="secondary" label="Compare" icon="format-list-bulleted" onPress={() => router.push('/ev-showroom/compare')} style={styles.smallButton} />
                  <ActionButton variant="secondary" label="Test Drive" icon="steering" onPress={() => {
                    setSelectedVehicleId(item.id)
                    router.push('/ev-showroom/test-drive')
                  }} style={styles.smallButton} />
                  <ActionButton label="View Details" icon="car-info" onPress={() => {
                    setSelectedVehicleId(item.id)
                    router.push(`/ev-showroom/car-details?vehicleId=${item.id}`)
                  }} style={styles.smallButton} />
                </View>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matching EVs found</Text>
            <Text style={styles.emptySubtitle}>Try resetting filters or searching another model.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 24 },
  heroCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    shadowColor: '#047857',
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 3,
  },
  heroAccent: {
    position: 'absolute',
    right: -20,
    top: -8,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(16,185,129,0.15)',
  },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  heroKicker: { color: '#047857', fontSize: 12, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },
  heroTitle: { color: '#064E3B', fontSize: 24, fontWeight: '900', lineHeight: 32, maxWidth: '70%' },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroBadgeText: { color: '#064E3B', marginLeft: 6, fontWeight: '700', fontSize: 13 },
  heroSubtext: { color: '#14532D', fontSize: 14, lineHeight: 20 },
  heroActions: { flexDirection: 'row', marginTop: 18, gap: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    paddingHorizontal: 14,
    height: 52,
  },
  searchInput: { flex: 1, marginLeft: 8, color: '#0F172A', fontSize: 14 },
  filterButton: {
    marginLeft: 12,
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 1,
  },
  brandRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  offerRow: { marginBottom: 20 },
  offerCard: {
    width: 190,
    minHeight: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginRight: 14,
    shadowColor: '#064E3B',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  offerTitle: { marginTop: 14, color: '#064E3B', fontSize: 15, fontWeight: '800' },
  offerSubtitle: { marginTop: 6, color: '#166534', fontSize: 12, lineHeight: 18 },
  featureRow: { marginBottom: 20 },
  featureCard: {
    width: 270,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    padding: 18,
    marginRight: 16,
    shadowColor: '#047857',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 2,
  },
  featureCardActive: { borderWidth: 1, borderColor: '#10b981' },
  featureHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  featureBadge: { color: '#065F46', fontSize: 11, fontWeight: '900', backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  featureImagePlaceholder: {
    height: 120,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureName: { color: '#064E3B', fontSize: 18, fontWeight: '900' },
  featureMeta: { color: '#166534', fontSize: 12, marginTop: 4 },
  featurePrice: { color: '#065F46', fontSize: 18, fontWeight: '900', marginTop: 10 },
  featureStats: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  featureStat: { color: '#115E59', fontSize: 12, fontWeight: '700' },
  featureAction: { marginTop: 14 },
  skeletonList: { gap: 16 },
  skeletonCard: {
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#064E3B',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  skeletonThumbnail: { width: '100%', height: 72, backgroundColor: '#ECFDF5', borderRadius: 18, marginBottom: 12 },
  skeletonRow: { width: '90%', height: 14, backgroundColor: '#ECFDF5', borderRadius: 8, marginBottom: 8 },
  skeletonRowShort: { width: '50%', height: 14, backgroundColor: '#ECFDF5', borderRadius: 8 },
  vehicleList: { gap: 14 },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#064E3B',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  vehicleTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  vehicleThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfo: { flex: 1, marginLeft: 12 },
  vehicleName: { color: '#064E3B', fontSize: 16, fontWeight: '900' },
  vehicleMeta: { color: '#166534', fontSize: 13, marginTop: 4 },
  vehicleStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  vehicleStat: { color: '#0f766e', fontSize: 12, fontWeight: '700' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  smallButton: { flex: 1 },
  emptyState: { alignItems: 'center', padding: 28, backgroundColor: '#ECFDF5', borderRadius: 24, marginTop: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '900', color: '#064E3B', marginBottom: 8 },
  emptySubtitle: { color: '#14532D', fontSize: 13, textAlign: 'center', lineHeight: 20 },
})
