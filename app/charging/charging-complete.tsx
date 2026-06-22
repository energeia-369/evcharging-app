import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChargingCompleteScreen() {
  const router = useRouter();
  const { stationId, connectorName, vehicleName, bookingId, batteryLevel, chargingTime, energyDelivered, runningCost } =
    useLocalSearchParams();

  const handleFinish = () => {
    router.push('/charging/stations-list');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e27" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Success Section */}
        <View style={styles.successSection}>
          <View style={styles.checkmarkContainer}>
            <MaterialCommunityIcons
              name="check-circle"
              size={100}
              color="#10b981"
            />
          </View>
          <Text style={styles.successTitle}>Charging Complete!</Text>
          <Text style={styles.successSubtitle}>
            Your vehicle is fully charged
          </Text>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons
                  name="battery-charging"
                  size={24}
                  color="#10b981"
                />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Battery Level</Text>
                  <Text style={styles.summaryValue}>{batteryLevel}%</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons
                  name="clock"
                  size={24}
                  color="#0ea5e9"
                />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Time Charged</Text>
                  <Text style={styles.summaryValue}>{chargingTime}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={24}
                  color="#f59e0b"
                />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Energy Delivered</Text>
                  <Text style={styles.summaryValue}>{energyDelivered} kWh</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons
                  name="currency-usd"
                  size={24}
                  color="#ec4899"
                />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Total Cost</Text>
                  <Text style={styles.summaryValue}>Rs. {runningCost}</Text>
                </View>
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

          {/* Benefits Card */}
          <View style={styles.benefitsCard}>
            <View style={styles.benefitItem}>
              <MaterialCommunityIcons
                name="gift"
                size={20}
                color="#10b981"
              />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitLabel}>Tokens Earned</Text>
                <Text style={styles.benefitValue}>+500 EV Tokens</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.benefitItem}>
              <MaterialCommunityIcons
                name="leaf"
                size={20}
                color="#10b981"
              />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitLabel}>CO₂ Saved</Text>
                <Text style={styles.benefitValue}>15 kg</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.invoiceButton}
              onPress={() => router.push('/charging/invoice')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="receipt"
                size={20}
                color="#10b981"
              />
              <Text style={styles.invoiceButtonText}>View Invoice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={handleFinish}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="home"
                size={20}
                color="#ffffff"
              />
              <Text style={styles.homeButtonText}>Go Home</Text>
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
  successSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryRow: {
    paddingVertical: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
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
  benefitsCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  benefitContent: {
    flex: 1,
  },
  benefitLabel: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    marginBottom: 2,
  },
  benefitValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  invoiceButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#10b981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  invoiceButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  homeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  homeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
