import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { UploadCard, type SelectedFile } from '../../components/fleet/UploadCard'

export default function DriverKycScreen() {
  const router = useRouter()
  const [drivingLicenseFile, setDrivingLicenseFile] = useState<SelectedFile | null>(null)
  const [aadhaarFile, setAadhaarFile] = useState<SelectedFile | null>(null)
  const [panFile, setPanFile] = useState<SelectedFile | null>(null)
  const [bankPassbookFile, setBankPassbookFile] = useState<SelectedFile | null>(null)
  const [showValidation, setShowValidation] = useState(false)

  const completion = useMemo(() => {
    const fields = [drivingLicenseFile, aadhaarFile, panFile, bankPassbookFile]
    const filled = fields.filter(Boolean).length
    return Math.round((filled / fields.length) * 100)
  }, [aadhaarFile, bankPassbookFile, drivingLicenseFile, panFile])

  const requiredUploadsReady = Boolean(drivingLicenseFile && aadhaarFile && panFile && bankPassbookFile)
  const verifiedCount = [drivingLicenseFile, aadhaarFile, panFile, bankPassbookFile].filter(Boolean).length

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

        <SectionHeader title="Driver Documents" subtitle="Upload the assigned driver's identity documents before verification." />
        <View style={styles.uploadList}>
          <UploadCard label="Driving License" file={drivingLicenseFile} onFileSelected={setDrivingLicenseFile} required showValidation={showValidation} warningText="Driving License is required for driver verification." description="The active license for the fleet driver." />
          <UploadCard label="Aadhaar Card" file={aadhaarFile} onFileSelected={setAadhaarFile} required showValidation={showValidation} warningText="Aadhaar Card is required for driver verification." description="Use the driver's government ID for identity proof." />
          <UploadCard label="PAN Card" file={panFile} onFileSelected={setPanFile} required showValidation={showValidation} warningText="PAN Card is required for driver verification." description="Attach the driver's tax identity document." />
          <UploadCard label="Bank Passbook" file={bankPassbookFile} onFileSelected={setBankPassbookFile} required showValidation={showValidation} warningText="Bank Passbook is required for payouts." description="Capture the driver's bank account proof." />
        </View>

        {showValidation && !requiredUploadsReady ? (
          <View style={styles.previewCard}>
            <View style={styles.noteRow}>
              <MaterialCommunityIcons name="file-document" size={18} color="#b91c1c" />
              <Text style={styles.noteText}>Please upload all required driver documents to continue.</Text>
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
              <Text style={styles.previewName}>Aman Kumar</Text>
              <Text style={styles.previewMeta}>License valid for 3 more years</Text>
              <Text style={styles.previewMeta}>Bank account linked for weekly payouts</Text>
            </View>
          </View>
        </FleetCard>

        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            if (!requiredUploadsReady) {
              setShowValidation(true)
              return
            }
            router.push('/fleet-management/verification')
          }}
        >
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
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  previewName: { fontSize: 15, fontWeight: '900', color: '#0f5132' },
  previewMeta: { fontSize: 12, color: '#6b7280', marginTop: 2, lineHeight: 17 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  noteText: { flex: 1, fontSize: 12, color: '#0f5132', lineHeight: 17 },
  primaryButton: { backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
})