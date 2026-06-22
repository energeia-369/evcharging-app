import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useShowroom } from '../../context/showroom-context'
import { paymentMethods } from '../../lib/mock/showroomData'

export default function PaymentScreen() {
  const router = useRouter()
  const { bookingDraft, updateBookingDraft } = useShowroom()
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [coupon, setCoupon] = useState('')

  const handlePayment = () => {
    router.push('/ev-showroom/confirmation')
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#064E3B" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Secure payment</Text>
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.badgeItem}>
            <MaterialCommunityIcons name="shield-check" size={18} color="#10B981" />
            <Text style={styles.badgeText}>Secure payment</Text>
          </View>
          <View style={styles.badgeItem}>
            <MaterialCommunityIcons name="cash" size={18} color="#10B981" />
            <Text style={styles.badgeText}>Earn 1200 reward points</Text>
          </View>
        </View>

        <View style={styles.methodCard}>
          {paymentMethods.map((method) => (
            <TouchableOpacity key={method.id} style={[styles.methodItem, selectedMethod === method.id && styles.methodItemActive]} onPress={() => setSelectedMethod(method.id)}>
              <View style={styles.methodIcon}>
                <MaterialCommunityIcons name={method.icon as any} size={22} color="#10B981" />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodSubtitle}>{method.title === 'UPI' ? 'Fast payment' : method.title === 'Wallet' ? 'Use wallet balance' : 'Secure and fast'}</Text>
              </View>
              <MaterialCommunityIcons name={selectedMethod === method.id ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} size={20} color={selectedMethod === method.id ? '#10B981' : '#94a3b8'} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.couponCard}>
          <Text style={styles.couponLabel}>Coupon code</Text>
          <View style={styles.couponRow}>
            <TextInput style={styles.couponInput} placeholder="Enter coupon" placeholderTextColor="#94a3b8" value={coupon} onChangeText={setCoupon} />
            <TouchableOpacity style={styles.applyButton} onPress={() => alert('Coupon applied')}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.amountCard}>
          <View style={styles.amountHeader}>
            <Text style={styles.amountTitle}>Booking amount</Text>
            <Text style={styles.amountValue}>₹20,000</Text>
          </View>
          <Text style={styles.amountSubtext}>Paid via {selectedMethod.toUpperCase()}</Text>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payText}>Proceed to pay</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 12 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  pageTitle: { fontSize: 20, fontWeight: '900', color: '#064E3B' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  badgeItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 14, gap: 8 },
  badgeText: { color: '#065F46', fontWeight: '700' },
  methodCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 14, marginBottom: 18, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 14, elevation: 1 },
  methodItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#ECFDF5', marginBottom: 12 },
  methodItemActive: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  methodIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center' },
  methodInfo: { flex: 1 },
  methodTitle: { fontSize: 15, fontWeight: '900', color: '#064E3B' },
  methodSubtitle: { color: '#14532D', fontSize: 12, marginTop: 4 },
  couponCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, marginBottom: 18, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 14, elevation: 1 },
  couponLabel: { color: '#065F46', fontWeight: '900', marginBottom: 12 },
  couponRow: { flexDirection: 'row', gap: 10 },
  couponInput: { flex: 1, borderRadius: 18, borderWidth: 1, borderColor: '#D1FAE5', paddingHorizontal: 14, color: '#0F172A', height: 52 },
  applyButton: { backgroundColor: '#10B981', borderRadius: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  applyText: { color: '#FFFFFF', fontWeight: '900' },
  amountCard: { backgroundColor: '#ECFDF5', borderRadius: 24, padding: 18, marginBottom: 22 },
  amountHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  amountTitle: { color: '#065F46', fontWeight: '900' },
  amountValue: { color: '#064E3B', fontSize: 20, fontWeight: '900' },
  amountSubtext: { color: '#14532D', fontSize: 13 },
  payButton: { backgroundColor: '#10B981', borderRadius: 18, paddingVertical: 16, alignItems: 'center', shadowColor: '#10B981', shadowOpacity: 0.14, shadowRadius: 16, elevation: 2 },
  payText: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 },
})
