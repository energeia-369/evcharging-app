import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { customers } from '../../lib/mock/customerData'

export default function CustomerDetail() {
  const router = useRouter()
  const { customerId } = useLocalSearchParams() as { customerId?: string }
  const customer = customers.find(c => c.id === customerId) || customers[0]

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}><MaterialCommunityIcons name="arrow-left" size={20} color="#064E3B" /></TouchableOpacity>
          <Text style={styles.title}>{customer.name}</Text>
        </View>

        <View style={styles.card}><Text style={styles.label}>Contact</Text><Text style={styles.value}>{customer.phone} • {customer.email}</Text></View>
        <View style={styles.card}><Text style={styles.label}>City</Text><Text style={styles.value}>{customer.city}</Text></View>
        <View style={styles.card}><Text style={styles.label}>Loyalty Points</Text><Text style={styles.value}>{customer.loyaltyPoints}</Text></View>

        <View style={styles.card}><Text style={styles.label}>Recent Bookings</Text>{customer.bookings.map(b => <Text key={b.id} style={styles.listItem}>{b.date} • {b.center} • {b.service} ({b.status})</Text>)}</View>

        <View style={styles.card}><Text style={styles.label}>Purchases</Text>{customer.purchases.length ? customer.purchases.map(p => <Text key={p.id} style={styles.listItem}>{p.date} • {p.vehicle} • ₹{(p.price/100).toFixed(0)}</Text>) : <Text style={styles.listEmpty}>No purchases</Text>}</View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 48 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  backButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: '#064E3B' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  label: { color: '#047857', fontWeight: '900', marginBottom: 6 },
  value: { color: '#064E3B', fontWeight: '900' },
  listItem: { color: '#064E3B', marginBottom: 6 },
  listEmpty: { color: '#94A3B8' },
})
