import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { PremiumCard, SectionHeader, SkeletonCard } from '../../components/ev-service/Shared'
import { useEvServiceBooking } from '../../context/booking-context'
import { getServiceCenter, serviceCategories } from '../../lib/mock/evServiceData'

export default function ServiceDetailsScreen() {
  const router = useRouter()
  const { draft, setDraft } = useEvServiceBooking()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [draft.centerId])

  const center = useMemo(() => getServiceCenter(draft.centerId), [draft.centerId])

  if (loading) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
        <SkeletonCard />
        <View style={{ height: 12 }} />
        <SkeletonCard />
      </ScrollView>
    )
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroImageCard}>
        <Image source={require('../../assets/images/icon.png')} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroOverlayTitle}>{center.name}</Text>
          <Text style={styles.heroOverlayText}>{center.imageLabel}</Text>
        </View>
      </View>

      <View style={styles.centerHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.centerName}>{center.name}</Text>
          <Text style={styles.centerAddress}>{center.address}</Text>
        </View>
        <View style={styles.ratingChip}>
          <MaterialCommunityIcons name="star" size={14} color="#d97706" />
          <Text style={styles.ratingText}>{center.rating}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaChip}><MaterialCommunityIcons name="map-marker-radius" size={16} color="#10b981" /><Text style={styles.metaText}>{(center.distanceKm ?? 0).toFixed(1)} km away</Text></View>
        <View style={styles.metaChip}><MaterialCommunityIcons name="clock-check-outline" size={16} color="#10b981" /><Text style={styles.metaText}>{center.openStatus} • Closes {center.closingTime}</Text></View>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton} onPress={() => Alert.alert('Call Center', center.phone)}>
          <MaterialCommunityIcons name="phone-outline" size={18} color="#0f5132" />
          <Text style={styles.actionText}>Call Center</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => Alert.alert('Directions', 'Mock directions opened for this service center.')}>
          <MaterialCommunityIcons name="navigation-outline" size={18} color="#0f5132" />
          <Text style={styles.actionText}>Get Directions</Text>
        </Pressable>
      </View>

      <SectionHeader title="Available services" subtitle="Pick a service category to continue booking" />
      <View style={styles.serviceGrid}>
        {serviceCategories.map(service => (
          <PremiumCard key={service.id} style={styles.serviceCard}>
            <MaterialCommunityIcons name={service.icon as any} size={20} color="#10b981" />
            <Text style={styles.serviceTitle}>{service.name}</Text>
            <Text style={styles.serviceMeta}>{service.durationMins} mins • {service.price}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
          </PremiumCard>
        ))}
      </View>

      <SectionHeader title="Technicians" subtitle="Experienced specialists assigned to your EV" />
      <View style={{ gap: 12 }}>
        {center.technicians.map(technician => (
          <PremiumCard key={technician.name}>
            <View style={styles.technicianRow}>
              <View style={styles.technicianAvatar}>
                <MaterialCommunityIcons name="account-tie-outline" size={20} color="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.technicianName}>{technician.name}</Text>
                <Text style={styles.technicianMeta}>{technician.role} • {technician.experienceYears} yrs experience</Text>
              </View>
              <View style={styles.ratingChip}>
                <MaterialCommunityIcons name="star" size={14} color="#d97706" />
                <Text style={styles.ratingText}>{technician.rating}</Text>
              </View>
            </View>
          </PremiumCard>
        ))}
      </View>

      <SectionHeader title="Service highlights" subtitle="A premium EV service experience" />
      <View style={styles.highlightRow}>
        <View style={styles.highlightPill}><Text style={styles.highlightText}>Fast turnaround</Text></View>
        <View style={styles.highlightPill}><Text style={styles.highlightText}>Pickup available</Text></View>
        <View style={styles.highlightPill}><Text style={styles.highlightText}>Warranty-safe process</Text></View>
      </View>

      <Pressable
        style={styles.bookButton}
        onPress={() => {
          setDraft(previous => ({ ...previous, centerId: center.id }))
          router.push('/ev-service/book-service')
        }}
      >
        <Text style={styles.bookButtonText}>Book Service</Text>
        <MaterialCommunityIcons name="arrow-right" size={18} color="#ffffff" />
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4fbf6' },
  container: { padding: 16, paddingBottom: 36 },
  heroImageCard: { height: 210, borderRadius: 28, overflow: 'hidden', backgroundColor: '#dff4e6', marginBottom: 14 },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.7 },
  heroOverlay: { position: 'absolute', left: 16, right: 16, bottom: 16, backgroundColor: 'rgba(15,81,50,0.88)', borderRadius: 22, padding: 14 },
  heroOverlayTitle: { color: '#ffffff', fontSize: 18, fontWeight: '900' },
  heroOverlayText: { color: 'rgba(255,255,255,0.85)', marginTop: 6, lineHeight: 18 },
  centerHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  centerName: { color: '#0f5132', fontSize: 22, fontWeight: '900' },
  centerAddress: { color: '#6b7d72', marginTop: 6, lineHeight: 19 },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff7ed', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  ratingText: { color: '#9a3412', fontWeight: '900', fontSize: 12 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#e2efe5' },
  metaText: { color: '#4f685b', fontSize: 12, fontWeight: '800' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#ffffff', borderRadius: 18, paddingVertical: 14, borderWidth: 1, borderColor: '#e2efe5' },
  actionText: { color: '#0f5132', fontWeight: '900' },
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  serviceCard: { flexBasis: '48%', flexGrow: 1, gap: 6 },
  serviceTitle: { color: '#0f5132', fontWeight: '900', fontSize: 14, marginTop: 8 },
  serviceMeta: { color: '#10b981', fontWeight: '800', fontSize: 12 },
  serviceDescription: { color: '#6b7d72', lineHeight: 18, fontSize: 12 },
  technicianRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  technicianAvatar: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  technicianName: { color: '#0f5132', fontWeight: '900' },
  technicianMeta: { color: '#6b7d72', marginTop: 4, fontSize: 12 },
  highlightRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  highlightPill: { backgroundColor: '#eaf8ee', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10 },
  highlightText: { color: '#0f5132', fontWeight: '900', fontSize: 12 },
  bookButton: { marginTop: 18, backgroundColor: '#0f5132', borderRadius: 20, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  bookButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 16 },
})
