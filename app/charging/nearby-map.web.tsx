import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NearbyChargingMapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webCard}>
        <MaterialCommunityIcons name="map-search" size={42} color="#16A34A" />
        <Text style={styles.title}>Nearby station map</Text>
        <Text style={styles.subtitle}>
          Use Android or iOS build to view native map markers and distances.
        </Text>
        <Text style={styles.status}>Nearby stations preview mode</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07131F',
    padding: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  webCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 24,
    gap: 12,
  },
  status: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
});
