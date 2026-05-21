import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    Animated,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native'

type HealthItem = {
  id: string
  label: string
  value: number
  target: number
  color: string
  icon: keyof typeof MaterialCommunityIcons.glyphMap
  helper: string
}

type Recommendation = {
  id: string
  title: string
  detail: string
  icon: keyof typeof MaterialCommunityIcons.glyphMap
  tone: 'good' | 'warning' | 'alert'
}

type AlertItem = {
  id: string
  title: string
  detail: string
  severity: 'low' | 'medium' | 'high'
  action: string
}

const initialHealthItems: HealthItem[] = [
  { id: 'battery', label: 'Battery Health', value: 92, target: 92, color: '#10b981', icon: 'battery-charging', helper: 'Pack performance remains strong' },
  { id: 'efficiency', label: 'Charging Efficiency', value: 88, target: 88, color: '#14b8a6', icon: 'flash', helper: 'Stable fast-charge behavior' },
  { id: 'tire', label: 'Tire Pressure', value: 96, target: 96, color: '#22c55e', icon: 'car-tire-alert', helper: 'Near ideal PSI across all wheels' },
  { id: 'brake', label: 'Brake Status', value: 89, target: 89, color: '#16a34a', icon: 'car-brake-hold', helper: 'Pads and regen blend are healthy' },
  { id: 'motor', label: 'Motor Temperature', value: 74, target: 74, color: '#059669', icon: 'engine-outline', helper: 'Within safe operating range' },
  { id: 'software', label: 'Software Version', value: 100, target: 100, color: '#0f766e', icon: 'update', helper: 'Running the latest approved build' },
]

const recommendations: Recommendation[] = [
  { id: 'r1', title: 'Top-up battery cooling soon', detail: 'The thermal trend is stable, but a 30-minute coolant inspection is recommended before the next long trip.', icon: 'coolant-temperature', tone: 'warning' },
  { id: 'r2', title: 'Schedule a tire rotation', detail: 'Front-left and rear-right wear indicators are slightly different. A rotation will keep range and grip balanced.', icon: 'rotate-right', tone: 'good' },
  { id: 'r3', title: 'Enable power-saving mode', detail: 'Using eco mode on your next drive can improve charging efficiency and preserve battery health.', icon: 'leaf', tone: 'good' },
]

const maintenanceAlerts: AlertItem[] = [
  { id: 'a1', title: 'Coolant check due in 220 km', detail: 'Motor temperature is healthy, but the service window is approaching.', severity: 'medium', action: 'Book checkup' },
  { id: 'a2', title: 'Brake pad wear estimate at 18%', detail: 'Regen braking is helping, but the wear profile should be reviewed at the next visit.', severity: 'low', action: 'View details' },
  { id: 'a3', title: '12V battery health monitor active', detail: 'System monitoring is enabled to catch auxiliary battery dips early.', severity: 'low', action: 'Monitor' },
]

const statusPills = ['Live telemetry', 'Mock data only', 'Updated every 3s']

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function createHealthSeed() {
  return initialHealthItems.map(item => ({ ...item }))
}

