import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { supportTickets } from '../../lib/mock/showroomData'

export default function AfterSalesScreen() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#064E3B" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>After sales service</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>EV care dashboard</Text>
          <Text style={styles.summarySubtitle}>Track maintenance, warranty, battery health and support requests.</Text>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'Service booking', icon: 'tools' },
            { label: 'Warranty', icon: 'shield-check' },
            { label: 'Battery health', icon: 'battery-charging' },
          ].map((item) => (
            <View key={item.label} style={styles.statCard}>
              <MaterialCommunityIcons name={item.icon as any} size={24} color="#10B981" />
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Battery health</Text>
            <Text style={styles.metricValue}>94%</Text>
            <Text style={styles.metricDetail}>Optimal charge retention</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Maintenance</Text>
            <Text style={styles.metricValue}>2 due</Text>
            <Text style={styles.metricDetail}>Next reminder in 12 days</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Support tickets</Text>
        <FlatList
          data={supportTickets}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketTitle}>{item.title}</Text>
                <Text style={[styles.ticketStatus, item.status === 'Open' ? styles.statusOpen : item.status === 'Resolved' ? styles.statusResolved : styles.statusProgress]}>{item.status}</Text>
              </View>
              <Text style={styles.ticketDetail}>{item.detail}</Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.helpButton} onPress={() => alert('Service request created')}>
          <Text style={styles.helpText}>Book service appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 12 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  pageTitle: { fontSize: 20, fontWeight: '900', color: '#064E3B' },
  summaryCard: { backgroundColor: '#ECFDF5', borderRadius: 24, padding: 18, marginBottom: 18 },
  summaryTitle: { color: '#065F46', fontSize: 18, fontWeight: '900', marginBottom: 8 },
  summarySubtitle: { color: '#14532D', fontSize: 13, lineHeight: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, alignItems: 'center', marginHorizontal: 4, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 14, elevation: 1 },
  statLabel: { color: '#064E3B', fontWeight: '900', marginTop: 10 },
  cardRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  metricCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 14, elevation: 1 },
  metricTitle: { color: '#065F46', fontWeight: '900', marginBottom: 6 },
  metricValue: { color: '#064E3B', fontSize: 24, fontWeight: '900' },
  metricDetail: { color: '#14532D', marginTop: 6, fontSize: 12 },
  sectionTitle: { color: '#064E3B', fontSize: 17, fontWeight: '900', marginBottom: 12 },
  ticketCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.05, shadowRadius: 12, elevation: 1 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ticketTitle: { color: '#064E3B', fontSize: 15, fontWeight: '900' },
  ticketStatus: { fontSize: 12, fontWeight: '900', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  statusOpen: { backgroundColor: '#DCFCE7', color: '#047857' },
  statusResolved: { backgroundColor: '#E0F2FE', color: '#0C4A6E' },
  statusProgress: { backgroundColor: '#FEF3C7', color: '#92400E' },
  ticketDetail: { color: '#14532D', fontSize: 13, lineHeight: 20 },
  helpButton: { backgroundColor: '#10B981', borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  helpText: { color: '#FFFFFF', fontWeight: '900' },
})
