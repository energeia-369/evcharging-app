import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { stationId, connectorName, dateLabel, slotTime, totalPrice, tokenRewards, vehicleName, bookingId } =
    useLocalSearchParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    const timer = setTimeout(() => {
      if (countdown === 0) {
        router.push('/');
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [countdown, router]);

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Success Animation Area */}
        <View style={styles.successSection}>
          <View style={styles.checkmarkCircle}>
            <MaterialCommunityIcons
              name="check-circle"
              size={100}
              color="#10b981"
            />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSubtitle}>
            Your charging slot has been booked
          </Text>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Booking Confirmation Card */}
          <View style={styles.confirmationCard}>
            <View style={styles.confirmationHeader}>
              <MaterialCommunityIcons
                name="check-all"
                size={20}
                color="#10b981"
              />
              <Text style={styles.confirmationTitle}>Booking Confirmed</Text>
            </View>

            <View style={styles.confirmationContent}>
              {/* Booking ID */}
              <View style={styles.idSection}>
                <Text style={styles.idLabel}>Booking ID</Text>
                <Text style={styles.idValue}>{bookingId}</Text>
              </View>

              {/* Details Grid */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="lightning-bolt"
                    size={16}
                    color="#10b981"
                  />
                  <Text style={styles.detailLabel}>Connector</Text>
                  <Text style={styles.detailValue}>{connectorName}</Text>
                </View>

                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={16}
                    color="#10b981"
                  />
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{dateLabel}</Text>
                </View>

                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color="#10b981"
                  />
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailValue}>{slotTime}</Text>
                </View>

                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="car-electric"
                    size={16}
                    color="#10b981"
                  />
                  <Text style={styles.detailLabel}>Vehicle</Text>
                  <Text style={styles.detailValue}>{vehicleName}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Payment Confirmation */}
          <View style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentLabel}>Amount Paid</Text>
              <Text style={styles.paymentValue}>Rs. {totalPrice}</Text>
            </View>
            <Text style={styles.paymentSubtext}>
              via Credit Card
            </Text>
          </View>

          {/* Rewards Earned */}
          {tokenRewards && (
            <View style={styles.rewardsCard}>
              <View style={styles.rewardsHeader}>
                <MaterialCommunityIcons
                  name="gift-outline"
                  size={20}
                  color="#f59e0b"
                />
                <View style={styles.rewardsContent}>
                  <Text style={styles.rewardsLabel}>Rewards Earned</Text>
                  <Text style={styles.rewardsValue}>
                    +{tokenRewards} EV Tokens
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Next Steps */}
          <View style={styles.stepsCard}>
            <Text style={styles.stepsTitle}>What's Next?</Text>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View>
                <Text style={styles.stepLabel}>Arrive at Station</Text>
                <Text style={styles.stepDescription}>
                  Come 5-10 minutes before your slot
                </Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View>
                <Text style={styles.stepLabel}>Connect Vehicle</Text>
                <Text style={styles.stepDescription}>
                  Use your booking ID to start charging
                </Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View>
                <Text style={styles.stepLabel}>Monitor Charging</Text>
                <Text style={styles.stepDescription}>
                  Check progress via the Energeia app
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleGoHome}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="home"
              size={20}
              color="#ffffff"
            />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>

          {/* Auto-redirect Info */}
          <Text style={styles.redirectText}>
            Redirecting to home in {countdown} seconds...
          </Text>
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
  successSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#f0fdf4',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  checkmarkCircle: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#059669',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  confirmationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  confirmationContent: {
    gap: 14,
  },
  idSection: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    alignItems: 'center',
  },
  idLabel: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
    marginBottom: 4,
  },
  idValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
    fontFamily: 'monospace',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailItem: {
    width: '48%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '500',
    marginVertical: 4,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
  },
  paymentCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  paymentLabel: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
  },
  paymentSubtext: {
    fontSize: 11,
    color: '#059669',
  },
  rewardsCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rewardsContent: {
    flex: 1,
  },
  rewardsLabel: {
    fontSize: 12,
    color: '#b45309',
    fontWeight: '500',
  },
  rewardsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f59e0b',
  },
  stepsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 14,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 12,
    color: '#9ca3af',
  },
  homeButton: {
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
    marginBottom: 12,
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  redirectText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
