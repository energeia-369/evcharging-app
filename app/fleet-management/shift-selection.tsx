import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { routeRecommendations, shiftOptions } from '../../lib/mock/fleetOnboardingData'

export default function ShiftSelectionScreen() {
  const router = useRouter()
  const [selectedShift, setSelectedShift] = useState(shiftOptions[0]?.id ?? '')

  const activeShift = useMemo(() => shiftOptions.find(option => option.id === selectedShift) ?? shiftOptions[0], [selectedShift])

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={22} color="#0f5132" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Shift Selection</Text>
            <Text style={styles.headerSubtitle}>Pick a shift that matches your fleet utilization and earnings goals.</Text>
          </View>
        </View>

        <FleetCard style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIconWrap}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryLabel}>Selected shift</Text>
              <Text style={styles.summaryValue}>{activeShift?.title}</Text>
            </View>
          </View>
          <View style={styles.routeInfoRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#10b981" />
            <Text style={styles.routeInfoText}>{activeShift?.routeCoverage}</Text>
          </View>
          <View style={styles.routeInfoRow}>
            <MaterialCommunityIcons name="battery-charging" size={16} color="#10b981" />
            <Text style={styles.routeInfoText}>{activeShift?.batteryUsage}</Text>
          </View>
        </FleetCard>

        <SectionHeader title="Available Shifts" />
        <View style={styles.shiftList}>
          {shiftOptions.map(option => {
            const isSelected = selectedShift === option.id
            return (
              <Pressable key={option.id} style={[styles.shiftCard, isSelected && styles.shiftCardSelected]} onPress={() => setSelectedShift(option.id)}>
                <View style={styles.shiftCardTop}>
                  <View style={[styles.shiftIconWrap, isSelected && styles.shiftIconWrapSelected]}>
                    <MaterialCommunityIcons name="clock-outline" size={18} color="#ffffff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.shiftTitle}>{option.title}</Text>
                    <Text style={styles.shiftHours}>{option.workingHours}</Text>
                  </View>
                  <View style={styles.shiftCheckWrap}>
                    <MaterialCommunityIcons name={(isSelected ? 'shield-check' : 'file-document') as any} size={18} color={isSelected ? '#10b981' : '#9ca3af'} />
                  </View>
                </View>
                <Text style={styles.shiftDetail}>{option.estimatedEarnings}</Text>
                <Text style={styles.shiftDetail}>{option.batteryUsage}</Text>
                <Text style={styles.shiftDetail}>{option.routeCoverage}</Text>
              </Pressable>
            )
          })}
        </View>

        <SectionHeader title="Recommended Routes" />
        <FleetCard>
          {routeRecommendations.map(item => (
            <View key={item} style={styles.recommendationRow}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#10b981" />
              <Text style={styles.recommendationText}>{item}</Text>
            </View>
          ))}
        </FleetCard>

        <Pressable style={styles.primaryButton} onPress={() => router.push('/fleet-management/vehicle-kyc')}>
          <Text style={styles.primaryButtonText}>Continue to Vehicle KYC</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#ffffff" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4fbf6' },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 19, fontWeight: '900', color: '#0f5132' },
  headerSubtitle: { fontSize: 12, color: '#6b7280', marginTop: 4, lineHeight: 18 },
  summaryCard: { marginBottom: 16 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  summaryIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  summaryLabel: { fontSize: 12, color: '#6b7280' },
  summaryValue: { fontSize: 16, fontWeight: '900', color: '#0f5132', marginTop: 2 },
  routeInfoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 6 },
  routeInfoText: { flex: 1, fontSize: 12, color: '#0f5132', lineHeight: 17 },
  shiftList: { gap: 12, marginBottom: 16 },
  shiftCard: { backgroundColor: '#ffffff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#e2efe5' },
  shiftCardSelected: { borderColor: '#10b981', backgroundColor: '#edf9f1' },
  shiftCardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  shiftIconWrap: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center' },
  shiftIconWrapSelected: { backgroundColor: '#10b981' },
  shiftTitle: { fontSize: 15, fontWeight: '900', color: '#0f5132' },
  shiftHours: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  shiftCheckWrap: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  shiftDetail: { fontSize: 12, color: '#0f5132', marginTop: 6, lineHeight: 17 },
  recommendationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  recommendationText: { flex: 1, fontSize: 12, color: '#0f5132', lineHeight: 17 },
  primaryButton: { marginTop: 16, backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
})