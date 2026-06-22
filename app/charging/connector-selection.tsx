import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ConnectorType {
  id: string;
  name: string;
  speed: string;
  chargingTime: string;
  pricePerKwh: number;
  available: number;
  icon: string;
  color: string;
  badge: string;
  description: string;
}

const CONNECTOR_TYPES: ConnectorType[] = [
  {
    id: 'ac',
    name: 'AC Charging',
    speed: '7 kW',
    chargingTime: '6-8 hours',
    pricePerKwh: 0.2,
    available: 3,
    icon: 'lightning-bolt',
    color: '#10b981',
    badge: 'Standard',
    description: 'Ideal for overnight or long-term parking',
  },
  {
    id: 'dc-fast',
    name: 'DC Fast Charging',
    speed: '50 kW',
    chargingTime: '30-40 mins',
    pricePerKwh: 0.45,
    available: 2,
    icon: 'lightning-bolt',
    color: '#f59e0b',
    badge: 'Popular',
    description: '80% charge in 30-40 minutes',
  },
  {
    id: 'super-fast',
    name: 'Super Fast Charging',
    speed: '150 kW',
    chargingTime: '15-20 mins',
    pricePerKwh: 0.7,
    available: 1,
    icon: 'flash',
    color: '#dc2626',
    badge: 'Premium',
    description: '80% charge in just 15-20 minutes',
  },
];

export default function ConnectorSelectionScreen() {
  const router = useRouter();
  const { stationId } = useLocalSearchParams();
  const [selectedConnectorId, setSelectedConnectorId] = useState<string>('ac');
  const [scaleAnims] = useState(
    CONNECTOR_TYPES.reduce(
      (acc, connector) => {
        acc[connector.id] = new Animated.Value(1);
        return acc;
      },
      {} as Record<string, Animated.Value>
    )
  );

  const handleSelectConnector = (connectorId: string) => {
    setSelectedConnectorId(connectorId);

    // Animate scale
    Animated.sequence([
      Animated.timing(scaleAnims[connectorId], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[connectorId], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = () => {
    const selectedConnector = CONNECTOR_TYPES.find(
      (c) => c.id === selectedConnectorId
    );
    router.push({
      pathname: '/charging/slot-booking',
      params: {
        stationId,
        connectorId: selectedConnectorId,
        connectorName: selectedConnector?.name,
      },
    });
  };

  const selectedConnector = CONNECTOR_TYPES.find(
    (c) => c.id === selectedConnectorId
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Connector</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Choose Connector Type</Text>
            <Text style={styles.subtitle}>Select the charging speed you prefer</Text>
          </View>

          {/* Connector Cards */}
          <View style={styles.connectorsGrid}>
            {CONNECTOR_TYPES.map((connector) => (
              <Animated.View
                key={connector.id}
                style={[
                  styles.connectorCardWrapper,
                  {
                    transform: [{ scale: scaleAnims[connector.id] }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.connectorCard,
                    selectedConnectorId === connector.id && styles.connectorCardSelected,
                  ]}
                  onPress={() => handleSelectConnector(connector.id)}
                  activeOpacity={0.8}
                >
                  {/* Badge */}
                  <View
                    style={[
                      styles.connectorBadge,
                      { backgroundColor: connector.color },
                    ]}
                  >
                    <Text style={styles.badgeText}>{connector.badge}</Text>
                  </View>

                  {/* Icon Section */}
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${connector.color}15` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={connector.icon as any}
                      size={40}
                      color={connector.color}
                    />
                  </View>

                  {/* Connector Info */}
                  <Text style={styles.connectorName}>{connector.name}</Text>
                  <Text style={styles.connectorSpeed}>{connector.speed}</Text>

                  {/* Details Grid */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={16}
                        color="#6b7280"
                      />
                      <Text style={styles.detailLabel}>Time</Text>
                      <Text style={styles.detailValue}>{connector.chargingTime}</Text>
                    </View>

                    <View style={styles.detailDivider} />

                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons
                        name="currency-usd"
                        size={16}
                        color="#6b7280"
                      />
                      <Text style={styles.detailLabel}>Price</Text>
                      <Text style={styles.detailValue}>Rs. {connector.pricePerKwh.toFixed(2)}</Text>
                    </View>
                  </View>

                  {/* Availability */}
                  <View style={styles.availabilityBadge}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={14}
                      color="#10b981"
                    />
                    <Text style={styles.availabilityText}>
                      {connector.available} available
                    </Text>
                  </View>

                  {/* Selection Indicator */}
                  {selectedConnectorId === connector.id && (
                    <View style={styles.selectedIndicator}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={24}
                        color="#10b981"
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Selected Connector Info Box */}
          {selectedConnector && (
            <View style={styles.infoBox}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="information"
                  size={20}
                  color="#3b82f6"
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>{selectedConnector.name}</Text>
                <Text style={styles.infoText}>{selectedConnector.description}</Text>
              </View>
            </View>
          )}

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue to Slot Booking</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>

          {/* Footer Info */}
          <View style={styles.footerInfo}>
            <MaterialCommunityIcons
              name="shield-check"
              size={16}
              color="#10b981"
            />
            <Text style={styles.footerText}>All connectors are tested and certified safe</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  connectorsGrid: {
    marginBottom: 24,
    gap: 12,
  },
  connectorCardWrapper: {
    width: '100%',
  },
  connectorCard: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  connectorCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
    shadowColor: '#10b981',
    shadowOpacity: 0.15,
  },
  connectorBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  connectorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  connectorSpeed: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 14,
  },
  detailsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  detailDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    marginBottom: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginBottom: 20,
  },
  infoIcon: {
    paddingTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 18,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
    flex: 1,
  },
});
