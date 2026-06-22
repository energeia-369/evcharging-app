import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CompareVehicle, compareVehicles, formatINR } from '../../lib/mock/compareData'

function SpecRow({ label, left, right, better }: { label: string; left: string | number; right: string | number; better?: 'left' | 'right' | 'tie' }) {
  return (
    <View style={styles.specRow}>
      <Text style={[styles.specCell, better === 'left' && styles.specBetter]}>{left}</Text>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={[styles.specCell, better === 'right' && styles.specBetter]}>{right}</Text>
    </View>
  )
}

export default function DealershipCompare() {
  const router = useRouter()
  const [leftId, setLeftId] = useState(compareVehicles[0].id)
  const [rightId, setRightId] = useState(compareVehicles[1].id)

  const left = useMemo(() => compareVehicles.find((v) => v.id === leftId) as CompareVehicle, [leftId])
  const right = useMemo(() => compareVehicles.find((v) => v.id === rightId) as CompareVehicle, [rightId])

  // helpers to determine better spec
  const compareNumber = (a: number, b: number, preferLower = false) => {
    if (a === b) return 'tie'
    if (preferLower) return a < b ? 'left' : 'right'
    return a > b ? 'left' : 'right'
  }

  const rangeBetter = compareNumber(left.rangeKm, right.rangeKm)
  const chargingBetter = compareNumber(left.chargingKw, right.chargingKw)
  const priceBetter = compareNumber(left.price, right.price, true)
  const speedBetter = compareNumber(left.topSpeedKmh, right.topSpeedKmh)
  const safetyBetter = compareNumber(left.safetyRating, right.safetyRating)

  const leftFeaturesSet = new Set(left.features)
  const rightFeaturesSet = new Set(right.features)

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>EV Vehicle Comparison</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={20} color="#064E3B" />
          </TouchableOpacity>
        </View>

        <View style={styles.selectorRow}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerLabel}>Left vehicle</Text>
            {compareVehicles.map((v) => (
              <TouchableOpacity key={v.id} onPress={() => setLeftId(v.id)} style={[styles.pickerOption, v.id === leftId && styles.pickerOptionActive]}>
                <Text style={[styles.pickerOptionText, v.id === leftId && styles.pickerOptionTextActive]}>{v.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.pickerCard}>
            <Text style={styles.pickerLabel}>Right vehicle</Text>
            {compareVehicles.map((v) => (
              <TouchableOpacity key={v.id} onPress={() => setRightId(v.id)} style={[styles.pickerOption, v.id === rightId && styles.pickerOptionActive]}>
                <Text style={[styles.pickerOptionText, v.id === rightId && styles.pickerOptionTextActive]}>{v.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.comparisonWrap}>
          <TouchableOpacity onPress={() => router.push(`/ev-showroom/car-details?vehicleId=${left.id}`)} style={styles.cardColumn}>
            <Text style={styles.cardTitle}>{left.name}</Text>
            <Text style={styles.cardPrice}>{formatINR(left.price)}</Text>
          </TouchableOpacity>

          <View style={styles.dividerColumn}>
            <Text style={styles.centerLabel}>Specification</Text>
          </View>

          <TouchableOpacity onPress={() => router.push(`/ev-showroom/car-details?vehicleId=${right.id}`)} style={styles.cardColumn}>
            <Text style={styles.cardTitle}>{right.name}</Text>
            <Text style={styles.cardPrice}>{formatINR(right.price)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableCard}>
          <SpecRow label="Battery Range (km)" left={`${left.rangeKm} km`} right={`${right.rangeKm} km`} better={rangeBetter as any} />
          <SpecRow label="Charging Speed (kW)" left={`${left.chargingKw} kW`} right={`${right.chargingKw} kW`} better={chargingBetter as any} />
          <SpecRow label="Top Speed (km/h)" left={`${left.topSpeedKmh} km/h`} right={`${right.topSpeedKmh} km/h`} better={speedBetter as any} />
          <SpecRow label="Price" left={formatINR(left.price)} right={formatINR(right.price)} better={priceBetter as any} />
          <SpecRow label="Safety Rating" left={`${left.safetyRating}/5`} right={`${right.safetyRating}/5`} better={safetyBetter as any} />

          <View style={styles.featuresBlock}>
            <Text style={styles.featuresLabel}>Features</Text>
            <View style={styles.featureRows}>
              <View style={styles.featureColumn}>
                {left.features.map((f) => (
                  <View key={f} style={styles.featureItem}><MaterialCommunityIcons name={rightFeaturesSet.has(f) ? 'check-decagram' : 'check'} size={14} color={rightFeaturesSet.has(f) ? '#059669' : '#047857'} /><Text style={styles.featureText}>{f}</Text></View>
                ))}
              </View>

              <View style={styles.featureColumnRight}>
                {right.features.map((f) => (
                  <View key={f} style={styles.featureItem}><MaterialCommunityIcons name={leftFeaturesSet.has(f) ? 'check-decagram' : 'check'} size={14} color={leftFeaturesSet.has(f) ? '#059669' : '#047857'} /><Text style={styles.featureText}>{f}</Text></View>
                ))}
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 48 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { color: '#064E3B', fontSize: 20, fontWeight: '900' },
  closeButton: { padding: 8, borderRadius: 8, backgroundColor: '#ECFDF5' },
  selectorRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  pickerCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E6F4EE' },
  pickerLabel: { color: '#047857', fontSize: 12, fontWeight: '900', marginBottom: 8 },
  pickerOption: { paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8 },
  pickerOptionActive: { backgroundColor: '#ECFDF5' },
  pickerOptionText: { color: '#064E3B' },
  pickerOptionTextActive: { fontWeight: '900' },
  comparisonWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardColumn: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, alignItems: 'center' },
  dividerColumn: { width: 140, alignItems: 'center' },
  centerLabel: { color: '#14532D', fontSize: 14, fontWeight: '900' },
  cardTitle: { color: '#064E3B', fontSize: 16, fontWeight: '900' },
  cardPrice: { color: '#047857', fontSize: 14, fontWeight: '900', marginTop: 6 },
  tableCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E6F4EE' },
  specRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  specCell: { flex: 1, color: '#064E3B', fontWeight: '800' },
  specLabel: { flex: 1.4, textAlign: 'center', color: '#0F172A', fontWeight: '900' },
  specBetter: { color: '#059669' },
  featuresBlock: { marginTop: 12 },
  featuresLabel: { color: '#047857', fontSize: 12, fontWeight: '900', marginBottom: 8 },
  featureRows: { flexDirection: 'row', gap: 12 },
  featureColumn: { flex: 1 },
  featureColumnRight: { flex: 1, alignItems: 'flex-end' },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  featureText: { color: '#064E3B', marginLeft: 8 },
})
