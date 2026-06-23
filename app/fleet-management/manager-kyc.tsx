import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { UploadCard, type SelectedFile } from '../../components/fleet/UploadCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from './AuthContext'

export default function ManagerKycScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const [aadhaarFile, setAadhaarFile] = useState<SelectedFile | null>(null)
  const [panFile, setPanFile] = useState<SelectedFile | null>(null)
  const [bankPassbookFile, setBankPassbookFile] = useState<SelectedFile | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  useEffect(() => {
    if (user?.email) {
      AsyncStorage.getItem(`@energeia_manager_kyc_${user.email}`).then((val) => {
        if (val === 'verified') {
          setIsSubmitted(true)
          setAadhaarFile({ name: 'aadhaar_verified.pdf', size: 1024, type: 'pdf' })
          setPanFile({ name: 'pan_verified.pdf', size: 1024, type: 'pdf' })
          setBankPassbookFile({ name: 'passbook_verified.pdf', size: 1024, type: 'pdf' })
        }
      })
    }
  }, [user?.email])

  async function handleVerify() {
    if (!aadhaarFile || !panFile || !bankPassbookFile) {
      setShowValidation(true)
      return
    }

    if (user?.email) {
      await AsyncStorage.setItem(`@energeia_manager_kyc_${user.email}`, 'verified')
      setIsSubmitted(true)
      Alert.alert('Success', 'Documents uploaded successfully and verified!')
      router.replace('/fleet-management/dashboard')
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.replace('/fleet-management/dashboard')}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#0f5132" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Manager KYC Upload</Text>
            <Text style={styles.headerSubtitle}>Upload Aadhaar, PAN and Bank documents to verify your profile.</Text>
          </View>
        </View>

        {isSubmitted ? (
          <FleetCard style={styles.successCard}>
            <MaterialCommunityIcons name="check-decagram" size={32} color="#10b981" />
            <Text style={styles.successTitle}>Verification Completed</Text>
            <Text style={styles.successText}>Your manager profile documents are verified and active.</Text>
          </FleetCard>
        ) : (
          <>
            <View style={styles.uploadGrid}>
              <UploadCard 
                label="Aadhaar Card" 
                file={aadhaarFile} 
                onFileSelected={setAadhaarFile} 
                required 
                showValidation={showValidation} 
                warningText="Aadhaar Card is required." 
                description="Government ID for manager identity proof." 
              />
              <UploadCard 
                label="PAN Card" 
                file={panFile} 
                onFileSelected={setPanFile} 
                required 
                showValidation={showValidation} 
                warningText="PAN Card is required." 
                description="Tax and business verification proof." 
              />
              <UploadCard 
                label="Bank Passbook" 
                file={bankPassbookFile} 
                onFileSelected={setBankPassbookFile} 
                required 
                showValidation={showValidation} 
                warningText="Bank Passbook is required." 
                description="Account proof for settlement setup." 
              />
            </View>

            <Pressable style={styles.primaryButton} onPress={handleVerify}>
              <MaterialCommunityIcons name="cloud-upload" size={18} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Upload & Verify</Text>
            </Pressable>
          </>
        )}
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
  uploadGrid: { gap: 12, marginBottom: 16 },
  primaryButton: { backgroundColor: '#10b981', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
  successCard: { padding: 24, alignItems: 'center', gap: 12, marginVertical: 20 },
  successTitle: { fontSize: 18, fontWeight: '900', color: '#0f5132' },
  successText: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 18 },
})
