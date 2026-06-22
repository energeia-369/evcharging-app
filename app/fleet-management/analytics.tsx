import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader, StatCard } from '../../components/fleet/Shared'
import { analyticsData, formatCurrency } from '../../lib/mock/fleetData'

export default function AnalyticsScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={24} color="#1f2937" />
          </Pressable>
          <Text style={styles.headerTitle}>Fleet Analytics</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Overview Stats */}
        <SectionHeader title="Fleet Overview" />
        <View style={styles.statsGrid}>
          <StatCard icon="truck" title="Total Vehicles" value={`${analyticsData.totalVehicles}`} color="#10b981" />
          <StatCard icon="battery-charging" title="Avg Battery" value={`${analyticsData.averageBatteryHealth}%`} color="#0ea5e9" />
          <StatCard icon="map-marker" title="This Month" value={`${analyticsData.totalKmThisMonth} km`} color="#f59e0b" />
          <StatCard icon="cash" title="Total Cost" value={formatCurrency(analyticsData.totalCostThisMonth)} color="#8b5cf6" />
        </View>

        {/* Performance Metrics */}
        <SectionHeader title="Performance Metrics" />
        <FleetCard style={styles.metricsCard}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Fleet Utilization</Text>
            <View style={styles.metricValue}>
              <Text style={styles.metricValueText}>{analyticsData.fleetUtilization}%</Text>
            </View>
          </View>
          <View style={styles.metricBarContainer}>
            <View style={[styles.metricBar, { width: `${analyticsData.fleetUtilization}%` }]} />
          </View>
        </FleetCard>

        <FleetCard style={styles.metricsCard}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Vehicle Health Score</Text>
            <View style={styles.metricValue}>
              <Text style={styles.metricValueText}>{analyticsData.vehicleHealthScore}%</Text>
            </View>
          </View>
          <View style={styles.metricBarContainer}>
            <View style={[styles.metricBar, { width: `${analyticsData.vehicleHealthScore}%`, backgroundColor: '#10b981' }]} />
          </View>
        </FleetCard>

        {/* Battery Usage */}
        <SectionHeader title="Daily Battery Usage" />
        <FleetCard>
          <View style={styles.chartContainer}>
            {analyticsData.batteryUsageDaily.map((day, idx) => (
              <View key={idx} style={styles.barChartItem}>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, { height: `${day.percentage}%` }]} />
                </View>
                <Text style={styles.barLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
        </FleetCard>

        {/* Charging Distribution */}
        <SectionHeader title="Charging Pattern" />
        <FleetCard>
          <View style={styles.chargingPatternContainer}>
            {analyticsData.chargingTimeByHour.map((hour, idx) => (
              <View key={idx} style={styles.chargingPatternItem}>
                <Text style={styles.chargingTime}>{hour.hour}:00</Text>
                <View style={styles.chargingDots}>
                  {[...Array(hour.sessions)].map((_, i) => (
                    <View key={i} style={styles.dot} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </FleetCard>

        {/* Cost Analysis */}
        <SectionHeader title="Cost Analysis" />
        <FleetCard>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Average Cost per km</Text>
            <Text style={styles.costValue}>{formatCurrency(analyticsData.averageCostPerKm)}/km</Text>
          </View>
          <View style={styles.costBreakdown}>
            <View style={styles.costItem}>
              <MaterialCommunityIcons name="battery-charging" size={16} color="#10b981" />
              <Text style={styles.costItemText}>Charging: 60%</Text>
            </View>
            <View style={styles.costItem}>
              <MaterialCommunityIcons name="shield-check" size={16} color="#0ea5e9" />
              <Text style={styles.costItemText}>Maintenance: 30%</Text>
            </View>
            <View style={styles.costItem}>
              <MaterialCommunityIcons name="file-document" size={16} color="#f59e0b" />
              <Text style={styles.costItemText}>Other: 10%</Text>
            </View>
          </View>
        </FleetCard>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4fbf6' },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0f5132', flex: 1, textAlign: 'center' },
  statsGrid: { gap: 8, marginBottom: 16 },
  metricsCard: { marginBottom: 12 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  metricLabel: { fontSize: 13, fontWeight: '600', color: '#0f5132' },
  metricValue: { backgroundColor: '#edf9f1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  metricValueText: { fontSize: 13, fontWeight: '900', color: '#10b981' },
  metricBarContainer: { height: 8, backgroundColor: '#e2efe5', borderRadius: 4, overflow: 'hidden' },
  metricBar: { height: '100%', backgroundColor: '#0ea5e9' },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 120, gap: 8 },
  barChartItem: { alignItems: 'center', flex: 1 },
  barContainer: { width: '100%', height: 100, backgroundColor: '#e2efe5', borderRadius: 6, justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: '100%', backgroundColor: '#10b981', borderRadius: 4 },
  barLabel: { fontSize: 11, fontWeight: '600', color: '#6b7280', marginTop: 6 },
  chargingPatternContainer: { gap: 8 },
  chargingPatternItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chargingTime: { fontSize: 11, fontWeight: '600', color: '#0f5132', width: 40 },
  chargingDots: { flexDirection: 'row', gap: 2, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e2efe5' },
  costLabel: { fontSize: 13, color: '#6b7280' },
  costValue: { fontSize: 16, fontWeight: '900', color: '#0f5132' },
  costBreakdown: { gap: 8 },
  costItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  costItemText: { fontSize: 12, color: '#0f5132', fontWeight: '500' },
})
