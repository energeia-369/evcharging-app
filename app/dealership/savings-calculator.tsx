import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

function formatINR(n: number) {
  if (!isFinite(n)) return '₹0'
  return `₹${n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export default function SavingsCalculator() {
  const router = useRouter()
  const [dailyKm, setDailyKm] = useState('40')
  const [petrolPrice, setPetrolPrice] = useState('110')
  const [evCostPerKwh, setEvCostPerKwh] = useState('12')
  const [petrolKmPerL, setPetrolKmPerL] = useState('15')
  const [evKwhPerKm, setEvKwhPerKm] = useState('0.15')

  // constants
  const co2PerLitre = 2.31 // kg CO2 per litre petrol

  const parsed = useMemo(() => {
    const dKm = Math.max(0, parseFloat(dailyKm) || 0)
    const pPrice = Math.max(0, parseFloat(petrolPrice) || 0)
    const evPrice = Math.max(0, parseFloat(evCostPerKwh) || 0)
    const pKmPerL = Math.max(0.1, parseFloat(petrolKmPerL) || 0.1)
    const evKwhKm = Math.max(0.0001, parseFloat(evKwhPerKm) || 0.0001)

    const petrolLitresPerDay = dKm / pKmPerL
    const petrolDailyCost = petrolLitresPerDay * pPrice

    const evKwhPerDay = dKm * evKwhKm
    const evDailyCost = evKwhPerDay * evPrice

    const dailySavings = petrolDailyCost - evDailyCost
    const monthlySavings = dailySavings * 30
    const annualSavings = dailySavings * 365

    const co2Daily = petrolLitresPerDay * co2PerLitre
    const co2Annual = co2Daily * 365

    return {
      dKm,
      petrolDailyCost,
      evDailyCost,
      dailySavings,
      monthlySavings,
      annualSavings,
      co2Daily,
      co2Annual,
      petrolLitresPerDay,
      evKwhPerDay,
    }
  }, [dailyKm, petrolPrice, evCostPerKwh, petrolKmPerL, evKwhPerKm])

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>EV Savings Calculator</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}><MaterialCommunityIcons name="close" size={18} color="#064E3B" /></TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inputs</Text>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Daily travel (km)</Text>
            <TextInput value={dailyKm} onChangeText={setDailyKm} keyboardType="numeric" style={styles.input} />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Petrol price (₹ / litre)</Text>
            <TextInput value={petrolPrice} onChangeText={setPetrolPrice} keyboardType="numeric" style={styles.input} />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>EV charging cost (₹ / kWh)</Text>
            <TextInput value={evCostPerKwh} onChangeText={setEvCostPerKwh} keyboardType="numeric" style={styles.input} />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Petrol efficiency (km / litre)</Text>
            <TextInput value={petrolKmPerL} onChangeText={setPetrolKmPerL} keyboardType="numeric" style={styles.input} />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>EV efficiency (kWh / km)</Text>
            <TextInput value={evKwhPerKm} onChangeText={setEvKwhPerKm} keyboardType="numeric" style={styles.input} />
          </View>
        </View>

        <View style={styles.premiumCard}>
          <Text style={styles.premiumTitle}>Monthly Savings</Text>
          <Text style={styles.premiumValue}>{formatINR(parsed.monthlySavings > 0 ? parsed.monthlySavings : 0)}</Text>
          <Text style={styles.premiumSubtitle}>Estimated savings vs petrol (30 days)</Text>
          <View style={styles.premiumRow}>
            <View style={styles.smallCard}><Text style={styles.smallLabel}>Daily Savings</Text><Text style={styles.smallValue}>{formatINR(parsed.dailySavings)}</Text></View>
            <View style={styles.smallCard}><Text style={styles.smallLabel}>Annual Savings</Text><Text style={styles.smallValue}>{formatINR(parsed.annualSavings)}</Text></View>
            <View style={styles.smallCard}><Text style={styles.smallLabel}>Charging / day</Text><Text style={styles.smallValue}>{formatINR(parsed.evDailyCost)}</Text></View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>CO2 Reduction</Text>
          <View style={styles.row}><Text style={styles.rowLabel}>Daily CO2 avoided</Text><Text style={styles.rowValue}>{parsed.co2Daily.toFixed(2)} kg</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Annual CO2 avoided</Text><Text style={styles.rowValue}>{parsed.co2Annual.toFixed(0)} kg</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estimates</Text>
          <View style={styles.row}><Text style={styles.rowLabel}>Petrol litres / day</Text><Text style={styles.rowValue}>{parsed.petrolLitresPerDay.toFixed(2)} L</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>EV kWh / day</Text><Text style={styles.rowValue}>{parsed.evKwhPerDay.toFixed(2)} kWh</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Petrol daily cost</Text><Text style={styles.rowValue}>{formatINR(parsed.petrolDailyCost)}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>EV daily cost</Text><Text style={styles.rowValue}>{formatINR(parsed.evDailyCost)}</Text></View>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 48 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: '#064E3B', fontSize: 20, fontWeight: '900' },
  closeButton: { padding: 8, borderRadius: 8, backgroundColor: '#ECFDF5' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  cardTitle: { color: '#047857', fontWeight: '900', marginBottom: 8 },
  inputRow: { marginBottom: 10 },
  inputLabel: { color: '#0F172A', fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#EEF7F1', backgroundColor: '#FAFFFB', padding: 10, borderRadius: 8, color: '#064E3B' },
  premiumCard: { backgroundColor: '#064E3B', borderRadius: 14, padding: 16, marginBottom: 12 },
  premiumTitle: { color: '#D1FAE5', fontWeight: '900', fontSize: 14 },
  premiumValue: { color: '#ECFDF5', fontSize: 28, fontWeight: '900', marginTop: 6 },
  premiumSubtitle: { color: '#A7F3D0', marginTop: 6 },
  premiumRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  smallCard: { backgroundColor: '#FFFFFF', padding: 8, borderRadius: 10, flex: 1, marginHorizontal: 4, alignItems: 'center' },
  smallLabel: { color: '#047857', fontWeight: '800', fontSize: 12 },
  smallValue: { color: '#064E3B', fontWeight: '900', marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F1F7F3' },
  rowLabel: { color: '#064E3B' },
  rowValue: { color: '#047857', fontWeight: '900' },
})
