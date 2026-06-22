import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  brandName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  welcomeSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 44,
  },
  welcomeDescription: {
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 18,
    lineHeight: 28,
  },
  featureCard: {
    marginTop: 40,
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    flexDirection: 'row',
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  featureText: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
  },
  illustrationContainer: {
    marginTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dcfce7',
    borderRadius: 24,
    paddingVertical: 64,
    borderWidth: 2,
    borderColor: '#a7f3d0',
  },
  illustrationText: {
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  illustrationSubtext: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 8,
  },
  buttonsSection: {
    paddingBottom: 24,
    paddingTop: 32,
  },
  primaryButton: {
    backgroundColor: '#10b981',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#10b981',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  secondaryButtonText: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footerText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    marginTop: 16,
  },
  footerLink: {
    color: '#10b981',
    fontWeight: '600',
  },
});

export default function LandingPage() {
  const router = useRouter();
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(50), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.mainContent}>
        {/* Top Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          {/* Logo and Branding */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons name="lightning-bolt" size={48} color="white" />
            </View>
            <Text style={styles.brandName}>Energeia</Text>
            <Text style={styles.brandSubtitle}>EV Ecosystem Platform</Text>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to Your EV Future</Text>
            <Text style={styles.welcomeDescription}>
              Discover sustainable mobility and connect with our thriving EV community
            </Text>
          </View>

          {/* Platform Description */}
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <MaterialCommunityIcons name="leaf" size={24} color="#10b981" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Clean Energy Mobility</Text>
              <Text style={styles.featureText}>
                Join thousands of EV enthusiasts. Find charging stations, track your emissions, and be part of the sustainable transportation revolution.
              </Text>
            </View>
          </View>

          {/* Illustration Placeholder */}
          <View style={styles.illustrationContainer}>
            <View style={{ alignItems: 'center' }}>
              <MaterialCommunityIcons name="car-electric" size={64} color="#059669" />
              <Text style={styles.illustrationText}>EV Ecosystem Illustration</Text>
              <Text style={styles.illustrationSubtext}>Sustainable Transportation</Text>
            </View>
          </View>
        </Animated.View>

        {/* Bottom Section - Buttons */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          <View style={styles.buttonsSection}>
            {/* Create Account Button */}
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/register')}>
              <View style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Create Account</Text>
              </View>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/login')}>
              <View style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Login</Text>
              </View>
            </TouchableOpacity>

            {/* Footer Text */}
            <Text style={styles.footerText}>
              By continuing, you agree to our <Text style={styles.footerLink}>Terms of Service</Text>
            </Text>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
