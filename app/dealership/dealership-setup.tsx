import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DealershipSetupScreen() {
  const router = useRouter()
  const [showroomName, setShowroomName] = useState('Energeia Prime EV Center')
  const [address, setAddress] = useState('Main Market Road, Bengaluru')
  const [hours, setHours] = useState('9:00 AM - 8:00 PM')
  const [staffCount, setStaffCount] = useState('14')
  const [showroomType, setShowroomType] = useState('Premium Studio')
  const [services, setServices] = useState({ sales: true, charging: true, service: true, delivery: true })

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Dealership Setup</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/dealership')}>
            <MaterialCommunityIcons name="store" size={18} color="#064E3B" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Showroom Details</Text>
          <TextInput value={showroomName} onChangeText={setShowroomName} style={styles.input} placeholder="Showroom Name" />
          <TextInput value={address} onChangeText={setAddress} style={styles.input} placeholder="Address" />
          <TextInput value={hours} onChangeText={setHours} style={styles.input} placeholder="Operating Hours" />
          <TextInput value={staffCount} onChangeText={setStaffCount} style={styles.input} placeholder="Staff Count" keyboardType="numeric" />
          <TextInput value={showroomType} onChangeText={setShowroomType} style={styles.input} placeholder="Showroom Type" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Logo Placeholder</Text>
          <View style={styles.logoBox}>
            <MaterialCommunityIcons name="office-building" size={28} color="#059669" />
            <Text style={styles.logoText}>Upload brand logo later</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>EV Services</Text>
          {([
            ['sales', 'Vehicle Sales'],
            ['charging', 'Charging Support'],
            ['service', 'Service Bay'],
            ['delivery', 'Delivery Management'],
          ] as const).map(([key, label]) => (
            <TouchableOpacity key={key} style={styles.toggleRow} onPress={() => setServices((current) => ({ ...current, [key]: !current[key] }))}>
              <View style={[styles.toggle, services[key] && styles.toggleActive]}>
                {services[key] ? <MaterialCommunityIcons name="clipboard-check" size={14} color="#FFFFFF" /> : null}
              </View>
              <Text style={styles.toggleText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/dealership/inventory')}>
          <Text style={styles.buttonText}>Complete Setup</Text>
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  sectionTitle: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  input: { backgroundColor: '#F8FFFB', borderWidth: 1, borderColor: '#D1FAE5', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, color: '#064E3B', marginBottom: 10 },
  logoBox: { borderWidth: 1, borderColor: '#D1FAE5', borderRadius: 18, backgroundColor: '#F8FFFB', alignItems: 'center', justifyContent: 'center', minHeight: 120, gap: 8 },
  logoText: { color: '#14532D', fontWeight: '800' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  toggle: { width: 22, height: 22, borderRadius: 7, borderWidth: 1, borderColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  toggleActive: { backgroundColor: '#059669', borderColor: '#059669' },
  toggleText: { color: '#064E3B', fontWeight: '700' },
  button: { backgroundColor: '#059669', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '900' },
})
