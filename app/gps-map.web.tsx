import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GpsMapScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.webCard}>
        <MaterialCommunityIcons name="map-marker-radius" size={42} color="#16A34A" />
        <Text style={styles.title}>GPS map preview</Text>
        <Text style={styles.subtitle}>
          Native maps are available on Android and iOS. Use the installed app on a device or emulator to see the live blue location dot.
        </Text>
        <Text style={styles.status}>GPS preview mode</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08111F',
    padding: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  webCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 28,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  status: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
});
