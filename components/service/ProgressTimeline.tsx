import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const ProgressTimeline: React.FC<{ steps: string[]; current: number }> = ({ steps, current }) => {
  return (
    <View style={{ padding: 16 }}>
      {steps.map((s, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.dot, i <= current ? styles.active : null]} />
          <Text style={[styles.label, i <= current ? styles.activeLabel : null]}>{s}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#e6e6e6', marginRight: 12 },
  active: { backgroundColor: '#1f7a3a' },
  label: { color: '#666' },
  activeLabel: { color: '#0f5132', fontWeight: '700' },
})

export default ProgressTimeline
