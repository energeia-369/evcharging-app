import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { PremiumCard, SectionHeader } from '../../components/ev-service/Shared'
import { useEvServiceBooking } from '../../context/booking-context'
import { buildBookingPricing, formatCurrency, paymentMethods } from '../../lib/mock/evServiceData'

export default function PaymentScreen() {
  const router = useRouter()
  const { draft, setDraft, createBooking } = useEvServiceBooking()
  const [selectedMethod, setSelectedMethod] = useState(draft.paymentMethod)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const pop = useRef(new Animated.Value(0)).current
  const pricing = useMemo(() => buildBookingPricing(draft.serviceId, draft.pickupDrop), [draft.pickupDrop, draft.serviceId])

  useEffect(() => {
    Animated.spring(pop, {
      toValue: success ? 1 : 0,
      useNativeDriver: true,
      friction: 7,
      tension: 90,
    }).start()
  }, [pop, success])

  const onPayNow = () => {
    setProcessing(true)
    setTimeout(() => {
      setDraft(previous => ({ ...previous, paymentMethod: selectedMethod }))
      createBooking({ paymentMethod: selectedMethod })
      setSuccess(true)
      setProcessing(false)
      setTimeout(() => router.push('/ev-service/tracking'), 850)
    }, 1200)
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <Text style={styles.heroKicker}>Step 5 of 8</Text>
        <Text style={styles.heroTitle}>Secure payment</Text>
        <Text style={styles.heroAmount}>{formatCurrency(pricing.total)}</Text>
        <Text style={styles.heroSubtitle}>Fake payment success animation with local state only.</Text>
        <View style={styles.secureBadge}>
          <MaterialCommunityIcons name="shield-check-outline" size={16} color="#10b981" />
          <Text style={styles.secureText}>Secure payment badge</Text>
        </View>
      </View>

      <SectionHeader title="Payment methods" subtitle="Choose one mock payment option" />
      <View style={{ gap: 10 }}>
        {paymentMethods.map(method => {
          const active = method.id === selectedMethod
          return (
            <Pressable key={method.id} style={({ pressed }) => [styles.methodCard, active && styles.methodCardActive, pressed && styles.pressed]} onPress={() => setSelectedMethod(method.id)}>
              <View style={[styles.methodIcon, active && styles.methodIconActive]}>
                <MaterialCommunityIcons name={method.icon as any} size={20} color={active ? '#ffffff' : '#10b981'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.methodTitle, active && styles.methodTitleActive]}>{method.name}</Text>
                <Text style={[styles.methodSubtitle, active && styles.methodSubtitleActive]}>{method.subtitle}</Text>
              </View>
              {active ? <MaterialCommunityIcons name="check-circle" size={20} color="#ffffff" /> : <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />}
            </Pressable>
          )
        })}
      </View>

      <PremiumCard style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Payment preview</Text>
        <Text style={styles.summaryText}>Selected method: {paymentMethods.find(method => method.id === selectedMethod)?.name}</Text>
        <Text style={styles.summaryText}>Amount to pay: {formatCurrency(pricing.total)}</Text>
        <Text style={styles.summaryText}>Checkout uses mock JSON data and no backend.</Text>

        {success ? (
          <Animated.View style={[styles.successBadge, { transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }] }]}>
            <MaterialCommunityIcons name="check-decagram" size={24} color="#ffffff" />
            <Text style={styles.successText}>Payment successful</Text>
          </Animated.View>
        ) : null}
      </PremiumCard>

      <Pressable style={styles.payButton} onPress={onPayNow} disabled={processing}>
        <Text style={styles.payText}>{processing ? 'Processing...' : 'Pay Now'}</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4fbf6' },
  container: { padding: 16, paddingBottom: 36 },
  heroCard: { backgroundColor: '#0f5132', borderRadius: 28, padding: 18 },
  heroKicker: { color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: '900', fontSize: 12 },
  heroTitle: { color: '#ffffff', fontSize: 24, fontWeight: '900', marginTop: 8 },
  heroAmount: { color: '#ffffff', fontSize: 30, fontWeight: '900', marginTop: 8 },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', marginTop: 8, lineHeight: 19 },
  secureBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.12)', alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, marginTop: 12 },
  secureText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  methodCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#ffffff', borderRadius: 20, padding: 14, borderWidth: 1, borderColor: '#e2efe5' },
  methodCardActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  pressed: { transform: [{ scale: 0.99 }] },
  methodIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#edf9f1' },
  methodIconActive: { backgroundColor: 'rgba(255,255,255,0.14)' },
  methodTitle: { color: '#0f5132', fontWeight: '900' },
  methodTitleActive: { color: '#ffffff' },
  methodSubtitle: { color: '#6b7d72', marginTop: 4, fontSize: 12 },
  methodSubtitleActive: { color: 'rgba(255,255,255,0.82)' },
  summaryCard: { marginTop: 16 },
  summaryLabel: { color: '#0f5132', fontWeight: '900', fontSize: 16 },
  summaryText: { color: '#6b7d72', marginTop: 8, lineHeight: 18 },
  successBadge: { marginTop: 14, backgroundColor: '#10b981', borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'flex-start' },
  successText: { color: '#ffffff', fontWeight: '900' },
  payButton: { marginTop: 18, backgroundColor: '#0f5132', borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
  payText: { color: '#ffffff', fontWeight: '900', fontSize: 16 },
})
