import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AlertCard, SectionHeader } from '../../components/fleet/Shared'
import { notifications } from '../../lib/mock/fleetData'

export default function NotificationsScreen() {
  const router = useRouter()
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={24} color="#1f2937" />
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {/* Unread Section */}
        {notifications.filter(n => !n.read).length > 0 && (
          <>
            <SectionHeader title="Unread" />
            <View style={styles.notificationsList}>
              {notifications
                .filter(n => !n.read)
                .map(notif => (
                  <AlertCard key={notif.id} type={notif.type} title={notif.title} message={notif.message} timestamp={notif.timestamp} />
                ))}
            </View>
          </>
        )}

        {/* All Notifications */}
        <SectionHeader title="All Notifications" />
        <View style={styles.notificationsList}>
          {notifications.map(notif => (
            <AlertCard key={notif.id} type={notif.type} title={notif.title} message={notif.message} timestamp={notif.timestamp} />
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
  unreadBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
  unreadBadgeText: { fontSize: 12, fontWeight: '900', color: '#ffffff' },
  notificationsList: { gap: 0, marginBottom: 16 },
})
