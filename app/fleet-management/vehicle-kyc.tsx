import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { UploadCard, type SelectedFile } from '../../components/fleet/UploadCard'

export default function VehicleKycScreen() {
  const router = useRouter()
  const [rcBookFile, setRcBookFile] = useState<SelectedFile | null>(null)
  const [insuranceFile, setInsuranceFile] = useState<SelectedFile | null>(null)
  const [vehicleImageFile, setVehicleImageFile] = useState<SelectedFile | null>(null)
  const [completedUploads, setCompletedUploads] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<SelectedFile[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<Record<string, SelectedFile | null>>({
    rcBook: null,
    insurance: null,
    vehicleImage: null,
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showValidation, setShowValidation] = useState(false)

  useEffect(() => {
    const nextSelectedDocuments = {
      rcBook: rcBookFile,
      insurance: insuranceFile,
      vehicleImage: vehicleImageFile,
    }

    const nextUploadedFiles = [rcBookFile, insuranceFile, vehicleImageFile].filter((file): file is SelectedFile => Boolean(file))

    setSelectedDocuments(nextSelectedDocuments)
    setUploadedFiles(nextUploadedFiles)
    setCompletedUploads(nextUploadedFiles.map(file => file.name))
    setUploadProgress(Math.round((nextUploadedFiles.length / 3) * 100))
  }, [insuranceFile, rcBookFile, vehicleImageFile])

  const requiredUploadsReady = Object.values(selectedDocuments).every(Boolean)
  const completedUploadCount = completedUploads?.length ?? 0
  const uploadTotalCount = Object.keys(selectedDocuments).length

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={22} color="#0f5132" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Vehicle KYC</Text>
            <Text style={styles.headerSubtitle}>Upload the fleet vehicle papers required for approval.</Text>
          </View>
        </View>

        <FleetCard style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="car-electric" size={24} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLabel}>Vehicle KYC progress</Text>
              <Text style={styles.heroValue}>{uploadProgress}% complete</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{completedUploadCount}/{uploadTotalCount} items</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
          </View>
        </FleetCard>

        <SectionHeader title="Required Documents" subtitle="Upload the vehicle ownership papers before moving to driver KYC." />
        <View style={styles.uploadList}>
          <UploadCard label="RC Book" file={rcBookFile} onFileSelected={setRcBookFile} required showValidation={showValidation} warningText="RC Book is required for vehicle approval." description="Upload the registration certificate for this vehicle." />
          <UploadCard label="Insurance Document" file={insuranceFile} onFileSelected={setInsuranceFile} required showValidation={showValidation} warningText="Insurance document is required for vehicle approval." description="Attach the current insurance proof for the EV." />
          <UploadCard label="Vehicle Image" file={vehicleImageFile} onFileSelected={setVehicleImageFile} required showValidation={showValidation} warningText="Vehicle image is required for vehicle approval." description="Use a clear front or side image of the vehicle." />
        </View>

        {showValidation && !requiredUploadsReady ? (
          <View style={styles.noteCard}>
            <View style={styles.noteRow}>
              <MaterialCommunityIcons name="file-document" size={18} color="#b91c1c" />
              <Text style={styles.noteText}>Please upload all required vehicle documents to continue.</Text>
            </View>
          </View>
        ) : null}

        <FleetCard style={styles.noteCard}>
          <View style={styles.noteRow}>
            <MaterialCommunityIcons name="check-circle" size={18} color="#10b981" />
            <Text style={styles.noteText}>Uploads are stored locally only and can be re-selected at any time.</Text>
          </View>
          <View style={styles.noteRow}>
            <MaterialCommunityIcons name="cloud-upload" size={18} color="#10b981" />
            <Text style={styles.noteText}>Accepted formats include PDF, JPG, PNG, and DOC files.</Text>
          </View>
        </FleetCard>

        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            if (!requiredUploadsReady) {
              setShowValidation(true)
              return
            }
            router.push('/fleet-management/driver-kyc')
          }}
        >
          <Text style={styles.primaryButtonText}>Continue to Driver KYC</Text>
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
  noteCard: { marginBottom: 16 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  noteText: { flex: 1, fontSize: 12, color: '#0f5132', lineHeight: 17 },
  primaryButton: { backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
})