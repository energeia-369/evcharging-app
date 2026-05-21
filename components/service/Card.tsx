import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  title: string
  subtitle?: string
  left?: React.ReactNode
  onPress?: () => void
  right?: React.ReactNode
}

export const Card: React.FC<Props> = ({ title, subtitle, left, onPress, right }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      <View style={styles.left}>{left ?? <MaterialCommunityIcons name="garage" size={36} color="#1f7a3a" />}</View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.right}>{right}</View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  left: { width: 48, alignItems: 'center' },
  body: { flex: 1, paddingHorizontal: 12 },
  title: { fontSize: 16, fontWeight: '700', color: '#0f5132' },
  subtitle: { fontSize: 12, color: '#6b6b6b', marginTop: 4 },
  right: { alignItems: 'flex-end' },
})

export default Card
