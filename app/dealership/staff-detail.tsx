import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { staff } from '../../lib/mock/staffData'

export default function StaffDetail() {
  const router = useRouter()
  const { staffId } = useLocalSearchParams() as { staffId?: string }
  const person = staff.find(s => s.id === staffId) || staff[0]

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}><MaterialCommunityIcons name="arrow-left" size={20} color="#064E3B" /></TouchableOpacity>
          <Text style={styles.title}>{person.name}</Text>
        </View>

        <View style={styles.card}><Text style={styles.label}>Role</Text><Text style={styles.value}>{person.role}</Text></View>
        <View style={styles.card}><Text style={styles.label}>Performance</Text><Text style={styles.value}>{person.performance}% • ⭐ {person.rating}</Text></View>
        <View style={styles.card}><Text style={styles.label}>Contact</Text><Text style={styles.value}>{person.phone} • {person.email}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL(`tel:${person.phone}`)}><Text style={styles.contactText}>Call</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.contactBtn, { backgroundColor: '#ECFDF5' }]} onPress={() => Linking.openURL(`mailto:${person.email}`)}><Text style={[styles.contactText, { color: '#047857' }]}>Email</Text></TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 48 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  backButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: '#064E3B' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ECFDF5' },
  label: { color: '#047857', fontWeight: '900', marginBottom: 6 },
  value: { color: '#064E3B', fontWeight: '900' },
  contactBtn: { backgroundColor: '#059669', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  contactText: { color: '#FFFFFF', fontWeight: '900' },
})
