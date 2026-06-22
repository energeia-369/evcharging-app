import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function TestDriveSuccessScreen() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.successRing}>
            <MaterialCommunityIcons name="check-circle" size={56} color="#10B981" />
          </View>
          <Text style={styles.title}>Test drive booked!</Text>
          <Text style={styles.subtitle}>Your preview drive request has been confirmed with the showroom team. A specialist will reach out shortly.</Text>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>Tomorrow</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>11:30 AM</Text>
            </View>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/ev-showroom/quotation')}>
              <Text style={styles.actionButtonText}>Get Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]} onPress={() => router.push('/ev-showroom/booking')}>
              <Text style={[styles.actionButtonText, styles.actionButtonSecondaryText]}>Reserve Vehicle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 28, alignItems: 'center', shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 20, elevation: 3 },
  successRing: { width: 108, height: 108, borderRadius: 54, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  title: { color: '#064E3B', fontSize: 24, fontWeight: '900', marginBottom: 12, textAlign: 'center' },
  subtitle: { color: '#14532D', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  detailRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 22 },
  detailItem: { flex: 1, padding: 16, backgroundColor: '#ECFDF5', borderRadius: 22, marginHorizontal: 4 },
  detailLabel: { color: '#065F46', fontSize: 12, marginBottom: 6, fontWeight: '700' },
  detailValue: { color: '#064E3B', fontSize: 16, fontWeight: '900' },
  actionRow: { flexDirection: 'row', width: '100%', gap: 12 },
  actionButton: { flex: 1, backgroundColor: '#10B981', borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  actionButtonSecondary: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#10B981' },
  actionButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  actionButtonSecondaryText: { color: '#064E3B' },
})
