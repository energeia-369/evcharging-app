import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { diagnostics } from '../../lib/mock/serviceData'

export default function Diagnostics() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f5132' }}>Vehicle Diagnostics</Text>
      </View>
      <FlatList data={diagnostics} keyExtractor={d => d.id} renderItem={({ item }) => (
        <View style={{ margin: 12, padding: 12, backgroundColor: '#fff', borderRadius: 12 }}>
          <Text style={{ fontWeight: '700' }}>{item.code}</Text>
          <Text style={{ color: '#666', marginTop: 6 }}>{item.message}</Text>
          <Text style={{ marginTop: 8, color: item.severity === 'high' ? '#b00020' : '#2f7a4a' }}>{item.severity.toUpperCase()}</Text>
        </View>
      )} />
    </View>
  )
}
