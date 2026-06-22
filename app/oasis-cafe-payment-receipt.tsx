import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

import {
    CafeCartItem,
    clearCafeCart,
    getCafeCartItems,
    subscribeCafeCart,
} from '@/lib/oasis-cafe-cart';

type PaymentMethod = 'UPI' | 'Card' | 'Cash';

type ReceiptData = {
  receiptId: string;
  paidAt: string;
  itemCount: number;
  paymentMethod: PaymentMethod;
  subtotal: number;
  gst: number;
  convenienceFee: number;
  tip: number;
  grandTotal: number;
  customerName: string;
};

const formatCurrency = (value: number) => `Rs. ${value.toFixed(2)}`;

export default function OasisCafePaymentReceiptScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const routePaymentMethod = params.paymentMethod as PaymentMethod | undefined;
  const [items, setItems] = useState<CafeCartItem[]>(getCafeCartItems());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    routePaymentMethod === 'UPI' || routePaymentMethod === 'Card' || routePaymentMethod === 'Cash'
      ? routePaymentMethod
      : 'UPI'
  );
  const [tipPercent, setTipPercent] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeCafeCart(() => {
      setItems([...getCafeCartItems()]);
    });

    return unsubscribe;
  }, []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const gst = Math.round(subtotal * 0.05);
  const convenienceFee = paymentMethod === 'UPI' ? 0 : 12;
  const tip = Math.round((subtotal * tipPercent) / 100);
  const grandTotal = subtotal + gst + convenienceFee + tip;

  const processPayment = () => {
    if (itemCount === 0) {
      Alert.alert(
        'No items to bill',
        'Add items in cart first, then proceed with payment.',
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

    const receiptData: ReceiptData = {
      receiptId: `RCPT-${Date.now().toString().slice(-6)}`,
      paidAt: new Date().toLocaleString(),
      itemCount,
      paymentMethod,
      subtotal,
      gst,
      convenienceFee,
      tip,
      grandTotal,
      customerName: customerName.trim(),
    };

    setReceipt(receiptData);
    clearCafeCart();
  };

  const handleShareReceipt = () => {
    if (!receipt) {
      return;
    }

    Alert.alert(
      'Receipt Ready',
      `Receipt ${receipt.receiptId} is ready to share with customer.`
    );
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
          <Text style={styles.title}>Payment / Receipt</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Secure</Text>
        </View>
      </View>

      {receipt ? (
        <View style={styles.receiptWrap}>
          <View style={styles.successIconWrap}>
            <MaterialCommunityIcons name="check-circle" size={42} color="#16A34A" />
          </View>
          <Text style={styles.successTitle}>Payment Successful</Text>
          <Text style={styles.successSubTitle}>Receipt ID: {receipt.receiptId}</Text>

          <View style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Customer</Text>
              <Text style={styles.receiptValue}>{receipt.customerName || 'Walk-in'}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Items</Text>
              <Text style={styles.receiptValue}>{receipt.itemCount}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Payment</Text>
              <Text style={styles.receiptValue}>{receipt.paymentMethod}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Paid At</Text>
              <Text style={styles.receiptValue}>{receipt.paidAt}</Text>
            </View>
            <View style={styles.receiptDivider} />
            <View style={styles.receiptRow}>
              <Text style={styles.receiptTotalLabel}>Total</Text>
              <Text style={styles.receiptTotalValue}>{formatCurrency(receipt.grandTotal)}</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleShareReceipt} activeOpacity={0.9}>
              <Text style={styles.secondaryButtonText}>Share Receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/oasis-cafe')} activeOpacity={0.9}>
              <Text style={styles.primaryButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Customer Name</Text>
            <TextInput
              style={styles.input}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Optional: Enter customer name"
              placeholderTextColor="#C2410C"
            />
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
            <Text style={styles.cardTitle}>Tip</Text>
            <View style={styles.chipRow}>
              {[0, 5, 10].map((percent) => (
                <TouchableOpacity
                  key={percent}
                  style={[styles.chip, tipPercent === percent && styles.chipActive]}
                  onPress={() => setTipPercent(percent)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.chipText, tipPercent === percent && styles.chipTextActive]}>
                    {percent === 0 ? 'No Tip' : `${percent}%`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (5%)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(gst)}</Text>
            </View>
            {convenienceFee > 0 ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Convenience Fee</Text>
                <Text style={styles.summaryValue}>{formatCurrency(convenienceFee)}</Text>
              </View>
            ) : null}
            {tip > 0 ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tip</Text>
                <Text style={styles.summaryValue}>{formatCurrency(tip)}</Text>
              </View>
            ) : null}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(grandTotal)}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.payButton} onPress={processPayment} activeOpacity={0.9}>
            <MaterialCommunityIcons name="credit-card-check-outline" size={18} color="#FFFFFF" />
            <Text style={styles.payButtonText}>Process Payment</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
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
  badge: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FED7AA',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
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
  input: {
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
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  chipText: {
    color: '#9A3412',
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#FFFFFF',
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
  payButton: {
    borderRadius: 14,
    backgroundColor: '#14B8A6',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  receiptWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  successIconWrap: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#ECFEFF',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    textAlign: 'center',
    color: '#134E4A',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 3,
  },
  successSubTitle: {
    textAlign: 'center',
    color: '#0F766E',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    padding: 14,
    marginBottom: 12,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptLabel: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '600',
  },
  receiptValue: {
    color: '#134E4A',
    fontSize: 13,
    fontWeight: '800',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#CCFBF1',
    marginVertical: 8,
  },
  receiptTotalLabel: {
    color: '#134E4A',
    fontSize: 15,
    fontWeight: '800',
  },
  receiptTotalValue: {
    color: '#0F766E',
    fontSize: 16,
    fontWeight: '900',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2DD4BF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#0F766E',
    fontSize: 14,
    fontWeight: '800',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});