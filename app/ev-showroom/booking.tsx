import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ActionButton } from '../../components/showroom-ui'
import { useShowroom } from '../../context/showroom-context'
import { financingOptions, getVehicleById, showroomVehicles } from '../../lib/mock/showroomData'

export default function BookingScreen() {
  const router = useRouter()
  const { selectedVehicleId, bookingDraft, updateBookingDraft } = useShowroom()
  const [loading, setLoading] = useState(true)

  const vehicle = useMemo(() => getVehicleById(selectedVehicleId) || showroomVehicles[0], [selectedVehicleId])

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleReserve = () => {
    router.push('/ev-showroom/payment')
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#064E3B" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Reserve your vehicle</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Vehicle</Text>
          <Text style={styles.summaryTitle}>{vehicle.name}</Text>
          <Text style={styles.summaryMeta}>{vehicle.brand} • ₹{(vehicle.price / 100000).toFixed(1)}L</Text>
        </View>

        <Text style={styles.sectionLabel}>Customer details</Text>
        <TextInput style={styles.input} placeholder="Full name" placeholderTextColor="#94a3b8" value={bookingDraft.name} onChangeText={(text) => updateBookingDraft({ name: text })} />
        <TextInput style={styles.input} placeholder="Phone number" placeholderTextColor="#94a3b8" keyboardType="phone-pad" value={bookingDraft.phone} onChangeText={(text) => updateBookingDraft({ phone: text })} />
        <TextInput style={[styles.input, styles.textArea]} placeholder="Address" placeholderTextColor="#94a3b8" value={bookingDraft.address} onChangeText={(text) => updateBookingDraft({ address: text })} multiline />

        <Text style={styles.sectionLabel}>Vehicle variant & color</Text>
        <View style={styles.selectRow}>
          {['Standard', 'Premium'].map((variant) => (
            <TouchableOpacity key={variant} style={[styles.optionCard, bookingDraft.variant === variant && styles.optionCardSelected]} onPress={() => updateBookingDraft({ variant })}>
              <Text style={[styles.optionText, bookingDraft.variant === variant && styles.optionTextSelected]}>{variant}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.selectRow}>
          {vehicle.colors.map((color) => (
            <TouchableOpacity key={color} style={[styles.optionCard, bookingDraft.color === color && styles.optionCardSelected]} onPress={() => updateBookingDraft({ color })}>
              <Text style={[styles.optionText, bookingDraft.color === color && styles.optionTextSelected]}>{color}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Financing option</Text>
        {financingOptions.map((option) => (
          <TouchableOpacity key={option.id} style={[styles.financeCard, bookingDraft.financing === option.title && styles.financeCardActive]} onPress={() => updateBookingDraft({ financing: option.title })}>
            <View style={styles.financeHeader}>
              <Text style={styles.financeName}>{option.title}</Text>
              <Text style={styles.financeRate}>{option.rate}</Text>
            </View>
            <Text style={styles.financeSubtitle}>{option.tenure} • {option.subtitle}</Text>
            <Text style={styles.financeMonthly}>₹{option.monthly.toLocaleString()} / month</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>Exchange vehicle</Text>
        <View style={styles.selectRow}>
          {['No', 'Yes'].map((value) => (
            <TouchableOpacity key={value} style={[styles.optionCard, bookingDraft.exchangeVehicle === value && styles.optionCardSelected]} onPress={() => updateBookingDraft({ exchangeVehicle: value })}>
              <Text style={[styles.optionText, bookingDraft.exchangeVehicle === value && styles.optionTextSelected]}>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Delivery location</Text>
        <View style={styles.selectRow}>
          {['Home Delivery', 'Showroom Pickup'].map((location) => (
            <TouchableOpacity key={location} style={[styles.optionCard, bookingDraft.deliveryLocation === location && styles.optionCardSelected]} onPress={() => updateBookingDraft({ deliveryLocation: location })}>
              <Text style={[styles.optionText, bookingDraft.deliveryLocation === location && styles.optionTextSelected]}>{location}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ActionButton label="Pay Booking Amount" icon="credit-card" onPress={handleReserve} />
        <ActionButton variant="secondary" label="Reserve Vehicle" icon="clipboard-check" onPress={handleReserve} style={styles.reserveButton} />

        {loading ? <Text style={styles.loading}>Loading premium reservation options...</Text> : null}
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
  summaryCard: { backgroundColor: '#ECFDF5', borderRadius: 24, padding: 18, marginBottom: 20 },
  summaryLabel: { fontSize: 12, color: '#047857', fontWeight: '900', marginBottom: 8 },
  summaryTitle: { color: '#064E3B', fontSize: 18, fontWeight: '900' },
  summaryMeta: { color: '#14532D', fontSize: 13, marginTop: 6 },
  sectionLabel: { color: '#065F46', fontSize: 14, fontWeight: '900', marginBottom: 12, marginTop: 16 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#D1FAE5', padding: 14, color: '#0F172A', marginBottom: 12 },
  textArea: { minHeight: 88, textAlignVertical: 'top' },
  selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  optionCard: { backgroundColor: '#FFFFFF', borderRadius: 18, paddingVertical: 14, paddingHorizontal: 18, borderWidth: 1, borderColor: '#D1FAE5' },
  optionCardSelected: { backgroundColor: '#DCFCE7', borderColor: '#10B981' },
  optionText: { color: '#0F172A', fontWeight: '700' },
  optionTextSelected: { color: '#065F46' },
  financeCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#D1FAE5', marginBottom: 12 },
  financeCardActive: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  financeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  financeName: { fontSize: 15, fontWeight: '900', color: '#064E3B' },
  financeRate: { fontSize: 13, color: '#065F46', fontWeight: '900' },
  financeSubtitle: { color: '#14532D', fontSize: 12, marginBottom: 8 },
  financeMonthly: { color: '#0F766E', fontSize: 15, fontWeight: '900' },
  reserveButton: { marginTop: 10 },
  loading: { marginTop: 16, textAlign: 'center', color: '#064E3B' },
})
