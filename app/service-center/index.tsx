import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { serviceCenters } from '../../lib/mock/serviceData'

function formatDistance(distanceKm: number) {
  return `${distanceKm.toFixed(1)} km away`
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const centers = useMemo(() => {
    const search = query.trim().toLowerCase()
    return serviceCenters.filter(center => {
      if (!search) return true
      return (
        center.name.toLowerCase().includes(search) ||
        center.address.toLowerCase().includes(search) ||
        center.services.join(' ').toLowerCase().includes(search) ||
        center.categories.join(' ').toLowerCase().includes(search)
      )
    })
  }, [query])

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroAccent} />
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.kicker}>Green EV Service</Text>
              <Text style={styles.heroTitle}>Book premium EV care in minutes.</Text>
              <Text style={styles.heroSubtitle}>Start with a service center, then follow the full mock flow with live booking updates.</Text>
            </View>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="ev-station" size={28} color="#0F5132" />
            </View>
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.statChip}><Text style={styles.statValue}>{serviceCenters.length}</Text><Text style={styles.statLabel}>Centers</Text></View>
            <View style={styles.statChip}><Text style={styles.statValue}>7</Text><Text style={styles.statLabel}>Flow steps</Text></View>
            <View style={styles.statChip}><Text style={styles.statValue}>24/7</Text><Text style={styles.statLabel}>Mock support</Text></View>
          </View>
        </View>

        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color="#6B7D72" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search center, service, or category"
            placeholderTextColor="#8DA197"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Choose a service center</Text>
          <Text style={styles.sectionMeta}>{centers.length} options available</Text>
        </View>

        {loading ? (
          <View style={styles.loadingStack}>
            {[0, 1, 2].map(index => (
              <View key={index} style={styles.loadingCard}>
                <View style={styles.loadingBadge} />
                <View style={{ flex: 1 }}>
                  <View style={styles.loadingLine} />
                  <View style={[styles.loadingLine, { width: '72%' }]} />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            data={centers}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable style={({ pressed }) => [styles.centerCard, pressed && styles.pressedCard]} onPress={() => router.push(`/service-center/details?centerId=${item.id}`)}>
                <View style={styles.cardHeader}>
                  <View style={styles.centerAvatar}>
                    <MaterialCommunityIcons name="garage" size={24} color="#1B7F4B" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.address}</Text>
                  </View>
                  <View style={styles.ratingPill}>
                    <MaterialCommunityIcons name="star" size={14} color="#D5A100" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="map-marker-outline" size={16} color="#1B7F4B" />
                    <Text style={styles.metaText}>{formatDistance(item.distanceKm)}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="leaf" size={16} color="#1B7F4B" />
                    <Text style={styles.metaText}>EV ready</Text>
                  </View>
                </View>

                <View style={styles.chipRow}>
                  {item.categories.map(category => (
                    <View key={category} style={styles.categoryChip}><Text style={styles.categoryChipText}>{category}</Text></View>
                  ))}
                </View>

                <View style={styles.serviceRow}>
                  {item.services.slice(0, 3).map(service => (
                    <View key={service} style={styles.serviceChip}><Text style={styles.serviceChipText}>{service}</Text></View>
                  ))}
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.footerText}>Tap to select this center</Text>
                  <MaterialCommunityIcons name="chevron-right" size={22} color="#1B7F4B" />
                </View>
              </Pressable>
            )}
          />
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 36 },
  hero: {
    backgroundColor: '#E4F8EA',
    borderRadius: 28,
    padding: 18,
    overflow: 'hidden',
    marginBottom: 16,
  },
  heroAccent: {
    position: 'absolute',
    right: -44,
    top: -44,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(27, 127, 75, 0.12)',
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  kicker: { color: '#1B7F4B', fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroTitle: { color: '#0F5132', fontSize: 28, fontWeight: '900', lineHeight: 34, marginTop: 8, maxWidth: 240 },
  heroSubtitle: { color: '#4F685B', fontSize: 14, lineHeight: 20, marginTop: 10, maxWidth: 300 },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B7F4B',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  heroStatsRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  statChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#0F5132',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  statValue: { color: '#0F5132', fontSize: 18, fontWeight: '900' },
  statLabel: { color: '#6B7D72', fontSize: 12, marginTop: 2 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 54,
    borderWidth: 1,
    borderColor: '#DDECE2',
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 10, color: '#123524', fontSize: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  sectionTitle: { color: '#0F5132', fontSize: 18, fontWeight: '900' },
  sectionMeta: { color: '#6B7D72', fontSize: 12 },
  loadingStack: { gap: 12 },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    shadowColor: '#0F5132',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 1,
  },
  loadingBadge: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#E7F4EB' },
  loadingLine: { height: 12, width: '88%', backgroundColor: '#E7F0E9', borderRadius: 999, marginBottom: 8 },
  listContent: { paddingBottom: 18, gap: 14 },
  centerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 16,
    shadowColor: '#0F5132',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDF5EF',
  },
  pressedCard: { transform: [{ scale: 0.99 }], opacity: 0.97 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  centerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#ECF9EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: '#0F5132', fontSize: 18, fontWeight: '900' },
  cardSubtitle: { color: '#6B7D72', fontSize: 13, marginTop: 3, lineHeight: 18 },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7E3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  ratingText: { color: '#8A6711', fontWeight: '900', fontSize: 13 },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 14, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: '#4F685B', fontSize: 13, fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  categoryChip: {
    backgroundColor: '#EDF8F1',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryChipText: { color: '#1B7F4B', fontSize: 12, fontWeight: '800' },
  serviceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  serviceChip: {
    backgroundColor: '#F4FBF6',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#DCECE1',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  serviceChipText: { color: '#496157', fontSize: 12, fontWeight: '700' },
  cardFooter: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { color: '#1B7F4B', fontSize: 13, fontWeight: '800' },
})
