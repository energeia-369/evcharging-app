import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ActionButton, InfoStat, SectionHeader } from '../../components/showroom-ui'
import { useShowroom } from '../../context/showroom-context'
import { getVehicleById, showroomVehicles } from '../../lib/mock/showroomData'

export default function CarDetailsScreen() {
  const router = useRouter()
  const { vehicleId } = useLocalSearchParams() as { vehicleId?: string }
  const { selectedVehicleId, setSelectedVehicleId, toggleFavorite, favorites } = useShowroom()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const selectedId = vehicleId || selectedVehicleId
  const vehicle = useMemo(() => getVehicleById(selectedId), [selectedId]) || showroomVehicles[0]
  const galleryPhotos = vehicle.galleryPhotos ?? []

  useEffect(() => {
    if (vehicle?.id) {
      setSelectedVehicleId(vehicle.id)
    }
  }, [vehicle?.id, setSelectedVehicleId])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const quotePrice = vehicle.price
  const savings = vehicle.savings

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#064E3B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicle details</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroBadge}>{vehicle.badge}</Text>
            <Text style={styles.heroName}>{vehicle.name}</Text>
            <Text style={styles.heroMeta}>{vehicle.brand} • {vehicle.category}</Text>
            <Text style={styles.heroPrice}>₹{(vehicle.price / 100000).toFixed(1)}L</Text>
          </View>
          <View style={styles.heroIconWrap}>
            <MaterialCommunityIcons name="car-electric" size={40} color="#10B981" />
          </View>
        </View>

        <View style={styles.carouselCard}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <View style={styles.imageFrame}>
            <Image
              source={galleryPhotos[activeImageIndex]}
              style={styles.galleryImage}
              resizeMode="cover"
              onError={() => setActiveImageIndex(0)}
            />
          </View>
          <View style={styles.thumbnailRow}>
            {galleryPhotos.length > 0 ? (
              galleryPhotos.map((photo, index) => (
                <Pressable key={index} onPress={() => setActiveImageIndex(index)} style={[styles.thumbnailWrap, activeImageIndex === index && styles.thumbnailWrapActive]}>
                  <Image source={photo} style={styles.thumbnailImage} resizeMode="cover" />
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyGalleryCard}>
                <Text style={styles.emptyGalleryText}>No Data Available</Text>
              </View>
            )}
          </View>
        </View>

        <SectionHeader title="Specifications" subtitle="Complete performance and battery details" />
        <View style={styles.statsGrid}>
          <InfoStat label="Battery" value={`${vehicle.batteryKwh} kWh`} />
          <InfoStat label="Range" value={`${vehicle.rangeKm} km`} />
          <InfoStat label="Charging" value={vehicle.chargingTime} />
          <InfoStat label="Top speed" value={`${vehicle.topSpeed} km/h`} />
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.attributeRow}>
            <MaterialCommunityIcons name="flash" size={18} color="#10B981" />
            <Text style={styles.attributeText}>{vehicle.chargingType}</Text>
          </View>
          <View style={styles.attributeRow}>
            <MaterialCommunityIcons name="speedometer" size={18} color="#10B981" />
            <Text style={styles.attributeText}>{vehicle.performance}</Text>
          </View>
          <View style={styles.attributeRow}>
            <MaterialCommunityIcons name="star" size={18} color="#10B981" />
            <Text style={styles.attributeText}>Rating {vehicle.rating.toFixed(1)}</Text>
          </View>
        </View>

        <SectionHeader title="Available colors" />
        <View style={styles.colorRow}>
          {vehicle.colors.map((color) => (
            <View key={color} style={styles.colorChip}>
              <Text style={styles.colorText}>{color}</Text>
            </View>
          ))}
        </View>

        <View style={styles.featureSplit}>
          <View style={styles.featureBlock}>
            <Text style={styles.featureTitle}>Features</Text>
            {vehicle.features.map((item) => (
              <View key={item} style={styles.featureItem}>
                <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color="#047857" />
                <Text style={styles.featureLabel}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.featureBlock}>
            <Text style={styles.featureTitle}>Safety</Text>
            {vehicle.safety.map((item) => (
              <View key={item} style={styles.featureItem}>
                <MaterialCommunityIcons name="shield-check" size={16} color="#047857" />
                <Text style={styles.featureLabel}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.deepCard}>
          <Text style={styles.deepTitle}>EMI Estimate</Text>
          <Text style={styles.deepValue}>₹{vehicle.emi.toLocaleString()} / month</Text>
          <Text style={styles.deepSubtitle}>Based on 36-month standard financing</Text>
        </View>

        <View style={styles.smartRow}>
          <View style={styles.smartCard}>
            <Text style={styles.smartTitle}>AI Recommendation</Text>
            <Text style={styles.smartDetail}>This model is recommended for long-distance city and highway driving.</Text>
          </View>
          <View style={styles.smartCard}> 
            <Text style={styles.smartTitle}>Battery Prediction</Text>
            <Text style={styles.smartDetail}>Predicted charge retention is 92% after 3 years with regular fast charging.</Text>
          </View>
        </View>

        <View style={styles.buttonCluster}>
          <ActionButton label="Book Test Drive" icon="calendar" onPress={() => router.push('/ev-showroom/test-drive')} />
          <ActionButton variant="secondary" label="Reserve Vehicle" icon="clipboard-check" onPress={() => router.push('/ev-showroom/booking')} />
          <ActionButton variant="secondary" label="Compare Vehicle" icon="car-info" onPress={() => router.push('/ev-showroom/compare')} />
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <Text style={styles.loadingText}>Loading vehicle insights...</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 30 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 14 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  headerTitle: { color: '#064E3B', fontSize: 20, fontWeight: '900' },
  heroCard: { backgroundColor: '#ffffff', borderRadius: 28, padding: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 20, elevation: 2, marginBottom: 18 },
  heroLeft: { flex: 1, paddingRight: 10 },
  heroBadge: { color: '#065F46', backgroundColor: '#DCFCE7', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, fontWeight: '900', fontSize: 11, marginBottom: 12 },
  heroName: { fontSize: 24, fontWeight: '900', color: '#064E3B', marginBottom: 6 },
  heroMeta: { color: '#0F766E', fontSize: 13, marginBottom: 10 },
  heroPrice: { color: '#064E3B', fontSize: 22, fontWeight: '900' },
  heroIconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  carouselCard: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 18, marginBottom: 18, shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 18, elevation: 2 },
  sectionTitle: { color: '#064E3B', fontSize: 18, fontWeight: '900', marginBottom: 14 },
  imageFrame: { borderRadius: 26, overflow: 'hidden', marginBottom: 12, backgroundColor: '#DCFCE7' },
  galleryImage: { height: 220, width: '100%' },
  thumbnailRow: { flexDirection: 'row', gap: 10 },
  thumbnailWrap: { flex: 1, height: 64, borderRadius: 18, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  thumbnailWrapActive: { borderColor: '#10B981' },
  thumbnailImage: { height: '100%', width: '100%' },
  emptyGalleryCard: { flex: 1, height: 64, borderRadius: 18, borderWidth: 1, borderColor: '#D1FAE5', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  emptyGalleryText: { color: '#14532D', fontSize: 12, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 18 },
  summaryCard: { backgroundColor: '#ECFDF5', borderRadius: 24, padding: 18, marginBottom: 18 },
  attributeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  attributeText: { color: '#065F46', fontSize: 14, fontWeight: '700' },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  colorChip: { borderRadius: 999, borderWidth: 1, borderColor: '#D1FAE5', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FFFFFF' },
  colorText: { color: '#064E3B', fontWeight: '700' },
  featureSplit: { flexDirection: 'row', gap: 16, marginBottom: 18 },
  featureBlock: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 14, elevation: 1 },
  featureTitle: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginBottom: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  featureLabel: { color: '#0F766E', fontSize: 13, flex: 1 },
  deepCard: { backgroundColor: '#ECFDF5', borderRadius: 24, padding: 18, marginBottom: 18 },
  deepTitle: { color: '#065F46', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  deepValue: { color: '#064E3B', fontSize: 22, fontWeight: '900' },
  deepSubtitle: { color: '#14532D', fontSize: 13, marginTop: 6 },
  smartRow: { gap: 14, marginBottom: 20 },
  smartCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 14, elevation: 1 },
  smartTitle: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginBottom: 8 },
  smartDetail: { color: '#14532D', fontSize: 13, lineHeight: 20 },
  buttonCluster: { gap: 12, marginBottom: 26 },
  loadingCard: { backgroundColor: '#ECFDF5', borderRadius: 24, padding: 18, alignItems: 'center' },
  loadingText: { color: '#0F766E', fontWeight: '700' },
})
