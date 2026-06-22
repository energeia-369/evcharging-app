import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export const RewardBadge: React.FC<{ points: number }> = ({ points }) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.points}>{points}</Text>
      <Text style={styles.label}>Rewards</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { backgroundColor: '#eaf7ea', padding: 10, borderRadius: 10, alignItems: 'center', width: 84 },
  points: { color: '#0f5132', fontWeight: '800' },
  label: { color: '#2f7a4a', fontSize: 11 },
})

export default RewardBadge
