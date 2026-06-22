import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { customerAnalytics, customers } from '../../lib/mock/customerData'

export default function DealershipCRM() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [list, setList] = useState(customers)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(c => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
  }, [query, list])

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Customer CRM</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}><MaterialCommunityIcons name="close" size={18} color="#064E3B" /></TouchableOpacity>
        </View>

        <View style={styles.analyticsRow}>
          <View style={styles.analyticsCard}><Text style={styles.analyticsKicker}>Total Customers</Text><Text style={styles.analyticsValue}>{customerAnalytics.totalCustomers}</Text></View>
          <View style={styles.analyticsCard}><Text style={styles.analyticsKicker}>Premium</Text><Text style={styles.analyticsValue}>{customerAnalytics.premiumCustomers}</Text></View>
          <View style={styles.analyticsCard}><Text style={styles.analyticsKicker}>Loyalty Points</Text><Text style={styles.analyticsValue}>{customerAnalytics.totalLoyaltyPoints}</Text></View>
        </View>

        <View style={styles.searchRow}>
          <TextInput placeholder="Search customers, email, city" value={query} onChangeText={setQuery} style={styles.searchInput} />
        </View>

        {filtered.map((c) => (
          <TouchableOpacity key={c.id} style={styles.card} onPress={() => router.push(`/dealership/customer-detail?customerId=${c.id}`)}>
            <View style={styles.cardLeft}>
              <View style={[styles.avatar, c.premium && { backgroundColor: '#10B981' }]}><Text style={styles.avatarText}>{c.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</Text></View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.name}>{c.name} {c.premium && <Text style={styles.premiumBadge}>Premium</Text>}</Text>
                <Text style={styles.meta}>{c.city} • {c.email}</Text>
                <Text style={styles.meta}>Loyalty: {c.loyaltyPoints}</Text>
              </View>
            </View>

            <View style={styles.cardRight}>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${c.phone}`)} style={styles.contactBtn}><MaterialCommunityIcons name="phone" size={16} color="#FFFFFF" /></TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(`mailto:${c.email}`)} style={[styles.contactBtn, { backgroundColor: '#ECFDF5', marginTop: 8 }]}><MaterialCommunityIcons name="email" size={16} color="#059669" /></TouchableOpacity>
            </View>

            <View style={styles.historyWrap}>
              <Text style={styles.historyHeading}>Recent Activity</Text>
              <View style={styles.historyRow}><Text style={styles.historyLabel}>Bookings</Text><Text style={styles.historyValue}>{c.bookings.length}</Text></View>
              <View style={styles.historyRow}><Text style={styles.historyLabel}>Purchases</Text><Text style={styles.historyValue}>{c.purchases.length}</Text></View>
              <View style={styles.historyRow}><Text style={styles.historyLabel}>Services</Text><Text style={styles.historyValue}>{c.services.length}</Text></View>
              <View style={styles.wishlistRow}><Text style={styles.historyLabel}>Wishlist</Text>{c.wishlist.length ? c.wishlist.map(w => <Text key={w} style={styles.wishlistItem}>{w}</Text>) : <Text style={styles.wishlistEmpty}>—</Text>}</View>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 48 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: '#064E3B', fontSize: 20, fontWeight: '900' },
  closeButton: { padding: 8, borderRadius: 8, backgroundColor: '#ECFDF5' },
  analyticsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  analyticsCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#ECFDF5' },
  analyticsKicker: { color: '#047857', fontSize: 12, fontWeight: '900' },
  analyticsValue: { color: '#064E3B', fontSize: 18, fontWeight: '900', marginTop: 6 },
  searchRow: { marginBottom: 12 },
  searchInput: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#E6F9F0', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#064E3B', fontWeight: '900' },
  name: { color: '#064E3B', fontWeight: '900' },
  premiumBadge: { color: '#10B981', fontWeight: '900', marginLeft: 8 },
  meta: { color: '#14532D', fontSize: 12 },
  cardRight: { position: 'absolute', right: 12, top: 12, alignItems: 'flex-end' },
  contactBtn: { backgroundColor: '#059669', padding: 8, borderRadius: 8, marginBottom: 6 },
  historyWrap: { marginTop: 12, borderTopWidth: 1, borderColor: '#F1F7F3', paddingTop: 10 },
  historyHeading: { color: '#047857', fontWeight: '900', marginBottom: 8 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  historyLabel: { color: '#064E3B' },
  historyValue: { color: '#047857', fontWeight: '900' },
  wishlistRow: { marginTop: 8 },
  wishlistItem: { color: '#064E3B', backgroundColor: '#F8FFFB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 6, alignSelf: 'flex-start' },
  wishlistEmpty: { color: '#94A3B8' },
})
