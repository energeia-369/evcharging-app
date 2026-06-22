import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Driver, Vehicle } from '../../lib/mock/fleetData';

export function FleetCard({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.card, style]}>{children}</View>
}

export function VehicleCard({ vehicle, onPress }: { vehicle: Vehicle; onPress: () => void }) {
  const statusColor = getStatusColor(vehicle.status)

  return (
    <Pressable style={({ pressed }) => [styles.vehicleCard, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.vehicleCardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.vehicleName}>{vehicle.name}</Text>
          <Text style={styles.vehicleNumber}>{vehicle.number}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{vehicle.battery}%</Text>
        </View>
      </View>

      <View style={styles.vehicleCardContent}>
        <View style={styles.vehicleInfoRow}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#6b7280" />
          <Text style={styles.vehicleInfoText}>{vehicle.location}</Text>
        </View>

        <View style={styles.vehicleInfoRow}>
          <MaterialCommunityIcons name="account-tie" size={16} color="#6b7280" />
          <Text style={styles.vehicleInfoText}>{vehicle.driverName}</Text>
        </View>

        <View style={styles.vehicleInfoRow}>
          <MaterialCommunityIcons name="car-electric" size={16} color="#6b7280" />
          <Text style={styles.vehicleInfoText}>{vehicle.tripStatus}</Text>
        </View>
      </View>

      <View style={styles.vehicleCardFooter}>
        <View style={styles.batteryContainer}>
          <MaterialCommunityIcons name="battery-charging" size={18} color={statusColor} />
          <View style={styles.batteryBar}>
            <View style={[styles.batteryFill, { width: `${vehicle.battery}%`, backgroundColor: statusColor }]} />
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export function DriverCard({ driver, onPress }: { driver: Driver; onPress?: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.driverCard, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.driverCardContent}>
        <View style={styles.driverAvatar}>
          <MaterialCommunityIcons name="account-tie" size={40} color="#10b981" />
        </View>

        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driver.name}</Text>
          <View style={styles.ratingRow}>
            <MaterialCommunityIcons name="shield-check" size={14} color="#f59e0b" />
            <Text style={styles.ratingText}>{driver.rating} • {driver.totalTrips} trips</Text>
          </View>
          <Text style={styles.availabilityText}>{driver.availability}</Text>
        </View>

        <View style={styles.contactIcon}>
          <MaterialCommunityIcons name="clipboard-check" size={20} color="#10b981" />
        </View>
      </View>
    </Pressable>
  )
}

export function StatCard({ icon, title, value, color }: { icon: string; title: string; value: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  )
}

export function AlertCard({ type, title, message, timestamp }: { type: string; title: string; message: string; timestamp: string }) {
  const alertColor = getAlertColor(type)

  return (
    <View style={[styles.alertCard, { borderLeftColor: alertColor, borderLeftWidth: 4 }]}>
      <View style={styles.alertHeader}>
        <View style={[styles.alertIcon, { backgroundColor: alertColor + '20' }]}>
          <MaterialCommunityIcons name={getAlertIcon(type) as any} size={18} color={alertColor} />
        </View>
        <Text style={styles.alertTitle}>{title}</Text>
      </View>
      <Text style={styles.alertMessage}>{message}</Text>
      <Text style={styles.alertTime}>{timestamp}</Text>
    </View>
  )
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'in-trip':
      return '#0ea5e9'
    case 'charging':
      return '#10b981'
    case 'available':
      return '#8b5cf6'
    case 'maintenance':
      return '#ef4444'
    case 'idle':
      return '#f59e0b'
    default:
      return '#6b7280'
  }
}

function getAlertColor(type: string) {
  switch (type) {
    case 'charging':
      return '#10b981'
    case 'battery':
      return '#f59e0b'
    case 'maintenance':
      return '#0ea5e9'
    case 'emergency':
      return '#ef4444'
    default:
      return '#6b7280'
  }
}

function getAlertIcon(type: string) {
  switch (type) {
    case 'charging':
      return 'battery-charging'
    case 'battery':
      return 'clipboard-check'
    case 'maintenance':
      return 'file-document'
    case 'emergency':
      return 'shield-check'
    default:
      return 'bell'
  }
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderRadius: 18, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  pressed: { transform: [{ scale: 0.98 }] },
  vehicleCard: { backgroundColor: '#ffffff', borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#e2efe5', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  vehicleCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  vehicleName: { fontSize: 16, fontWeight: '900', color: '#0f5132' },
  vehicleNumber: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, alignItems: 'center' },
  statusText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  vehicleCardContent: { gap: 8, marginBottom: 12 },
  vehicleInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vehicleInfoText: { fontSize: 13, color: '#4f6952', fontWeight: '500' },
  vehicleCardFooter: { borderTopWidth: 1, borderTopColor: '#e2efe5', paddingTop: 10 },
  batteryContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  batteryBar: { flex: 1, height: 6, backgroundColor: '#e2efe5', borderRadius: 3, overflow: 'hidden' },
  batteryFill: { height: '100%' },
  driverCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e2efe5' },
  driverCardContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  driverAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 14, fontWeight: '900', color: '#0f5132' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  availabilityText: { fontSize: 11, color: '#10b981', fontWeight: '600', marginTop: 2 },
  contactIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#edf9f1', alignItems: 'center', justifyContent: 'center' },
  statCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  statIcon: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statContent: { flex: 1 },
  statTitle: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  statValue: { fontSize: 18, fontWeight: '900', color: '#0f5132', marginTop: 2 },
  alertCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 12, marginBottom: 10 },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  alertIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  alertTitle: { fontSize: 14, fontWeight: '900', color: '#0f5132', flex: 1 },
  alertMessage: { fontSize: 13, color: '#4f6952', lineHeight: 18, marginLeft: 46, marginBottom: 6 },
  alertTime: { fontSize: 11, color: '#9ca3af', marginLeft: 46 },
  sectionHeader: { marginBottom: 12, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#0f5132' },
  sectionSubtitle: { fontSize: 12, color: '#6b7280', marginTop: 2 },
})
