import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  )
}

export function PremiumCard({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.card, style]}>{children}</View>
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.skeletonLineLong} />
      <View style={styles.skeletonLineShort} />
      <View style={styles.skeletonRow}>
        <View style={styles.skeletonChip} />
        <View style={styles.skeletonChip} />
      </View>
    </View>
  )
}

export function ProgressBar({ value, color = '#10b981' }: { value: number; color?: string }) {
  const animated = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: Math.max(0, Math.min(1, value)),
      duration: 650,
      useNativeDriver: false,
    }).start()
  }, [animated, value])

  return (
    <View style={styles.track}>
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: animated.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
    </View>
  )
}

export function StatusTimeline({ steps, currentStep }: { steps: Array<{ title: string; detail: string; icon: string }>; currentStep: number }) {
  return (
    <View style={styles.timelineWrap}>
      {steps.map((step, index) => {
        const complete = index < currentStep
        const active = index === currentStep
        return (
          <View key={`${step.title}-${index}`} style={styles.timelineRow}>
            <View style={[styles.timelineRail, complete && styles.timelineRailComplete, active && styles.timelineRailActive]}>
              <MaterialCommunityIcons name={step.icon as any} size={16} color={complete || active ? '#ffffff' : '#10b981'} />
            </View>
            <View style={styles.timelineCopy}>
              <Text style={[styles.timelineTitle, (complete || active) && styles.timelineTitleActive]}>{step.title}</Text>
              <Text style={styles.timelineDetail}>{step.detail}</Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

export function StatPill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statPill}>
      <MaterialCommunityIcons name={icon as any} size={18} color="#0f5132" />
      <View style={{ marginLeft: 8 }}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionHeader: { marginTop: 18, marginBottom: 12 },
  sectionTitle: { color: '#0f5132', fontSize: 18, fontWeight: '900' },
  sectionSubtitle: { color: '#6b7d72', marginTop: 4, fontSize: 12 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2efe5',
    shadowColor: '#0f5132',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  skeletonLineLong: { height: 14, width: '72%', borderRadius: 999, backgroundColor: '#eef4ef', marginBottom: 10 },
  skeletonLineShort: { height: 12, width: '45%', borderRadius: 999, backgroundColor: '#eef4ef', marginBottom: 18 },
  skeletonRow: { flexDirection: 'row', gap: 10 },
  skeletonChip: { height: 26, width: 86, borderRadius: 999, backgroundColor: '#eef4ef' },
  track: { height: 10, borderRadius: 999, backgroundColor: '#edf4ef', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  timelineWrap: { gap: 14 },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineRail: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cfe4d6',
    backgroundColor: '#f4fbf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineRailComplete: { backgroundColor: '#10b981', borderColor: '#10b981' },
  timelineRailActive: { backgroundColor: '#0f5132', borderColor: '#0f5132' },
  timelineCopy: { flex: 1 },
  timelineTitle: { color: '#4f685b', fontWeight: '800' },
  timelineTitleActive: { color: '#0f5132' },
  timelineDetail: { color: '#6b7d72', fontSize: 12, lineHeight: 18, marginTop: 4 },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5fbf7',
    borderWidth: 1,
    borderColor: '#e2efe5',
    borderRadius: 18,
    padding: 12,
  },
  statLabel: { color: '#6b7d72', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  statValue: { color: '#0f5132', fontWeight: '900', marginTop: 2 },
})
