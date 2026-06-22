import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { staffMembers } from '../../lib/mock/dealershipLifecycleData'

const roles = ['all', 'Technician', 'Sales Manager', 'Service Advisor', 'Dispatcher', 'Admin'] as const

export default function StaffScreen() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<(typeof roles)[number]>('all')

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase()
    return staffMembers.filter((member) => {
      const matchesSearch = [member.name, member.role, member.email].join(' ').toLowerCase().includes(query)
      const matchesRole = roleFilter === 'all' || member.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [roleFilter, search])

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Staff Management</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/dealership')}>
            <MaterialCommunityIcons name="account-group" size={18} color="#064E3B" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="account-group" size={18} color="#059669" />
          <TextInput value={search} onChangeText={setSearch} placeholder="Search employees" style={styles.searchInput} placeholderTextColor="#7C8B93" />
        </View>

        <View style={styles.filterRow}>
          {roles.map((role) => (
            <TouchableOpacity key={role} style={[styles.filterChip, roleFilter === role && styles.filterChipActive]} onPress={() => setRoleFilter(role)}>
              <Text style={[styles.filterText, roleFilter === role && styles.filterTextActive]}>{role.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredStaff.map((member) => (
          <View key={member.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.avatar}><MaterialCommunityIcons name={member.role === 'Technician' ? 'tools' : 'account-tie'} size={18} color="#059669" /></View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.role}>{member.role}</Text>
              </View>
              <View style={styles.ratingPill}><Text style={styles.ratingText}>⭐ {member.rating}</Text></View>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Attendance</Text>
              <Text style={styles.metaValue}>{member.attendance}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Performance</Text>
              <Text style={styles.metaValue}>{member.performance}%</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`tel:${member.phone}`)}>
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`mailto:${member.email}`)}>
                <Text style={styles.actionText}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.assignButton]}>
                <Text style={styles.actionText}>Assign Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: '#064E3B', fontSize: 24, fontWeight: '900' },
  iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#064E3B', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, color: '#064E3B' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  filterChip: { borderWidth: 1, borderColor: '#D1FAE5', backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  filterChipActive: { backgroundColor: '#059669', borderColor: '#059669' },
  filterText: { color: '#064E3B', fontSize: 11, fontWeight: '900' },
  filterTextActive: { color: '#FFFFFF' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#064E3B', shadowOpacity: 0.06, shadowRadius: 10, elevation: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  name: { color: '#064E3B', fontWeight: '900' },
  role: { color: '#14532D', fontSize: 12, marginTop: 4 },
  ratingPill: { backgroundColor: '#ECFDF5', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  ratingText: { color: '#047857', fontWeight: '900' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  metaLabel: { color: '#047857', fontWeight: '800' },
  metaValue: { color: '#064E3B', fontWeight: '900' },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  actionButton: { flexGrow: 1, backgroundColor: '#ECFDF5', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  assignButton: { backgroundColor: '#D1FAE5' },
  actionText: { color: '#064E3B', fontWeight: '900', fontSize: 12 },
})
