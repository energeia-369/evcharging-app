import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type CafeFeature = {
  title: string;
  description: string;
  icon: string;
  accent: string;
  route?: string;
};

const features: CafeFeature[] = [
  {
    title: 'View Menu',
    description: 'Browse food, beverages, and special combos with clear pricing.',
    icon: 'book-open-variant',
    accent: '#16A34A',
    route: '/oasis-cafe-view-menu',
  },
  {
    title: 'QR / Table Order',
    description: 'Let customers scan a table code and place orders from their seat.',
    icon: 'qrcode-scan',
    accent: '#0EA5E9',
    route: '/oasis-cafe-table-order',
  },
  {
    title: 'Add to Cart',
    description: 'Collect items, adjust quantity, and review the full bill before checkout.',
    icon: 'cart-outline',
    accent: '#F59E0B',
    route: '/oasis-cafe-cart',
  },
  {
    title: 'Place Order',
    description: 'Send the order to kitchen or counter with one confirmation action.',
    icon: 'clipboard-check-outline',
    accent: '#8B5CF6',
    route: '/oasis-cafe-place-order',
  },
  {
    title: 'POS Billing',
    description: 'Handle dine-in, take-away, and counter billing in one smooth flow.',
    icon: 'point-of-sale',
    accent: '#EF4444',
    route: '/oasis-cafe-pos-billing',
  },
  {
    title: 'Payment / Receipt',
    description: 'Accept UPI, card, or cash and generate a clean invoice or receipt.',
    icon: 'receipt-text-outline',
    accent: '#14B8A6',
    route: '/oasis-cafe-payment-receipt',
  },
];

export default function OasisCafeScreen() {
  const router = useRouter();

  const handleFeaturePress = (feature: CafeFeature) => {
    if (feature.route) {
      router.push(feature.route as any);
      return;
    }

    Alert.alert('Coming soon', `${feature.title} feature is under setup.`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8ED" />

      <View style={styles.hero}>
        <View style={styles.heroGlowLeft} />
        <View style={styles.heroGlowRight} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.85}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#7C2D12" />
          </TouchableOpacity>

          <View style={styles.titleWrap}>
            <Text style={styles.eyebrow}>Module Preview</Text>
            <Text style={styles.title}>Oasis Cafe</Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Open</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Manage cafe operations from menu browsing to QR ordering, billing, and receipts.
        </Text>

        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Core features</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>POS</Text>
            <Text style={styles.statLabel}>Billing ready</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>QR</Text>
            <Text style={styles.statLabel}>Table orders</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionKicker}>Feature set</Text>
          <Text style={styles.sectionTitle}>What this module does</Text>
        </View>

        {features.map((feature) => (
          <TouchableOpacity
            key={feature.title}
            style={styles.featureCard}
            activeOpacity={0.85}
            onPress={() => handleFeaturePress(feature)}
          >
            <View style={[styles.featureIconWrap, { backgroundColor: `${feature.accent}14` }]}>
              <MaterialCommunityIcons name={feature.icon as any} size={24} color={feature.accent} />
            </View>

            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>

            <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
          </TouchableOpacity>
        ))}

        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Ready to turn this on?</Text>
          <Text style={styles.actionDescription}>
            You can connect these feature cards to menu, cart, billing, and receipt screens later.
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.9} onPress={() => router.back()}>
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.9}
              onPress={() => router.push('/oasis-cafe-view-menu')}
            >
              <Text style={styles.primaryButtonText}>Open module</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8ED',
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: '#FFF4E6',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroGlowLeft: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 160,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    top: -90,
    left: -70,
  },
  heroGlowRight: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 130,
    backgroundColor: 'rgba(22, 163, 74, 0.12)',
    right: -50,
    bottom: -50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C2D12',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  titleWrap: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#B45309',
    marginBottom: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#431407',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#22C55E',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9A3412',
  },
  subtitle: {
    marginTop: 14,
    color: '#7C2D12',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#431407',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#7C2D12',
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 34,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionKicker: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#B45309',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#431407',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FCD9B6',
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#431407',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#431407',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#7C2D12',
    fontWeight: '500',
  },
  actionCard: {
    marginTop: 8,
    backgroundColor: '#FFF7ED',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FCD9B6',
    padding: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#431407',
    marginBottom: 6,
  },
  actionDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#7C2D12',
    marginBottom: 14,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  secondaryButtonText: {
    color: '#9A3412',
    fontWeight: '800',
    fontSize: 14,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#F97316',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
