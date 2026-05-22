import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FleetWelcome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.illustration}>
            <MaterialCommunityIcons name={'truck-fast' as any} size={52} color="#16A34A" />
          </View>
          <Text style={styles.title}>Energeia Fleet Management</Text>
          <Text style={styles.subtitle}>Premium EV fleet tools for managers. Optimize trips, charging, and earnings from one polished control center.</Text>
        </View>

        {loading ? (
          <View style={styles.loadingStack}>
            {[0, 1].map((item) => (
              <View key={item} style={styles.skeletonCard}>
                <View style={styles.skeletonIcon} />
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '65%' }]} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.benefitsRow}>
            <View style={styles.card}>
              <MaterialCommunityIcons name={'car-electric' as any} size={28} color="#0f766e" />
              <Text style={styles.cardTitle}>EV Ready</Text>
              <Text style={styles.cardText}>Built for charging-aware routes and real-time EV operations.</Text>
            </View>
            <View style={styles.card}>
              <MaterialCommunityIcons name={'chart-line' as any} size={28} color="#0f766e" />
              <Text style={styles.cardTitle}>Analytics</Text>
              <Text style={styles.cardText}>Track utilization, battery levels, and daily revenue trends.</Text>
            </View>
          </View>
        )}

        <View style={styles.inlineSuccess}>
          <MaterialCommunityIcons name={'check-decagram' as any} size={16} color="#15803D" />
          <Text style={styles.inlineSuccessText}>Fleet module is synced and ready.</Text>
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
  container: { flex: 1, backgroundColor: '#F4FBF6' },
  content: { padding: 20, alignItems: 'center', paddingBottom: 34 },
  hero: { width: '100%', alignItems: 'center', marginTop: 20 },
  illustration: {
    width: 220,
    height: 140,
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  title: { fontSize: 24, fontWeight: '900', color: '#064E3B' },
  subtitle: { fontSize: 14, color: '#065F46', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  benefitsRow: { flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'space-between' },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: { fontWeight: '600', marginTop: 8, color: '#064e3b' },
  cardText: { fontSize: 12, color: '#065f46', marginTop: 6 },
  loadingStack: { width: '100%', gap: 10, marginTop: 18 },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    padding: 14,
    gap: 8,
  },
  skeletonIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#E2E8F0' },
  skeletonLine: { height: 10, borderRadius: 999, backgroundColor: '#E2E8F0', width: '88%' },
  inlineSuccess: {
    marginTop: 14,
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineSuccessText: { color: '#166534', fontWeight: '700' },
  actions: { marginTop: 28, width: '100%' },
  primaryButton: { backgroundColor: '#059669', padding: 14, borderRadius: 14, alignItems: 'center', marginBottom: 12 },
  primaryText: { color: '#fff', fontWeight: '700' },
  ghostButton: { borderColor: '#059669', borderWidth: 1, padding: 14, borderRadius: 14, alignItems: 'center', backgroundColor: '#FFFFFF' },
  ghostText: { color: '#059669', fontWeight: '600' },
});
