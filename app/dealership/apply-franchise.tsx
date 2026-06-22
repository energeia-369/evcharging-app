import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { aiInsights, franchisePlans } from '../../lib/mock/dealershipLifecycleData'

export default function ApplyFranchiseScreen() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    investmentCapacity: '',
    preferredLocation: '',
    businessExperience: '',
    businessDescription: '',
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const updateField = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = () => {
    setErrorMessage(null)
    setSuccessMessage(null)

    const requiredFields = ['fullName', 'companyName', 'email', 'phone', 'city', 'state', 'investmentCapacity', 'preferredLocation'] as const
    const hasMissing = requiredFields.some((field) => !form[field].trim())

    if (hasMissing) {
      setErrorMessage('Please fill all required fields before submitting.')
      return
    }

    if (!acceptedTerms) {
      setErrorMessage('Please accept the franchise terms to continue.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccessMessage('Application submitted successfully. Redirecting to verification...')
      router.push('/dealership/verification')
    }, 650)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Apply Franchise</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/dealership')}>
            <MaterialCommunityIcons name="store" size={18} color="#064E3B" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Franchise application</Text>
          <Text style={styles.heroText}>Complete the form below with your business details and preferred location.</Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorCard}>
            <MaterialCommunityIcons name="alert-circle" size={16} color="#B91C1C" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {successMessage ? (
          <View style={styles.successCard}>
            <MaterialCommunityIcons name="check-decagram" size={16} color="#15803D" />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          {([
            ['fullName', 'Full Name'],
            ['companyName', 'Company Name'],
            ['email', 'Email'],
            ['phone', 'Phone Number'],
            ['city', 'City'],
            ['state', 'State'],
            ['investmentCapacity', 'Investment Capacity'],
            ['preferredLocation', 'Preferred Location'],
            ['businessExperience', 'Business Experience'],
          ] as const).map(([key, label]) => (
            <View key={key} style={styles.inputWrap}>
              <Text style={styles.label}>{label}</Text>
              <TextInput value={form[key]} onChangeText={(value) => updateField(key, value)} style={styles.input} placeholder={label} placeholderTextColor="#9CA3AF" />
            </View>
          ))}

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Business Description</Text>
            <TextInput value={form.businessDescription} onChangeText={(value) => updateField('businessDescription', value)} style={[styles.input, styles.textArea]} multiline placeholder="Describe your dealership vision" placeholderTextColor="#9CA3AF" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Upload Placeholders</Text>
          {['GST Certificate', 'PAN Card', 'Business License'].map((item) => (
            <View key={item} style={styles.uploadRow}>
              <MaterialCommunityIcons name="file-document" size={18} color="#059669" />
              <Text style={styles.uploadText}>{item}</Text>
              <TouchableOpacity style={styles.uploadButton}><Text style={styles.uploadButtonText}>Attach</Text></TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Franchise Plans</Text>
          {franchisePlans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planMeta}>{plan.investment}</Text>
              <Text style={styles.planMeta}>{plan.support}</Text>
              <Text style={styles.planMeta}>{plan.margin}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <View style={styles.benefitRow}><MaterialCommunityIcons name="account-group" size={16} color="#059669" /><Text style={styles.benefitText}>Brand support and local lead generation</Text></View>
          <View style={styles.benefitRow}><MaterialCommunityIcons name="chart-line" size={16} color="#059669" /><Text style={styles.benefitText}>Premium EV sales analytics and AI guidance</Text></View>
          <View style={styles.benefitRow}><MaterialCommunityIcons name="wallet" size={16} color="#059669" /><Text style={styles.benefitText}>Earnings and commission visibility</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>AI Recommendation</Text>
          {aiInsights.map((item) => (
            <View key={item} style={styles.aiRow}>
              <MaterialCommunityIcons name="flash" size={16} color="#059669" />
              <Text style={styles.aiText}>{item}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.termsRow} onPress={() => setAcceptedTerms((value) => !value)}>
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms ? <MaterialCommunityIcons name="clipboard-check" size={14} color="#FFFFFF" /> : null}
          </View>
          <Text style={styles.termsText}>I agree to the franchise terms and conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={submitting} onPress={handleSubmit} style={[styles.submitButton, submitting && { opacity: 0.7 }]}> 
          <Text style={styles.submitButtonText}>{submitting ? 'Submitting...' : 'Submit Application'}</Text>
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
  heroCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  errorText: { color: '#991B1B', flex: 1, fontWeight: '700' },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  successText: { color: '#166534', flex: 1, fontWeight: '700' },
  heroLabel: { color: '#047857', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  heroText: { color: '#14532D', marginTop: 6, lineHeight: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  sectionTitle: { color: '#064E3B', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  inputWrap: { marginBottom: 10 },
  label: { color: '#047857', fontSize: 12, fontWeight: '900', marginBottom: 6 },
  input: { backgroundColor: '#F8FFFB', borderWidth: 1, borderColor: '#D1FAE5', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, color: '#064E3B' },
  textArea: { minHeight: 96, textAlignVertical: 'top' },
  uploadRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  uploadText: { flex: 1, color: '#064E3B', fontWeight: '700' },
  uploadButton: { backgroundColor: '#ECFDF5', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  uploadButtonText: { color: '#047857', fontWeight: '900' },
  planCard: { backgroundColor: '#F8FFFB', borderRadius: 16, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ECFDF5' },
  planName: { color: '#064E3B', fontWeight: '900' },
  planMeta: { color: '#14532D', marginTop: 4, fontSize: 12 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  benefitText: { color: '#064E3B', flex: 1 },
  aiRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  aiText: { color: '#064E3B', flex: 1 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1, borderColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  checkboxChecked: { backgroundColor: '#059669', borderColor: '#059669' },
  termsText: { color: '#064E3B', flex: 1 },
  submitButton: { backgroundColor: '#059669', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontWeight: '900' },
})
