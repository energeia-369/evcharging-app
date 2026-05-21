import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { verificationSteps } from '../../lib/mock/fleetOnboardingData'

export default function FleetVerificationScreen() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState(0)
  const progress = useMemo(() => Math.round(((stepIndex + 1) / verificationSteps.length) * 100), [stepIndex])

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex(current => (current >= verificationSteps.length - 1 ? current : current + 1))
    }, 850)

    return () => clearInterval(timer)
  }, [])

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={22} color="#0f5132" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Verification</Text>
            <Text style={styles.headerSubtitle}>Track the local onboarding review as each approval step completes.</Text>
          </View>
        </View>

        <FleetCard style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="shield-check" size={24} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLabel}>Approval progress</Text>
              <Text style={styles.heroValue}>{progress}% complete</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{verificationSteps[stepIndex]?.title}</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </FleetCard>

        <SectionHeader title="Verification Timeline" />
        <FleetCard style={styles.timelineCard}>
          {verificationSteps.map((step, index) => {
            const isDone = index <= stepIndex
            return (
              <View key={step.title} style={styles.timelineRow}>
                <View style={[styles.timelineDot, isDone && styles.timelineDotDone]}>
                  <MaterialCommunityIcons name={step.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']} size={16} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.timelineTitle}>{step.title}</Text>
                  <Text style={styles.timelineDetail}>{step.detail}</Text>
                </View>
                <Text style={[styles.timelineStatus, isDone && styles.timelineStatusDone]}>{isDone ? 'Done' : 'Pending'}</Text>
              </View>
            )
          })}
        </FleetCard>

        <FleetCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <MaterialCommunityIcons name="bank" size={18} color="#10b981" />
            <Text style={styles.noteText}>Bank verification is simulated with local status progression only.</Text>
          </View>
          <View style={styles.noteRow}>
            <MaterialCommunityIcons name="clock-outline" size={18} color="#10b981" />
            <Text style={styles.noteText}>Once all steps are complete, you will land on the fleet dashboard.</Text>
          </View>
        </FleetCard>

        <Pressable style={styles.primaryButton} onPress={() => router.replace('/fleet-management')}>
          <Text style={styles.primaryButtonText}>Open Fleet Dashboard</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#ffffff" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4fbf6' },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 19, fontWeight: '900', color: '#0f5132' },
  headerSubtitle: { fontSize: 12, color: '#6b7280', marginTop: 4, lineHeight: 18 },
  heroCard: { marginBottom: 16 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  heroIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  heroLabel: { fontSize: 12, color: '#6b7280' },
  heroValue: { fontSize: 18, fontWeight: '900', color: '#0f5132', marginTop: 2 },
  heroBadge: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  heroBadgeText: { fontSize: 11, fontWeight: '800', color: '#10b981' },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: '#e2efe5', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#10b981' },
  timelineCard: { marginBottom: 16 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  timelineDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#d1d5db', alignItems: 'center', justifyContent: 'center' },
  timelineDotDone: { backgroundColor: '#10b981' },
  timelineTitle: { fontSize: 14, fontWeight: '900', color: '#0f5132' },
  timelineDetail: { fontSize: 12, color: '#6b7280', marginTop: 3, lineHeight: 17 },
  timelineStatus: { fontSize: 11, fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', marginTop: 8 },
  timelineStatusDone: { color: '#10b981' },
  noteCard: { marginBottom: 16 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  noteText: { flex: 1, fontSize: 12, color: '#0f5132', lineHeight: 17 },
  primaryButton: { backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
})