import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { useAuth } from './AuthContext'
import { useFleetOps } from './FleetOpsContext'

const PREDEFINED_ROUTES = [
  { pickup: 'Ramwadi', drop: 'Airport', distance: 6 },
  { pickup: 'Ramwadi', drop: 'Kharadi', distance: 5 },
  { pickup: 'Ramwadi', drop: 'Pheonix', distance: 4 },
  { pickup: 'Swargate', drop: 'Katraj', distance: 7 },
  { pickup: 'Swargate', drop: 'Rajiv Gandhi bhartiya vidyapith', distance: 9 },
  { pickup: 'Wanaj', drop: 'Chandani chawk', distance: 4 },
  { pickup: 'Wanaj', drop: 'Karve nagar', distance: 3 },
  { pickup: 'Wanaj', drop: 'Bavdan', distance: 6 },
  { pickup: 'Wanaj', drop: 'Bugav', distance: 8 },
  { pickup: 'Chandani chawk', drop: 'Karve nagar', distance: 5 },
  { pickup: 'Pcmc', drop: 'Nigadi', distance: 8 },
]

export default function TripBookingScreen() {
  const router = useRouter()
  const { setBookingDraft, nxlTokens, setNxlTokens, useNxlTokens, setUseNxlTokens, redeemNxlTokens } = useFleetOps()
  const [pickupLocation, setPickupLocation] = useState('Ramwadi')
  const [dropLocation, setDropLocation] = useState('Airport')
  const [passengerName, setPassengerName] = useState('Aarav Mehta')
  const [contactNumber, setContactNumber] = useState('9876543210')
  const [vehicleType, setVehicleType] = useState('Premium EV Sedan')
  const [scheduledAt, setScheduledAt] = useState('Today, 05:30 PM')
  const [priority, setPriority] = useState(true)
  const [showScanner, setShowScanner] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'nxl'>('upi')

  const { user } = useAuth()
  const isCustomer = user?.role === 'customer' || !user?.role

  const tripPreview = useMemo(() => {
    const matched = PREDEFINED_ROUTES.find(
      r => r.pickup.toLowerCase() === pickupLocation.trim().toLowerCase() &&
           r.drop.toLowerCase() === dropLocation.trim().toLowerCase()
    )
    const distance = matched ? matched.distance : Math.max(6, Math.round((pickupLocation.length + dropLocation.length) / 4))
    const baseFare = distance * 42 + (priority ? 150 : 0)
    
    // Apply NXL discount if toggled
    const discount = useNxlTokens ? Math.min(nxlTokens, baseFare) : 0
    const estimatedFare = Math.max(0, baseFare - discount)

    return {
      distance,
      baseFare,
      discount,
      estimatedFare,
    }
  }, [dropLocation, pickupLocation, priority, useNxlTokens, nxlTokens])

  function handleAssignVehicle() {
    setBookingDraft({
      pickupLocation,
      dropLocation,
      passengerName,
      contactNumber,
      vehicleType,
      estimatedFare: tripPreview.estimatedFare,
      distance: tripPreview.distance,
      scheduledAt,
      priority,
    })
    router.push('/fleet-management/assign-vehicle')
  }

  function handleScanSuccess(route: typeof PREDEFINED_ROUTES[0]) {
    setPickupLocation(route.pickup)
    setDropLocation(route.drop)
    setShowScanner(false)
    Alert.alert('Scan Successful', `Ticket detected! Route auto-filled: ${route.pickup} to ${route.drop}`)
  }

  function handleCustomerBookRide() {
    // Open payment option modal
    setShowPaymentModal(true)
  }

  function handleConfirmPayment() {
    const finalFare = tripPreview.estimatedFare
    setShowPaymentModal(false)

    // Deduct tokens immediately if paying entirely with NXL
    if (selectedPaymentMethod === 'nxl') {
      if (nxlTokens < finalFare) {
        Alert.alert('Error', 'Insufficient NXL Tokens for full payment.')
        return
      }
      setNxlTokens(nxlTokens - finalFare)
      Alert.alert('Payment Successful', `Paid ₹${finalFare} using NXL Tokens!`)
    }

    setBookingDraft({
      pickupLocation,
      dropLocation,
      passengerName: user?.fullName || 'Customer',
      contactNumber: user?.mobile || '9876543210',
      vehicleType,
      estimatedFare: selectedPaymentMethod === 'nxl' ? 0 : finalFare,
      distance: tripPreview.distance,
      scheduledAt: 'Immediate Booking',
      priority: false,
      paymentMethod: selectedPaymentMethod === 'nxl' ? 'NXL Tokens Wallet' : selectedPaymentMethod.toUpperCase(),
    })
    
    Alert.alert(
      'Requesting Ride',
      `Searching for nearby electric cabs...`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm Match',
          onPress: () => {
            Alert.alert('Cab Booked!', 'Your EV Cab is on its way. Proceeding to live tracking map.')
            router.push('/fleet-management/tracking')
          }
        }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>{isCustomer ? 'Ola/Uber EV Cabs' : 'Trip Booking'}</Text>
            <Text style={styles.headerTitle}>{isCustomer ? 'Book Your EV Ride' : 'Plan a new passenger trip'}</Text>
            <Text style={styles.headerSubtitle}>
              {isCustomer 
                ? 'Select pickup & drop points. Confirm ride to match with the nearest electric cab instantly.' 
                : 'Create a booking, preview the route, and hand it to vehicle assignment.'
              }
            </Text>
          </View>
          <Pressable style={styles.headerIcon} onPress={() => setShowScanner(true)}>
            <MaterialCommunityIcons name={'qrcode-scan' as any} size={24} color="#ffffff" />
          </Pressable>
        </View>

        {/* QR Scanner Mock Modal */}
        <Modal visible={showScanner} transparent animationType="slide">
          <View style={styles.scannerModalOverlay}>
            <View style={styles.scannerModalContent}>
              <Text style={styles.scannerModalTitle}>QR Ticket Scanner</Text>
              <Text style={styles.scannerModalSubtitle}>Simulating ticket QR scan detection. Tap a route below to scan it.</Text>
              
              <View style={styles.scanTargetsList}>
                {PREDEFINED_ROUTES.slice(0, 5).map((route, index) => (
                  <Pressable 
                    key={index} 
                    style={styles.scanTargetButton} 
                    onPress={() => handleScanSuccess(route)}
                  >
                    <MaterialCommunityIcons name="qrcode" size={18} color="#059669" />
                    <Text style={styles.scanTargetText}>{route.pickup} → {route.drop}</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable style={styles.scannerCloseButton} onPress={() => setShowScanner(false)}>
                <Text style={styles.scannerCloseButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Payment Selection Modal */}
        <Modal visible={showPaymentModal} transparent animationType="slide">
          <View style={styles.paymentModalOverlay}>
            <View style={styles.paymentModalContent}>
              <View style={styles.paymentModalHeader}>
                <Text style={styles.paymentModalTitle}>Select Payment Method</Text>
                <Pressable onPress={() => setShowPaymentModal(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#6b7280" />
                </Pressable>
              </View>

              <View style={styles.fareBreakdown}>
                <Text style={styles.fareBreakdownTitle}>Fare Summary</Text>
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>Base Fare ({tripPreview.distance} km)</Text>
                  <Text style={styles.fareVal}>₹{tripPreview.baseFare}</Text>
                </View>
                {useNxlTokens && (
                  <View style={styles.fareRow}>
                    <Text style={[styles.fareLabel, { color: '#059669' }]}>NXL Token Discount</Text>
                    <Text style={[styles.fareVal, { color: '#059669' }]}>-₹{tripPreview.discount}</Text>
                  </View>
                )}
                <View style={[styles.fareRow, styles.fareTotalRow]}>
                  <Text style={styles.fareTotalLabel}>Total Amount</Text>
                  <Text style={styles.fareTotalVal}>₹{tripPreview.estimatedFare}</Text>
                </View>
              </View>

              <Text style={styles.paymentOptionsSectionTitle}>Choose Payment Option</Text>
              
              <View style={styles.paymentOptionsList}>
                <Pressable 
                  style={[styles.paymentOptionItem, selectedPaymentMethod === 'upi' && styles.paymentOptionItemActive]}
                  onPress={() => setSelectedPaymentMethod('upi')}
                >
                  <MaterialCommunityIcons name="qrcode" size={24} color={selectedPaymentMethod === 'upi' ? '#10b981' : '#059669'} />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.paymentOptionLabel}>UPI (GPay / PhonePe / Paytm)</Text>
                    <Text style={styles.paymentOptionSub}>Pay instantly using any UPI app</Text>
                  </View>
                  <MaterialCommunityIcons 
                    name={selectedPaymentMethod === 'upi' ? "radiobox-marked" : "radiobox-blank"} 
                    size={20} 
                    color={selectedPaymentMethod === 'upi' ? '#10b981' : '#9ca3af'} 
                  />
                </Pressable>

                <Pressable 
                  style={[styles.paymentOptionItem, selectedPaymentMethod === 'card' && styles.paymentOptionItemActive]}
                  onPress={() => setSelectedPaymentMethod('card')}
                >
                  <MaterialCommunityIcons name="credit-card-outline" size={24} color={selectedPaymentMethod === 'card' ? '#10b981' : '#059669'} />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.paymentOptionLabel}>Debit / Credit Card</Text>
                    <Text style={styles.paymentOptionSub}>Visa, MasterCard, RuPay</Text>
                  </View>
                  <MaterialCommunityIcons 
                    name={selectedPaymentMethod === 'card' ? "radiobox-marked" : "radiobox-blank"} 
                    size={20} 
                    color={selectedPaymentMethod === 'card' ? '#10b981' : '#9ca3af'} 
                  />
                </Pressable>

                <Pressable 
                  style={[styles.paymentOptionItem, selectedPaymentMethod === 'netbanking' && styles.paymentOptionItemActive]}
                  onPress={() => setSelectedPaymentMethod('netbanking')}
                >
                  <MaterialCommunityIcons name="bank-outline" size={24} color={selectedPaymentMethod === 'netbanking' ? '#10b981' : '#059669'} />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.paymentOptionLabel}>Net Banking</Text>
                    <Text style={styles.paymentOptionSub}>All major Indian banks supported</Text>
                  </View>
                  <MaterialCommunityIcons 
                    name={selectedPaymentMethod === 'netbanking' ? "radiobox-marked" : "radiobox-blank"} 
                    size={20} 
                    color={selectedPaymentMethod === 'netbanking' ? '#10b981' : '#9ca3af'} 
                  />
                </Pressable>

                <Pressable 
                  style={[
                    styles.paymentOptionItem, 
                    selectedPaymentMethod === 'nxl' && styles.paymentOptionItemActive,
                    nxlTokens < tripPreview.estimatedFare && styles.paymentOptionItemDisabled
                  ]}
                  onPress={() => {
                    if (nxlTokens >= tripPreview.estimatedFare) {
                      setSelectedPaymentMethod('nxl')
                    } else {
                      Alert.alert('Insufficient Balance', 'You do not have enough NXL tokens to cover the full fare. You can toggle "Apply Tokens" on the main booking page to get a partial discount instead.')
                    }
                  }}
                >
                  <MaterialCommunityIcons name="wallet-outline" size={24} color={selectedPaymentMethod === 'nxl' ? '#10b981' : '#059669'} />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.paymentOptionLabel}>Pay with NXL Tokens</Text>
                    <Text style={styles.paymentOptionSub}>Balance: {nxlTokens} NXL Tokens</Text>
                  </View>
                  <MaterialCommunityIcons 
                    name={selectedPaymentMethod === 'nxl' ? "radiobox-marked" : "radiobox-blank"} 
                    size={20} 
                    color={selectedPaymentMethod === 'nxl' ? '#10b981' : '#9ca3af'} 
                  />
                </Pressable>
              </View>

              <View style={styles.paymentFooter}>
                <Text style={styles.cashbackNotice}>🎁 You will earn 5% NXL Tokens cashback (approx. {Math.round(tripPreview.estimatedFare * 0.05)} NXL) after this ride!</Text>
                <Pressable style={styles.paymentConfirmBtn} onPress={handleConfirmPayment}>
                  <Text style={styles.paymentConfirmBtnText}>
                    {selectedPaymentMethod === 'nxl' 
                      ? `Pay ₹${tripPreview.estimatedFare} with NXL Tokens` 
                      : `Confirm & Pay ₹${tripPreview.estimatedFare}`
                    }
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <FleetCard style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIcon}>
              <MaterialCommunityIcons name={'map-marker' as any} size={20} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryLabel}>Route Preview</Text>
              <Text style={styles.summaryValue}>{pickupLocation} → {dropLocation}</Text>
            </View>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityBadgeText}>{priority ? 'Priority' : 'Standard'}</Text>
            </View>
          </View>
          <View style={styles.routeBox}>
            <MaterialCommunityIcons name={'flash' as any} size={18} color="#10b981" />
            <Text style={styles.routeText}>Estimated distance {tripPreview.distance} km, fare ₹{tripPreview.estimatedFare.toLocaleString('en-IN')}</Text>
          </View>
        </FleetCard>

        <SectionHeader title="Quick Select Route" subtitle="Tap a predefined route to auto-fill." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shortcutsScroll} contentContainerStyle={styles.shortcutsContent}>
          {PREDEFINED_ROUTES.map((route, idx) => (
            <Pressable
              key={idx}
              style={[
                styles.shortcutPill,
                pickupLocation === route.pickup && dropLocation === route.drop && styles.shortcutPillActive
              ]}
              onPress={() => {
                setPickupLocation(route.pickup)
                setDropLocation(route.drop)
              }}
            >
              <MaterialCommunityIcons 
                name={'navigation' as any} 
                size={12} 
                color={pickupLocation === route.pickup && dropLocation === route.drop ? '#ffffff' : '#059669'} 
              />
              <Text style={[
                styles.shortcutText,
                pickupLocation === route.pickup && dropLocation === route.drop && styles.shortcutTextActive
              ]}>
                {route.pickup} → {route.drop}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <SectionHeader title="Booking Details" subtitle="Enter passenger and trip information." />
        <FleetCard style={styles.formCard}>
          <View style={styles.field}>
            <Text style={styles.label}>Pickup Location</Text>
            <TextInput value={pickupLocation} onChangeText={setPickupLocation} style={styles.input} placeholder="Pickup location" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Drop Location</Text>
            <TextInput value={dropLocation} onChangeText={setDropLocation} style={styles.input} placeholder="Drop location" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Passenger Name</Text>
            <TextInput value={passengerName} onChangeText={setPassengerName} style={styles.input} placeholder="Passenger name" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Contact Number</Text>
            <TextInput value={contactNumber} onChangeText={setContactNumber} style={styles.input} keyboardType="phone-pad" placeholder="Contact number" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Vehicle Type</Text>
            <TextInput value={vehicleType} onChangeText={setVehicleType} style={styles.input} placeholder="Vehicle type" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Schedule Time</Text>
            <TextInput value={scheduledAt} onChangeText={setScheduledAt} style={styles.input} placeholder="Schedule time" placeholderTextColor="#9ca3af" />
          </View>
        </FleetCard>

        <View style={styles.toggleRow}>
          <Pressable style={[styles.toggleButton, priority && styles.toggleButtonActive]} onPress={() => setPriority(true)}>
            <Text style={[styles.toggleText, priority && styles.toggleTextActive]}>Priority Booking</Text>
          </Pressable>
          <Pressable style={[styles.toggleButton, !priority && styles.toggleButtonActive]} onPress={() => setPriority(false)}>
            <Text style={[styles.toggleText, !priority && styles.toggleTextActive]}>Standard</Text>
          </Pressable>
        </View>

        {isCustomer && (
          <FleetCard style={styles.nxlWalletCard}>
            <View style={styles.nxlWalletHeader}>
              <MaterialCommunityIcons name="wallet" size={24} color="#10b981" />
              <View style={{ flex: 1 }}>
                <Text style={styles.nxlWalletTitle}>NXL Tokens Wallet</Text>
                <Text style={styles.nxlWalletSubtitle}>Available Balance: {nxlTokens} NXL Tokens (1 NXL = ₹1)</Text>
              </View>
            </View>
            <View style={styles.nxlWalletActionRow}>
              <Text style={styles.nxlCashbackNotice}>🎁 Earn 5% NXL Tokens as rewards on ride completion!</Text>
              <Pressable 
                style={[styles.nxlUseButton, useNxlTokens && styles.nxlUseButtonActive]} 
                onPress={() => setUseNxlTokens(!useNxlTokens)}
              >
                <Text style={[styles.nxlUseButtonText, useNxlTokens && styles.nxlUseButtonTextActive]}>
                  {useNxlTokens ? 'Applied' : 'Apply Tokens'}
                </Text>
              </Pressable>
            </View>
          </FleetCard>
        )}

        <FleetCard style={styles.routePreviewCard}>
          <Text style={styles.sectionCardTitle}>Distance Calculation</Text>
          <View style={styles.routeMetricRow}>
            <View style={styles.metricPill}>
              <MaterialCommunityIcons name={'chart-line' as any} size={16} color="#059669" />
              <Text style={styles.metricPillText}>{tripPreview.distance} km</Text>
            </View>
            <View style={styles.metricPill}>
              <MaterialCommunityIcons name={'cash' as any} size={16} color="#059669" />
              <Text style={styles.metricPillText}>₹{tripPreview.estimatedFare.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.metricPill}>
              <MaterialCommunityIcons name={'clock-outline' as any} size={16} color="#059669" />
              <Text style={styles.metricPillText}>{scheduledAt}</Text>
            </View>
          </View>
          <View style={styles.routePlaceholder}>
            <MaterialCommunityIcons name={'map-marker' as any} size={28} color="#10b981" />
            <Text style={styles.placeholderText}>Route preview placeholder with live navigation support.</Text>
          </View>
        </FleetCard>

        <View style={styles.buttonRow}>
          {isCustomer ? (
            <Pressable style={styles.primaryButton} onPress={handleCustomerBookRide}>
              <MaterialCommunityIcons name={'car-electric' as any} size={18} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Book Ride Now (Ola/Uber style)</Text>
            </Pressable>
          ) : (
            <>
              <Pressable style={styles.secondaryButton} onPress={handleAssignVehicle}>
                <MaterialCommunityIcons name={'clipboard-check' as any} size={16} color="#ffffff" />
                <Text style={styles.secondaryButtonText}>Assign Vehicle</Text>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={handleAssignVehicle}>
                <MaterialCommunityIcons name={'qrcode-scan' as any} size={16} color="#ffffff" />
                <Text style={styles.primaryButtonText}>Confirm Trip</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4fbf6' },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  kicker: { color: '#059669', fontSize: 11, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' },
  headerTitle: { color: '#0f5132', fontSize: 22, fontWeight: '900', marginTop: 4 },
  headerSubtitle: { color: '#6b7280', fontSize: 12, marginTop: 4, lineHeight: 18 },
  headerIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  summaryCard: { marginBottom: 16 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  summaryIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#059669', alignItems: 'center', justifyContent: 'center' },
  summaryLabel: { color: '#6b7280', fontSize: 11 },
  summaryValue: { color: '#0f5132', fontSize: 14, fontWeight: '900', marginTop: 3 },
  priorityBadge: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  priorityBadgeText: { color: '#059669', fontWeight: '900', fontSize: 11 },
  routeBox: { borderRadius: 16, backgroundColor: '#f0fbf5', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  routeText: { flex: 1, color: '#0f5132', fontWeight: '700', fontSize: 12, lineHeight: 17 },
  shortcutsScroll: { marginBottom: 16, maxHeight: 45 },
  shortcutsContent: { gap: 8, paddingRight: 16 },
  shortcutPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#edf9f1', borderColor: '#dbe7dd', borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  shortcutPillActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  shortcutText: { color: '#0f5132', fontSize: 12, fontWeight: '700' },
  shortcutTextActive: { color: '#ffffff' },
  formCard: { marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { color: '#0f5132', fontSize: 12, fontWeight: '800', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#dbe7dd', borderRadius: 14, backgroundColor: '#fbfdfb', paddingHorizontal: 14, paddingVertical: 12, color: '#0f172a', fontSize: 14 },
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  toggleButton: { flex: 1, borderRadius: 14, paddingVertical: 12, backgroundColor: '#edf9f1', alignItems: 'center' },
  toggleButtonActive: { backgroundColor: '#10b981' },
  toggleText: { color: '#0f5132', fontSize: 12, fontWeight: '800' },
  toggleTextActive: { color: '#ffffff' },
  routePreviewCard: { marginBottom: 16 },
  sectionCardTitle: { color: '#0f5132', fontSize: 14, fontWeight: '900', marginBottom: 12 },
  routeMetricRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  metricPill: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  metricPillText: { color: '#0f5132', fontWeight: '800', fontSize: 11 },
  routePlaceholder: { minHeight: 160, borderRadius: 18, borderWidth: 1, borderColor: '#dbe7dd', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', padding: 18, backgroundColor: '#ffffff' },
  placeholderText: { marginTop: 10, color: '#6b7280', fontSize: 12, fontWeight: '700', textAlign: 'center', lineHeight: 18 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  secondaryButton: { flex: 1, backgroundColor: '#0f5132', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  primaryButton: { flex: 1, backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  scannerModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  scannerModalContent: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, width: '100%', maxWidth: 400, gap: 16 },
  scannerModalTitle: { fontSize: 18, fontWeight: '900', color: '#0f5132', textAlign: 'center' },
  scannerModalSubtitle: { fontSize: 12, color: '#6b7280', textAlign: 'center', lineHeight: 18 },
  scanTargetsList: { gap: 10, marginVertical: 10 },
  scanTargetButton: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#edf9f1', borderWidth: 1, borderColor: '#dbe7dd', borderRadius: 14, padding: 14 },
  scanTargetText: { fontSize: 13, fontWeight: '700', color: '#0f5132' },
  scannerCloseButton: { backgroundColor: '#ef4444', borderRadius: 16, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  scannerCloseButtonText: { color: '#ffffff', fontWeight: '900', fontSize: 13 },
  nxlWalletCard: { marginBottom: 16, padding: 16, gap: 12 },
  nxlWalletHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nxlWalletTitle: { color: '#0f5132', fontSize: 15, fontWeight: '900' },
  nxlWalletSubtitle: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  nxlWalletActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#e2efe5', paddingTop: 12 },
  nxlCashbackNotice: { flex: 1, color: '#059669', fontSize: 11, fontWeight: '800' },
  nxlUseButton: { backgroundColor: '#edf9f1', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#dbe7dd' },
  nxlUseButtonActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  nxlUseButtonText: { color: '#059669', fontSize: 11, fontWeight: '800' },
  nxlUseButtonTextActive: { color: '#ffffff' },
  paymentModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  paymentModalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16 },
  paymentModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentModalTitle: { fontSize: 18, fontWeight: '900', color: '#0f5132' },
  fareBreakdown: { backgroundColor: '#f4fbf6', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#dbe7dd' },
  fareBreakdownTitle: { fontSize: 12, fontWeight: '800', color: '#0f5132', marginBottom: 8 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  fareLabel: { fontSize: 12, color: '#4f6952' },
  fareVal: { fontSize: 12, fontWeight: '800', color: '#0f5132' },
  fareTotalRow: { borderTopWidth: 1, borderTopColor: '#dbe7dd', paddingTop: 8, marginTop: 6 },
  fareTotalLabel: { fontSize: 13, fontWeight: '900', color: '#0f5132' },
  fareTotalVal: { fontSize: 15, fontWeight: '900', color: '#10b981' },
  paymentOptionsSectionTitle: { fontSize: 13, fontWeight: '800', color: '#0f5132', marginTop: 4 },
  paymentOptionsList: { gap: 10 },
  paymentOptionItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderWidth: 1, borderColor: '#dbe7dd', borderRadius: 16, backgroundColor: '#fbfdfb' },
  paymentOptionItemActive: { borderColor: '#10b981', backgroundColor: '#edf9f1' },
  paymentOptionItemDisabled: { opacity: 0.5 },
  paymentOptionLabel: { fontSize: 13, fontWeight: '800', color: '#0f5132' },
  paymentOptionSub: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  paymentFooter: { gap: 12, marginTop: 8 },
  cashbackNotice: { color: '#059669', fontSize: 11, fontWeight: '850', textAlign: 'center', lineHeight: 16 },
  paymentConfirmBtn: { backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  paymentConfirmBtnText: { color: '#ffffff', fontWeight: '900', fontSize: 13 },
})
