import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useAuth } from './fleet-management/AuthContext';

type RoleType = 'customer' | 'admin' | 'fleet_manager' | 'service_manager' | 'franchise_owner';

interface Role {
  id: RoleType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const roles: Role[] = [
  {
    id: 'customer',
    title: 'Customer',
    description: 'Browse EVs, find charging stations, and manage your profile',
    icon: 'account-circle',
    color: '#059669',
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Manage platform, users, and system configuration',
    icon: 'shield-account',
    color: '#0891b2',
  },
  {
    id: 'fleet_manager',
    title: 'Fleet Manager',
    description: 'Oversee vehicle fleet and optimize charging operations',
    icon: 'car-multiple',
    color: '#7c3aed',
  },
  {
    id: 'service_manager',
    title: 'Service Manager',
    description: 'Manage maintenance and service requests',
    icon: 'wrench',
    color: '#d97706',
  },
  {
    id: 'franchise_owner',
    title: 'Franchise Owner',
    description: 'Manage franchise operations and business analytics',
    icon: 'store',
    color: '#dc2626',
  },
];

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const handleRolePress = (roleId: RoleType) => {
    setSelectedRole(roleId);
    // Haptic feedback animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = () => {
    if (!selectedRole) {
      alert('Please select a role to continue');
      return;
    }
    // Admin goes directly to the dedicated admin dashboard
    if (selectedRole === 'admin') {
      router.push('/admin');
    } else {
      router.push({
        pathname: '/module-selection',
        params: { role: selectedRole },
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Role</Text>
          <Text style={styles.headerSubtitle}>
            Select the role that best describes you in the Energeia ecosystem
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.cardsContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              activeOpacity={0.8}
              onPress={() => handleRolePress(role.id)}
              style={[
                styles.roleCard,
                selectedRole === role.id && styles.roleCardSelected,
              ]}
            >
              <Animated.View
                style={[
                  styles.cardContent,
                  selectedRole === role.id && {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                {/* Icon Container */}
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: `${role.color}15`,
                      borderColor: selectedRole === role.id ? role.color : '#e5e7eb',
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={role.icon as any}
                    size={32}
                    color={role.color}
                  />
                </View>

                {/* Role Title */}
                <Text style={styles.roleTitle}>{role.title}</Text>

                {/* Role Description */}
                <Text style={styles.roleDescription}>{role.description}</Text>

                {/* Selection Indicator */}
                {selectedRole === role.id && (
                  <View style={[styles.selectionIndicator, { backgroundColor: role.color }]}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="white"
                    />
                    <Text style={styles.selectionText}>Selected</Text>
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spacing */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleContinue}
          style={[
            styles.continueButton,
            !selectedRole && styles.continueButtonDisabled,
          ]}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

        {!selectedRole && (
          <Text style={styles.selectionHint}>Please select a role above</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  cardsContainer: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    overflow: 'hidden'
  },
  roleCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  roleDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  selectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  selectionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  spacer: {
    height: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  continueButton: {
    backgroundColor: '#10b981',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowColor: '#000',
    shadowOpacity: 0.08,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  selectionHint: {
    marginTop: 12,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
  },
});
