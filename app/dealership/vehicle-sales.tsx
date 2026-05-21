import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { formatINR, sampleVehicles } from '../../lib/mock/dealershipLifecycleData'

export default function VehicleSalesScreen() {
  const router = useRouter()
  const [customerName, setCustomerName] = useState('')
  const [selectedVehicleId, setSelectedVehicleId] = useState(sampleVehicles[0]?.id ?? '')
  const [variant, setVariant] = useState(sampleVehicles[0]?.variant ?? '')
  const [color, setColor] = useState(sampleVehicles[0]?.color ?? '')
  const [discount, setDiscount] = useState('50000')
  const [exchange, setExchange] = useState(true)
  const [quoteGenerated, setQuoteGenerated] = useState(false)

  const selectedVehicle = useMemo(() => sampleVehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? sampleVehicles[0], [selectedVehicleId])
  const emi = useMemo(() => {
    const principal = Math.max(0, (selectedVehicle?.price ?? 0) - (Number(discount) || 0) - (exchange ? 40000 : 0))
    const rate = 0.0095
    const months = 36
    const emiValue = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
    return Math.round(Number.isFinite(emiValue) ? emiValue : 0)
  }, [discount, exchange, selectedVehicle])

  const bookingAmount = Math.round((selectedVehicle?.price ?? 0) * 0.1)
  const proceedToPayment = () => {
    router.push({ pathname: '/dealership/payment', params: { amount: String(bookingAmount), emi: String(emi) } })
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Vehicle Sales</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/dealership')}>
            <MaterialCommunityIcons name="car-electric" size={18} color="#064E3B" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Booking Form</Text>
          <TextInput value={customerName} onChangeText={setCustomerName} style={styles.input} placeholder="Customer Name" />
          <View style={styles.rowWrap}>
            {sampleVehicles.map((vehicle) => (
              <TouchableOpacity key={vehicle.id} style={[styles.choiceChip, selectedVehicleId === vehicle.id && styles.choiceChipActive]} onPress={() => {
                setSelectedVehicleId(vehicle.id)
                setVariant(vehicle.variant)
                setColor(vehicle.color)
              }}>
                <Text style={[styles.choiceText, selectedVehicleId === vehicle.id && styles.choiceTextActive]}>{vehicle.model}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput value={variant} onChangeText={setVariant} style={styles.input} placeholder="Variant Selection" />
          <TextInput value={color} onChangeText={setColor} style={styles.input} placeholder="Color Selection" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>EMI Calculator</Text>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Vehicle Price</Text><Text style={styles.summaryValue}>{formatINR(selectedVehicle?.price ?? 0)}</Text></View>
          <TextInput value={discount} onChangeText={setDiscount} style={styles.input} keyboardType="numeric" placeholder="Discount" />
          <TouchableOpacity style={styles.toggleRow} onPress={() => setExchange((value) => !value)}>
            <View style={[styles.checkbox, exchange && styles.checkboxActive]}>{exchange ? <MaterialCommunityIcons name="clipboard-check" size={14} color="#FFFFFF" /> : null}</View>
            <Text style={styles.toggleText}>Exchange vehicle option</Text>
          </TouchableOpacity>
          <View style={styles.emiBox}>
            <Text style={styles.emiLabel}>Estimated EMI</Text>
            <Text style={styles.emiValue}>{formatINR(emi)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Booking Amount</Text><Text style={styles.summaryValue}>{formatINR(bookingAmount)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Discount</Text><Text style={styles.summaryValue}>{formatINR(Number(discount) || 0)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Exchange Bonus</Text><Text style={styles.summaryValue}>{exchange ? '₹40,000' : '₹0'}</Text></View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => setQuoteGenerated(true)}>
          <Text style={styles.buttonText}>Generate Quote</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={proceedToPayment}>
          <Text style={styles.buttonText}>Proceed To Payment</Text>
        </TouchableOpacity>

        {quoteGenerated ? (
          <View style={styles.quoteCard}>
            <MaterialCommunityIcons name="file-document" size={18} color="#059669" />
            <Text style={styles.quoteText}>Quote generated for {customerName || 'customer'} with EMI {formatINR(emi)}.</Text>
          </View>
        ) : null}
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  sectionTitle: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  input: { backgroundColor: '#F8FFFB', borderWidth: 1, borderColor: '#D1FAE5', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, color: '#064E3B', marginBottom: 10 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  choiceChip: { borderWidth: 1, borderColor: '#D1FAE5', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FFFFFF' },
  choiceChipActive: { backgroundColor: '#059669', borderColor: '#059669' },
  choiceText: { color: '#064E3B', fontSize: 12, fontWeight: '900' },
  choiceTextActive: { color: '#FFFFFF' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#047857', fontWeight: '800' },
  summaryValue: { color: '#064E3B', fontWeight: '900' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1, borderColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  checkboxActive: { backgroundColor: '#059669', borderColor: '#059669' },
  toggleText: { color: '#064E3B', flex: 1 },
  emiBox: { marginTop: 12, backgroundColor: '#ECFDF5', borderRadius: 16, padding: 14 },
  emiLabel: { color: '#047857', fontSize: 12, fontWeight: '900' },
  emiValue: { color: '#064E3B', fontSize: 22, fontWeight: '900', marginTop: 6 },
  button: { backgroundColor: '#059669', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  secondaryButton: { backgroundColor: '#047857' },
  buttonText: { color: '#FFFFFF', fontWeight: '900' },
  quoteCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginTop: 8, borderWidth: 1, borderColor: '#ECFDF5' },
  quoteText: { color: '#064E3B', flex: 1 },
})
