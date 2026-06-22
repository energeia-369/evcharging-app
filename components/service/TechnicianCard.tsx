import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const TechnicianCard: React.FC<{ name: string; exp: number; rating: number; onPress?: () => void }> = ({ name, exp, rating, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.9}>
      <View style={styles.avatar}><MaterialCommunityIcons name="account-circle" size={36} color="#1f7a3a" /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>{exp} yrs • {rating} ★</Text>
      </View>
      <View style={{ paddingLeft: 8 }}>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 10, marginVertical: 6, marginHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  avatar: { width: 48, alignItems: 'center' },
  name: { fontWeight: '700', color: '#0f5132' },
  meta: { color: '#6b6b6b', marginTop: 4, fontSize: 12 },
})

export default TechnicianCard
