import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DashboardCard = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  route: string;
};

const moduleCards: DashboardCard[] = [
  { id: 'charging', title: 'EV Charging', subtitle: 'Nearby stations and live map', icon: 'ev-station', route: '/charging/nearby-map' },
  { id: 'fleet', title: 'Fleet Management', subtitle: 'Vehicles, trips, and analytics', icon: 'car-electric', route: '/fleet-management' },
  { id: 'dealership', title: 'Dealership', subtitle: 'Lifecycle and inventory dashboard', icon: 'store', route: '/dealership' },
  { id: 'service', title: 'Service Center', subtitle: 'Bookings and maintenance flow', icon: 'tools', route: '/service-center' },
  { id: 'franchise', title: 'Franchise', subtitle: 'Apply and track approvals', icon: 'account-tie', route: '/dealership/apply-franchise' },
  { id: 'cafe', title: 'Cafe', subtitle: 'Menu, POS, and payments', icon: 'coffee', route: '/oasis-cafe' },
  { id: 'admin', title: 'Admin Module', subtitle: 'Platform control center', icon: 'shield-crown', route: '/admin' },
  { id: 'showroom', title: 'EV Showroom', subtitle: 'Explore and compare EV models', icon: 'car-sports', route: '/ev-showroom' },
];

export default function UserDashboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const cards = useMemo(() => moduleCards, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>Energeia Ecosystem</Text>
          <Text style={styles.heroTitle}>Premium EV Operations Dashboard</Text>
          <Text style={styles.heroSubtitle}>Manage charging, fleet, service, cafe, franchise, and admin workflows from one polished control surface.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <Text style={styles.sectionMeta}>{cards.length} modules</Text>
        </View>

        {loading ? (
          <View style={styles.skeletonGrid}>
            {[0, 1, 2, 3].map((item) => (
              <View key={item} style={styles.skeletonCard}>
                <View style={styles.skeletonIcon} />
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '72%' }]} />
              </View>
            ))}
          </View>
        ) : cards.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="view-grid-outline" size={26} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No modules available</Text>
            <Text style={styles.emptyText}>Try refreshing the app to restore dashboard sections.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {cards.map((card) => (
              <Pressable
                key={card.id}
                onPress={() => router.push(card.route as never)}
                style={({ pressed }) => [styles.moduleCard, pressed && styles.moduleCardPressed]}
              >
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons name={card.icon as any} size={20} color="#16A34A" />
                </View>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
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
    paddingBottom: 36,
    gap: 14,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    shadowColor: '#0F5132',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  kicker: {
    color: '#16A34A',
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  heroTitle: {
    marginTop: 6,
    color: '#064E3B',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
  },
  heroSubtitle: {
    marginTop: 10,
    color: '#475569',
    lineHeight: 20,
  },
  sectionHeader: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionMeta: {
    color: '#16A34A',
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    minHeight: 132,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  moduleCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    marginBottom: 10,
  },
  cardTitle: {
    color: '#064E3B',
    fontWeight: '800',
    fontSize: 15,
  },
  cardSubtitle: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 12,
    lineHeight: 17,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skeletonCard: {
    width: '48%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    minHeight: 132,
    gap: 10,
  },
  skeletonIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  skeletonLine: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    width: '92%',
  },
  emptyState: {
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
    fontSize: 16,
    fontWeight: '800',
  },
  emptyText: {
    color: '#64748B',
    textAlign: 'center',
  },
});
