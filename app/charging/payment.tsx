import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
  details: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'upi',
    name: 'UPI',
    icon: 'qrcode-scan',
    color: '#7c3aed',
    details: 'Google Pay, PhonePe, Paytm',
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: 'credit-card',
    color: '#0ea5e9',
    details: 'Visa, Mastercard, RuPay',
  },
  {
    id: 'wallet',
    name: 'Wallet',
    icon: 'wallet-outline',
    color: '#06b6d4',
    details: 'Digital wallet balance',
  },
  {
    id: 'tokens',
    name: 'Token Balance',
    icon: 'lightning-bolt',
    color: '#f59e0b',
    details: 'Use EV reward tokens',
  },
];

export default function PaymentScreen() {
  const router = useRouter();
  const { stationId, connectorName, dateLabel, slotTime, selectedDuration, totalPrice, tokenRewards, vehicleName } =
    useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCompletePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      // Navigate to live charging after animation
      setTimeout(() => {
        router.push({
          pathname: '/charging/live-charging',
          params: {
            stationId,
            connectorName,
            dateLabel,
            slotTime,
            totalPrice,
            tokenRewards,
            vehicleName,
            bookingId: `EV-${Date.now().toString().slice(-8)}`,
          },
        });
      }, 2000);
    }, 2000);
  };

  const selectedPaymentMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Success Modal */}
      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successCheckmark}>
              <MaterialCommunityIcons
                name="check-circle"
                size={80}
                color="#10b981"
              />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successSubtext}>
              Preparing your charging session...
            </Text>
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Amount Section */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Total Amount Due</Text>
            <Text style={styles.amountValue}>Rs. {totalPrice}</Text>
            <Text style={styles.amountSubtext}>
              For {vehicleName} - {selectedDuration}
            </Text>
          </View>

          {/* Order Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIcon}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={16}
                  color="#10b981"
                />
              </View>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryLabel}>Charging Type</Text>
                <Text style={styles.summaryValue}>{connectorName}</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <View style={styles.summaryIcon}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={16}
                  color="#10b981"
                />
              </View>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryLabel}>Date & Time</Text>
                <Text style={styles.summaryValue}>
                  {dateLabel} at {slotTime}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.methodsSection}>
            <Text style={styles.methodsTitle}>Select Payment Method</Text>

            <View style={styles.methodsGrid}>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    selectedMethod === method.id && styles.methodCardSelected,
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.methodIconBg,
                      {
                        backgroundColor: `${method.color}15`,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={method.icon as any}
                      size={24}
                      color={method.color}
                    />
                  </View>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDetails}>{method.details}</Text>
                  {selectedMethod === method.id && (
                    <View style={styles.methodCheckmark}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={method.color}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Security Info */}
          <View style={styles.securityCard}>
            <View style={styles.securityItem}>
              <MaterialCommunityIcons
                name="shield-check"
                size={16}
                color="#10b981"
              />
              <Text style={styles.securityText}>
                Your payment is encrypted and secure
              </Text>
            </View>
            <View style={styles.securityItem}>
              <MaterialCommunityIcons
                name="lock"
                size={16}
                color="#10b981"
              />
              <Text style={styles.securityText}>
                PCI DSS Level 1 compliant payment gateway
              </Text>
            </View>
          </View>

          {/* Complete Payment Button */}
          <TouchableOpacity
            style={[
              styles.payButton,
              isProcessing && styles.payButtonDisabled,
            ]}
            onPress={handleCompletePayment}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <>
                <MaterialCommunityIcons
                  name="loading"
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.payButtonText}>Processing...</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.payButtonText}>Complete Payment (Rs. {totalPrice})</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.termsText}>
            By clicking Complete Payment, you agree to our Terms of Service and
            Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    maxWidth: 300,
  },
  successCheckmark: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 28,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 42,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  amountSubtext: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#f0f2f5',
  },
  methodsSection: {
    marginBottom: 28,
  },
  methodsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  methodCard: {
    width: '48%',
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e8e8e8',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  methodCardSelected: {
    borderColor: '#1a1a1a',
    backgroundColor: '#f8f9fa',
  },
  methodIconBg: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  methodDetails: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  methodCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  securityCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    lineHeight: 18,
  },
  payButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  payButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowColor: '#000',
    shadowOpacity: 0,
  },
  payButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  termsText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
