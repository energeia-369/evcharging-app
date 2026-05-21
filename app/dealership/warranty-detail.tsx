import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { daysUntil, formatINR, warranties } from '../../lib/mock/warrantyData'

export default function WarrantyDetail() {
  const router = useRouter()
  const { warrantyId } = useLocalSearchParams() as { warrantyId?: string }
  const w = warranties.find(item => item.id === warrantyId) || warranties[0]

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}><MaterialCommunityIcons name="arrow-left" size={20} color="#064E3B" /></TouchableOpacity>
          <Text style={styles.title}>Warranty • {w.vehicleName}</Text>
        </View>

        <View style={styles.card}><Text style={styles.label}>VIN</Text><Text style={styles.value}>{w.vin}</Text></View>
        <View style={styles.card}><Text style={styles.label}>Purchase Date</Text><Text style={styles.value}>{w.purchaseDate}</Text></View>
        <View style={styles.card}><Text style={styles.label}>Expiry</Text><Text style={styles.value}>{w.expiryDate} • {daysUntil(w.expiryDate)} days left</Text></View>

        <View style={styles.card}><Text style={styles.label}>Covered Services</Text>{w.coveredServices.map(s => <Text key={s} style={styles.listItem}>• {s}</Text>)}</View>

        <View style={styles.card}><Text style={styles.label}>Extended Options</Text>{w.extendedOptions?.length ? w.extendedOptions.map(e => <Text key={e.id} style={styles.listItem}>{e.name} • {e.termYears} yrs • {formatINR(e.price)}</Text>) : <Text style={styles.listEmpty}>No extended options</Text>}</View>

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
  title: { fontSize: 18, fontWeight: '900', color: '#064E3B' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  label: { color: '#047857', fontWeight: '900', marginBottom: 6 },
  value: { color: '#064E3B', fontWeight: '900' },
  listItem: { color: '#064E3B', marginBottom: 6 },
  listEmpty: { color: '#94A3B8' },
})
