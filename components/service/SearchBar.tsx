import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export const SearchBar: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="magnify" size={20} color="#666" />
      <TextInput placeholder={placeholder ?? 'Search services or centres'} style={styles.input} value={value} onChangeText={onChange} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 16,
    backgroundColor: '#f6f9f6',
    borderRadius: 10,
  },
  input: { marginLeft: 8, flex: 1, fontSize: 14 },
})

export default SearchBar
