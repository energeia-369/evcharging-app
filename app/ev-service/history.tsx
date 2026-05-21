import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { PremiumCard, SectionHeader } from '../../components/ev-service/Shared'
import { useEvServiceBooking } from '../../context/booking-context'
import { formatCurrency } from '../../lib/mock/evServiceData'

type FilterKey = 'all' | 'completed' | 'cancelled' | 'upcoming'

export default function ServiceHistoryScreen() {
  const router = useRouter()
  const { bookings, setActiveBookingId } = useEvServiceBooking()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')

  const filteredBookings = useMemo(() => {
    const term = query.trim().toLowerCase()
    return bookings.filter(booking => {
      const matchesQuery = !term || [booking.bookingNumber, booking.centerName, booking.vehicleName, booking.serviceName, booking.status].join(' ').toLowerCase().includes(term)
      const matchesFilter = filter === 'all' || booking.status === filter
      return matchesQuery && matchesFilter
    })
  }, [bookings, filter, query])

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#10b981" />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search bookings, vehicles, centers" placeholderTextColor="#8da197" style={styles.searchInput} />
      </View>

      <SectionHeader title="Booking history" subtitle="Completed, cancelled, and upcoming services" />
      <View style={styles.filterRow}>
        {(['all', 'upcoming', 'completed', 'cancelled'] as FilterKey[]).map(key => (
          <Pressable key={key} style={[styles.filterChip, filter === key && styles.filterChipActive]} onPress={() => setFilter(key)}>
            <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>{key}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ gap: 12 }}>
        {filteredBookings.map(booking => (
          <Pressable
            key={booking.id}
            style={({ pressed }) => [styles.historyCard, pressed && styles.pressed]}
            onPress={() => {
              setActiveBookingId(booking.id)
              router.push('/ev-service/invoice')
            }}
          >
            <View style={styles.cardRow}>
              <View style={styles.cardIcon}><MaterialCommunityIcons name="calendar-check-outline" size={20} color="#10b981" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{booking.serviceName}</Text>
                <Text style={styles.cardMeta}>{booking.centerName}</Text>
              </View>
              <View style={[styles.statusBadge, booking.status === 'completed' && styles.completedBadge, booking.status === 'cancelled' && styles.cancelledBadge]}>
                <Text style={[styles.statusText, (booking.status === 'completed' || booking.status === 'cancelled') && styles.statusTextLight]}>{booking.status}</Text>
              </View>
            </View>
            <Text style={styles.cardMeta}>{booking.date} • {booking.time} • {booking.vehicleName}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.bookingNumber}>{booking.bookingNumber}</Text>
              <Text style={styles.amount}>{formatCurrency(booking.totalAmount)}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="History summary" subtitle="Useful quick view of the local mock data" />
      <View style={styles.summaryGrid}>
        <PremiumCard style={styles.summaryCard}><Text style={styles.summaryValue}>{bookings.filter(booking => booking.status === 'completed').length}</Text><Text style={styles.summaryLabel}>Completed</Text></PremiumCard>
        <PremiumCard style={styles.summaryCard}><Text style={styles.summaryValue}>{bookings.filter(booking => booking.status === 'cancelled').length}</Text><Text style={styles.summaryLabel}>Cancelled</Text></PremiumCard>
        <PremiumCard style={styles.summaryCard}><Text style={styles.summaryValue}>{bookings.filter(booking => booking.status === 'upcoming').length}</Text><Text style={styles.summaryLabel}>Upcoming</Text></PremiumCard>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4fbf6' },
  container: { padding: 16, paddingBottom: 36 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffffff', borderRadius: 18, paddingHorizontal: 14, height: 52, borderWidth: 1, borderColor: '#e2efe5' },
  searchInput: { flex: 1, color: '#0f5132' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  filterChip: { backgroundColor: '#ffffff', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: '#e2efe5' },
  filterChipActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  filterText: { color: '#0f5132', fontWeight: '900', fontSize: 12, textTransform: 'capitalize' },
  filterTextActive: { color: '#ffffff' },
  historyCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#e2efe5' },
  pressed: { transform: [{ scale: 0.99 }] },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#0f5132', fontWeight: '900' },
  cardMeta: { color: '#6b7d72', marginTop: 4, fontSize: 12 },
  statusBadge: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  completedBadge: { backgroundColor: '#10b981' },
  cancelledBadge: { backgroundColor: '#ef4444' },
  statusText: { color: '#0f5132', fontWeight: '900', fontSize: 11, textTransform: 'uppercase' },
  statusTextLight: { color: '#ffffff' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' },
  bookingNumber: { color: '#10b981', fontWeight: '900', fontSize: 12 },
  amount: { color: '#0f5132', fontWeight: '900' },
  summaryGrid: { flexDirection: 'row', gap: 10 },
  summaryCard: { flex: 1 },
  summaryValue: { color: '#0f5132', fontSize: 24, fontWeight: '900' },
  summaryLabel: { color: '#6b7d72', marginTop: 4, fontWeight: '800' },
})
