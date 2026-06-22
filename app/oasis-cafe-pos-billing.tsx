import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { CafeCartItem, getCafeCartItems, subscribeCafeCart } from '@/lib/oasis-cafe-cart';

type BillingMode = 'Dine-in' | 'Take-away' | 'Counter';
type PaymentMethod = 'UPI' | 'Card' | 'Cash';

type GeneratedBill = {
  billId: string;
  mode: BillingMode;
  payment: PaymentMethod;
  itemCount: number;
  subtotal: number;
  discount: number;
  gst: number;
  serviceCharge: number;
  total: number;
};

const formatCurrency = (value: number) => `Rs. ${value.toFixed(2)}`;

export default function OasisCafePosBillingScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CafeCartItem[]>(getCafeCartItems());
  const [billingMode, setBillingMode] = useState<BillingMode>('Counter');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [generatedBill, setGeneratedBill] = useState<GeneratedBill | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeCafeCart(() => {
      setItems([...getCafeCartItems()]);
    });

    return unsubscribe;
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const gst = Math.round(discountedSubtotal * 0.05);
  const serviceCharge = billingMode === 'Dine-in' ? Math.round(discountedSubtotal * 0.03) : 0;
  const total = discountedSubtotal + gst + serviceCharge;

  const applyDiscountCode = () => {
    const normalized = discountCode.trim().toUpperCase();

    if (!normalized) {
      Alert.alert('Add code', 'Please enter a discount code.');
      return;
    }

    if (normalized === 'CAFE10') {
      setDiscountPercent(10);
      Alert.alert('Discount applied', 'CAFE10 applied: 10% off on subtotal.');
      return;
    }

    if (normalized === 'CAFE5') {
      setDiscountPercent(5);
      Alert.alert('Discount applied', 'CAFE5 applied: 5% off on subtotal.');
      return;
    }

    setDiscountPercent(0);
    Alert.alert('Invalid code', 'Try CAFE10 or CAFE5.');
  };

  const generateBill = () => {
    if (itemCount === 0) {
      Alert.alert(
        'No items found',
        'Add items to cart first, then generate POS bill.',
        [
          {
            text: 'Go to Menu',
            onPress: () => router.push('/oasis-cafe-view-menu'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    setGeneratedBill({
      billId: `BILL-${Date.now().toString().slice(-6)}`,
      mode: billingMode,
      payment: paymentMethod,
      itemCount,
      subtotal,
      discount: discountAmount,
      gst,
      serviceCharge,
      total,
    });

    router.push({
      pathname: '/oasis-cafe-payment-receipt',
      params: {
        paymentMethod,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8ED" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.85}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#7C2D12" />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.eyebrow}>Oasis Cafe</Text>
          <Text style={styles.title}>POS Billing</Text>
        </View>

        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>Live</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Billing Mode</Text>
          <View style={styles.chipRow}>
            {(['Dine-in', 'Take-away', 'Counter'] as BillingMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.chip, billingMode === mode && styles.chipActive]}
                onPress={() => setBillingMode(mode)}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, billingMode === mode && styles.chipTextActive]}>{mode}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <View style={styles.chipRow}>
            {(['UPI', 'Card', 'Cash'] as PaymentMethod[]).map((method) => (
              <TouchableOpacity
                key={method}
                style={[styles.chip, paymentMethod === method && styles.chipActive]}
                onPress={() => setPaymentMethod(method)}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, paymentMethod === method && styles.chipTextActive]}>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Discount</Text>
          <View style={styles.discountRow}>
            <TextInput
              style={styles.discountInput}
              value={discountCode}
              onChangeText={setDiscountCode}
              placeholder="Enter code (CAFE10 / CAFE5)"
              placeholderTextColor="#C2410C"
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.applyButton} onPress={applyDiscountCode} activeOpacity={0.9}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          {discountPercent > 0 ? (
            <Text style={styles.discountHint}>Active discount: {discountPercent}%</Text>
          ) : null}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items</Text>
            <Text style={styles.summaryValue}>{itemCount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>
          {discountAmount > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.discountValue}>- {formatCurrency(discountAmount)}</Text>
            </View>
          ) : null}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (5%)</Text>
            <Text style={styles.summaryValue}>{formatCurrency(gst)}</Text>
          </View>
          {serviceCharge > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Charge (3%)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(serviceCharge)}</Text>
            </View>
          ) : null}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Payable Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={generateBill} activeOpacity={0.9}>
          <MaterialCommunityIcons name="receipt-text-check-outline" size={18} color="#FFFFFF" />
          <Text style={styles.generateButtonText}>Generate POS Bill</Text>
        </TouchableOpacity>

        {generatedBill ? (
          <View style={styles.generatedCard}>
            <Text style={styles.generatedTitle}>Bill Generated</Text>
            <Text style={styles.generatedSubTitle}>#{generatedBill.billId}</Text>

            <View style={styles.generatedRow}>
              <Text style={styles.generatedLabel}>Mode</Text>
              <Text style={styles.generatedValue}>{generatedBill.mode}</Text>
            </View>
            <View style={styles.generatedRow}>
              <Text style={styles.generatedLabel}>Payment</Text>
              <Text style={styles.generatedValue}>{generatedBill.payment}</Text>
            </View>
            <View style={styles.generatedRow}>
              <Text style={styles.generatedLabel}>Items</Text>
              <Text style={styles.generatedValue}>{generatedBill.itemCount}</Text>
            </View>
            <View style={styles.generatedDivider} />
            <View style={styles.generatedRow}>
              <Text style={styles.generatedTotalLabel}>Grand Total</Text>
              <Text style={styles.generatedTotalValue}>{formatCurrency(generatedBill.total)}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8ED',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFF4E6',
    borderBottomWidth: 1,
    borderBottomColor: '#FCD9B6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    color: '#B45309',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    color: '#431407',
    fontWeight: '900',
  },
  liveBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  liveBadgeText: {
    color: '#9A3412',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCD9B6',
    padding: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7C2D12',
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FDBA74',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  chipText: {
    color: '#9A3412',
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  discountRow: {
    flexDirection: 'row',
    gap: 8,
  },
  discountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    color: '#431407',
    backgroundColor: '#FFF7ED',
    fontSize: 13,
    fontWeight: '600',
  },
  applyButton: {
    borderRadius: 10,
    backgroundColor: '#EA580C',
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  discountHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#166534',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#FFF4E6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCD9B6',
    padding: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#7C2D12',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#431407',
    fontSize: 14,
    fontWeight: '700',
  },
  discountValue: {
    color: '#166534',
    fontSize: 14,
    fontWeight: '800',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#FED7AA',
    marginVertical: 8,
  },
  totalLabel: {
    color: '#431407',
    fontSize: 16,
    fontWeight: '800',
  },
  totalValue: {
    color: '#166534',
    fontSize: 17,
    fontWeight: '900',
  },
  generateButton: {
    borderRadius: 14,
    backgroundColor: '#DC2626',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  generatedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 14,
  },
  generatedTitle: {
    fontSize: 18,
    color: '#7F1D1D',
    fontWeight: '900',
    marginBottom: 3,
  },
  generatedSubTitle: {
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '700',
    marginBottom: 10,
  },
  generatedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  generatedLabel: {
    color: '#7F1D1D',
    fontSize: 13,
    fontWeight: '600',
  },
  generatedValue: {
    color: '#450A0A',
    fontSize: 13,
    fontWeight: '800',
  },
  generatedDivider: {
    height: 1,
    backgroundColor: '#FECACA',
    marginVertical: 8,
  },
  generatedTotalLabel: {
    color: '#450A0A',
    fontSize: 15,
    fontWeight: '800',
  },
  generatedTotalValue: {
    color: '#B91C1C',
    fontSize: 16,
    fontWeight: '900',
  },
});