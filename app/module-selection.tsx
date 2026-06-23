import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ModuleType = 
  | 'ev_charging'
  | 'oasis_cafe'
  | 'ev_service'
  | 'fleet_management'
  | 'ev_showroom'
  | 'dealership';

interface Module {
  id: ModuleType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const modules: Module[] = [
  {
    id: 'ev_charging',
    title: 'EV Charging Station',
    description: 'Find charging stations, view live socket availability and charge your EV',
    icon: 'power-plug',
    color: '#10b981',
  },
  {
    id: 'oasis_cafe',
    title: 'Oasis Cafe',
    description: 'Operate and manage cafe services',
    icon: 'coffee',
    color: '#f59e0b',
  },
  {
    id: 'ev_service',
    title: 'EV Service Center',
    description: 'Manage vehicle maintenance and repairs',
    icon: 'wrench',
    color: '#0891b2',
  },
  {
    id: 'fleet_management',
    title: 'Fleet Management Dashboard',
    description: 'Register vehicles, add drivers, verify docs, and manage fleet',
    icon: 'car-multiple',
    color: '#8b5cf6',
  },
  {
    id: 'ev_showroom',
    title: 'EV Car Service Center & Showroom',
    description: 'Display vehicles and manage sales operations',
    icon: 'store',
    color: '#d97706',
  },
  {
    id: 'dealership',
    title: 'Dealership & Franchise',
    description: 'Manage dealership network and franchise operations',
    icon: 'shopping-outline',
    color: '#dc2626',
  },
];

export default function ModuleSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const role = (params?.role as string) || 'customer';

  // Filter modules based on selected role
  const filteredModules = useMemo(() => {
    if (role === 'customer') {
      // Customer gets EV Charging Station and Fleet Service (Trip Booking)
      return modules.filter(m => m.id === 'ev_charging' || m.id === 'fleet_management');
    }
    if (role === 'fleet_manager') {
      return modules.filter(m => m.id === 'fleet_management' || m.id === 'ev_charging');
    }
    if (role === 'service_manager') {
      return modules.filter(m => m.id === 'ev_service');
    }
    if (role === 'franchise_owner') {
      return modules.filter(m => m.id === 'dealership' || m.id === 'oasis_cafe' || m.id === 'ev_showroom');
    }
    return modules;
  }, [role]);

  const [selectedModules, setSelectedModules] = useState<ModuleType[]>([]);

  const toggleModule = (moduleId: ModuleType) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleContinue = () => {
    if (selectedModules.length === 0) {
      alert('Please select at least one module to continue');
      return;
    }
    
    // For Customer, if they choose Fleet Service, redirect them to Fleet Management welcome screen to login/register
    if (role === 'customer') {
      if (selectedModules.includes('fleet_management') && !selectedModules.includes('ev_charging')) {
        router.push('/fleet-management?role=customer');
        return;
      }
      if (selectedModules.includes('ev_charging') && !selectedModules.includes('fleet_management')) {
        router.push('/ev-charging-station');
        return;
      }
      // If both, go to main dashboard tabs
      router.push('/(tabs)');
      return;
    }

    if (selectedModules.length === 1 && selectedModules[0] === 'ev_charging') {
      router.push('/ev-charging-station');
      return;
    }

    if (selectedModules.length === 1 && selectedModules[0] === 'oasis_cafe') {
      router.push('/oasis-cafe');
      return;
    }

    if (selectedModules.length === 1 && selectedModules[0] === 'ev_service') {
      router.push('/ev-service' as any);
      return;
    }

    if (selectedModules.length === 1 && selectedModules[0] === 'fleet_management') {
      router.push('/fleet-management');
      return;
    }

    if (selectedModules.length === 1 && selectedModules[0] === 'ev_showroom') {
      router.push('/ev-showroom');
      return;
    }
    
    router.push('/(tabs)');
  };

  const isModuleSelected = (moduleId: ModuleType) =>
    selectedModules.includes(moduleId);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#059669"
            />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Select Modules</Text>
          <Text style={styles.headerSubtitle}>
            Choose the modules you want to access in your account
          </Text>
        </View>

        {/* Module Cards */}
        <View style={styles.modulesContainer}>
          {filteredModules.map((module) => {
            const isSelected = isModuleSelected(module.id);
            // Custom label for Customer role on Fleet Management
            const displayTitle = (role === 'customer' && module.id === 'fleet_management') 
              ? 'Book Point-to-Point Fleet Service' 
              : module.title;
            const displayDesc = (role === 'customer' && module.id === 'fleet_management')
              ? 'Book instant Pune route rides using electric vehicles'
              : module.description;

            return (
              <TouchableOpacity
                key={module.id}
                activeOpacity={0.7}
                onPress={() => toggleModule(module.id)}
                style={[
                  styles.moduleCard,
                  isSelected && styles.moduleCardSelected,
                ]}
              >
                {/* Checkbox */}
                <View
                  style={[
                    styles.checkbox,
                    isSelected && {
                      backgroundColor: module.color,
                      borderColor: module.color,
                    },
                  ]}
                >
                  {isSelected && (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color="white"
                    />
                  )}
                </View>

                {/* Content */}
                <View style={styles.moduleContent}>
                  {/* Icon */}
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: `${module.color}15`,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={module.icon as any}
                      size={28}
                      color={module.color}
                    />
                  </View>

                  {/* Text Content */}
                  <View style={styles.textContent}>
                    <Text style={styles.moduleTitle}>{displayTitle}</Text>
                    <Text style={styles.moduleDescription}>
                      {displayDesc}
                    </Text>
                  </View>
                </View>

                {/* Right Arrow */}
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={isSelected ? '#10b981' : '#d1d5db'}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Spacing */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {selectedModules.length > 0 && (
          <Text style={styles.selectionCount}>
            {selectedModules.length} module{selectedModules.length !== 1 ? 's' : ''} selected
          </Text>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleContinue}
          style={[
            styles.continueButton,
            selectedModules.length === 0 && styles.continueButtonDisabled,
          ]}
        >
          <Text style={styles.continueButtonText}>Continue to Dashboard</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

        {selectedModules.length === 0 && (
          <Text style={styles.selectionHint}>
            Please select at least one module
          </Text>
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
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 28,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: 80,
  },
  backButtonText: {
    marginLeft: 8,
    color: '#059669',
    fontSize: 16,
    fontWeight: '600',
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
  modulesContainer: {
    gap: 12,
  },
  moduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moduleCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
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
  selectionCount: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
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
