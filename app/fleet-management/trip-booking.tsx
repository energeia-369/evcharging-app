import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { useFleetOps } from './FleetOpsContext'

<<<<<<< HEAD
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
  const { setBookingDraft } = useFleetOps()
  const [pickupLocation, setPickupLocation] = useState('Ramwadi')
  const [dropLocation, setDropLocation] = useState('Airport')
=======
export default function TripBookingScreen() {
  const router = useRouter()
  const { setBookingDraft } = useFleetOps()
  const [pickupLocation, setPickupLocation] = useState('Bandra West Metro Station')
  const [dropLocation, setDropLocation] = useState('Mumbai Airport Terminal 2')
>>>>>>> 6fd40c6f5515f9b35690b17707ff8f51705372eb
  const [passengerName, setPassengerName] = useState('Aarav Mehta')
  const [contactNumber, setContactNumber] = useState('9876543210')
  const [vehicleType, setVehicleType] = useState('Premium EV Sedan')
  const [scheduledAt, setScheduledAt] = useState('Today, 05:30 PM')
  const [priority, setPriority] = useState(true)

  const tripPreview = useMemo(() => {
<<<<<<< HEAD
    const matched = PREDEFINED_ROUTES.find(
      r => r.pickup.toLowerCase() === pickupLocation.trim().toLowerCase() &&
           r.drop.toLowerCase() === dropLocation.trim().toLowerCase()
    )
    const distance = matched ? matched.distance : Math.max(6, Math.round((pickupLocation.length + dropLocation.length) / 4))
=======
    const distance = Math.max(6, Math.round((pickupLocation.length + dropLocation.length) / 4))
>>>>>>> 6fd40c6f5515f9b35690b17707ff8f51705372eb
    const estimatedFare = distance * 42 + (priority ? 150 : 0)
    return {
      distance,
      estimatedFare,
    }
  }, [dropLocation, pickupLocation, priority])

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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>Trip Booking</Text>
            <Text style={styles.headerTitle}>Plan a new passenger trip</Text>
            <Text style={styles.headerSubtitle}>Create a booking, preview the route, and hand it to vehicle assignment.</Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name={'qrcode-scan' as any} size={24} color="#ffffff" />
          </View>
        </View>

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

<<<<<<< HEAD
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

=======
>>>>>>> 6fd40c6f5515f9b35690b17707ff8f51705372eb
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
          <Pressable style={styles.secondaryButton} onPress={handleAssignVehicle}>
            <MaterialCommunityIcons name={'clipboard-check' as any} size={16} color="#ffffff" />
            <Text style={styles.secondaryButtonText}>Assign Vehicle</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={handleAssignVehicle}>
            <MaterialCommunityIcons name={'qrcode-scan' as any} size={16} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Confirm Trip</Text>
          </Pressable>
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
<<<<<<< HEAD
  shortcutsScroll: { marginBottom: 16, maxHeight: 45 },
  shortcutsContent: { gap: 8, paddingRight: 16 },
  shortcutPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#edf9f1', borderColor: '#dbe7dd', borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  shortcutPillActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  shortcutText: { color: '#0f5132', fontSize: 12, fontWeight: '700' },
  shortcutTextActive: { color: '#ffffff' },
=======
>>>>>>> 6fd40c6f5515f9b35690b17707ff8f51705372eb
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
})
