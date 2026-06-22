import React from 'react';
import { StyleSheet, View } from 'react-native';

export const Skeleton: React.FC<{ width?: string | number; height?: number; style?: any }> = ({ width = '100%', height = 16, style }) => {
  return <View style={[styles.skel, { width, height }, style]} />
}

const styles = StyleSheet.create({
  skel: { backgroundColor: '#eee', borderRadius: 8, marginVertical: 6 },
})

export default Skeleton
