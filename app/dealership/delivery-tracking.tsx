import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { formatINR } from '../../lib/mock/dealershipLifecycleData'

const deliverySteps = [
  { title: 'Booking Confirmed', detail: 'Sales booking received and queued.', icon: 'clipboard-check' },
  { title: 'Payment Received', detail: 'Payment confirmed and invoice generated.', icon: 'credit-card' },
  { title: 'Vehicle Processing', detail: 'Vehicle is being prepped and inspected.', icon: 'tools' },
  { title: 'Registration Completed', detail: 'RTO registration and documentation are complete.', icon: 'file-document' },
  { title: 'Out For Delivery', detail: 'Delivery executive is on the way.', icon: 'map-marker' },
  { title: 'Delivered', detail: 'Vehicle has reached the customer.', icon: 'car-electric' },
]

export default function DeliveryTrackingScreen() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState(0)
  const [eta, setEta] = useState(48)
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, deliverySteps.length - 1))
      setEta((current) => Math.max(0, current - 8))
    }, 1400)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (stepIndex + 1) / deliverySteps.length,
      duration: 450,
      useNativeDriver: false,
    }).start()
  }, [progress, stepIndex])

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Delivery Tracking</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/dealership')}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#064E3B" />
          </TouchableOpacity>
        </View>

        <View style={styles.etaCard}>
          <Text style={styles.etaLabel}>Estimated Arrival</Text>
          <Text style={styles.etaValue}>{eta} mins</Text>
          <Text style={styles.etaText}>Fake live updates are running locally.</Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
          </View>
        </View>

        <View style={styles.timelineCard}>
          {deliverySteps.map((step, index) => {
            const active = index === stepIndex
            const done = index < stepIndex
            return (
              <View key={step.title} style={styles.timelineRow}>
                <View style={[styles.timelineDot, done && styles.timelineDone, active && styles.timelineActive]}>
                  <MaterialCommunityIcons name={step.icon as any} size={14} color="#FFFFFF" />
                </View>
                <View style={[styles.timelineContent, active && styles.timelineContentActive]}>
                  <Text style={styles.timelineTitle}>{step.title}</Text>
                  <Text style={styles.timelineText}>{step.detail}</Text>
                  <View style={[styles.badge, active && styles.badgeActive, done && styles.badgeDone]}>
                    <Text style={[styles.badgeText, active && { color: '#FFFFFF' }]}>{done ? 'Completed' : active ? 'In progress' : 'Pending'}</Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Executive</Text>
          <View style={styles.execRow}>
            <View style={styles.execAvatar}><MaterialCommunityIcons name="account-tie" size={20} color="#059669" /></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.execName}>Rahul Verma</Text>
              <Text style={styles.execMeta}>Energeia Fleet Support</Text>
            </View>
            <View style={styles.execBadge}><Text style={styles.execBadgeText}>On Route</Text></View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Summary</Text>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Vehicle Value</Text><Text style={styles.summaryValue}>{formatINR(2499000)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Documentation</Text><Text style={styles.summaryValue}>Ready</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Status</Text><Text style={styles.summaryValue}>Live tracking active</Text></View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/dealership/analytics')}>
          <Text style={styles.buttonText}>View Analytics</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: '#064E3B', fontSize: 24, fontWeight: '900' },
  iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 },
  etaCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  etaLabel: { color: '#047857', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  etaValue: { color: '#064E3B', fontSize: 30, fontWeight: '900', marginTop: 6 },
  etaText: { color: '#14532D', marginTop: 6 },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: '#DCFCE7', overflow: 'hidden', marginTop: 12 },
  progressFill: { height: '100%', backgroundColor: '#10B981' },
  timelineCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  timelineDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#94A3B8', alignItems: 'center', justifyContent: 'center' },
  timelineDone: { backgroundColor: '#10B981' },
  timelineActive: { backgroundColor: '#059669' },
  timelineContent: { flex: 1, backgroundColor: '#F8FFFB', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  timelineContentActive: { borderColor: '#10B981' },
  timelineTitle: { color: '#064E3B', fontWeight: '900' },
  timelineText: { color: '#14532D', marginTop: 4 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#ECFDF5', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, marginTop: 8 },
  badgeActive: { backgroundColor: '#059669' },
  badgeDone: { backgroundColor: '#DCFCE7' },
  badgeText: { color: '#047857', fontSize: 11, fontWeight: '900' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  sectionTitle: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  execRow: { flexDirection: 'row', alignItems: 'center' },
  execAvatar: { width: 54, height: 54, borderRadius: 18, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  execName: { color: '#064E3B', fontWeight: '900' },
  execMeta: { color: '#14532D', fontSize: 12, marginTop: 4 },
  execBadge: { backgroundColor: '#ECFDF5', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  execBadgeText: { color: '#047857', fontSize: 11, fontWeight: '900' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#047857', fontWeight: '800' },
  summaryValue: { color: '#064E3B', fontWeight: '900' },
  button: { backgroundColor: '#059669', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '900' },
})
