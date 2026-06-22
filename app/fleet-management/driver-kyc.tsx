import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { UploadCard, type SelectedFile } from '../../components/fleet/UploadCard'
import { useFleetOps } from './FleetOpsContext'

export default function DriverKycScreen() {
  const router = useRouter()
  const { completeDriverKyc, fleetDrivers, selectedDriverForKycId, updateDriver } = useFleetOps()
  const selectedDriver = fleetDrivers.find((driver) => driver.id === selectedDriverForKycId) ?? null

  const [driverName, setDriverName] = useState(selectedDriver?.name ?? '')
  const [mobileNumber, setMobileNumber] = useState(selectedDriver?.mobileNumber ?? '')
  const [aadhaarNumber, setAadhaarNumber] = useState(selectedDriver?.aadhaarNumber ?? '')
  const [licenseNumber, setLicenseNumber] = useState(selectedDriver?.licenseNumber ?? '')
  const [bankDetails, setBankDetails] = useState(selectedDriver?.bankDetails ?? '')
  const [emergencyContact, setEmergencyContact] = useState(selectedDriver?.emergencyContact ?? '')

  const [drivingLicenseFile, setDrivingLicenseFile] = useState<SelectedFile | null>(null)
  const [aadhaarFile, setAadhaarFile] = useState<SelectedFile | null>(null)
  const [profilePhotoFile, setProfilePhotoFile] = useState<SelectedFile | null>(null)
  const [bankPassbookFile, setBankPassbookFile] = useState<SelectedFile | null>(null)
  const [showValidation, setShowValidation] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')

  const completion = useMemo(() => {
    const fields = [driverName, mobileNumber, aadhaarNumber, licenseNumber, bankDetails, emergencyContact, drivingLicenseFile, aadhaarFile, profilePhotoFile, bankPassbookFile]
    const filled = fields.filter(Boolean).length
    return Math.round((filled / fields.length) * 100)
  }, [aadhaarFile, aadhaarNumber, bankDetails, bankPassbookFile, driverName, drivingLicenseFile, emergencyContact, licenseNumber, mobileNumber, profilePhotoFile])

  const requiredUploadsReady = Boolean(drivingLicenseFile && aadhaarFile && profilePhotoFile && bankPassbookFile)
  const verifiedCount = [drivingLicenseFile, aadhaarFile, profilePhotoFile, bankPassbookFile].filter(Boolean).length

  function handleContinue() {
    if (!selectedDriver) {
      setShowValidation(true)
      setValidationMessage('Select a driver from Add Driver flow before KYC.')
      return
    }

    if (!driverName.trim() || !bankDetails.trim() || !emergencyContact.trim()) {
      setShowValidation(true)
      setValidationMessage('Driver name, bank details, and emergency contact are required.')
      return
    }

    if (mobileNumber.replace(/\D/g, '').length !== 10) {
      setShowValidation(true)
      setValidationMessage('Mobile number must be 10 digits.')
      return
    }

    if (aadhaarNumber.replace(/\D/g, '').length !== 12) {
      setShowValidation(true)
      setValidationMessage('Aadhaar number must be 12 digits.')
      return
    }

    if (!requiredUploadsReady) {
      setShowValidation(true)
      setValidationMessage('Please upload all required driver KYC documents.')
      return
    }

    const updateResult = updateDriver(selectedDriver.id, {
      driverName,
      mobileNumber,
      aadhaarNumber,
      licenseNumber,
      bankDetails,
      emergencyContact,
    })

    if (!updateResult.ok) {
      setShowValidation(true)
      setValidationMessage(updateResult.message)
      return
    }

    const kycResult = completeDriverKyc(selectedDriver.id, {
      aadhaarCard: aadhaarFile?.name ?? '',
      drivingLicense: drivingLicenseFile?.name ?? '',
      profilePhoto: profilePhotoFile?.name ?? '',
      bankProof: bankPassbookFile?.name ?? '',
    })

    if (!kycResult.ok) {
      setShowValidation(true)
      setValidationMessage(kycResult.message)
      return
    }

    router.push('/fleet-management/verification')
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={22} color="#0f5132" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Driver KYC</Text>
            <Text style={styles.headerSubtitle}>Verify the driver identity and payment details for fleet readiness.</Text>
          </View>
        </View>

        <FleetCard style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="account-tie" size={24} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLabel}>Driver KYC progress</Text>
              <Text style={styles.heroValue}>{completion}% complete</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{verifiedCount} verified</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${completion}%` }]} />
          </View>
        </FleetCard>

        <SectionHeader title="Driver Details" subtitle="Each driver must complete individual identity and payout information." />
        <FleetCard style={styles.previewCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Driver Name</Text>
            <TextInput value={driverName} onChangeText={setDriverName} style={styles.input} placeholder="Driver name" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput value={mobileNumber} onChangeText={setMobileNumber} style={styles.input} keyboardType="phone-pad" placeholder="9876543210" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Aadhaar Number</Text>
            <TextInput value={aadhaarNumber} onChangeText={setAadhaarNumber} style={styles.input} keyboardType="number-pad" placeholder="12 digit Aadhaar" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>License Number</Text>
            <TextInput value={licenseNumber} onChangeText={setLicenseNumber} style={styles.input} placeholder="DL-XX-XXXX" placeholderTextColor="#9ca3af" autoCapitalize="characters" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bank Details</Text>
            <TextInput value={bankDetails} onChangeText={setBankDetails} style={styles.input} placeholder="Bank name / account" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Emergency Contact</Text>
            <TextInput value={emergencyContact} onChangeText={setEmergencyContact} style={styles.input} keyboardType="phone-pad" placeholder="Emergency number" placeholderTextColor="#9ca3af" />
          </View>
        </FleetCard>

        <SectionHeader title="Driver Documents" subtitle="Upload the assigned driver's identity documents before verification." />
        <View style={styles.uploadList}>
          <UploadCard label="Driving License" file={drivingLicenseFile} onFileSelected={setDrivingLicenseFile} required showValidation={showValidation} warningText="Driving License is required for driver verification." description="The active license for the fleet driver." />
          <UploadCard label="Aadhaar Card" file={aadhaarFile} onFileSelected={setAadhaarFile} required showValidation={showValidation} warningText="Aadhaar Card is required for driver verification." description="Use the driver's government ID for identity proof." />
          <UploadCard label="Profile Photo" file={profilePhotoFile} onFileSelected={setProfilePhotoFile} required showValidation={showValidation} warningText="Driver profile photo is required for verification." description="Capture a clear profile photo for driver verification." />
          <UploadCard label="Bank Passbook" file={bankPassbookFile} onFileSelected={setBankPassbookFile} required showValidation={showValidation} warningText="Bank Passbook is required for payouts." description="Capture the driver's bank account proof." />
        </View>

        {showValidation && !requiredUploadsReady ? (
          <View style={styles.previewCard}>
            <View style={styles.noteRow}>
              <MaterialCommunityIcons name="file-document" size={18} color="#b91c1c" />
              <Text style={styles.noteText}>{validationMessage || 'Please upload all required driver documents to continue.'}</Text>
            </View>
          </View>
        ) : null}

        <FleetCard style={styles.previewCard}>
          <SectionHeader title="Driver Preview" />
          <View style={styles.previewRow}>
            <View style={styles.avatarWrap}>
              <MaterialCommunityIcons name="account-tie" size={28} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.previewName}>{driverName || 'Driver profile pending'}</Text>
              <Text style={styles.previewMeta}>License: {licenseNumber || 'Not added yet'}</Text>
              <Text style={styles.previewMeta}>Emergency: {emergencyContact || 'Not added yet'}</Text>
            </View>
          </View>
        </FleetCard>

        <Pressable style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continue to Verification</Text>
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
  heroCard: { marginBottom: 16 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  heroIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center' },
  heroLabel: { fontSize: 12, color: '#6b7280' },
  heroValue: { fontSize: 18, fontWeight: '900', color: '#0f5132', marginTop: 2 },
  heroBadge: { backgroundColor: '#edf9f1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  heroBadgeText: { fontSize: 11, fontWeight: '800', color: '#10b981' },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: '#e2efe5', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#10b981' },
  uploadList: { gap: 12, marginBottom: 16 },
  previewCard: { marginBottom: 16 },
  inputGroup: { marginBottom: 10 },
  inputLabel: { fontSize: 12, color: '#0f5132', fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#dbe7dd', borderRadius: 12, backgroundColor: '#fbfdfb', color: '#0f172a', paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  previewName: { fontSize: 15, fontWeight: '900', color: '#0f5132' },
  previewMeta: { fontSize: 12, color: '#6b7280', marginTop: 2, lineHeight: 17 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  noteText: { flex: 1, fontSize: 12, color: '#0f5132', lineHeight: 17 },
  primaryButton: { backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
})