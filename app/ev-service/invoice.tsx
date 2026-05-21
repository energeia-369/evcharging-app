import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { PremiumCard, SectionHeader } from '../../components/ev-service/Shared'
import { useEvServiceBooking } from '../../context/booking-context'
import { formatCurrency } from '../../lib/mock/evServiceData'

export default function InvoiceScreen() {
  const router = useRouter()
  const { activeBookingId, bookings, setActiveBookingId } = useEvServiceBooking()
  const booking = useMemo(() => bookings.find(item => item.id === activeBookingId) ?? bookings[0], [activeBookingId, bookings])

  if (!booking) {
    return <View style={styles.empty}><Text style={styles.emptyText}>Invoice not available</Text></View>
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <Text style={styles.heroKicker}>Step 7 of 8</Text>
        <Text style={styles.heroTitle}>Invoice</Text>
        <Text style={styles.heroAmount}>{booking.invoiceNumber}</Text>
        <Text style={styles.heroSubtitle}>Payment status: {booking.paymentStatus}</Text>
      </View>

      <PremiumCard>
        <Text style={styles.sectionTitle}>Service center details</Text>
        <Text style={styles.cardLine}>{booking.centerName}</Text>
        <Text style={styles.cardLine}>{booking.centerAddress}</Text>
      </PremiumCard>

      <SectionHeader title="Vehicle and service" subtitle="Service items are stored locally" />
      <PremiumCard>
        <InfoRow label="Vehicle" value={`${booking.vehicleName} • ${booking.vehiclePlate}`} />
        <InfoRow label="Service item" value={booking.serviceName} />
        <InfoRow label="Technician" value={`${booking.technicianName} • ${booking.technicianRole}`} />
      </PremiumCard>

      <SectionHeader title="Billing summary" subtitle="GST and totals computed from mock state" />
      <PremiumCard>
        <InfoRow label="Service fee" value={formatCurrency(booking.estimatedCost)} />
        <InfoRow label="GST" value={formatCurrency(booking.taxAmount)} />
        <InfoRow label="Total amount" value={formatCurrency(booking.totalAmount)} emphasis />
        <InfoRow label="Status" value={booking.paymentStatus} emphasis />
      </PremiumCard>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton} onPress={() => Alert.alert('Download invoice', booking.invoiceNumber)}>
          <MaterialCommunityIcons name="download" size={18} color="#0f5132" />
          <Text style={styles.actionText}>Download invoice</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => Alert.alert('Share invoice', booking.invoiceNumber)}>
          <MaterialCommunityIcons name="share-variant" size={18} color="#0f5132" />
          <Text style={styles.actionText}>Share invoice</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.historyButton}
        onPress={() => {
          setActiveBookingId(booking.id)
          router.push('/ev-service/history')
        }}
      >
        <Text style={styles.historyText}>View History</Text>
        <MaterialCommunityIcons name="history" size={18} color="#ffffff" />
      </Pressable>
    </ScrollView>
  )
}

function InfoRow({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, emphasis && styles.infoValueEmphasis]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4fbf6' },
  container: { padding: 16, paddingBottom: 36 },
  heroCard: { backgroundColor: '#0f5132', borderRadius: 28, padding: 18, marginBottom: 14 },
  heroKicker: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  heroTitle: { color: '#ffffff', fontSize: 24, fontWeight: '900', marginTop: 8 },
  heroAmount: { color: '#ffffff', fontSize: 26, fontWeight: '900', marginTop: 8 },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', marginTop: 8 },
  sectionTitle: { color: '#0f5132', fontWeight: '900', fontSize: 16, marginBottom: 10 },
  cardLine: { color: '#4f685b', marginTop: 6, lineHeight: 18 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { color: '#6b7d72', fontWeight: '800' },
  infoValue: { color: '#0f5132', fontWeight: '800', flex: 1, textAlign: 'right', marginLeft: 12 },
  infoValueEmphasis: { color: '#10b981', fontWeight: '900' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#ffffff', borderRadius: 18, paddingVertical: 14, borderWidth: 1, borderColor: '#e2efe5' },
  actionText: { color: '#0f5132', fontWeight: '900' },
  historyButton: { marginTop: 18, backgroundColor: '#0f5132', borderRadius: 20, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  historyText: { color: '#ffffff', fontWeight: '900', fontSize: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4fbf6' },
  emptyText: { color: '#0f5132', fontWeight: '900' },
})
