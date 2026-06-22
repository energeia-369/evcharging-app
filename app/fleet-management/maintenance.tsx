import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { formatCurrency, getMaintenanceColor, maintenanceRecords } from '../../lib/mock/fleetData'

export default function MaintenanceScreen() {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState('all')

  const statuses = ['all', 'scheduled', 'in-progress', 'completed']

  const filteredRecords = selectedStatus === 'all' ? maintenanceRecords : maintenanceRecords.filter(r => r.status === selectedStatus)

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={24} color="#1f2937" />
          </Pressable>
          <Text style={styles.headerTitle}>Maintenance</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Status Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilterContainer}>
          {statuses.map(status => (
            <Pressable
              key={status}
              style={[styles.statusFilterBadge, selectedStatus === status && styles.statusFilterBadgeActive]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[styles.statusFilterText, selectedStatus === status && styles.statusFilterTextActive]}>
                {status.replace('-', ' ')}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Maintenance Records */}
        <SectionHeader title={`${filteredRecords.length} Records`} />
        <View style={styles.recordsList}>
          {filteredRecords.map(record => (
            <FleetCard key={record.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <View style={[styles.recordTypeIcon, { backgroundColor: getMaintenanceColor(record.status) + '20' }]}>
                  <MaterialCommunityIcons
                    name={
                      record.type === 'routine'
                        ? 'file-document'
                        : record.type === 'battery'
                          ? 'battery-check'
                          : record.type === 'electrical'
                            ? 'lightning-bolt'
                            : record.type === 'brake'
                              ? 'shield-alert'
                              : 'car'
                    }
                    size={18}
                    color={getMaintenanceColor(record.status)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recordTitle}>{record.description}</Text>
                  <Text style={styles.recordType}>{record.type.replace('-', ' ')}</Text>
                </View>
                <View
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor: record.priority === 'high' ? '#fee2e2' : record.priority === 'medium' ? '#fef3c7' : '#d1fae5',
                    },
                  ]}
                >
                  <Text style={[styles.priorityText, { color: record.priority === 'high' ? '#ef4444' : record.priority === 'medium' ? '#f59e0b' : '#10b981' }]}>
                    {record.priority}
                  </Text>
                </View>
              </View>

              <View style={styles.recordDetails}>
                <View style={styles.recordDetailItem}>
                  <MaterialCommunityIcons name="calendar" size={14} color="#6b7280" />
                  <Text style={styles.recordDetailText}>{record.scheduledDate}</Text>
                </View>
                <View style={styles.recordDetailItem}>
                  <MaterialCommunityIcons name="cash" size={14} color="#6b7280" />
                  <Text style={styles.recordDetailText}>{formatCurrency(record.estimatedCost)}</Text>
                </View>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: getMaintenanceColor(record.status) + '20' }]}>
                <MaterialCommunityIcons name="shield-check" size={8} color={getMaintenanceColor(record.status)} />
                <Text style={[styles.statusBadgeText, { color: getMaintenanceColor(record.status) }]}>{record.status}</Text>
              </View>
            </FleetCard>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4fbf6' },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0f5132', flex: 1, textAlign: 'center' },
  statusFilterContainer: { marginBottom: 16 },
  statusFilterBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: '#ffffff', marginRight: 8, borderWidth: 1, borderColor: '#e2efe5' },
  statusFilterBadgeActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  statusFilterText: { fontSize: 12, fontWeight: '600', color: '#6b7280', textTransform: 'capitalize' },
  statusFilterTextActive: { color: '#ffffff' },
  recordsList: { gap: 10 },
  recordCard: { borderLeftWidth: 4, borderLeftColor: '#10b981' },
  recordHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  recordTypeIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  recordTitle: { fontSize: 14, fontWeight: '900', color: '#0f5132' },
  recordType: { fontSize: 11, color: '#6b7280', marginTop: 2, textTransform: 'capitalize' },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, justifyContent: 'center' },
  priorityText: { fontSize: 10, fontWeight: '900', textTransform: 'capitalize' },
  recordDetails: { flexDirection: 'row', gap: 16, marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#e2efe5' },
  recordDetailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  recordDetailText: { fontSize: 12, color: '#6b7280' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start' },
  statusBadgeText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
})
