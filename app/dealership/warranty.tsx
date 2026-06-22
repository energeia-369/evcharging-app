import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { daysUntil, formatINR, warranties, warrantyAlerts } from '../../lib/mock/warrantyData'

export default function WarrantyManagement() {
  const router = useRouter()
  const [list] = useState(warranties)

  const alerts = useMemo(() => warrantyAlerts.filter(a => a.daysUntilExpiry <= 60), [])

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Warranty Management</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}><MaterialCommunityIcons name="close" size={18} color="#064E3B" /></TouchableOpacity>
        </View>

        <View style={styles.alertsRow}>
          {alerts.length ? alerts.map((a) => (
            <View key={a.warrantyId} style={styles.alertCard}><MaterialCommunityIcons name="alert-circle-outline" size={16} color="#B45309" /><Text style={styles.alertText}>{a.message} • {a.daysUntilExpiry} days</Text></View>
          )) : <Text style={styles.noAlerts}>No critical warranty alerts</Text>}
        </View>

        {list.map((w) => (
          <View key={w.id} style={styles.card}>
            <View style={styles.cardTop}><Text style={styles.vehicleName}>{w.vehicleName}</Text><Text style={styles.vin}>{w.vin}</Text></View>
            <View style={styles.metaRow}><Text style={styles.metaLabel}>Purchase</Text><Text style={styles.metaValue}>{w.purchaseDate}</Text></View>
            <View style={styles.metaRow}><Text style={styles.metaLabel}>Expiry</Text><Text style={[styles.metaValue, daysUntil(w.expiryDate) < 30 && { color: '#B91C1C' }]}>{w.expiryDate} • {daysUntil(w.expiryDate)}d left</Text></View>

            <View style={styles.section}><Text style={styles.sectionTitle}>Covered Services</Text>{w.coveredServices.map(s => <Text key={s} style={styles.serviceItem}>• {s}</Text>)}</View>

            <View style={styles.section}><Text style={styles.sectionTitle}>Battery Warranty</Text><Text style={styles.serviceItem}>{w.batteryWarrantyYears} years</Text></View>

            <View style={styles.section}><Text style={styles.sectionTitle}>Extended Options</Text>{w.extendedOptions?.length ? w.extendedOptions.map(e => (
              <View key={e.id} style={styles.extRow}><Text style={styles.extName}>{e.name} • {e.termYears} yrs</Text><Text style={styles.extPrice}>{formatINR(e.price)}</Text></View>
            )) : <Text style={styles.serviceItem}>No extended cover</Text>}</View>

            <View style={styles.actionsRow}><TouchableOpacity style={styles.primaryBtn}><Text style={styles.primaryBtnText}>Extend Warranty</Text></TouchableOpacity><TouchableOpacity onPress={() => router.push(`/dealership/warranty-detail?warrantyId=${w.id}`)} style={styles.ghostBtn}><Text style={styles.ghostBtnText}>View Details</Text></TouchableOpacity></View>
          </View>
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
  alertsRow: { marginBottom: 12 },
  alertCard: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: '#FFFBEB', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#FDE68A', marginBottom: 8 },
  alertText: { color: '#92400E', marginLeft: 8 },
  noAlerts: { color: '#064E3B' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vehicleName: { color: '#064E3B', fontWeight: '900' },
  vin: { color: '#94A3B8', fontSize: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  metaLabel: { color: '#047857', fontWeight: '800' },
  metaValue: { color: '#064E3B', fontWeight: '900' },
  section: { marginTop: 10 },
  sectionTitle: { color: '#047857', fontWeight: '900', marginBottom: 6 },
  serviceItem: { color: '#064E3B', marginBottom: 4 },
  extRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  extName: { color: '#064E3B' },
  extPrice: { color: '#047857', fontWeight: '900' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  primaryBtn: { backgroundColor: '#059669', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '900' },
  ghostBtn: { borderWidth: 1, borderColor: '#ECFDF5', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  ghostBtnText: { color: '#064E3B', fontWeight: '900' },
})
