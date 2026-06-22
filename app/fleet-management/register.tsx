import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { UploadCard, type SelectedFile } from '../../components/fleet/UploadCard'
import { fleetDashboardStats } from '../../lib/mock/fleetOnboardingData'
import { useAuth } from './AuthContext'

export default function FleetRegisterScreen() {
  const router = useRouter()
  const { register } = useAuth()
  const [fleetName, setFleetName] = useState('GreenMotion Logistics')
  const [managerName, setManagerName] = useState('Aman Sharma')
  const [email, setEmail] = useState('fleet@greenmotion.com')
  const [password, setPassword] = useState('Fleet@1234')
  const [phone, setPhone] = useState('9876543210')
  const [city, setCity] = useState('Bengaluru')
  const [showValidation, setShowValidation] = useState(false)

  const completion = useMemo(() => {
    const fields = [fleetName, managerName, email, password, phone, city]
    const filled = fields.filter(Boolean).length
    return Math.round((filled / fields.length) * 100)
  }, [city, email, fleetName, managerName, phone, password])

  async function handleContinue() {
    if (!fleetName.trim() || !managerName.trim() || !email.trim() || !password || !phone.trim() || !city.trim()) {
      setShowValidation(true)
      Alert.alert('Missing fields', 'Please fill in all details to continue.')
      return
    }

    const result = await register({
      fullName: managerName,
      email,
      phone,
      company: fleetName,
      password,
    })

    if (result.success) {
      Alert.alert('Registration successful', result.message || 'Your account has been created successfully.')
      router.push('/fleet-management/shift-selection')
      return
    }

    if (result.status === 409 || result.code === 'USER_EXISTS') {
      Alert.alert('Email already exists', result.message || 'Email already exists')
      return
    }

    if (result.status === 400) {
      Alert.alert('Missing fields', result.message || 'Please check your details and try again.')
      return
    }

    if (result.status === 500) {
      Alert.alert('Server error', result.message || 'Server error. Please try again later.')
      return
    }

    Alert.alert('Registration failed', result.message || 'Registration failed')
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={22} color="#0f5132" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Fleet Manager Registration</Text>
            <Text style={styles.headerSubtitle}>Start your onboarding journey with verified fleet details.</Text>
          </View>
        </View>

        <FleetCard style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="account-tie" size={28} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLabel}>Registration progress</Text>
              <Text style={styles.heroValue}>{completion}% complete</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{fleetDashboardStats.assignedVehicles} vehicles ready</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${completion}%` }]} />
          </View>
        </FleetCard>

        <SectionHeader title="Fleet Details" subtitle="Capture the primary operating profile for your fleet." />
        <FleetCard style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Fleet Name</Text>
            <TextInput style={styles.input} value={fleetName} onChangeText={setFleetName} placeholder="Fleet name" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Manager Name</Text>
            <TextInput style={styles.input} value={managerName} onChangeText={setManagerName} placeholder="Manager name" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="Email address" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Number</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Phone number" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Operating City</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" placeholderTextColor="#9ca3af" />
          </View>
        </FleetCard>



        <SectionHeader title="Why this matters" />
        <View style={styles.summaryGrid}>
          <FleetCard style={styles.summaryCard}>
            <MaterialCommunityIcons name="battery-charging" size={22} color="#10b981" />
            <Text style={styles.summaryLabel}>Battery Optimized</Text>
            <Text style={styles.summaryValue}>{fleetDashboardStats.batteryAnalytics}</Text>
          </FleetCard>
          <FleetCard style={styles.summaryCard}>
            <MaterialCommunityIcons name="map-marker" size={22} color="#0ea5e9" />
            <Text style={styles.summaryLabel}>Route Coverage</Text>
            <Text style={styles.summaryValue}>{fleetDashboardStats.shiftTimings}</Text>
          </FleetCard>
          <FleetCard style={styles.summaryCard}>
            <MaterialCommunityIcons name="wallet" size={22} color="#f59e0b" />
            <Text style={styles.summaryLabel}>Monthly Earnings</Text>
            <Text style={styles.summaryValue}>₹{fleetDashboardStats.earnings.toLocaleString()}</Text>
          </FleetCard>
        </View>

        <Pressable style={styles.primaryButton} onPress={handleContinue}>
          <MaterialCommunityIcons name="qrcode-scan" size={18} color="#ffffff" />
          <Text style={styles.primaryButtonText}>Continue to Shift Selection</Text>
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
  heroCard: { marginBottom: 16 },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  heroIconWrap: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  heroLabel: { fontSize: 12, color: '#6b7280' },
  heroValue: { fontSize: 18, fontWeight: '900', color: '#0f5132', marginTop: 2 },
  heroBadge: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  heroBadgeText: { fontSize: 11, fontWeight: '800', color: '#10b981' },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: '#e2efe5', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#10b981' },
  formCard: { marginBottom: 16 },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#0f5132', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#dbe7dd', borderRadius: 14, backgroundColor: '#fbfdfb', paddingHorizontal: 14, paddingVertical: 12, color: '#0f172a', fontSize: 14 },
  uploadGrid: { gap: 12, marginBottom: 16 },
  warningBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fee2e2', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 },
  warningBannerText: { flex: 1, fontSize: 12, color: '#991b1b', fontWeight: '700', lineHeight: 17 },
  summaryGrid: { gap: 10, marginBottom: 16 },
  summaryCard: { paddingVertical: 14 },
  summaryLabel: { fontSize: 12, fontWeight: '800', color: '#0f5132', marginTop: 8 },
  summaryValue: { fontSize: 12, color: '#6b7280', marginTop: 4, lineHeight: 17 },
  primaryButton: { backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
})
