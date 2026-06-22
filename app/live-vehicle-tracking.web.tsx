import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LiveVehicleTrackingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.webCard}>
        <MaterialCommunityIcons name="map-clock" size={40} color="#22C55E" />
        <Text style={styles.title}>Live tracking preview</Text>
        <Text style={styles.subtitle}>
          Use Android or iOS build to see real-time vehicle movement with Socket.IO.
        </Text>
        <Text style={styles.metaText}>Live tracking active</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070E1B',
    padding: 16,
  },
  title: {
    fontSize: 28,
    color: '#F8FAFC',
    fontWeight: '800',
    marginTop: 2,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  metaText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  webCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#111827',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 10,
  },
});
