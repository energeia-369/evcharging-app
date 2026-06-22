import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo } from 'react'
<<<<<<< HEAD
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native'
=======
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
>>>>>>> 6fd40c6f5515f9b35690b17707ff8f51705372eb
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { analyticsData, trips } from '../../lib/mock/fleetData'
import { useAuth } from './AuthContext'
import { useFleetOps } from './FleetOpsContext'

type QuickAction = {
  label: string
  icon: string
  route: string
}

export default function FleetDashboard() {
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAuth()
  const { currentDriver, currentVehicle, dashboardMetrics, resetOperations } = useFleetOps()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/fleet-management/login')
    }
  }, [isAuthenticated, router])

  const summary = useMemo(() => {
    const activeTrips = dashboardMetrics.vehicleDriverMapping.filter(item => item.drivers.length > 0).length
    return {
      totalVehicles: dashboardMetrics.totalVehicles,
      totalDrivers: dashboardMetrics.totalDrivers,
      activeDrivers: dashboardMetrics.activeDrivers,
      assignedDrivers: dashboardMetrics.assignedDrivers,
      pendingKyc: dashboardMetrics.pendingKyc,
      activeTrips,
      earnings: analyticsData.totalCostThisMonth,
      batteryHealth: analyticsData.averageBatteryHealth,
      fleetScore: analyticsData.vehicleHealthScore,
    }
  }, [dashboardMetrics])

  const quickActions: QuickAction[] = [
    { label: 'Vehicles & Drivers', icon: 'truck', route: '/fleet-management/vehicles' },
<<<<<<< HEAD
    { label: 'Point-to-Point Fleet Service', icon: 'qrcode-scan', route: '/fleet-management/trip-booking' },
=======
    { label: 'Trip Booking', icon: 'qrcode-scan', route: '/fleet-management/trip-booking' },
>>>>>>> 6fd40c6f5515f9b35690b17707ff8f51705372eb
    { label: 'Live Tracking', icon: 'map-marker', route: '/fleet-management/tracking' },
    { label: 'Fleet Reports', icon: 'chart-line', route: '/fleet-management/reports' },
    { label: 'Vehicle Charging', icon: 'battery-charging', route: '/fleet-management/charging' },
    { label: 'Invoice & Settlement', icon: 'file-document', route: '/fleet-management/invoice' },
  ]

<<<<<<< HEAD
  function handleActionPress(action: QuickAction) {
    if (action.route === '/fleet-management/trip-booking') {
      if (summary.totalVehicles === 0 || summary.totalDrivers === 0) {
        Alert.alert(
          'Setup Required',
          'Please add at least one vehicle and one driver to use the Point-to-Point Fleet Service.'
        )
        return
      }
    }
    router.push(action.route as any)
  }

