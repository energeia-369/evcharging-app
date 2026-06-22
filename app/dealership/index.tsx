import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { dashboardNotifications, dashboardStats, formatINR, monthlyRevenue, salesGrowth, sampleVehicles } from '../../lib/mock/dealershipLifecycleData'

function StatCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <MaterialCommunityIcons name={icon as any} size={18} color="#059669" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  )
}

export default function DealershipScreen() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return sampleVehicles
    return sampleVehicles.filter((vehicle) => {
      return (
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.variant.toLowerCase().includes(query) ||
        vehicle.color.toLowerCase().includes(query)
      )
    })
  }, [search])

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.kicker}>Dealership & Franchise</Text>
            <Text style={styles.title}>Lifecycle Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/dealership')}>
            <MaterialCommunityIcons name="store" size={18} color="#064E3B" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Connected frontend lifecycle</Text>
          <Text style={styles.heroTitle}>Dashboard to franchise, setup, inventory, sales, payment, delivery, analytics, and wallet.</Text>
          <Text style={styles.heroText}>Premium EV dealership UI using mock data only.</Text>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="office-building" size={18} color="#059669" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search vehicles or variants"
              style={styles.searchInput}
              placeholderTextColor="#7C8B93"
            />
          </View>
        </View>

        <View style={styles.statGrid}>
          <StatCard title="Total Revenue" value={formatINR(dashboardStats.totalRevenue)} subtitle="Monthly revenue snapshot" icon="cash" />
          <StatCard title="Monthly Sales" value={String(dashboardStats.monthlySales)} subtitle="Vehicles sold this month" icon="car-electric" />
          <StatCard title="Inventory Count" value={String(dashboardStats.inventoryCount)} subtitle="Visible stock count" icon="clipboard-check" />
          <StatCard title="Pending Deliveries" value={String(dashboardStats.pendingDeliveries)} subtitle="Awaiting dispatch" icon="map-marker" />
        </View>

        <SectionHeading title="Quick Actions" subtitle="Start the connected lifecycle here" />
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/dealership/apply-dealer')}>
            <MaterialCommunityIcons name="account-tie" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Apply Dealer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/dealership/apply-franchise')}>
            <MaterialCommunityIcons name="file-document" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Apply Franchise</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/dealership/inventory')}>
            <MaterialCommunityIcons name="clipboard-check" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/dealership/analytics')}>
            <MaterialCommunityIcons name="chart-line" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/dealership/staff')}>
            <MaterialCommunityIcons name="account-group" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Staff</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/dealership/commission')}>
            <MaterialCommunityIcons name="wallet" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Commission Wallet</Text>
          </TouchableOpacity>
        </View>

        <SectionHeading title="Dealer Performance" subtitle="Visible premium cards and performance tracking" />
        <View style={styles.performanceRow}>
          <View style={styles.performanceCard}>
            <Text style={styles.performanceValue}>94</Text>
            <Text style={styles.performanceLabel}>Dealer Score</Text>
          </View>
          <View style={styles.performanceCard}>
            <Text style={styles.performanceValue}>18%</Text>
            <Text style={styles.performanceLabel}>Revenue Growth</Text>
          </View>
          <View style={styles.performanceCard}>
            <Text style={styles.performanceValue}>213</Text>
            <Text style={styles.performanceLabel}>Active Customers</Text>
          </View>
        </View>

        <SectionHeading title="Revenue Analytics" subtitle="Monthly trend cards and AI-ready layout" />
        <View style={styles.metricRow}>
          {monthlyRevenue.map((item) => (
            <View key={item.month} style={styles.miniCard}>
              <Text style={styles.miniCardLabel}>{item.month}</Text>
              <Text style={styles.miniCardValue}>{formatINR(item.revenue)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.bannerCard}>
          <MaterialCommunityIcons name="chart-line" size={20} color="#059669" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.bannerTitle}>{salesGrowth.percent}% EV sales growth</Text>
            <Text style={styles.bannerText}>Revenue and sales are trending upward across the lifecycle.</Text>
          </View>
        </View>

        <SectionHeading title="Inventory Alerts" subtitle="Stock health and fast visibility" />
        <View style={styles.noticeCard}>
          <MaterialCommunityIcons name="tools" size={18} color="#059669" />
          <Text style={styles.noticeText}>4 premium EVs need restock review and 2 battery packs are in transit.</Text>
        </View>

        <SectionHeading title="Franchise Approval" subtitle="Timeline overview for the connected flow" />
        <View style={styles.timelineCard}>
          {['Application Submitted', 'Documents Verified', 'Business Review', 'Financial Approval', 'Approved'].map((step, index) => (
            <View key={step} style={styles.timelineRow}>
              <View style={styles.timelineDot}><Text style={styles.timelineNumber}>{index + 1}</Text></View>
              <Text style={styles.timelineText}>{step}</Text>
            </View>
          ))}
        </View>

        <SectionHeading title="Vehicle Sales" subtitle="Visible vehicle inventory cards" />
        <View style={styles.vehicleGrid}>
          {filteredVehicles.map((vehicle) => (
            <View key={vehicle.id} style={styles.vehicleCard}>
              <View style={styles.vehicleImage}>
                <MaterialCommunityIcons name="car-electric" size={22} color="#059669" />
              </View>
              <Text style={styles.vehicleName}>{vehicle.model}</Text>
              <Text style={styles.vehicleMeta}>{vehicle.variant}</Text>
              <Text style={styles.vehicleMeta}>{vehicle.color}</Text>
            </View>
          ))}
        </View>

        <SectionHeading title="Staff Management" subtitle="Operational readiness and local staff controls" />
        <View style={styles.noticeCard}>
          <MaterialCommunityIcons name="account-group" size={18} color="#059669" />
          <Text style={styles.noticeText}>Technicians, sales managers, and support staff are ready for assignments.</Text>
        </View>

        <SectionHeading title="Commission Wallet" subtitle="Earnings and payout summary" />
        <View style={styles.walletCard}>
          <MaterialCommunityIcons name="wallet" size={22} color="#FFFFFF" />
          <Text style={styles.walletValue}>₹1,25,000</Text>
          <Text style={styles.walletLabel}>Available earnings</Text>
        </View>

        <SectionHeading title="Notifications" subtitle="Recent mock updates" />
        {dashboardNotifications.map((item) => (
          <View key={item} style={styles.notificationCard}>
            <MaterialCommunityIcons name="file-document" size={16} color="#059669" />
            <Text style={styles.notificationText}>{item}</Text>
          </View>
        ))}

        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  kicker: { color: '#047857', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '900', fontSize: 12 },
  title: { color: '#064E3B', fontSize: 26, fontWeight: '900' },
  iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 },
  heroCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, marginBottom: 16, shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 14, elevation: 2 },
  heroLabel: { color: '#047857', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  heroTitle: { color: '#064E3B', fontSize: 18, fontWeight: '900', marginTop: 8, lineHeight: 24 },
  heroText: { color: '#14532D', marginTop: 8, lineHeight: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F8FFFB', borderWidth: 1, borderColor: '#D1FAE5', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, marginTop: 12 },
  searchInput: { flex: 1, color: '#064E3B' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  statCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 22, padding: 14, shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  statIcon: { width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { color: '#064E3B', fontSize: 18, fontWeight: '900' },
  statTitle: { color: '#064E3B', fontSize: 13, fontWeight: '800', marginTop: 6 },
  statSubtitle: { color: '#14532D', fontSize: 11, marginTop: 4 },
  sectionHeading: { marginTop: 10, marginBottom: 10 },
  sectionTitle: { color: '#064E3B', fontSize: 18, fontWeight: '900' },
  sectionSubtitle: { color: '#166534', fontSize: 12, marginTop: 4 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  actionButton: { width: '48%', backgroundColor: '#059669', borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 6 },
  actionText: { color: '#FFFFFF', fontWeight: '900', textAlign: 'center' },
  performanceRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  performanceCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1, alignItems: 'center' },
  performanceValue: { color: '#059669', fontSize: 22, fontWeight: '900' },
  performanceLabel: { color: '#14532D', marginTop: 4, fontSize: 12, textAlign: 'center' },
  metricRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  miniCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  miniCardLabel: { color: '#047857', fontSize: 12, fontWeight: '900' },
  miniCardValue: { color: '#064E3B', fontSize: 15, fontWeight: '900', marginTop: 6 },
  bannerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', borderRadius: 18, padding: 14, marginBottom: 12 },
  bannerTitle: { color: '#064E3B', fontWeight: '900' },
  bannerText: { color: '#14532D', marginTop: 4 },
  noticeCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#ECFDF5', marginBottom: 12 },
  noticeText: { color: '#064E3B', flex: 1 },
  timelineCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  timelineDot: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  timelineNumber: { color: '#FFFFFF', fontWeight: '900' },
  timelineText: { color: '#064E3B', fontWeight: '800' },
  vehicleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  vehicleCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  vehicleImage: { height: 70, borderRadius: 14, backgroundColor: '#F8FFFB', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  vehicleName: { color: '#064E3B', fontWeight: '900' },
  vehicleMeta: { color: '#14532D', fontSize: 12, marginTop: 4 },
  walletCard: { backgroundColor: '#064E3B', borderRadius: 18, padding: 16, marginBottom: 12, alignItems: 'flex-start', gap: 6 },
  walletValue: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  walletLabel: { color: '#D1FAE5' },
  notificationCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#ECFDF5' },
  notificationText: { color: '#064E3B', flex: 1 },
  footerSpacer: { height: 28 },
})
