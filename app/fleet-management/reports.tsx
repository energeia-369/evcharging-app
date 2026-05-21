import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { analyticsData, drivers, trips } from '../../lib/mock/fleetData'

export default function ReportsScreen() {
  const topDrivers = useMemo(() => [...drivers].sort((left, right) => right.rating - left.rating).slice(0, 3), [])
  const utilizationBars = analyticsData.batteryUsageDaily
  const revenueBars = analyticsData.chargingTimeByHour

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>Fleet Intelligence</Text>
            <Text style={styles.headerTitle}>Reports & analytics</Text>
            <Text style={styles.headerSubtitle}>Review fleet utilization, battery efficiency, and revenue signals.</Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name={'chart-line' as any} size={24} color="#ffffff" />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'qrcode-scan' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Daily Trips</Text>
            <Text style={styles.statValue}>{trips.length}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'cash' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Revenue</Text>
            <Text style={styles.statValue}>₹{analyticsData.totalCostThisMonth.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'battery-charging' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Battery Efficiency</Text>
            <Text style={styles.statValue}>{analyticsData.averageBatteryHealth}%</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'shield-check' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Fleet Score</Text>
            <Text style={styles.statValue}>{analyticsData.vehicleHealthScore}</Text>
          </View>
        </View>

        <SectionHeader title="Analytics Highlights" subtitle="Revenue, utilization, and environmental gains." />
        <View style={styles.highlightRow}>
          <FleetCard style={styles.highlightCard}>
            <MaterialCommunityIcons name={'chart-line' as any} size={20} color="#10b981" />
            <Text style={styles.highlightLabel}>Weekly Trips</Text>
            <Text style={styles.highlightValue}>{analyticsData.fleetUtilization}% utilization</Text>
          </FleetCard>
          <FleetCard style={styles.highlightCard}>
            <MaterialCommunityIcons name={'flash' as any} size={20} color="#10b981" />
            <Text style={styles.highlightLabel}>Carbon Savings</Text>
            <Text style={styles.highlightValue}>1.8 tons this month</Text>
          </FleetCard>
        </View>

        <FleetCard style={styles.chartCard}>
          <Text style={styles.sectionCardTitle}>Revenue Forecast</Text>
          <View style={styles.barChart}>
            {revenueBars.map(item => (
              <View key={item.hour} style={styles.barGroup}>
                <View style={[styles.bar, { height: 24 + item.sessions * 8 }]} />
                <Text style={styles.barLabel}>{item.hour}:00</Text>
              </View>
            ))}
          </View>
        </FleetCard>

        <FleetCard style={styles.chartCard}>
          <Text style={styles.sectionCardTitle}>Battery Efficiency Curve</Text>
          <View style={styles.lineChartPlaceholder}>
            {utilizationBars.map(item => (
              <View key={item.day} style={styles.lineChartPointRow}>
                <Text style={styles.lineChartDay}>{item.day}</Text>
                <View style={styles.lineTrack}>
                  <View style={[styles.lineFill, { width: `${item.percentage}%` }]} />
                </View>
                <Text style={styles.lineValue}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
        </FleetCard>

        <SectionHeader title="Top Performing Drivers" />
        {topDrivers.map(driver => (
          <FleetCard key={driver.id} style={styles.driverCard}>
            <View style={styles.driverRow}>
              <View style={styles.driverAvatar}>
                <MaterialCommunityIcons name={'account-tie' as any} size={22} color="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverMeta}>Rating {driver.rating.toFixed(1)} • {driver.totalTrips} trips</Text>
                <Text style={styles.driverMeta}>Shift {driver.availability.replace('-', ' ')}</Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreBadgeText}>Top</Text>
              </View>
            </View>
          </FleetCard>
        ))}
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
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { width: '48.5%', backgroundColor: '#ffffff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#dbe7dd' },
  statLabel: { color: '#6b7280', fontSize: 11, marginTop: 8 },
  statValue: { color: '#0f5132', fontSize: 15, fontWeight: '900', marginTop: 4 },
  highlightRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  highlightCard: { flex: 1 },
  highlightLabel: { color: '#6b7280', fontSize: 11, marginTop: 8 },
  highlightValue: { color: '#0f5132', fontSize: 13, fontWeight: '900', marginTop: 4 },
  chartCard: { marginBottom: 16 },
  sectionCardTitle: { color: '#0f5132', fontSize: 14, fontWeight: '900', marginBottom: 12 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
  barGroup: { alignItems: 'center', flex: 1 },
  bar: { width: '100%', borderRadius: 12, backgroundColor: '#10b981' },
  barLabel: { color: '#6b7280', fontSize: 10, marginTop: 6 },
  lineChartPlaceholder: { gap: 10 },
  lineChartPointRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lineChartDay: { width: 30, color: '#0f5132', fontSize: 11, fontWeight: '800' },
  lineTrack: { flex: 1, height: 8, borderRadius: 999, backgroundColor: '#e2efe5', overflow: 'hidden' },
  lineFill: { height: '100%', backgroundColor: '#10b981' },
  lineValue: { width: 36, textAlign: 'right', color: '#0f5132', fontSize: 11, fontWeight: '800' },
  driverCard: { marginBottom: 12 },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  driverName: { color: '#0f5132', fontSize: 14, fontWeight: '900' },
  driverMeta: { color: '#6b7280', fontSize: 12, marginTop: 2, lineHeight: 17 },
  scoreBadge: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  scoreBadgeText: { color: '#059669', fontSize: 11, fontWeight: '900' },
})