=======
>>>>>>> 6fd40c6f5515f9b35690b17707ff8f51705372eb
  function handleLogout() {
    resetOperations()
    logout()
    router.replace('/fleet-management')
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.heroGlow} />

        <FleetCard style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons name={'shield-check' as any} size={24} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>Connected Fleet Operations</Text>
              <Text style={styles.heroTitle}>Welcome back, {user?.fullName ?? user?.email ?? 'Fleet Manager'}</Text>
              <Text style={styles.heroSubtitle}>Your EV fleet is live, monitored, and ready for trip dispatch.</Text>
            </View>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <MaterialCommunityIcons name={'clipboard-check' as any} size={16} color="#0f5132" />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>

          <View style={styles.assignmentRow}>
            <View style={styles.assignmentChip}>
              <MaterialCommunityIcons name={'car-electric' as any} size={16} color="#10b981" />
              <Text style={styles.assignmentChipText}>{currentVehicle.number}</Text>
            </View>
            <View style={styles.assignmentChip}>
              <MaterialCommunityIcons name={'account-tie' as any} size={16} color="#10b981" />
              <Text style={styles.assignmentChipText}>{currentDriver.name}</Text>
            </View>
          </View>
        </FleetCard>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'truck' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Total Vehicles</Text>
            <Text style={styles.statValue}>{summary.totalVehicles}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'account-tie' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Total Drivers</Text>
            <Text style={styles.statValue}>{summary.totalDrivers}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'map-marker' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Active Drivers</Text>
            <Text style={styles.statValue}>{summary.activeDrivers}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'cash' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Assigned Drivers</Text>
            <Text style={styles.statValue}>{summary.assignedDrivers}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'clipboard-check' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Pending KYC</Text>
            <Text style={styles.statValue}>{summary.pendingKyc}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'qrcode-scan' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Mapped Vehicles</Text>
            <Text style={styles.statValue}>{summary.activeTrips}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'cash' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Fleet Earnings</Text>
            <Text style={styles.statValue}>₹{summary.earnings.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name={'battery-charging' as any} size={20} color="#10b981" />
            <Text style={styles.statLabel}>Battery Health</Text>
            <Text style={styles.statValue}>{summary.batteryHealth}%</Text>
          </View>
        </View>

        <FleetCard style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <View>
              <Text style={styles.sectionCardTitle}>Battery Health Overview</Text>
              <Text style={styles.healthText}>Average battery health, fleet score, and charging workload.</Text>
            </View>
            <View style={styles.scoreBadge}>
              <MaterialCommunityIcons name={'shield-check' as any} size={14} color="#10b981" />
              <Text style={styles.scoreBadgeText}>{summary.fleetScore}</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${summary.batteryHealth}%` }]} />
          </View>
          <View style={styles.healthFooter}>
            <Text style={styles.healthFooterText}>{summary.batteryHealth}% average battery health</Text>
            <Text style={styles.healthFooterText}>{analyticsData.fleetUtilization}% fleet utilization</Text>
          </View>
        </FleetCard>

<<<<<<< HEAD
        <SectionHeader title="Onboarding & KYC Status" subtitle="Upload and verify your fleet documents." />
        <FleetCard style={styles.kycCard}>
          <View style={styles.kycHeaderRow}>
            <MaterialCommunityIcons name="shield-account" size={24} color="#059669" />
            <Text style={styles.kycCardTitle}>Required Fleet Documents</Text>
          </View>
          
          <View style={styles.kycItemRow}>
            <MaterialCommunityIcons 
              name={summary.totalVehicles > 0 ? "check-circle" : "circle-outline"} 
              size={18} 
              color={summary.totalVehicles > 0 ? "#10b981" : "#9ca3af"} 
            />
            <Text style={styles.kycItemText}>Vehicle Registration & KYC Uploads</Text>
            <Pressable 
              style={styles.kycActionBtn} 
              onPress={() => router.push('/fleet-management/vehicle-kyc')}
            >
              <Text style={styles.kycActionBtnText}>
                {summary.totalVehicles > 0 ? "Edit Docs" : "Upload"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.kycItemRow}>
            <MaterialCommunityIcons 
              name={summary.totalDrivers > 0 ? "check-circle" : "circle-outline"} 
              size={18} 
              color={summary.totalDrivers > 0 ? "#10b981" : "#9ca3af"} 
            />
            <Text style={styles.kycItemText}>Driver License & KYC Verification</Text>
            <Pressable 
              style={styles.kycActionBtn} 
              onPress={() => router.push('/fleet-management/driver-kyc')}
            >
              <Text style={styles.kycActionBtnText}>
                {summary.totalDrivers > 0 ? "Edit Docs" : "Upload"}
              </Text>
            </Pressable>
          </View>

          {summary.totalVehicles > 0 && summary.totalDrivers > 0 ? (
            <View style={styles.kycSuccessBanner}>
              <MaterialCommunityIcons name="check-decagram" size={16} color="#047857" />
              <Text style={styles.kycSuccessText}>Point-to-Point Fleet Service Unlocked! 🚀</Text>
            </View>
          ) : (
            <View style={styles.kycWarningBanner}>
              <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#b45309" />
              <Text style={styles.kycWarningText}>Add vehicle + driver to unlock Fleet Service routing.</Text>
            </View>
          )}
        </FleetCard>

        <SectionHeader title="Quick Actions" subtitle="Jump into each connected fleet module." />
        <View style={styles.actionGrid}>
          {quickActions.map(action => (
            <Pressable key={action.route} style={styles.actionCard} onPress={() => handleActionPress(action)}>
=======
        <SectionHeader title="Quick Actions" subtitle="Jump into each connected fleet module." />
        <View style={styles.actionGrid}>
          {quickActions.map(action => (
            <Pressable key={action.route} style={styles.actionCard} onPress={() => router.push(action.route as any)}>
>>>>>>> 6fd40c6f5515f9b35690b17707ff8f51705372eb
              <MaterialCommunityIcons name={action.icon as any} size={20} color="#10b981" />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <SectionHeader title="Fleet Snapshot" />
        <FleetCard style={styles.snapshotCard}>
          <View style={styles.snapshotRow}>
            <MaterialCommunityIcons name={'clock-outline' as any} size={18} color="#10b981" />
            <Text style={styles.snapshotText}>{trips.length} completed trips tracked in the local mock feed.</Text>
          </View>
          <View style={styles.snapshotRow}>
            <MaterialCommunityIcons name={'battery-charging' as any} size={18} color="#10b981" />
            <Text style={styles.snapshotText}>{analyticsData.chargingVehicles} vehicles are currently in charging status.</Text>
          </View>
          <View style={styles.snapshotRow}>
            <MaterialCommunityIcons name={'chart-line' as any} size={18} color="#10b981" />
            <Text style={styles.snapshotText}>Performance score stays aligned with vehicle health and utilization.</Text>
          </View>
        </FleetCard>

        <SectionHeader title="Vehicle Driver Mapping" subtitle="One vehicle can host multiple drivers with independent shifts and KYC." />
        <FleetCard style={styles.snapshotCard}>
          {dashboardMetrics.vehicleDriverMapping.map(item => (
            <View key={item.vehicleId} style={styles.mappingRow}>
              <Text style={styles.mappingVehicle}>{item.vehicleNumber}</Text>
              <Text style={styles.mappingDrivers}>{item.drivers.length > 0 ? item.drivers.join(', ') : 'No drivers assigned'}</Text>
            </View>
          ))}
        </FleetCard>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4fbf6' },
  content: { padding: 16, paddingBottom: 32 },
  heroGlow: { position: 'absolute', top: -60, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(16,185,129,0.10)' },
  heroCard: { marginBottom: 16 },
  heroRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  heroIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  kicker: { color: '#059669', fontSize: 11, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' },
  heroTitle: { color: '#0f5132', fontSize: 20, fontWeight: '900', marginTop: 4, lineHeight: 26 },
  heroSubtitle: { color: '#6b7280', fontSize: 12, marginTop: 4, lineHeight: 18 },
  logoutButton: { borderRadius: 14, backgroundColor: '#edf9f1', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoutText: { color: '#0f5132', fontSize: 12, fontWeight: '900' },
  assignmentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  assignmentChip: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  assignmentChipText: { color: '#0f5132', fontSize: 11, fontWeight: '800' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { width: '48.5%', backgroundColor: '#ffffff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#dbe7dd' },
  statLabel: { color: '#6b7280', fontSize: 11, marginTop: 8 },
  statValue: { color: '#0f5132', fontSize: 16, fontWeight: '900', marginTop: 4 },
  healthCard: { marginBottom: 16 },
  healthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  sectionCardTitle: { color: '#0f5132', fontSize: 14, fontWeight: '900' },
  healthText: { color: '#6b7280', fontSize: 12, marginTop: 4, lineHeight: 18 },
  scoreBadge: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  scoreBadgeText: { color: '#059669', fontWeight: '900', fontSize: 11 },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: '#e2efe5', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#10b981' },
  healthFooter: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginTop: 12 },
  healthFooterText: { color: '#4f6952', fontSize: 12, fontWeight: '700' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  actionCard: { width: '48.5%', backgroundColor: '#ffffff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#dbe7dd', minHeight: 88, justifyContent: 'space-between' },
  actionLabel: { color: '#0f5132', fontSize: 12, fontWeight: '900', marginTop: 18, lineHeight: 17 },
  snapshotCard: { marginBottom: 16 },
  snapshotRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  snapshotText: { flex: 1, color: '#4f6952', fontSize: 12, lineHeight: 18 },
  mappingRow: { borderBottomWidth: 1, borderBottomColor: '#e2efe5', paddingBottom: 8, marginBottom: 8 },
  mappingVehicle: { color: '#0f5132', fontSize: 12, fontWeight: '900' },
  mappingDrivers: { color: '#4f6952', fontSize: 12, marginTop: 4, lineHeight: 18 },
<<<<<<< HEAD
  kycCard: { marginBottom: 16, gap: 12 },
  kycHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  kycCardTitle: { color: '#0f5132', fontSize: 15, fontWeight: '900' },
  kycItemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingVertical: 4 },
  kycItemText: { flex: 1, color: '#374151', fontSize: 13, fontWeight: '600' },
  kycActionBtn: { backgroundColor: '#edf9f1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  kycActionBtnText: { color: '#059669', fontSize: 11, fontWeight: '800' },
  kycSuccessBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#d1fae5', padding: 10, borderRadius: 10, marginTop: 4 },
  kycSuccessText: { color: '#065f46', fontSize: 12, fontWeight: '800' },
  kycWarningBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fef3c7', padding: 10, borderRadius: 10, marginTop: 4 },
  kycWarningText: { color: '#92400e', fontSize: 12, fontWeight: '800' },
=======
>>>>>>> 6fd40c6f5515f9b35690b17707ff8f51705372eb
})
