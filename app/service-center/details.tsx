import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { getServiceCenter, serviceTypes } from '../../lib/mock/serviceData'

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export default function Details() {
  const params = useLocalSearchParams<{ centerId?: string; id?: string }>()
  const router = useRouter()
  const centerId = paramValue(params.centerId ?? params.id)
  const [loading, setLoading] = useState(true)
  const { width } = useWindowDimensions()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(timer)
  }, [centerId])

  const center = useMemo(() => getServiceCenter(centerId), [centerId])

  if (!center) {
    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="alert-circle-outline" size={30} color="#1B7F4B" />
        <Text style={styles.emptyTitle}>Service center not found</Text>
        <Text style={styles.emptySubtitle}>Go back and choose a center to continue the booking flow.</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.stepBadge}>
        <MaterialCommunityIcons name="numeric-2-circle-outline" size={18} color="#1B7F4B" />
        <Text style={styles.stepBadgeText}>Select service type</Text>
      </View>

      <View style={styles.centerHero}>
        <View style={styles.centerIconWrap}>
          <MaterialCommunityIcons name="garage" size={24} color="#0F5132" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.centerTitle}>{center.name}</Text>
          <Text style={styles.centerSubtitle}>{center.address}</Text>
        </View>
        <View style={styles.ratingPill}>
          <MaterialCommunityIcons name="star" size={14} color="#D5A100" />
          <Text style={styles.ratingText}>{center.rating}</Text>
        </View>
      </View>

      <View style={styles.centerMetaRow}>
        <View style={styles.centerMetaChip}><MaterialCommunityIcons name="map-marker-outline" size={16} color="#1B7F4B" /><Text style={styles.centerMetaText}>{(center.distanceKm ?? 0).toFixed(1)} km away</Text></View>
        <View style={styles.centerMetaChip}><MaterialCommunityIcons name="leaf" size={16} color="#1B7F4B" /><Text style={styles.centerMetaText}>{center.categories.join(' • ')}</Text></View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pick a service card</Text>
        <Text style={styles.sectionMeta}>Responsive grid on larger screens</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color="#1B7F4B" />
        </View>
      ) : (
        <View style={[styles.serviceGrid, width >= 700 && { marginHorizontal: -6 }] }>
          {serviceTypes.map(item => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.serviceCard, width >= 700 && styles.serviceCardLarge, pressed && styles.pressedCard]}
              onPress={() => router.push(`/service-center/book-service?centerId=${center.id}&serviceTypeId=${item.id}`)}
            >
              <View style={styles.serviceIconWrap}>
                <MaterialCommunityIcons name={item.icon as any} size={22} color="#0F5132" />
              </View>
              <Text style={styles.serviceTitle}>{item.name}</Text>
              <Text style={styles.serviceDescription}>{item.description}</Text>
              <View style={styles.serviceMetaRow}>
                <View style={styles.metaPill}><MaterialCommunityIcons name="clock-outline" size={14} color="#1B7F4B" /><Text style={styles.metaPillText}>{item.durationMins} mins</Text></View>
                <View style={styles.metaPill}><MaterialCommunityIcons name="cash" size={14} color="#1B7F4B" /><Text style={styles.metaPillText}>₹ {item.price}</Text></View>
              </View>
              <View style={styles.badgePill}><Text style={styles.badgeText}>{item.badge}</Text></View>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 32 },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDEDE2',
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  stepBadgeText: { color: '#1B7F4B', fontSize: 12, fontWeight: '800' },
  centerHero: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#0F5132',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDF5EF',
  },
  centerIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#EAF8EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTitle: { color: '#0F5132', fontSize: 20, fontWeight: '900' },
  centerSubtitle: { color: '#6B7D72', marginTop: 4, lineHeight: 19 },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF6DF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ratingText: { color: '#8A6711', fontWeight: '900' },
  centerMetaRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 12 },
  centerMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DDEDE2',
  },
  centerMetaText: { color: '#4F685B', fontSize: 12, fontWeight: '700' },
  sectionHeader: { marginTop: 18, marginBottom: 12 },
  sectionTitle: { color: '#0F5132', fontSize: 18, fontWeight: '900' },
  sectionMeta: { color: '#6B7D72', fontSize: 12, marginTop: 4 },
  loadingWrap: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 6,
  },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  serviceCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0F5132',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDF5EF',
  },
  serviceCardLarge: { width: '48%', flexGrow: 1 },
  pressedCard: { transform: [{ scale: 0.99 }] },
  serviceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ECF9EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceTitle: { color: '#0F5132', fontSize: 17, fontWeight: '900' },
  serviceDescription: { color: '#5E7266', fontSize: 13, lineHeight: 19, marginTop: 8 },
  serviceMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F4FBF6',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  metaPillText: { color: '#1B7F4B', fontSize: 12, fontWeight: '800' },
  badgePill: { alignSelf: 'flex-start', marginTop: 14, backgroundColor: '#EAF8EE', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  badgeText: { color: '#1B7F4B', fontSize: 12, fontWeight: '900' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F4FBF6' },
  emptyTitle: { marginTop: 10, color: '#0F5132', fontSize: 18, fontWeight: '900' },
  emptySubtitle: { marginTop: 8, color: '#6B7D72', textAlign: 'center', lineHeight: 20 },
})
