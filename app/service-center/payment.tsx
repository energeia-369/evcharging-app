import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { addInvoice, formatCurrency, getBooking, getPaymentMethod, updateBooking } from '../../lib/mock/serviceData'

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export default function Payment() {
  const params = useLocalSearchParams<{ bookingId?: string }>()
  const router = useRouter()
  const bookingId = paramValue(params.bookingId)
  const booking = useMemo(() => getBooking(bookingId), [bookingId])
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [processing, setProcessing] = useState(false)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (booking?.paymentMethod) {
      setSelectedMethod(booking.paymentMethod)
    }
  }, [booking?.paymentMethod])

  if (!booking) {
    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="alert-circle-outline" size={32} color="#1B7F4B" />
        <Text style={styles.emptyTitle}>Payment unavailable</Text>
        <Text style={styles.emptySubtitle}>The booking could not be found in the local mock store.</Text>
      </View>
    )
  }

  const methods = ['upi', 'card', 'wallet', 'netbanking'].map(id => getPaymentMethod(id)).filter(Boolean)

  const pay = () => {
    setProcessing(true)
    setTimeout(() => {
      updateBooking(bookingId, { paymentMethod: selectedMethod, status: 'paid' })
      const invoice = addInvoice({ bookingId, amount: booking.estimatedAmount, paid: true })
      setProcessing(false)
      setPaid(true)
      setTimeout(() => {
        router.replace(`/service-center/tracking?bookingId=${bookingId}&invoiceId=${invoice.id}`)
      }, 900)
    }, 1200)
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.stepBadge}>
        <MaterialCommunityIcons name="numeric-5-circle-outline" size={18} color="#1B7F4B" />
        <Text style={styles.stepBadgeText}>Payment method selection</Text>
      </View>

      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Amount to pay</Text>
        <Text style={styles.amountValue}>{formatCurrency(booking.estimatedAmount)}</Text>
        <Text style={styles.amountMeta}>{booking.services.join(' • ')}</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Choose payment method</Text>
        <Text style={styles.sectionMeta}>Fake secure payment with local success response</Text>
      </View>

      <View style={styles.methodsGrid}>
        {methods.map(method => {
          if (!method) return null
          const active = method.id === selectedMethod
          return (
            <Pressable key={method.id} style={({ pressed }) => [styles.methodCard, active && styles.methodCardActive, pressed && styles.pressedCard]} onPress={() => setSelectedMethod(method.id)}>
              <View style={[styles.methodIconWrap, active && styles.methodIconWrapActive]}>
                <MaterialCommunityIcons name={method.icon as any} size={20} color={active ? '#FFFFFF' : '#1B7F4B'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.methodTitle, active && styles.methodTitleActive]}>{method.name}</Text>
                <Text style={[styles.methodSubtitle, active && styles.methodSubtitleActive]}>{method.subtitle}</Text>
              </View>
              {active ? <MaterialCommunityIcons name="check-circle" size={22} color="#FFFFFF" /> : <MaterialCommunityIcons name="chevron-right" size={20} color="#8DA197" />}
            </Pressable>
          )
        })}
      </View>

      <View style={styles.noticeCard}>
        <MaterialCommunityIcons name="shield-check-outline" size={22} color="#1B7F4B" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.noticeTitle}>Protected mock checkout</Text>
          <Text style={styles.noticeText}>This is a front-end only flow. No real payment gateway or backend is used.</Text>
        </View>
      </View>

      {paid ? (
        <View style={styles.successCard}>
          <MaterialCommunityIcons name="check-decagram" size={26} color="#1B7F4B" />
          <Text style={styles.successTitle}>Payment successful</Text>
          <Text style={styles.successText}>Your booking is now live and tracking has started.</Text>
        </View>
      ) : null}

      <Pressable style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]} onPress={pay} disabled={processing}>
        {processing ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.ctaText}>Pay securely</Text>}
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 36 },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDEDE2',
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  stepBadgeText: { color: '#1B7F4B', fontSize: 12, fontWeight: '800' },
  amountCard: { backgroundColor: '#0F5132', borderRadius: 26, padding: 18 },
  amountLabel: { color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, fontWeight: '800' },
  amountValue: { color: '#FFFFFF', fontSize: 30, fontWeight: '900', marginTop: 8 },
  amountMeta: { color: 'rgba(255,255,255,0.88)', marginTop: 8 },
  sectionHeader: { marginTop: 18, marginBottom: 12 },
  sectionTitle: { color: '#0F5132', fontSize: 18, fontWeight: '900' },
  sectionMeta: { color: '#6B7D72', fontSize: 12, marginTop: 4 },
  methodsGrid: { gap: 10 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#DDEDE2',
    padding: 14,
  },
  methodCardActive: { backgroundColor: '#1B7F4B', borderColor: '#1B7F4B' },
  pressedCard: { transform: [{ scale: 0.99 }] },
  methodIconWrap: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#EDF8F1', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  methodIconWrapActive: { backgroundColor: 'rgba(255,255,255,0.16)' },
  methodTitle: { color: '#0F5132', fontWeight: '900', fontSize: 15 },
  methodTitleActive: { color: '#FFFFFF' },
  methodSubtitle: { color: '#6B7D72', marginTop: 4, fontSize: 12 },
  methodSubtitleActive: { color: 'rgba(255,255,255,0.82)' },
  noticeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 22, borderWidth: 1, borderColor: '#DDEDE2', padding: 14, marginTop: 16 },
  noticeTitle: { color: '#0F5132', fontWeight: '900' },
  noticeText: { color: '#6B7D72', marginTop: 4, lineHeight: 18 },
  successCard: { backgroundColor: '#EAF8EE', borderRadius: 22, padding: 16, alignItems: 'center', marginTop: 16 },
  successTitle: { color: '#0F5132', fontWeight: '900', fontSize: 16, marginTop: 8 },
  successText: { color: '#4F685B', marginTop: 6, textAlign: 'center' },
  ctaButton: { backgroundColor: '#1B7F4B', borderRadius: 20, paddingVertical: 16, alignItems: 'center', marginTop: 18 },
  ctaButtonPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  ctaText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F4FBF6' },
  emptyTitle: { marginTop: 10, color: '#0F5132', fontSize: 18, fontWeight: '900' },
  emptySubtitle: { marginTop: 8, color: '#6B7D72', textAlign: 'center', lineHeight: 20 },
})
