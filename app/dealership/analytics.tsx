import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { analyticsLeaderBoard, customerGrowth, formatINR, monthlyRevenue, profitSummary, salesGrowth, topSellingVehicles } from '../../lib/mock/dealershipLifecycleData'

export default function AnalyticsScreen() {
  const router = useRouter()
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Revenue Analytics</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/dealership')}>
            <MaterialCommunityIcons name="chart-line" size={18} color="#064E3B" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardsRow}>
          {monthlyRevenue.map((item) => (
            <View key={item.month} style={styles.miniCard}>
              <Text style={styles.miniLabel}>{item.month}</Text>
              <Text style={styles.miniValue}>{formatINR(item.revenue)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>EV Sales Growth</Text>
          <Text style={styles.bigValue}>{salesGrowth.percent}%</Text>
          <Text style={styles.bodyText}>Growth over {salesGrowth.period}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Top Selling Vehicles</Text>
          {topSellingVehicles.map((vehicle) => (
            <View key={vehicle.name} style={styles.listRow}>
              <MaterialCommunityIcons name="car-electric" size={16} color="#059669" />
              <Text style={styles.listText}>{vehicle.name}</Text>
              <Text style={styles.listValue}>{vehicle.units} units</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.miniCardWide}><Text style={styles.miniLabel}>Gross Profit</Text><Text style={styles.miniValue}>{formatINR(profitSummary.grossProfit)}</Text></View>
          <View style={styles.miniCardWide}><Text style={styles.miniLabel}>Net Profit</Text><Text style={styles.miniValue}>{formatINR(profitSummary.netProfit)}</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Growth</Text>
          {customerGrowth.map((item) => (
            <View key={item.month} style={styles.listRow}>
              <MaterialCommunityIcons name="account-group" size={16} color="#059669" />
              <Text style={styles.listText}>{item.month}</Text>
              <Text style={styles.listValue}>{item.customers}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>AI Sales Prediction</Text>
          <View style={styles.predictionCard}>
            <MaterialCommunityIcons name="flash" size={18} color="#059669" />
            <Text style={styles.predictionText}>Next month revenue is projected to grow by 12% with premium EV demand.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dealer Ranking Leaderboard</Text>
          {analyticsLeaderBoard.map((dealer, index) => (
            <View key={dealer.name} style={styles.rankRow}>
              <View style={styles.rankPill}><Text style={styles.rankText}>#{index + 1}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.listText}>{dealer.name}</Text>
                <Text style={styles.rankMeta}>{dealer.city}</Text>
              </View>
              <Text style={styles.listValue}>{dealer.score}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/dealership/commission')}>
          <Text style={styles.buttonText}>Open Commission Wallet</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: '#064E3B', fontSize: 24, fontWeight: '900' },
  iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 },
  cardsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  miniCard: { width: '31%', flexGrow: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
  miniCardWide: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
  miniLabel: { color: '#047857', fontSize: 12, fontWeight: '900' },
  miniValue: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginTop: 6 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  sectionTitle: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  bigValue: { color: '#059669', fontSize: 32, fontWeight: '900' },
  bodyText: { color: '#14532D', marginTop: 6 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  listText: { color: '#064E3B', flex: 1, fontWeight: '700' },
  listValue: { color: '#047857', fontWeight: '900' },
  predictionCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ECFDF5', borderRadius: 16, padding: 12 },
  predictionText: { color: '#064E3B', flex: 1 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  rankPill: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  rankText: { color: '#047857', fontWeight: '900' },
  rankMeta: { color: '#14532D', fontSize: 12, marginTop: 2 },
  button: { backgroundColor: '#059669', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '900' },
})
