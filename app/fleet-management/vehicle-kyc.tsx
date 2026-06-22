import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { UploadCard, type SelectedFile } from '../../components/fleet/UploadCard'
import { useFleetOps } from './FleetOpsContext'

export default function VehicleKycScreen() {
  const router = useRouter()
  const { completeVehicleKyc, fleetVehicles, registerVehicle, selectedVehicleForKycId, setSelectedVehicleForKycId } = useFleetOps()
  const selectedVehicle = fleetVehicles.find((vehicle) => vehicle.id === selectedVehicleForKycId) ?? null

  const [vehicleNumber, setVehicleNumber] = useState(selectedVehicle?.number ?? '')
  const [vehicleModel, setVehicleModel] = useState(selectedVehicle?.model ?? '')
  const [vehicleLocation, setVehicleLocation] = useState(selectedVehicle?.location ?? '')
  const [vehicleLabel, setVehicleLabel] = useState(selectedVehicle?.imageLabel ?? '')

  const [rcBookFile, setRcBookFile] = useState<SelectedFile | null>(null)
  const [insuranceFile, setInsuranceFile] = useState<SelectedFile | null>(null)
  const [pollutionFile, setPollutionFile] = useState<SelectedFile | null>(null)
  const [vehicleImageFile, setVehicleImageFile] = useState<SelectedFile | null>(null)
  const [completedUploads, setCompletedUploads] = useState<string[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<Record<string, SelectedFile | null>>({
    rcBook: null,
    insurance: null,
    pollutionCertificate: null,
    vehicleImage: null,
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showValidation, setShowValidation] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')

  useEffect(() => {
    if (!selectedVehicle) {
      return
    }

    setVehicleNumber(selectedVehicle.number)
    setVehicleModel(selectedVehicle.model)
    setVehicleLocation(selectedVehicle.location)
    setVehicleLabel(selectedVehicle.imageLabel)
  }, [selectedVehicle])

  useEffect(() => {
    const nextSelectedDocuments = {
      rcBook: rcBookFile,
      insurance: insuranceFile,
      pollutionCertificate: pollutionFile,
      vehicleImage: vehicleImageFile,
    }

    const nextUploadedFiles = [rcBookFile, insuranceFile, pollutionFile, vehicleImageFile].filter((file): file is SelectedFile => Boolean(file))

    setSelectedDocuments(nextSelectedDocuments)
    setCompletedUploads(nextUploadedFiles.map(file => file.name))
    setUploadProgress(Math.round((nextUploadedFiles.length / 4) * 100))
  }, [insuranceFile, pollutionFile, rcBookFile, vehicleImageFile])

  const requiredUploadsReady = Object.values(selectedDocuments).every(Boolean)
  const completedUploadCount = completedUploads?.length ?? 0
  const uploadTotalCount = Object.keys(selectedDocuments).length

  function handleContinue() {
    setValidationMessage('')

    if (!vehicleNumber.trim() || !vehicleModel.trim()) {
      setShowValidation(true)
      setValidationMessage('Vehicle number and model are required.')
      return
    }

    if (!requiredUploadsReady) {
      setShowValidation(true)
      setValidationMessage('Please upload all required vehicle documents to continue.')
      return
    }

    let targetVehicleId = selectedVehicle?.id

    if (!targetVehicleId) {
      const registerResult = registerVehicle({
        vehicleNumber,
        model: vehicleModel,
        location: vehicleLocation,
        imageLabel: vehicleLabel,
      })

      if (!registerResult.ok || !registerResult.vehicleId) {
        setShowValidation(true)
        setValidationMessage(registerResult.message)
        return
      }

      targetVehicleId = registerResult.vehicleId
      setSelectedVehicleForKycId(registerResult.vehicleId)
    }

    const kycResult = completeVehicleKyc(targetVehicleId, {
      rcBook: rcBookFile?.name ?? '',
      insurance: insuranceFile?.name ?? '',
      pollutionCertificate: pollutionFile?.name ?? '',
      vehicleImage: vehicleImageFile?.name ?? '',
    })

    if (!kycResult.ok) {
      setShowValidation(true)
      setValidationMessage(kycResult.message)
      return
    }

    router.push('/fleet-management/driver-management')
  }

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

        <SectionHeader title="Vehicle Registration" subtitle="Register the vehicle before submitting KYC." />
        <FleetCard style={styles.noteCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Vehicle Number</Text>
            <TextInput value={vehicleNumber} onChangeText={setVehicleNumber} style={styles.input} placeholder="MH-01-EV-1001" placeholderTextColor="#9ca3af" autoCapitalize="characters" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Vehicle Model</Text>
            <TextInput value={vehicleModel} onChangeText={setVehicleModel} style={styles.input} placeholder="Tata Nexon EV" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Operating Location</Text>
            <TextInput value={vehicleLocation} onChangeText={setVehicleLocation} style={styles.input} placeholder="City hub" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Vehicle Image Label</Text>
            <TextInput value={vehicleLabel} onChangeText={setVehicleLabel} style={styles.input} placeholder="Premium EV fleet vehicle" placeholderTextColor="#9ca3af" />
          </View>
        </FleetCard>

        <SectionHeader title="Required Documents" subtitle="Upload RC, insurance, pollution certificate, and vehicle image." />
        <View style={styles.uploadList}>
          <UploadCard label="RC Book" file={rcBookFile} onFileSelected={setRcBookFile} required showValidation={showValidation} warningText="RC Book is required for vehicle approval." description="Upload the registration certificate for this vehicle." />
          <UploadCard label="Insurance Document" file={insuranceFile} onFileSelected={setInsuranceFile} required showValidation={showValidation} warningText="Insurance document is required for vehicle approval." description="Attach the current insurance proof for the EV." />
          <UploadCard label="Pollution Certificate" file={pollutionFile} onFileSelected={setPollutionFile} required showValidation={showValidation} warningText="Pollution certificate is required for vehicle approval." description="Upload the latest pollution compliance certificate." />
          <UploadCard label="Vehicle Image" file={vehicleImageFile} onFileSelected={setVehicleImageFile} required showValidation={showValidation} warningText="Vehicle image is required for vehicle approval." description="Use a clear front or side image of the vehicle." />
        </View>

        {showValidation && (!requiredUploadsReady || !vehicleNumber.trim() || !vehicleModel.trim()) ? (
          <View style={styles.noteCard}>
            <View style={styles.noteRow}>
              <MaterialCommunityIcons name="file-document" size={18} color="#b91c1c" />
              <Text style={styles.noteText}>{validationMessage || 'Please complete all vehicle registration details and uploads.'}</Text>
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

        <Pressable style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Save Vehicle KYC and Add Drivers</Text>
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
  inputGroup: { marginBottom: 10 },
  inputLabel: { fontSize: 12, color: '#0f5132', fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#dbe7dd', borderRadius: 12, backgroundColor: '#fbfdfb', color: '#0f172a', paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  noteText: { flex: 1, fontSize: 12, color: '#0f5132', lineHeight: 17 },
  primaryButton: { backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
})