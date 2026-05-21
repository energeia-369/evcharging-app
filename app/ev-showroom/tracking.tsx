import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const stages = [
  { label: 'Booking Confirmed', detail: 'Reservation verified and processing begins.' },
  { label: 'Vehicle Processing', detail: 'Inspection and polishing in progress.' },
  { label: 'Registration Completed', detail: 'Paperwork and RBI registration finished.' },
  { label: 'Ready For Delivery', detail: 'Vehicle handed off to delivery partner.' },
  { label: 'Delivered', detail: 'Your EV is arriving soon.' },
]

export default function TrackingScreen() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [liveStatus, setLiveStatus] = useState('Your vehicle is being prepared for delivery.')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = Math.min(prev + 1, stages.length - 1)
        setLiveStatus(
          next === 0
            ? 'Processing your booking confirmation.'
            : next === 1
            ? 'Detailing and final checks underway.'
            : next === 2
            ? 'Registration completed by the showroom team.'
            : next === 3
            ? 'Delivery partner is ready to dispatch.'
            : 'Your vehicle has been delivered successfully.'
        )
        return next
      })
    }, 2600)
    return () => clearInterval(interval)
  }, [])

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#064E3B" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Delivery tracking</Text>
        </View>

        <View style={styles.liveCard}>
          <Text style={styles.liveTitle}>Live tracking</Text>
          <Text style={styles.liveDetail}>{liveStatus}</Text>
          <Text style={styles.eta}>ETA: 3-5 days</Text>
        </View>

        {stages.map((stage, index) => (
          <View key={stage.label} style={[styles.stageCard, index <= currentStep && styles.stageCardActive]}>
            <View style={[styles.stageDot, index <= currentStep && styles.stageDotActive]}>
              <MaterialCommunityIcons name={index <= currentStep ? 'check' : 'clock-outline'} size={16} color={index <= currentStep ? '#FFFFFF' : '#10B981'} />
            </View>
            <View style={styles.stageInfo}>
              <Text style={styles.stageLabel}>{stage.label}</Text>
              <Text style={styles.stageDetail}>{stage.detail}</Text>
            </View>
          </View>
        ))}

        <View style={styles.driverCard}>
          <Text style={styles.driverTitle}>Delivery executive</Text>
          <Text style={styles.driverName}>Rohit Sharma</Text>
          <Text style={styles.driverContact}>+91 91234 56780</Text>
        </View>

        <TouchableOpacity style={styles.keepButton} onPress={() => router.push('/ev-showroom/after-sales')}>
          <Text style={styles.keepText}>View After Sales</Text>
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
  liveCard: { backgroundColor: '#ECFDF5', borderRadius: 24, padding: 18, marginBottom: 20 },
  liveTitle: { color: '#065F46', fontSize: 15, fontWeight: '900', marginBottom: 8 },
  liveDetail: { color: '#14532D', fontSize: 14, marginBottom: 12 },
  eta: { color: '#064E3B', fontWeight: '900' },
  stageCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  stageCardActive: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
  stageDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  stageDotActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  stageInfo: { flex: 1 },
  stageLabel: { color: '#064E3B', fontSize: 15, fontWeight: '900' },
  stageDetail: { color: '#14532D', fontSize: 12, marginTop: 4 },
  driverCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, marginTop: 18, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 14, elevation: 1 },
  driverTitle: { color: '#065F46', fontWeight: '900', marginBottom: 10 },
  driverName: { color: '#064E3B', fontSize: 16, fontWeight: '900' },
  driverContact: { color: '#14532D', marginTop: 6 },
  keepButton: { marginTop: 22, backgroundColor: '#10B981', borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  keepText: { color: '#FFFFFF', fontWeight: '900' },
})
