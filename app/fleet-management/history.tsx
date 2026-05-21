import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { chargingSessions, formatCurrency, trips } from '../../lib/mock/fleetData'

export default function HistoryScreen() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('trips')

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={24} color="#1f2937" />
          </Pressable>
          <Text style={styles.headerTitle}>History</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Tab Selection */}
        <View style={styles.tabsContainer}>
          <Pressable style={[styles.tab, selectedTab === 'trips' && styles.tabActive]} onPress={() => setSelectedTab('trips')}>
            <Text style={[styles.tabText, selectedTab === 'trips' && styles.tabTextActive]}>Trips</Text>
          </Pressable>
          <Pressable style={[styles.tab, selectedTab === 'charging' && styles.tabActive]} onPress={() => setSelectedTab('charging')}>
            <Text style={[styles.tabText, selectedTab === 'charging' && styles.tabTextActive]}>Charging</Text>
          </Pressable>
        </View>

        {/* Trips Tab */}
        {selectedTab === 'trips' && (
          <>
            <SectionHeader title={`${trips.length} Trips`} />
            <View style={styles.historyList}>
              {trips.map(trip => (
                <FleetCard key={trip.id} style={styles.historyCard}>
                  <View style={styles.historyCardHeader}>
                    <View style={styles.tripIcon}>
                      <MaterialCommunityIcons name="map-marker" size={18} color="#0ea5e9" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tripTitle}>
                        {trip.startLocation} → {trip.endLocation}
                      </Text>
                      <Text style={styles.tripTime}>{trip.startTime}</Text>
                    </View>
                    <View style={styles.tripStatus}>
                      <Text style={styles.tripStatusText}>{trip.status}</Text>
                    </View>
                  </View>

                  <View style={styles.tripDetails}>
                    <View style={styles.tripDetail}>
                      <MaterialCommunityIcons name="map-marker" size={14} color="#6b7280" />
                      <Text style={styles.tripDetailText}>{trip.distance} km</Text>
                    </View>
                    <View style={styles.tripDetail}>
                      <MaterialCommunityIcons name="timer" size={14} color="#6b7280" />
                      <Text style={styles.tripDetailText}>{trip.duration}</Text>
                    </View>
                    <View style={styles.tripDetail}>
                      <MaterialCommunityIcons name="cash" size={14} color="#6b7280" />
                      <Text style={styles.tripDetailText}>{formatCurrency(trip.cost)}</Text>
                    </View>
                  </View>
                </FleetCard>
              ))}
            </View>
          </>
        )}

        {/* Charging Tab */}
        {selectedTab === 'charging' && (
          <>
            <SectionHeader title={`${chargingSessions.length} Charging Sessions`} />
            <View style={styles.historyList}>
              {chargingSessions.map(session => (
                <FleetCard key={session.id} style={styles.historyCard}>
                  <View style={styles.historyCardHeader}>
                    <View style={styles.chargingIcon}>
                      <MaterialCommunityIcons name="battery-charging" size={18} color="#10b981" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sessionTitle}>{session.stationName}</Text>
                      <Text style={styles.sessionLocation}>{session.stationLocation}</Text>
                      <Text style={styles.sessionTime}>{session.startTime}</Text>
                    </View>
                    <View style={styles.sessionStatus}>
                      <Text style={styles.sessionStatusText}>{session.status}</Text>
                    </View>
                  </View>

                  <View style={styles.sessionDetails}>
                    <View style={styles.sessionDetail}>
                      <Text style={styles.sessionDetailLabel}>Battery</Text>
                      <Text style={styles.sessionDetailValue}>
                        {session.batteryStart}% → {session.batteryEnd}%
                      </Text>
                    </View>
                    <View style={styles.sessionDetail}>
                      <Text style={styles.sessionDetailLabel}>Energy</Text>
                      <Text style={styles.sessionDetailValue}>{session.energyDelivered.toFixed(1)} kWh</Text>
                    </View>
                    <View style={styles.sessionDetail}>
                      <Text style={styles.sessionDetailLabel}>Cost</Text>
                      <Text style={styles.sessionDetailValue}>{formatCurrency(session.cost)}</Text>
                    </View>
                  </View>
                </FleetCard>
              ))}
            </View>
          </>
        )}
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
  tabsContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: '#e2efe5', alignItems: 'center' },
  tabActive: { borderBottomColor: '#10b981' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: '#10b981', fontWeight: '900' },
  historyList: { gap: 10 },
  historyCard: { borderLeftWidth: 4, borderLeftColor: '#0ea5e9' },
  historyCardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  tripIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
  chargingIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center' },
  tripTitle: { fontSize: 13, fontWeight: '900', color: '#0f5132' },
  tripTime: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  tripStatus: { backgroundColor: '#d1fae5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  tripStatusText: { fontSize: 10, fontWeight: '900', color: '#10b981', textTransform: 'capitalize' },
  tripDetails: { flexDirection: 'row', gap: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e2efe5' },
  tripDetail: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  tripDetailText: { fontSize: 11, color: '#6b7280', fontWeight: '500' },
  sessionTitle: { fontSize: 13, fontWeight: '900', color: '#0f5132' },
  sessionLocation: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  sessionTime: { fontSize: 10, color: '#9ca3af', marginTop: 2 },
  sessionStatus: { backgroundColor: '#d1fae5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  sessionStatusText: { fontSize: 10, fontWeight: '900', color: '#10b981', textTransform: 'capitalize' },
  sessionDetails: { flexDirection: 'row', gap: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e2efe5' },
  sessionDetail: { flex: 1 },
  sessionDetailLabel: { fontSize: 10, color: '#6b7280', marginBottom: 2 },
  sessionDetailValue: { fontSize: 12, fontWeight: '900', color: '#0f5132' },
})
