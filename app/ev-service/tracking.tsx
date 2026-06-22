import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { PremiumCard, SectionHeader, StatusTimeline } from '../../components/ev-service/Shared'
import { useEvServiceBooking } from '../../context/booking-context'
import { timelineSteps } from '../../lib/mock/evServiceData'

export default function TrackingScreen() {
  const router = useRouter()
  const { activeBooking, updateBooking } = useEvServiceBooking()
  const [currentStep, setCurrentStep] = useState(0)
  const [statusNote, setStatusNote] = useState('Booking live')

  useEffect(() => {
    setCurrentStep(activeBooking?.timelineStep ?? 0)
  }, [activeBooking?.timelineStep])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(previous => {
        const next = Math.min(previous + 1, timelineSteps.length - 1)
        if (activeBooking) {
          updateBooking(activeBooking.id, {
            timelineStep: next,
            status: next >= timelineSteps.length - 1 ? 'in-progress' : 'in-progress',
          })
        }
        setStatusNote(timelineSteps[next].title)
        return next
      })
    }, 2200)

    return () => clearInterval(timer)
  }, [activeBooking, updateBooking])

  const readyToComplete = currentStep >= timelineSteps.length - 1

  const onComplete = () => {
    if (!activeBooking) return
    updateBooking(activeBooking.id, {
      timelineStep: timelineSteps.length - 1,
      status: 'completed',
    })
    router.push('/ev-service/invoice')
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <Text style={styles.heroKicker}>Step 6 of 8</Text>
        <Text style={styles.heroTitle}>Live service tracking</Text>
        <Text style={styles.heroSubtitle}>Mock real-time updates powered by setInterval().</Text>
        <View style={styles.badgeRow}>
          <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>{statusNote}</Text></View>
          <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>{activeBooking?.eta}</Text></View>
        </View>
      </View>

      <PremiumCard>
        <View style={styles.techRow}>
          <View style={styles.techIcon}><MaterialCommunityIcons name="account-tie-outline" size={20} color="#10b981" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.techTitle}>{activeBooking?.technicianName}</Text>
            <Text style={styles.techMeta}>{activeBooking?.technicianRole} • {activeBooking?.technicianExperienceYears} yrs • ★ {activeBooking?.technicianRating}</Text>
          </View>
          <View style={styles.liveDot} />
        </View>
        <Text style={styles.techDetail}>{activeBooking?.centerName}</Text>
        <Text style={styles.techDetail}>Estimated completion: {activeBooking?.eta}</Text>
      </PremiumCard>

      <SectionHeader title="Service progress" subtitle="Vertical timeline with live status badges" />
      <PremiumCard>
        <StatusTimeline
          steps={timelineSteps.map(step => ({ title: step.title, detail: step.detail, icon: step.icon }))}
          currentStep={currentStep}
        />
      </PremiumCard>

      <SectionHeader title="Completion status" subtitle="Track the final handover and quality check" />
      <View style={styles.statusGrid}>
        <View style={styles.statusCard}><Text style={styles.statusLabel}>Booking</Text><Text style={styles.statusValue}>Confirmed</Text></View>
        <View style={styles.statusCard}><Text style={styles.statusLabel}>Pickup</Text><Text style={styles.statusValue}>Live</Text></View>
        <View style={styles.statusCard}><Text style={styles.statusLabel}>QA</Text><Text style={styles.statusValue}>Queued</Text></View>
      </View>

      <Pressable style={[styles.completeButton, !readyToComplete && styles.completeButtonDisabled]} disabled={!readyToComplete} onPress={onComplete}>
        <Text style={styles.completeText}>Complete</Text>
        <MaterialCommunityIcons name="check-circle-outline" size={18} color="#ffffff" />
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4fbf6' },
  container: { padding: 16, paddingBottom: 36 },
  heroCard: { backgroundColor: '#0f5132', borderRadius: 28, padding: 18 },
  heroKicker: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  heroTitle: { color: '#ffffff', fontSize: 24, fontWeight: '900', marginTop: 8 },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', marginTop: 8, lineHeight: 19 },
  badgeRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 12 },
  liveBadge: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  liveBadgeText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  techRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  techIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  techTitle: { color: '#0f5132', fontWeight: '900' },
  techMeta: { color: '#6b7d72', marginTop: 4, fontSize: 12 },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10b981' },
  techDetail: { color: '#4f685b', marginTop: 8 },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statusCard: { flexBasis: '31%', flexGrow: 1, backgroundColor: '#ffffff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#e2efe5' },
  statusLabel: { color: '#6b7d72', fontSize: 11, textTransform: 'uppercase', fontWeight: '900' },
  statusValue: { color: '#0f5132', fontWeight: '900', marginTop: 8 },
  completeButton: { marginTop: 18, backgroundColor: '#10b981', borderRadius: 20, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  completeButtonDisabled: { opacity: 0.45 },
  completeText: { color: '#ffffff', fontWeight: '900', fontSize: 16 },
})
