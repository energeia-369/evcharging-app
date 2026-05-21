import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { formatCurrency, getBooking, getInvoice } from '../../lib/mock/serviceData'

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export default function Invoice() {
  const params = useLocalSearchParams<{ invoiceId?: string; bookingId?: string }>()
  const router = useRouter()
  const invoiceId = paramValue(params.invoiceId)
  const bookingId = paramValue(params.bookingId)
  const invoice = useMemo(() => getInvoice(invoiceId), [invoiceId])
  const resolvedBookingId = bookingId || invoice?.bookingId || ''
  const booking = useMemo(() => getBooking(resolvedBookingId), [resolvedBookingId])

  if (!invoice) {
    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="file-document-outline" size={32} color="#1B7F4B" />
        <Text style={styles.emptyTitle}>Invoice not found</Text>
        <Text style={styles.emptySubtitle}>The payment receipt is unavailable in the mock store.</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.receiptHero}>
        <MaterialCommunityIcons name="receipt-text-check-outline" size={26} color="#1B7F4B" />
        <Text style={styles.receiptTitle}>Payment receipt</Text>
        <Text style={styles.receiptAmount}>{formatCurrency(invoice.amount)}</Text>
        <Text style={styles.receiptMeta}>{invoice.paid ? 'Paid successfully' : 'Pending payment'}</Text>
      </View>

      <View style={styles.infoCard}>
        <InfoRow icon="identifier" label="Invoice ID" value={invoice.id} />
        <InfoRow icon="calendar-check" label="Booking ID" value={invoice.bookingId} />
        <InfoRow icon="garage" label="Service center" value={booking?.centerName ?? 'Unknown center'} />
        <InfoRow icon="car-electric-outline" label="Vehicle" value={booking?.vehicleName ?? 'Unknown vehicle'} />
        <InfoRow icon="cash" label="Amount" value={formatCurrency(invoice.amount)} />
      </View>

      <Pressable style={styles.ctaButton} onPress={() => router.push('/service-center/history')}>
        <Text style={styles.ctaText}>View booking history</Text>
      </Pressable>
    </ScrollView>
  )
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <MaterialCommunityIcons name={icon as any} size={18} color="#1B7F4B" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 36 },
  receiptHero: { backgroundColor: '#0F5132', borderRadius: 28, padding: 18, alignItems: 'center' },
  receiptTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginTop: 10 },
  receiptAmount: { color: '#FFFFFF', fontSize: 30, fontWeight: '900', marginTop: 10 },
  receiptMeta: { color: 'rgba(255,255,255,0.82)', marginTop: 8 },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, marginTop: 16, borderWidth: 1, borderColor: '#E3EFE6' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  infoIconWrap: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECF9EF', alignItems: 'center', justifyContent: 'center' },
  infoLabel: { color: '#6B7D72', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  infoValue: { color: '#0F5132', fontSize: 14, fontWeight: '900', marginTop: 4 },
  ctaButton: { marginTop: 18, backgroundColor: '#1B7F4B', borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
  ctaText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F4FBF6' },
  emptyTitle: { marginTop: 10, color: '#0F5132', fontSize: 18, fontWeight: '900' },
  emptySubtitle: { marginTop: 8, color: '#6B7D72', textAlign: 'center', lineHeight: 20 },
})