export default function InvoiceScreen() {
  const { width } = useWindowDimensions()
  const [healthItems, setHealthItems] = useState(createHealthSeed)
  const [healthScore, setHealthScore] = useState(91)
  const [lastUpdated, setLastUpdated] = useState('Just now')
  const [pulseTick, setPulseTick] = useState(0)
  const animatedValues = useRef(initialHealthItems.map(() => new Animated.Value(0))).current

  useEffect(() => {
    const timer = setInterval(() => {
      setHealthItems(previous => {
        const next = previous.map(item => {
          const drift = Math.sin((Date.now() + item.target) / 5000) * 1.3
          const updatedValue = clamp(item.target + drift, 58, 100)
          return { ...item, value: Number(updatedValue.toFixed(0)) }
        })

        const score = Math.round(next.reduce((sum, item) => sum + item.value, 0) / next.length)
        setHealthScore(score)
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', second: '2-digit' }))
        setPulseTick(tick => tick + 1)
        return next
      })
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    healthItems.forEach((item, index) => {
      Animated.timing(animatedValues[index], {
        toValue: item.value / 100,
        duration: 650,
        useNativeDriver: false,
      }).start()
    })
  }, [animatedValues, healthItems])

  const scoreRing = useMemo(() => {
    const size = width < 390 ? 148 : 172
    const stroke = 12
    const radius = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const progress = circumference - (healthScore / 100) * circumference
    return { size, stroke, radius, circumference, progress }
  }, [healthScore, width])

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4fbf6" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.kicker}>Vehicle diagnostics</Text>
              <Text style={styles.heroTitle}>Premium EV Health Dashboard</Text>
              <Text style={styles.heroSubtitle}>A responsive, frontend-only diagnostics view powered by mock health telemetry and animated status updates.</Text>
            </View>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="clipboard-pulse-outline" size={28} color="#0f5132" />
            </View>
          </View>

          <View style={styles.pillRow}>
            {statusPills.map(pill => (
              <View key={pill} style={styles.statusPill}>
                <View style={styles.pillDot} />
                <Text style={styles.statusPillText}>{pill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.scoreGrid}>
          <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <Text style={styles.sectionLabel}>EV Health Score</Text>
              <View style={styles.liveChip}>
                <Text style={styles.liveChipText}>Live</Text>
              </View>
            </View>

            <View style={styles.scoreBody}>
              <View style={styles.scoreRingWrap}>
                <Animated.View
                  style={[
                    styles.scoreGlow,
                    {
                      opacity: 0.3 + ((pulseTick % 6) * 0.08),
                    },
                  ]}
                />
                <View style={[styles.ringFrame, { width: scoreRing.size, height: scoreRing.size }]}>
                  <SvgRing
                    size={scoreRing.size}
                    radius={scoreRing.radius}
                    stroke={scoreRing.stroke}
                    circumference={scoreRing.circumference}
                    progress={scoreRing.progress}
                    score={healthScore}
                  />
                </View>
              </View>

              <View style={styles.scoreCopy}>
                <Text style={styles.scoreValue}>{healthScore}</Text>
                <Text style={styles.scoreMeta}>Excellent condition</Text>
                <Text style={styles.scoreDescription}>The vehicle is healthy with minor service advisories. Telemetry is being refreshed automatically.</Text>
                <View style={styles.lastUpdatedRow}>
                  <MaterialCommunityIcons name="update" size={16} color="#10b981" />
                  <Text style={styles.lastUpdatedText}>Updated {lastUpdated}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.quickStatsCard}>
            <MetricPill label="Battery" value={`${healthItems[0]?.value ?? 0}%`} icon="battery-heart" />
            <MetricPill label="Efficiency" value={`${healthItems[1]?.value ?? 0}%`} icon="ev-station" />
            <MetricPill label="Tires" value={`${healthItems[2]?.value ?? 0}%`} icon="tire" />
            <MetricPill label="Motor" value={`${healthItems[4]?.value ?? 0}°C`} icon="engine" />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Health metrics</Text>
          <Text style={styles.sectionMeta}>Animated progress bars from mock vehicle data</Text>
        </View>

        <View style={styles.metricsList}>
          {healthItems.map((item, index) => (
            <View key={item.id} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <View style={styles.metricIconWrap}>
                  <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
                </View>
                <View style={styles.metricCopy}>
                  <Text style={styles.metricLabel}>{item.label}</Text>
                  <Text style={styles.metricHelper}>{item.helper}</Text>
                </View>
                <Text style={styles.metricValue}>{item.value}%</Text>
              </View>

              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    { backgroundColor: item.color, width: animatedValues[index].interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
                  ]}
                />
              </View>

              <View style={styles.metricFooter}>
                <Text style={styles.metricFooterText}>Target {item.target}%</Text>
                <Text style={styles.metricFooterText}>{item.value >= item.target ? 'Stable' : 'Monitoring'}</Text>
              </View>
            </View>
          ))}
        </View>

        <SectionHeader title="AI Recommendations" subtitle="Generated from live mock telemetry" />
        <View style={styles.recommendationList}>
          {recommendations.map(item => (
            <View key={item.id} style={styles.recommendationCard}>
              <View style={styles.recommendationIconWrap}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color={item.tone === 'alert' ? '#b91c1c' : item.tone === 'warning' ? '#b45309' : '#0f5132'}
                />
              </View>
              <View style={styles.recommendationCopy}>
                <Text style={styles.recommendationTitle}>{item.title}</Text>
                <Text style={styles.recommendationDetail}>{item.detail}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#97a99f" />
            </View>
          ))}
        </View>

        <SectionHeader title="Maintenance alerts" subtitle="Priority items to keep the EV in top condition" />
        <View style={styles.alertList}>
          {maintenanceAlerts.map(item => (
            <View key={item.id} style={styles.alertCard}>
              <View style={[styles.alertBadge, item.severity === 'high' && styles.alertHigh, item.severity === 'medium' && styles.alertMedium]}>
                <MaterialCommunityIcons
                  name={item.severity === 'high' ? 'alert-octagon' : item.severity === 'medium' ? 'alert' : 'information-outline'}
                  size={16}
                  color="#ffffff"
                />
              </View>
              <View style={styles.alertCopy}>
                <Text style={styles.alertTitle}>{item.title}</Text>
                <Text style={styles.alertDetail}>{item.detail}</Text>
              </View>
              <Pressable style={styles.alertAction}>
                <Text style={styles.alertActionText}>{item.action}</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.footerCard}>
          <View style={styles.footerTopRow}>
            <View>
              <Text style={styles.footerTitle}>Battery and drive system summary</Text>
              <Text style={styles.footerSubtitle}>White and green premium dashboard with responsive mobile layout.</Text>
            </View>
            <MaterialCommunityIcons name="leaf" size={24} color="#10b981" />
          </View>

          <View style={styles.footerGrid}>
            <FooterStat label="Battery" value={`${healthItems[0]?.value ?? 0}%`} />
            <FooterStat label="Motor temp" value={`${healthItems[4]?.value ?? 0}°C`} />
            <FooterStat label="Software" value="v12.4.1" />
            <FooterStat label="Alerts" value={String(maintenanceAlerts.length)} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

function SvgRing({
  size,
  radius,
  stroke,
  circumference,
  progress,
  score,
}: {
  size: number
  radius: number
  stroke: number
  circumference: number
  progress: number
  score: number
}) {
  return (
    <View>
      <View
        style={[
          styles.ringBase,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: 'rgba(16, 185, 129, 0.12)',
          },
        ]}
      />
      <View
        style={[
          styles.ringProgress,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: '#10b981',
            borderTopColor: '#10b981',
            borderRightColor: progress < circumference ? 'transparent' : '#10b981',
            transform: [{ rotate: `${(score / 100) * 360 - 90}deg` }],
            opacity: 0.35,
          },
        ]}
      />
      <View style={[styles.ringInner, { width: size - 26, height: size - 26, borderRadius: (size - 26) / 2 }]}>
        <Text style={styles.ringLabel}>Score</Text>
        <Text style={styles.ringValue}>{score}</Text>
      </View>
    </View>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionMeta}>{subtitle}</Text>
    </View>
  )
}

function MetricPill({ label, value, icon }: { label: string; value: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }) {
  return (
    <View style={styles.metricPill}>
      <MaterialCommunityIcons name={icon} size={18} color="#0f5132" />
      <View style={{ marginLeft: 8, flex: 1 }}>
        <Text style={styles.metricPillLabel}>{label}</Text>
        <Text style={styles.metricPillValue}>{value}</Text>
      </View>
    </View>
  )
}

function FooterStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.footerStat}>
      <Text style={styles.footerStatLabel}>{label}</Text>
      <Text style={styles.footerStatValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4fbf6',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2efe5',
    shadowColor: '#0f5132',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  kicker: {
    color: '#10b981',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: '800',
  },
  heroTitle: {
    color: '#0f5132',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    marginTop: 8,
    maxWidth: 280,
  },
  heroSubtitle: {
    color: '#5d7266',
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 340,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#edf9f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3fbf6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e3efe6',
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  statusPillText: {
    color: '#1b7f4b',
    fontWeight: '800',
    fontSize: 12,
  },
  scoreGrid: {
    marginTop: 16,
    gap: 14,
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2efe5',
    shadowColor: '#0f5132',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    color: '#0f5132',
    fontSize: 16,
    fontWeight: '900',
  },
  liveChip: {
    backgroundColor: '#e8f9ef',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  liveChipText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  scoreBody: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    flexWrap: 'wrap',
  },
  scoreRingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreGlow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#10b981',
  },
  ringFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringBase: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  ringProgress: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  ringInner: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f5132',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  ringLabel: {
    color: '#6a7d72',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  ringValue: {
    color: '#0f5132',
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '900',
    marginTop: 2,
  },
  scoreCopy: {
    flex: 1,
    minWidth: 180,
  },
  scoreValue: {
    color: '#0f5132',
    fontSize: 40,
    fontWeight: '900',
  },
  scoreMeta: {
    color: '#10b981',
    marginTop: 6,
    fontSize: 14,
    fontWeight: '900',
  },
  scoreDescription: {
    color: '#5d7266',
    lineHeight: 20,
    marginTop: 10,
  },
  lastUpdatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  lastUpdatedText: {
    color: '#10b981',
    fontWeight: '800',
    fontSize: 12,
  },
  quickStatsCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricPill: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2efe5',
  },
  metricPillLabel: {
    color: '#6a7d72',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  metricPillValue: {
    color: '#0f5132',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 4,
  },
  sectionHeader: {
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#0f5132',
    fontSize: 18,
    fontWeight: '900',
  },
  sectionMeta: {
    color: '#6a7d72',
    fontSize: 12,
    marginTop: 4,
  },
  metricsList: {
    gap: 12,
  },
  metricCard: {
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
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#f0fbf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricCopy: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  metricLabel: {
    color: '#0f5132',
    fontSize: 15,
    fontWeight: '900',
  },
  metricHelper: {
    color: '#6a7d72',
    marginTop: 4,
    lineHeight: 18,
    fontSize: 12,
  },
  metricValue: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: '900',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#edf5ef',
    overflow: 'hidden',
    marginTop: 14,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  metricFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  metricFooterText: {
    color: '#6a7d72',
    fontSize: 12,
    fontWeight: '700',
  },
  recommendationList: {
    gap: 12,
  },
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2efe5',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0f5132',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  recommendationIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#f4fbf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationCopy: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  recommendationTitle: {
    color: '#0f5132',
    fontSize: 14,
    fontWeight: '900',
  },
  recommendationDetail: {
    color: '#6a7d72',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  alertList: {
    gap: 12,
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2efe5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertBadge: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertMedium: {
    backgroundColor: '#f59e0b',
  },
  alertHigh: {
    backgroundColor: '#ef4444',
  },
  alertCopy: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  alertTitle: {
    color: '#0f5132',
    fontSize: 14,
    fontWeight: '900',
  },
  alertDetail: {
    color: '#6a7d72',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  alertAction: {
    backgroundColor: '#eefaf1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  alertActionText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '900',
  },
  footerCard: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2efe5',
    shadowColor: '#0f5132',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  footerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  footerTitle: {
    color: '#0f5132',
    fontSize: 17,
    fontWeight: '900',
  },
  footerSubtitle: {
    color: '#6a7d72',
    marginTop: 6,
    lineHeight: 18,
  },
  footerGrid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  footerStat: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 140,
    backgroundColor: '#f5fbf7',
    borderRadius: 18,
    padding: 14,
  },
  footerStatLabel: {
    color: '#6a7d72',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  footerStatValue: {
    color: '#0f5132',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 6,
  },
})