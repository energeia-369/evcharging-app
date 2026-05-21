import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FleetWelcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.illustration} />
          <Text style={styles.title}>Energeia Fleet Management</Text>
          <Text style={styles.subtitle}>Premium EV fleet tools for managers — optimize shifts, vehicles, and earnings.</Text>
        </View>

        <View style={styles.benefitsRow}>
          <View style={styles.card}>
            <MaterialCommunityIcons name={'car-electric' as any} size={28} color="#0f766e" />
            <Text style={styles.cardTitle}>EV Ready</Text>
            <Text style={styles.cardText}>Designed for electric vehicles and charging integration.</Text>
          </View>
          <View style={styles.card}>
            <MaterialCommunityIcons name={'chart-line' as any} size={28} color="#0f766e" />
            <Text style={styles.cardTitle}>Analytics</Text>
            <Text style={styles.cardText}>Real-time fleet performance and earnings overview.</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/fleet-management/login')}>
            <Text style={styles.primaryText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostButton} onPress={() => router.push('/fleet-management/register')}>
            <Text style={styles.ghostText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fffb' },
  content: { padding: 20, alignItems: 'center' },
  hero: { width: '100%', alignItems: 'center', marginTop: 20 },
  illustration: { width: 220, height: 140, backgroundColor: '#e6fff9', borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#064e3b' },
  subtitle: { fontSize: 14, color: '#065f46', textAlign: 'center', marginTop: 8 },
  benefitsRow: { flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'space-between' },
  card: { flex: 1, backgroundColor: '#ffffff', padding: 14, borderRadius: 12, marginHorizontal: 6, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  cardTitle: { fontWeight: '600', marginTop: 8, color: '#064e3b' },
  cardText: { fontSize: 12, color: '#065f46', marginTop: 6 },
  actions: { marginTop: 28, width: '100%' },
  primaryButton: { backgroundColor: '#059669', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  primaryText: { color: '#fff', fontWeight: '700' },
  ghostButton: { borderColor: '#059669', borderWidth: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  ghostText: { color: '#059669', fontWeight: '600' },
});
