import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const playbooks = [
  { id: 'charging', title: 'Charging Expansion', description: 'Scale stations, monitor occupancy, and improve connector uptime.', icon: 'ev-station', route: '/charging/stations-list' },
  { id: 'fleet', title: 'Fleet Optimization', description: 'Track battery health, trips, and route efficiency per vehicle.', icon: 'truck-fast', route: '/fleet-management' },
  { id: 'service', title: 'Service Excellence', description: 'Reduce booking turnaround with organized service center flow.', icon: 'tools', route: '/service-center' },
  { id: 'franchise', title: 'Franchise Growth', description: 'Accelerate applications and partner readiness checks.', icon: 'account-tie', route: '/dealership/apply-franchise' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const cards = useMemo(() => playbooks, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Business Playbooks</Text>
          <Text style={styles.title}>Operate Energeia Like a Premium EV Startup</Text>
          <Text style={styles.subtitle}>Pick a flow and jump into polished module screens with consistent layout, spacing, and visual language.</Text>
        </View>

        {cards.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="compass-off-outline" size={24} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No playbooks available</Text>
            <Text style={styles.emptyText}>Playbook cards will appear once your modules are configured.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {cards.map((card) => (
              <Pressable
                key={card.id}
                onPress={() => router.push(card.route as never)}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              >
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons name={card.icon as any} size={20} color="#16A34A" />
                </View>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardText}>{card.description}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4FBF6',
  },
  container: {
    padding: 16,
    gap: 12,
    paddingBottom: 34,
  },
  hero: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    padding: 18,
    shadowColor: '#0F5132',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  kicker: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 8,
    fontSize: 28,
    lineHeight: 34,
    color: '#064E3B',
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 10,
    color: '#64748B',
    lineHeight: 20,
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  cardText: {
    marginTop: 6,
    color: '#64748B',
    lineHeight: 18,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 22,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 16,
  },
  emptyText: {
    color: '#64748B',
    textAlign: 'center',
  },
});
