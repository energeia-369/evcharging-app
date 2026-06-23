import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useShowroom } from '../../context/showroom-context'
import { showroomBranches, showroomVehicles } from '../../lib/mock/showroomData'

const timeSlots = ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM']

export default function TestDriveScreen() {
  const router = useRouter()
  const { selectedVehicleId, bookingDraft, updateBookingDraft } = useShowroom()
  const [loading, setLoading] = useState(true)
  const safeShowrooms = showroomBranches ?? []
  const safeTimeSlots = timeSlots ?? []

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const selectedVehicle = showroomVehicles.find((item) => item.id === selectedVehicleId) || showroomVehicles[0]

  const handleConfirm = () => {
    updateBookingDraft({ vehicleId: selectedVehicle.id })
    router.push('/ev-showroom/test-drive-success')
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#064E3B" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Book a test drive</Text>
        </View>

        <View style={styles.vehiclePanel}>
          <Text style={styles.panelBadge}>Selected car</Text>
          <Text style={styles.panelTitle}>{selectedVehicle.name}</Text>
          <Text style={styles.panelSubtitle}>{selectedVehicle.brand} • {selectedVehicle.category}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Select showroom</Text>
          {safeShowrooms.length > 0 ? (
            safeShowrooms.map((branch) => (
              <TouchableOpacity
                key={branch.id}
                style={[styles.selectField, bookingDraft.showroomId === branch.id && styles.selectFieldActive]}
                onPress={() => updateBookingDraft({ showroomId: branch.id })}
              >
                <View style={styles.branchIcon}>
                  <MaterialCommunityIcons name="store" size={20} color="#10B981" />
                </View>
                <View style={styles.branchInfo}>
                  <Text style={styles.branchName}>{branch.name}</Text>
                  <Text style={styles.branchSubtitle}>{branch.address}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyStateTitle}>No Data Available</Text>
              <Text style={styles.emptyStateSubtitle}>Showrooms will appear here once mock data loads.</Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Select date</Text>
          <View style={styles.optionRow}>
            {['Tomorrow', 'Next week', 'Weekend'].map((option) => (
              <TouchableOpacity key={option} onPress={() => updateBookingDraft({ date: option })} style={[styles.dateChip, bookingDraft.date === option && styles.dateChipActive]}>
                <Text style={[styles.dateText, bookingDraft.date === option && styles.dateTextActive]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Select time</Text>
          <View style={styles.timeGrid}>
            {safeTimeSlots.length > 0 ? (
              safeTimeSlots.map((slot: string) => (
                <TouchableOpacity key={slot} onPress={() => updateBookingDraft({ time: slot })} style={[styles.timeSlot, bookingDraft.time === slot && styles.timeSlotActive]}>
                  <Text style={[styles.timeText, bookingDraft.time === slot && styles.timeTextActive]}>{slot}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>No Data Available</Text>
                <Text style={styles.emptyStateSubtitle}>Time slots will appear here once mock data loads.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Your name</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter full name"
            placeholderTextColor="#94a3b8"
            value={bookingDraft.name}
            onChangeText={(text) => updateBookingDraft({ name: text })}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Phone number</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter phone number"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            value={bookingDraft.phone}
            onChangeText={(text) => updateBookingDraft({ phone: text })}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Address</Text>
          <TextInput
            style={[styles.inputField, styles.textArea]}
            placeholder="Enter delivery or meeting address"
            placeholderTextColor="#94a3b8"
            value={bookingDraft.address}
            onChangeText={(text) => updateBookingDraft({ address: text })}
            multiline
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Notes</Text>
          <TextInput
            style={[styles.inputField, styles.textArea]}
            placeholder="Add any special request"
            placeholderTextColor="#94a3b8"
            value={bookingDraft.notes}
            onChangeText={(text) => updateBookingDraft({ notes: text })}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm Test Drive</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingNotice}>
            <Text style={styles.loadingNoticeText}>Preparing your booking details...</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 12 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  pageTitle: { fontSize: 22, fontWeight: '900', color: '#064E3B' },
  vehiclePanel: { backgroundColor: '#ECFDF5', borderRadius: 24, padding: 18, marginBottom: 20 },
  panelBadge: { color: '#047857', fontSize: 12, fontWeight: '700', marginBottom: 8 },
  panelTitle: { color: '#064E3B', fontSize: 20, fontWeight: '900', marginBottom: 4 },
  panelSubtitle: { color: '#14532D', fontSize: 13 },
  fieldGroup: { marginBottom: 18 },
  fieldLabel: { color: '#065F46', fontSize: 14, fontWeight: '700', marginBottom: 10 },
  selectField: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#D1FAE5', flexDirection: 'row', alignItems: 'center', gap: 12 },
  selectFieldActive: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
  branchIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center' },
  branchInfo: { flex: 1 },
  branchName: { color: '#064E3B', fontSize: 15, fontWeight: '800' },
  branchSubtitle: { color: '#14532D', fontSize: 12, marginTop: 2 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dateChip: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1FAE5' },
  dateChipActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  dateText: { color: '#0F172A', fontWeight: '700' },
  dateTextActive: { color: '#FFFFFF' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeSlot: { minWidth: '48%', padding: 14, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1FAE5' },
  timeSlotActive: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  timeText: { color: '#0F172A', fontWeight: '700' },
  timeTextActive: { color: '#065F46' },
  inputField: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#D1FAE5', padding: 14, color: '#0F172A' },
  textArea: { minHeight: 96, textAlignVertical: 'top' },
  confirmButton: { backgroundColor: '#10B981', borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 10, shadowColor: '#10B981', shadowOpacity: 0.12, shadowRadius: 14, elevation: 2 },
  confirmText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  loadingNotice: { marginTop: 16, backgroundColor: '#DCFCE7', padding: 14, borderRadius: 18 },
  loadingNoticeText: { color: '#065F46' },
  emptyStateCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#D1FAE5', width: '100%' },
  emptyStateTitle: { color: '#064E3B', fontWeight: '900', fontSize: 14 },
  emptyStateSubtitle: { color: '#14532D', fontSize: 12, marginTop: 4, lineHeight: 18 },
})
