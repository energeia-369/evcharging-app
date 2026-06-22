import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dummy vehicle data
const DUMMY_VEHICLES = [
  { id: '1', name: 'Tesla Model 3', license: 'EV-2024-001' },
  { id: '2', name: 'Chevrolet Bolt', license: 'EV-2024-002' },
];

export default function BookingSummaryScreen() {
  const router = useRouter();

  const {
    stationId,
    connectorName,
    dateLabel,
    slotTime,
    selectedDuration,
    totalPrice,
  } = useLocalSearchParams();

  const selectedVehicle = DUMMY_VEHICLES[0];

  const baseCost = parseFloat(totalPrice as string) || 12.5;
  const taxRate = 0.08;
  const taxAmount = baseCost * taxRate;
  const platformFee = 1.5;
  const finalTotal = baseCost + taxAmount + platformFee;
  const tokenRewards = Math.floor(finalTotal * 5);

  const handleProceedToPayment = () => {
    router.push({
      pathname: '/charging/payment',
      params: {
        stationId,
        connectorName,
        dateLabel,
        slotTime,
        selectedDuration,
        totalPrice: finalTotal.toFixed(2),
        tokenRewards,
        vehicleName: selectedVehicle.name,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#1f2937"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Booking Summary
          </Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>
              Booking Details
            </Text>

            <Text style={styles.subtitle}>
              Review your charging session details
            </Text>
          </View>

          {/* Main Card */}
          <View style={styles.premiumCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBg}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={28}
                  color="#10b981"
                />
              </View>

              <View style={styles.headerContent}>
                <Text style={styles.cardTitle}>
                  Station #{stationId}
                </Text>

                <Text style={styles.cardSubtitle}>
                  {connectorName}
                </Text>
              </View>
            </View>

            {/* Date & Time */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailBox}>
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={18}
                  color="#10b981"
                />

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>
                    Date
                  </Text>

                  <Text style={styles.detailValue}>
                    {dateLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailBox}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={18}
                  color="#10b981"
                />

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>
                    Time
                  </Text>

                  <Text style={styles.detailValue}>
                    {slotTime}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardDivider} />

            {/* Duration & Vehicle */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailBox}>
                <MaterialCommunityIcons
                  name="timer-outline"
                  size={18}
                  color="#10b981"
                />

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>
                    Duration
                  </Text>

                  <Text style={styles.detailValue}>
                    {selectedDuration}
                  </Text>
                </View>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailBox}>
                <MaterialCommunityIcons
                  name="car-electric"
                  size={18}
                  color="#10b981"
                />

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>
                    Vehicle
                  </Text>

                  <Text style={styles.detailValue}>
                    {selectedVehicle.name}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Cost Breakdown */}
          <View style={styles.costCard}>
            <View style={styles.costHeader}>
              <MaterialCommunityIcons
                name="receipt"
                size={20}
                color="#1f2937"
              />

              <Text style={styles.costTitle}>
                Cost Breakdown
              </Text>
            </View>

            <View style={styles.costItems}>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>
                  Base Charging Cost
                </Text>

                <Text style={styles.costValue}>
                  Rs. {baseCost.toFixed(2)}
                </Text>
              </View>

              <View style={styles.costRow}>
                <Text style={styles.costLabel}>
                  Tax (8%)
                </Text>

                <Text style={styles.costValue}>
                  Rs. {taxAmount.toFixed(2)}
                </Text>
              </View>

              <View style={styles.costRow}>
                <Text style={styles.costLabel}>
                  Platform Fee
                </Text>

                <Text style={styles.costValue}>
                  Rs. {platformFee.toFixed(2)}
                </Text>
              </View>

              <View style={styles.costDivider} />

              <View style={styles.costRow}>
                <Text style={styles.totalLabel}>
                  Total Amount
                </Text>

                <Text style={styles.totalValue}>
                  Rs. {finalTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Rewards */}
          <View style={styles.rewardsCard}>
            <View style={styles.rewardsHeader}>
              <View style={styles.rewardsIconBg}>
                <MaterialCommunityIcons
                  name="gift"
                  size={20}
                  color="#f59e0b"
                />
              </View>

              <View>
                <Text style={styles.rewardsTitle}>
                  Earn Rewards
                </Text>

                <Text style={styles.rewardsSubtitle}>
                  You'll earn {tokenRewards} EV tokens
                </Text>
              </View>
            </View>

            <View style={styles.rewardsInfo}>
              <View style={styles.rewardItem}>
                <View style={styles.rewardBullet} />

                <Text style={styles.rewardText}>
                  {tokenRewards} tokens =
                  Rs. {(tokenRewards / 100).toFixed(2)} off
                  next booking
                </Text>
              </View>

              <View style={styles.rewardItem}>
                <View style={styles.rewardBullet} />

                <Text style={styles.rewardText}>
                  Collect 1000 tokens for exclusive EV
                  benefits
                </Text>
              </View>
            </View>
          </View>

          {/* Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="information"
                size={16}
                color="#3b82f6"
              />

              <Text style={styles.infoText}>
                Arrive 5-10 minutes before your
                scheduled time
              </Text>
            </View>

            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="undo"
                size={16}
                color="#f59e0b"
              />

              <Text style={styles.infoText}>
                Free cancellation up to 30 minutes
                before
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleProceedToPayment}
              activeOpacity={0.8}
            >
              <Text style={styles.proceedButtonText}>
                Proceed To Payment
              </Text>

              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color="#ffffff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>
                Back to Slot Selection
              </Text>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },

  premiumCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },

  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },

  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },

  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
  },

  detailBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },

  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 2,
  },

  detailDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 14,
  },

  costCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },

  costHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },

  costTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },

  costItems: {
    gap: 10,
  },

  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  costLabel: {
    fontSize: 13,
    color: '#6b7280',
  },

  costValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },

  costDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },

  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },

  rewardsCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },

  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },

  rewardsIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rewardsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400e',
  },

  rewardsSubtitle: {
    fontSize: 12,
    color: '#b45309',
    marginTop: 2,
  },

  rewardsInfo: {
    gap: 10,
  },

  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  rewardBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f59e0b',
  },

  rewardText: {
    flex: 1,
    fontSize: 12,
    color: '#92400e',
    lineHeight: 18,
  },

  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    gap: 12,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },

  buttonContainer: {
    gap: 12,
  },

  proceedButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10b981',
  },

  proceedButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },

  backButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
});