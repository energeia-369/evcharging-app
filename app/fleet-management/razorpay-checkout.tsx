import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFleetOps } from './FleetOpsContext'

export default function RazorpayCheckoutScreen() {
  const router = useRouter()
  const { bookingDraft, earnNxlTokens, completeTrip, currentDriver, currentVehicle, nxlTokens, setNxlTokens } = useFleetOps()
  
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'nxl'>('upi')
  const [upiId, setUpiId] = useState('user@okaxis')
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444')
  const [cardExpiry, setCardExpiry] = useState('12/29')
  const [cardCvv, setCardCvv] = useState('123')
  const [selectedBank, setSelectedBank] = useState('SBI')
  
  const [paymentState, setPaymentState] = useState<'checkout' | 'processing' | 'otp' | 'success'>('checkout')
  const [otp, setOtp] = useState('')
  const [transactionId, setTransactionId] = useState('')

  const amount = bookingDraft.estimatedFare

  useEffect(() => {
    // Generate a mock Razorpay payment ID
    const randomId = 'pay_' + Math.random().toString(36).substr(2, 9).toUpperCase()
    setTransactionId(randomId)
  }, [])

  function handlePay() {
    if (selectedMethod === 'nxl') {
      if (nxlTokens < amount) {
        Alert.alert('Insufficient Balance', 'You do not have enough NXL tokens to pay for this ride.')
        return
      }
      setPaymentState('processing')
      setTimeout(() => {
        // Deduct NXL tokens
        setNxlTokens(nxlTokens - amount)
        setPaymentState('success')
        // Earn cashback
        earnNxlTokens(amount)
        
        // Complete the trip officially in context
        completeTrip({
          totalDistance: bookingDraft.distance,
          totalDuration: '42 mins',
          driverRating: currentDriver.rating,
          customerFeedback: 'Smooth ride, on-time pickup, and excellent charging-friendly routing.',
          fareAmount: amount,
          batteryConsumed: Math.max(8, Math.round(bookingDraft.distance * 0.4)),
          carbonSavings: `${Math.round(bookingDraft.distance * 1.8)} kg CO2 saved`,
        })

        // Auto redirect to trip completion screen after 2 seconds
        setTimeout(() => {
          router.replace('/fleet-management/trip-completion')
        }, 2000)
      }, 1500)
      return
    }

    setPaymentState('processing')
    setTimeout(() => {
      setPaymentState('otp')
    }, 1500)
  }

  function handleVerifyOtp() {
    if (otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit code.')
      return
    }
    setPaymentState('processing')
    setTimeout(() => {
      setPaymentState('success')
      // Earn cashback
      earnNxlTokens(amount)
      
      // Complete the trip officially in context
      completeTrip({
        totalDistance: bookingDraft.distance,
        totalDuration: '42 mins',
        driverRating: currentDriver.rating,
        customerFeedback: 'Smooth ride, on-time pickup, and excellent charging-friendly routing.',
        fareAmount: amount,
        batteryConsumed: Math.max(8, Math.round(bookingDraft.distance * 0.4)),
        carbonSavings: `${Math.round(bookingDraft.distance * 1.8)} kg CO2 saved`,
      })

      // Auto redirect to trip completion screen after 2 seconds
      setTimeout(() => {
        router.replace('/fleet-management/trip-completion')
      }, 2000)
    }, 1500)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {paymentState === 'checkout' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Razorpay Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.brandInfo}>
              <View style={styles.logoCircle}>
                <MaterialCommunityIcons name="lightning-bolt" size={24} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.merchantName}>Energeia EV Cabs</Text>
                <Text style={styles.purposeText}>Ride Booking Payment</Text>
              </View>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <Text style={styles.amountText}>{amount}</Text>
            </View>
          </View>

          {/* Secure Badging */}
          <View style={styles.securityBadge}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#059669" />
            <Text style={styles.securityText}>Razorpay Secure Checkout • 256-Bit SSL</Text>
          </View>

          {/* Payment Methods */}
          <Text style={styles.sectionTitle}>Cards, UPI & More</Text>

          {/* Card Option */}
          <Pressable 
            style={[styles.methodCard, selectedMethod === 'card' && styles.methodCardActive]}
            onPress={() => setSelectedMethod('card')}
          >
            <View style={styles.methodLeft}>
              <MaterialCommunityIcons name="credit-card" size={24} color={selectedMethod === 'card' ? '#0052cc' : '#4f6952'} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.methodTitle}>Card</Text>
                <Text style={styles.methodDesc}>Visa, MasterCard, RuPay, Maestro</Text>
              </View>
            </View>
            <MaterialCommunityIcons 
              name={selectedMethod === 'card' ? 'radiobox-marked' : 'radiobox-blank'} 
              size={20} 
              color={selectedMethod === 'card' ? '#0052cc' : '#9ca3af'} 
            />
          </Pressable>

          {selectedMethod === 'card' && (
            <View style={styles.detailsForm}>
              <View style={styles.field}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput value={cardNumber} onChangeText={setCardNumber} style={styles.input} keyboardType="numeric" />
              </View>
              <View style={styles.rowFields}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Expiry (MM/YY)</Text>
                  <TextInput value={cardExpiry} onChangeText={setCardExpiry} style={styles.input} keyboardType="numeric" placeholder="MM/YY" />
                </View>
                <View style={[styles.field, { flex: 1, marginLeft: 12 }]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput value={cardCvv} onChangeText={setCardCvv} style={styles.input} keyboardType="numeric" secureTextEntry />
                </View>
              </View>
            </View>
          )}

          {/* UPI Option */}
          <Pressable 
            style={[styles.methodCard, selectedMethod === 'upi' && styles.methodCardActive]}
            onPress={() => setSelectedMethod('upi')}
          >
            <View style={styles.methodLeft}>
              <MaterialCommunityIcons name="qrcode" size={24} color={selectedMethod === 'upi' ? '#0052cc' : '#4f6952'} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.methodTitle}>UPI / GPay / PhonePe</Text>
                <Text style={styles.methodDesc}>Pay instantly using UPI apps</Text>
              </View>
            </View>
            <MaterialCommunityIcons 
              name={selectedMethod === 'upi' ? 'radiobox-marked' : 'radiobox-blank'} 
              size={20} 
              color={selectedMethod === 'upi' ? '#0052cc' : '#9ca3af'} 
            />
          </Pressable>

          {selectedMethod === 'upi' && (
            <View style={styles.detailsForm}>
              <View style={styles.field}>
                <Text style={styles.label}>UPI ID (VPA)</Text>
                <TextInput value={upiId} onChangeText={setUpiId} style={styles.input} autoCapitalize="none" />
              </View>
            </View>
          )}

          {/* Net Banking Option */}
          <Pressable 
            style={[styles.methodCard, selectedMethod === 'netbanking' && styles.methodCardActive]}
            onPress={() => setSelectedMethod('netbanking')}
          >
            <View style={styles.methodLeft}>
              <MaterialCommunityIcons name="bank" size={24} color={selectedMethod === 'netbanking' ? '#0052cc' : '#4f6952'} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.methodTitle}>Net Banking</Text>
                <Text style={styles.methodDesc}>All Indian banks supported</Text>
              </View>
            </View>
            <MaterialCommunityIcons 
              name={selectedMethod === 'netbanking' ? 'radiobox-marked' : 'radiobox-blank'} 
              size={20} 
              color={selectedMethod === 'netbanking' ? '#0052cc' : '#9ca3af'} 
            />
          </Pressable>

          {selectedMethod === 'netbanking' && (
            <View style={styles.detailsForm}>
              <Text style={styles.label}>Select Bank</Text>
              <View style={styles.bankGrid}>
                {['SBI', 'HDFC', 'ICICI', 'Axis'].map(bank => (
                  <Pressable 
                    key={bank}
                    style={[styles.bankItem, selectedBank === bank && styles.bankItemActive]}
                    onPress={() => setSelectedBank(bank)}
                  >
                    <Text style={[styles.bankText, selectedBank === bank && styles.bankTextActive]}>{bank}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Pay with NXL Tokens Option */}
          <Pressable 
            style={[styles.methodCard, selectedMethod === 'nxl' && styles.methodCardActive]}
            onPress={() => setSelectedMethod('nxl')}
          >
            <View style={styles.methodLeft}>
              <MaterialCommunityIcons name="wallet-outline" size={24} color={selectedMethod === 'nxl' ? '#0052cc' : '#4f6952'} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.methodTitle}>Pay with NXL Tokens</Text>
                <Text style={styles.methodDesc}>Balance: {nxlTokens} NXL Tokens (1 NXL = ₹1)</Text>
              </View>
            </View>
            <MaterialCommunityIcons 
              name={selectedMethod === 'nxl' ? 'radiobox-marked' : 'radiobox-blank'} 
              size={20} 
              color={selectedMethod === 'nxl' ? '#0052cc' : '#9ca3af'} 
            />
          </Pressable>

          {selectedMethod === 'nxl' && (
            <View style={styles.detailsForm}>
              <Text style={styles.label}>NXL Wallet Settlement</Text>
              <Text style={{ color: '#0f5132', fontSize: 13, fontWeight: '700', marginTop: 4 }}>
                {nxlTokens >= amount 
                  ? `Settle this ride using ${amount} NXL tokens from your wallet.`
                  : `Insufficient balance. You need ${amount} NXL but only have ${nxlTokens} NXL.`
                }
              </Text>
            </View>
          )}

          {/* Footer Branding and Pay Button */}
          <View style={styles.footer}>
            <Pressable style={styles.payButton} onPress={handlePay}>
              <Text style={styles.payButtonText}>
                {selectedMethod === 'nxl' ? `PAY WITH ${amount} NXL TOKENS` : `PAY SECURELY ₹${amount}`}
              </Text>
            </Pressable>
            <Text style={styles.brandingText}>Razorpay Trusted Partner</Text>
          </View>
        </ScrollView>
      )}

      {/* Processing Animation Screen */}
      {paymentState === 'processing' && (
        <View style={styles.centeredScreen}>
          <ActivityIndicator size="large" color="#0052cc" />
          <Text style={styles.processingText}>Processing payment securely...</Text>
          <Text style={styles.processingSub}>Please do not press back or close the app</Text>
        </View>
      )}

      {/* OTP Authentication Screen */}
      {paymentState === 'otp' && (
        <View style={styles.otpContainer}>
          <View style={styles.otpCard}>
            <View style={styles.otpHeader}>
              <Text style={styles.otpHeaderTitle}>Bank Authentication</Text>
              <Text style={styles.otpHeaderSub}>Enter mock 4-digit OTP sent to your phone</Text>
            </View>
            <View style={styles.otpBody}>
              <Text style={styles.otpLabel}>Enter OTP Code</Text>
              <TextInput 
                value={otp} 
                onChangeText={setOtp} 
                maxLength={4}
                keyboardType="numeric" 
                style={styles.otpInput} 
                placeholder="0 0 0 0"
                textAlign="center"
              />
              <Text style={styles.otpHelp}>Use mock code '1234' or any 4 digits to approve.</Text>
            </View>
            <View style={styles.otpFooter}>
              <Pressable style={styles.otpSubmitBtn} onPress={handleVerifyOtp}>
                <Text style={styles.otpSubmitBtnText}>Submit & Authorize</Text>
              </Pressable>
              <Pressable style={styles.otpCancelBtn} onPress={() => setPaymentState('checkout')}>
                <Text style={styles.otpCancelBtnText}>Cancel Transaction</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Success Confirmation Screen */}
      {paymentState === 'success' && (
        <View style={[styles.centeredScreen, { backgroundColor: '#f0fdf4' }]}>
          <View style={styles.successIconCircle}>
            <MaterialCommunityIcons name="check" size={56} color="#059669" />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successAmount}>₹{amount}</Text>
          <View style={styles.receiptBox}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transaction ID</Text>
              <Text style={styles.receiptVal}>{transactionId}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Status</Text>
              <Text style={[styles.receiptVal, { color: '#059669', fontWeight: '950' }]}>PAID</Text>
            </View>
          </View>
          <Text style={styles.redirectText}>Redirecting you back to your ride...</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  brandHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#0a2540', 
    borderRadius: 18, 
    padding: 20,
    marginBottom: 12
  },
  brandInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0052cc', alignItems: 'center', justifyContent: 'center' },
  merchantName: { color: '#ffffff', fontSize: 16, fontWeight: '900' },
  purposeText: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  amountContainer: { alignItems: 'flex-end' },
  currencySymbol: { color: '#60a5fa', fontSize: 13, fontWeight: '700' },
  amountText: { color: '#ffffff', fontSize: 24, fontWeight: '900' },
  securityBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20 },
  securityText: { color: '#4b5563', fontSize: 11, fontWeight: '700' },
  sectionTitle: { color: '#1f2937', fontSize: 14, fontWeight: '800', marginBottom: 12 },
  methodCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#ffffff', 
    borderWidth: 1.5, 
    borderColor: '#e5e7eb', 
    borderRadius: 16, 
    padding: 16,
    marginBottom: 10
  },
  methodCardActive: { borderColor: '#0052cc', backgroundColor: '#f0f7ff' },
  methodLeft: { flexDirection: 'row', alignItems: 'center' },
  methodTitle: { color: '#1f2937', fontSize: 14, fontWeight: '800' },
  methodDesc: { color: '#6b7280', fontSize: 11, marginTop: 2 },
  detailsForm: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 16, marginBottom: 14, gap: 10 },
  field: { gap: 6 },
  label: { color: '#4b5563', fontSize: 11, fontWeight: '800' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 10, color: '#1f2937', fontSize: 14 },
  rowFields: { flexDirection: 'row' },
  bankGrid: { flexDirection: 'row', gap: 8, marginTop: 6 },
  bankItem: { flex: 1, backgroundColor: '#f3f4f6', padding: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  bankItemActive: { backgroundColor: '#f0f7ff', borderColor: '#0052cc' },
  bankText: { color: '#4b5563', fontSize: 12, fontWeight: '750' },
  bankTextActive: { color: '#0052cc' },
  footer: { marginTop: 30, alignItems: 'center', gap: 10 },
  payButton: { backgroundColor: '#0052cc', borderRadius: 16, paddingVertical: 16, width: '100%', alignItems: 'center' },
  payButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  brandingText: { color: '#9ca3af', fontSize: 11, fontWeight: '600' },
  centeredScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  processingText: { fontSize: 16, fontWeight: '800', color: '#1f2937', marginTop: 20 },
  processingSub: { fontSize: 12, color: '#6b7280', marginTop: 8 },
  otpContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  otpCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, gap: 16 },
  otpHeader: { alignItems: 'center' },
  otpHeaderTitle: { fontSize: 17, fontWeight: '900', color: '#0a2540' },
  otpHeaderSub: { fontSize: 12, color: '#6b7280', marginTop: 4, textAlign: 'center' },
  otpBody: { gap: 8 },
  otpLabel: { fontSize: 12, fontWeight: '800', color: '#4b5563' },
  otpInput: { borderBottomWidth: 2, borderBottomColor: '#0052cc', fontSize: 24, fontWeight: '900', paddingVertical: 8, letterSpacing: 8 },
  otpHelp: { fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 4 },
  otpFooter: { gap: 10, marginTop: 10 },
  otpSubmitBtn: { backgroundColor: '#059669', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  otpSubmitBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 13 },
  otpCancelBtn: { alignItems: 'center', paddingVertical: 8 },
  otpCancelBtnText: { color: '#ef4444', fontWeight: '800', fontSize: 12 },
  successIconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 20, fontWeight: '900', color: '#065f46' },
  successAmount: { fontSize: 32, fontWeight: '900', color: '#065f46', marginTop: 10 },
  receiptBox: { backgroundColor: '#ffffff', borderRadius: 18, padding: 16, width: '100%', maxWidth: 300, gap: 8, marginVertical: 20, borderWidth: 1, borderColor: '#d1fae5' },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between' },
  receiptLabel: { color: '#6b7280', fontSize: 12 },
  receiptVal: { color: '#1f2937', fontSize: 12, fontWeight: '850' },
  redirectText: { fontSize: 12, color: '#6b7280' },
})
