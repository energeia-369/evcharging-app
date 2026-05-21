import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { PremiumCard, SectionHeader, SkeletonCard, StatPill } from '../../components/ev-service/Shared'
import { useEvServiceBooking } from '../../context/booking-context'
import { serviceCategories, serviceCenters } from '../../lib/mock/evServiceData'

export default function EvServiceHomeScreen() {
  const router = useRouter()
  const { width } = useWindowDimensions()
  const { bookings, setDraft } = useEvServiceBooking()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const activeBookings = useMemo(() => bookings.filter(booking => booking.status === 'upcoming' || booking.status === 'in-progress'), [bookings])

  const openEmergency = () => {
    setDraft(previous => ({ ...previous, centerId: serviceCenters[0].id, serviceId: 'emergency-roadside' }))
    router.push('/ev-service/book-service')
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>EV service ecosystem</Text>
            <Text style={styles.heroTitle}>Book premium EV care near you.</Text>
            <Text style={styles.heroSubtitle}>A connected frontend-only flow with mock data, smooth transitions, and a clean green EV theme.</Text>
          </View>
          <View style={styles.heroBadge}>
            <MaterialCommunityIcons name="leaf" size={24} color="#0f5132" />
          </View>
        </View>

        <View style={styles.statGrid}>
          <StatPill icon="map-marker-radius" label="Centers" value={String(serviceCenters.length)} />
          <StatPill icon="shape" label="Categories" value={String(serviceCategories.length)} />
          <StatPill icon="calendar-check" label="Bookings" value={String(activeBookings.length)} />
          <StatPill icon="shield-star" label="Score" value="Premium" />
        </View>
      </View>

      <SectionHeader title="Service categories" subtitle="Tap a category to move quickly to booking" />
      <View style={styles.categoryRow}>
        {serviceCategories.map(category => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [styles.categoryCard, width >= 720 && styles.halfCard, pressed && styles.pressed]}
            onPress={() => {
              setDraft(previous => ({ ...previous, serviceId: category.id }))
              router.push('/ev-service/book-service')
            }}
          >
            <View style={styles.categoryIcon}>
              <MaterialCommunityIcons name={category.icon as any} size={20} color="#10b981" />
            </View>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <Text style={styles.categoryMeta}>{category.durationMins} mins • {category.price}</Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Nearby service centers" subtitle="Choose a center and continue the flow" />
      {loading ? (
        <View style={{ gap: 12 }}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {serviceCenters.map(center => (
            <Pressable
              key={center.id}
              style={({ pressed }) => [styles.centerCard, pressed && styles.pressed]}
              onPress={() => {
                setDraft(previous => ({ ...previous, centerId: center.id }))
                router.push('/ev-service/service-details')
              }}
            >
              <Image source={require('../../assets/images/icon.png')} style={styles.centerImage} />
              <View style={{ flex: 1 }}>
                <View style={styles.centerHeaderRow}>
                  <Text style={styles.centerName}>{center.name}</Text>
                  <View style={styles.ratingChip}>
                    <MaterialCommunityIcons name="star" size={14} color="#d97706" />
                    <Text style={styles.ratingText}>{center.rating}</Text>
                  </View>
                </View>
                <Text style={styles.centerAddress}>{center.address}</Text>
                <View style={styles.centerFooterRow}>
                  <Text style={styles.centerFooterText}>{(center.distanceKm ?? 0).toFixed(1)} km away</Text>
                  <Text style={styles.centerFooterText}>{center.openStatus}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <SectionHeader title="Active bookings" subtitle="Live and upcoming service work" />
      <View style={{ gap: 12 }}>
        {activeBookings.map(booking => (
          <PremiumCard key={booking.id}>
            <View style={styles.bookingHeaderRow}>
              <View style={styles.bookingBadge}>
                <MaterialCommunityIcons name="car-electric-outline" size={18} color="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bookingTitle}>{booking.serviceName}</Text>
                <Text style={styles.bookingMeta}>{booking.centerName}</Text>
              </View>
              <View style={[styles.statusTag, booking.status === 'in-progress' && styles.statusProgress]}>
                <Text style={[styles.statusTagText, booking.status === 'in-progress' && styles.statusTagTextLight]}>{booking.status}</Text>
              </View>
            </View>
            <Text style={styles.bookingDetail}>{booking.date} • {booking.time} • {booking.vehicleName}</Text>
          </PremiumCard>
        ))}
      </View>

      <SectionHeader title="Emergency service" subtitle="Fast help when your EV needs immediate attention" />
      <Pressable style={({ pressed }) => [styles.emergencyCard, pressed && styles.pressed]} onPress={openEmergency}>
        <View style={styles.emergencyIcon}>
          <MaterialCommunityIcons name="alert-decagram" size={22} color="#ffffff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.emergencyTitle}>Roadside support on standby</Text>
          <Text style={styles.emergencyText}>Open the emergency booking path with pickup enabled and priority dispatch.</Text>
        </View>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4fbf6' },
  container: { padding: 16, paddingBottom: 36 },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2efe5',
    shadowColor: '#0f5132',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  heroTopRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  kicker: { color: '#10b981', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '900' },
  heroTitle: { color: '#0f5132', fontSize: 28, lineHeight: 34, fontWeight: '900', marginTop: 8, maxWidth: 260 },
  heroSubtitle: { color: '#5d7266', lineHeight: 20, marginTop: 8 },
  heroBadge: { width: 54, height: 54, borderRadius: 18, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: {
    flexBasis: '100%',
    flexGrow: 1,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2efe5',
  },
  halfCard: { flexBasis: '48%' },
  pressed: { transform: [{ scale: 0.99 }] },
  categoryIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#ecf9ef', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  categoryTitle: { color: '#0f5132', fontWeight: '900', fontSize: 15 },
  categoryMeta: { color: '#6b7d72', marginTop: 4, fontSize: 12 },
  centerCard: { flexDirection: 'row', gap: 12, backgroundColor: '#ffffff', borderRadius: 24, padding: 14, borderWidth: 1, borderColor: '#e2efe5' },
  centerImage: { width: 76, height: 76, borderRadius: 20, backgroundColor: '#edf9f1' },
  centerHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  centerName: { color: '#0f5132', fontSize: 16, fontWeight: '900', flex: 1 },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff7ed', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  ratingText: { color: '#9a3412', fontWeight: '900', fontSize: 12 },
  centerAddress: { color: '#5d7266', marginTop: 6, lineHeight: 18 },
  centerFooterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 8, flexWrap: 'wrap' },
  centerFooterText: { color: '#10b981', fontWeight: '800', fontSize: 12 },
  bookingHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bookingBadge: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#ecf9ef', alignItems: 'center', justifyContent: 'center' },
  bookingTitle: { color: '#0f5132', fontWeight: '900' },
  bookingMeta: { color: '#6b7d72', marginTop: 4, fontSize: 12 },
  bookingDetail: { color: '#4f685b', marginTop: 10 },
  statusTag: { backgroundColor: '#e9f8ee', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  statusProgress: { backgroundColor: '#0f5132' },
  statusTagText: { color: '#10b981', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  statusTagTextLight: { color: '#ffffff' },
  emergencyCard: { flexDirection: 'row', gap: 12, backgroundColor: '#0f5132', borderRadius: 24, padding: 16, alignItems: 'center' },
  emergencyIcon: { width: 44, height: 44, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  emergencyTitle: { color: '#ffffff', fontWeight: '900', fontSize: 15 },
  emergencyText: { color: 'rgba(255,255,255,0.8)', marginTop: 4, lineHeight: 18 },
})
