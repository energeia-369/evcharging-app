import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { verificationTimeline } from '../../lib/mock/dealershipLifecycleData'

export default function VerificationScreen() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, verificationTimeline.length - 1))
      setSeconds((current) => current + 1)
    }, 1400)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (stepIndex + 1) / verificationTimeline.length,
      duration: 450,
      useNativeDriver: false,
    }).start()
  }, [progress, stepIndex])

  const approvalPercent = Math.round(((stepIndex + 1) / verificationTimeline.length) * 100)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Verification</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/dealership')}>
            <MaterialCommunityIcons name="clipboard-check" size={18} color="#064E3B" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Fake live progress updates</Text>
          <Text style={styles.heroValue}>{approvalPercent}%</Text>
          <Text style={styles.heroText}>Application is moving through the approval pipeline.</Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
          </View>
        </View>

        <View style={styles.card}>
          {verificationTimeline.map((step, index) => {
            const status = index < stepIndex ? 'done' : index === stepIndex ? 'active' : 'pending'
            return (
              <View key={step.title} style={styles.timelineRow}>
                <View style={[styles.timelineDot, status === 'done' && styles.dotDone, status === 'active' && styles.dotActive]}>
                  <MaterialCommunityIcons name={step.icon as any} size={14} color="#FFFFFF" />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{step.title}</Text>
                  <Text style={styles.timelineText}>{step.detail}</Text>
                  <View style={[styles.badge, status === 'done' && styles.badgeDone, status === 'active' && styles.badgeActive]}>
                    <Text style={[styles.badgeText, status === 'active' && { color: '#FFFFFF' }]}>{status === 'done' ? 'Verified' : status === 'active' ? 'Reviewing' : 'Pending'}</Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.supportRow}><MaterialCommunityIcons name="file-document" size={16} color="#059669" /><Text style={styles.supportText}>Document helpdesk is available for GST, PAN, and business papers.</Text></View>
          <View style={styles.supportRow}><MaterialCommunityIcons name="account-group" size={16} color="#059669" /><Text style={styles.supportText}>A dedicated franchise support advisor will contact you soon.</Text></View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/dealership/dealership-setup')}>
          <Text style={styles.buttonText}>Continue Setup</Text>
        </TouchableOpacity>

        <View style={styles.footerCard}>
          <Text style={styles.footerText}>Live elapsed time: {seconds}s</Text>
        </View>
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
  heroCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  heroLabel: { color: '#047857', textTransform: 'uppercase', fontSize: 12, fontWeight: '900' },
  heroValue: { color: '#064E3B', fontSize: 32, fontWeight: '900', marginTop: 6 },
  heroText: { color: '#14532D', marginTop: 6, lineHeight: 20 },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: '#DCFCE7', overflow: 'hidden', marginTop: 12 },
  progressFill: { height: '100%', backgroundColor: '#10B981' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  timelineDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#94A3B8', alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: '#10B981' },
  dotActive: { backgroundColor: '#059669' },
  timelineContent: { flex: 1, backgroundColor: '#F8FFFB', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  timelineTitle: { color: '#064E3B', fontWeight: '900' },
  timelineText: { color: '#14532D', marginTop: 4 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#ECFDF5', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, marginTop: 8 },
  badgeDone: { backgroundColor: '#DCFCE7' },
  badgeActive: { backgroundColor: '#059669' },
  badgeText: { color: '#047857', fontWeight: '900', fontSize: 11 },
  sectionTitle: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  supportRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  supportText: { flex: 1, color: '#064E3B' },
  button: { backgroundColor: '#059669', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#FFFFFF', fontWeight: '900' },
  footerCard: { backgroundColor: '#ECFDF5', borderRadius: 16, padding: 12, alignItems: 'center' },
  footerText: { color: '#064E3B', fontWeight: '800' },
})
