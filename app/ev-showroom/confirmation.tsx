import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function ConfirmationScreen() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="check-circle" size={56} color="#10B981" />
          </View>
          <Text style={styles.title}>Booking confirmed</Text>
          <Text style={styles.subtitle}>Your EV reservation has been successfully processed. Delivery preparation is underway.</Text>
          <View style={styles.detailList}>
            {[
              { label: 'Booking ID', value: 'BK-324578' },
              { label: 'Vehicle', value: 'Nexa Volt X' },
              { label: 'Delivery date', value: '15 Jun 2026' },
              { label: 'Showroom', value: 'Green City EV Showroom' },
              { label: 'Amount', value: '₹20,000' },
              { label: 'Delivery timeline', value: '5-7 days' },
            ].map((item) => (
              <View key={item.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.push('/ev-showroom/tracking')}>
              <Text style={styles.buttonText}>Track Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={() => alert('Receipt generated')}>
              <Text style={styles.buttonSecondaryText}>Download Receipt</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.contactButton} onPress={() => alert('Contact showroom simulated')}>
            <Text style={styles.contactText}>Contact Showroom</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 36 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 20, elevation: 3 },
  iconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  title: { color: '#064E3B', fontSize: 24, fontWeight: '900', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#14532D', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  detailList: { gap: 12, marginBottom: 24 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ECFDF5' },
  detailLabel: { color: '#0F766E', fontSize: 13, fontWeight: '700' },
  detailValue: { color: '#064E3B', fontSize: 13, fontWeight: '900' },
  buttonsRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  buttonPrimary: { flex: 1, backgroundColor: '#10B981', borderRadius: 18, paddingVertical: 14, alignItems: 'center' },
  buttonSecondary: { flex: 1, backgroundColor: '#ECFDF5', borderRadius: 18, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '900' },
  buttonSecondaryText: { color: '#064E3B', fontWeight: '900' },
  contactButton: { alignItems: 'center', marginTop: 6 },
  contactText: { color: '#10B981', fontWeight: '900' },
})
