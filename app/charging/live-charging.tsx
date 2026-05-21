import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LiveChargingScreen() {
  const router = useRouter();
  const { stationId, connectorName, vehicleName, bookingId, totalPrice } = useLocalSearchParams();
  const [batteryLevel, setBatteryLevel] = useState(15);
  const [chargingTime, setChargingTime] = useState(0);
  const [isCharging, setIsCharging] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [energyDelivered, setEnergyDelivered] = useState(2.25); // kWh
  const [runningCost, setRunningCost] = useState(0);

  // Charging parameters (Tesla-like)
  const pricePerKwh = 0.15;
  const chargingSpeedKw = 13;
  const maxChargingCurrent = 32.5;

  useEffect(() => {
    if (!isCharging || isPaused) return;

    const chargingInterval = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev >= 100) {
          setIsCharging(false);
          return 100;
        }
        return prev + 0.5;
      });

      setChargingTime((prev) => prev + 1);

      // Energy delivered calculation: Power (kW) * Time (hours)
      setEnergyDelivered((prev) => prev + (chargingSpeedKw / 3600));

      // Running cost calculation
      setRunningCost((prev) => prev + (chargingSpeedKw * pricePerKwh) / 3600);
    }, 1000);

    return () => clearInterval(chargingInterval);
  }, [isCharging, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate charging current based on battery level
  const chargingCurrent = Math.max(maxChargingCurrent * (1 - batteryLevel / 150), 5);

  // Calculate charging speed (kW) based on current battery level
  const effectiveChargingSpeed = (chargingCurrent * 400) / 1000; // Current (A) * Voltage (V) / 1000

  const estimatedCompletionTime = Math.round(((100 - batteryLevel) / 0.5) * 1000) / 1000;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#0a0e27" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Charging</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Circular Progress Section */}
          <View style={styles.circularProgressSection}>
            <View style={styles.circularProgressContainer}>
              {/* Background Circle */}
              <View style={styles.circleBackground} />

              {/* Progress Circle (animated) */}
              <View
                style={[
                  styles.circleProgress,
                  {
                    borderColor: isPaused ? '#f59e0b' : '#10b981',
                    opacity: isPaused ? 0.6 : 1,
                  },
                ]}
              />

              {/* Center Content */}
              <View style={styles.circleCenter}>
                <Text style={styles.batteryPercentage}>{Math.round(batteryLevel)}%</Text>
                <Text style={styles.batteryLabel}>Battery</Text>
              </View>
            </View>

            {/* Status below circle */}
            <View style={styles.statusInfo}>
              <View style={styles.statusItem}>
                <MaterialCommunityIcons
                  name={isPaused ? 'pause-circle' : 'lightning-bolt'}
                  size={20}
                  color={isPaused ? '#f59e0b' : '#10b981'}
                />
                <Text style={styles.statusLabel}>
                  {isPaused ? 'Paused' : 'Charging'}
                </Text>
              </View>
            </View>
          </View>

          {/* Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricIconBg}>
                <MaterialCommunityIcons
                  name="speedometer"
                  size={20}
                  color="#10b981"
                />
              </View>
              <Text style={styles.metricLabel}>Charging Speed</Text>
              <Text style={styles.metricValue}>{effectiveChargingSpeed.toFixed(1)} kW</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIconBg}>
                <MaterialCommunityIcons
                  name="clock"
                  size={20}
                  color="#0ea5e9"
                />
              </View>
              <Text style={styles.metricLabel}>Time Elapsed</Text>
              <Text style={styles.metricValue}>{formatTime(chargingTime)}</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIconBg}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={20}
                  color="#f59e0b"
                />
              </View>
              <Text style={styles.metricLabel}>Energy Delivered</Text>
              <Text style={styles.metricValue}>{energyDelivered.toFixed(2)} kWh</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIconBg}>
                <MaterialCommunityIcons
                  name="currency-usd"
                  size={20}
                  color="#ec4899"
                />
              </View>
              <Text style={styles.metricLabel}>Running Cost</Text>
              <Text style={styles.metricValue}>Rs. {runningCost.toFixed(2)}</Text>
            </View>
          </View>

          {/* Live Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Current</Text>
                <Text style={styles.statValue}>{chargingCurrent.toFixed(1)} A</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Voltage</Text>
                <Text style={styles.statValue}>400 V</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Power</Text>
                <Text style={styles.statValue}>{effectiveChargingSpeed.toFixed(1)} kW</Text>
              </View>
            </View>
          </View>

          {/* Session Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Session Details</Text>

            <View style={styles.detailRow}>
              <View style={styles.detailRowLeft}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={18}
                  color="#0ea5e9"
                />
                <Text style={styles.detailRowLabel}>Station</Text>
              </View>
              <Text style={styles.detailRowValue}>Station #{stationId}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailRowLeft}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={18}
                  color="#0ea5e9"
                />
                <Text style={styles.detailRowLabel}>Connector</Text>
              </View>
              <Text style={styles.detailRowValue}>{connectorName}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailRowLeft}>
                <MaterialCommunityIcons
                  name="car-electric"
                  size={18}
                  color="#0ea5e9"
                />
                <Text style={styles.detailRowLabel}>Vehicle</Text>
              </View>
              <Text style={styles.detailRowValue}>{vehicleName}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailRowLeft}>
                <MaterialCommunityIcons
                  name="ticket-confirmation"
                  size={18}
                  color="#0ea5e9"
                />
                <Text style={styles.detailRowLabel}>Booking ID</Text>
              </View>
              <Text style={styles.bookingId}>{bookingId}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                isPaused ? styles.pauseButtonActive : styles.pauseButton,
              ]}
              onPress={() => setIsPaused(!isPaused)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={isPaused ? 'play' : 'pause'}
                size={20}
                color={isPaused ? '#ffffff' : '#f59e0b'}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  isPaused && styles.actionButtonTextActive,
                ]}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.stopButton}
              onPress={() =>
                router.push({
                  pathname: '/charging/charging-complete',
                  params: {
                    stationId,
                    connectorName,
                    vehicleName,
                    bookingId,
                    batteryLevel: Math.round(batteryLevel),
                    chargingTime: formatTime(chargingTime),
                    energyDelivered: energyDelivered.toFixed(2),
                    runningCost: runningCost.toFixed(2),
                  },
                })
              }
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="stop-circle"
                size={20}
                color="#ffffff"
              />
              <Text style={styles.stopButtonText}>Stop Charging</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
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
    backgroundColor: '#0a0e27',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  // Circular Progress Section
  circularProgressSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  circularProgressContainer: {
    position: 'relative',
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  circleBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 120,
    borderWidth: 12,
    borderColor: '#1a1a2e',
  },
  circleProgress: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 120,
    borderWidth: 12,
    borderColor: '#10b981',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  circleCenter: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 120,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
  },
  batteryPercentage: {
    fontSize: 64,
    fontWeight: '700',
    color: '#10b981',
  },
  batteryLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  statusInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metricIconBg: {
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  // Stats Card
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e8e8e8',
  },
  // Details Card
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailRowLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  detailRowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  bookingId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8',
  },
  // Button Container
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#f59e0b',
    backgroundColor: '#transparent',
  },
  pauseButton: {
    backgroundColor: 'transparent',
    borderColor: '#f59e0b',
  },
  pauseButtonActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f59e0b',
  },
  actionButtonTextActive: {
    color: '#ffffff',
  },
  stopButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  stopButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
