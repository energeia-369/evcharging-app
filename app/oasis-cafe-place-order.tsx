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

import {
    CafeCartItem,
    getCafeCartItems,
    subscribeCafeCart,
} from '@/lib/oasis-cafe-cart';

type OrderMode = 'Dine-in' | 'Take-away';
type DeliverySpeed = 'Standard' | 'Express';
type PaymentMode = 'Pay at Counter' | 'Prepaid';

type PlacedOrderSnapshot = {
  id: string;
  mode: OrderMode;
  speed: DeliverySpeed;
  payment: PaymentMode;
  note: string;
  itemCount: number;
  total: number;
  etaMinutes: number;
};

const formatCurrency = (value: number) => `Rs. ${value.toFixed(2)}`;

export default function OasisCafePlaceOrderScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CafeCartItem[]>(getCafeCartItems());
  const [orderMode, setOrderMode] = useState<OrderMode>('Dine-in');
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('Standard');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Pay at Counter');
  const [specialNote, setSpecialNote] = useState('');
  const [placedOrder, setPlacedOrder] = useState<PlacedOrderSnapshot | null>(null);

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

  const gst = Math.round(subtotal * 0.05);
  const packagingFee = orderMode === 'Take-away' ? 20 : 0;
  const expressFee = deliverySpeed === 'Express' ? 40 : 0;
  const total = subtotal + gst + packagingFee + expressFee;
  const etaMinutes = Math.max(10, 12 + itemCount * 3 - (deliverySpeed === 'Express' ? 8 : 0));

  const placeOrder = () => {
    if (itemCount === 0) {
      return;
    }

    const orderId = `CAF-${Date.now().toString().slice(-6)}`;
    setPlacedOrder({
      id: orderId,
      mode: orderMode,
      speed: deliverySpeed,
      payment: paymentMode,
      note: specialNote.trim(),
      itemCount,
      total,
      etaMinutes,
    });

    // Keep cart items for billing and payment stages.
    router.push('/oasis-cafe-pos-billing');
  };

  const handlePlaceOrderPress = () => {
    if (itemCount === 0) {
      Alert.alert(
        'Cart is empty',
        'Add items from the menu before placing your order.',
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

    placeOrder();
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
          <Text style={styles.title}>Place Order</Text>
        </View>

        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Final Step</Text>
        </View>
      </View>

      {placedOrder ? (
        <View style={styles.successWrap}>
          <View style={styles.successIconWrap}>
            <MaterialCommunityIcons name="check-circle" size={40} color="#16A34A" />
          </View>
          <Text style={styles.successTitle}>Order Placed Successfully</Text>
          <Text style={styles.successSubtitle}>#{placedOrder.id}</Text>

          <View style={styles.successCard}>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Items</Text>
              <Text style={styles.successValue}>{placedOrder.itemCount}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Type</Text>
              <Text style={styles.successValue}>{placedOrder.mode}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Speed</Text>
              <Text style={styles.successValue}>{placedOrder.speed}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Payment</Text>
              <Text style={styles.successValue}>{placedOrder.payment}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>ETA</Text>
              <Text style={styles.successValue}>{placedOrder.etaMinutes} min</Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successTotalLabel}>Total Paid</Text>
              <Text style={styles.successTotalValue}>{formatCurrency(placedOrder.total)}</Text>
            </View>
            {placedOrder.note ? (
              <View style={styles.noteChip}>
                <MaterialCommunityIcons name="note-text-outline" size={16} color="#9A3412" />
                <Text style={styles.noteChipText}>{placedOrder.note}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.successActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/oasis-cafe-view-menu')} activeOpacity={0.9}>
              <Text style={styles.secondaryButtonText}>View Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/oasis-cafe')} activeOpacity={0.9}>
              <Text style={styles.primaryButtonText}>Back to Module</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Type</Text>
            <View style={styles.chipRow}>
              {(['Dine-in', 'Take-away'] as OrderMode[]).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[styles.chip, orderMode === mode && styles.chipActive]}
                  onPress={() => setOrderMode(mode)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.chipText, orderMode === mode && styles.chipTextActive]}>{mode}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Speed</Text>
            <View style={styles.chipRow}>
              {(['Standard', 'Express'] as DeliverySpeed[]).map((speed) => (
                <TouchableOpacity
                  key={speed}
                  style={[styles.chip, deliverySpeed === speed && styles.chipActive]}
                  onPress={() => setDeliverySpeed(speed)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.chipText, deliverySpeed === speed && styles.chipTextActive]}>
                    {speed}
                    {speed === 'Express' ? ' (+Rs. 40)' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment</Text>
            <View style={styles.chipRow}>
              {(['Pay at Counter', 'Prepaid'] as PaymentMode[]).map((payment) => (
                <TouchableOpacity
                  key={payment}
                  style={[styles.chip, paymentMode === payment && styles.chipActive]}
                  onPress={() => setPaymentMode(payment)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.chipText, paymentMode === payment && styles.chipTextActive]}>{payment}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Special Instructions</Text>
            <TextInput
              style={styles.noteInput}
              value={specialNote}
              onChangeText={setSpecialNote}
              placeholder="Less sugar, no onion, extra napkins..."
              placeholderTextColor="#C2410C"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={120}
            />
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
            {packagingFee > 0 ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Packaging</Text>
                <Text style={styles.summaryValue}>{formatCurrency(packagingFee)}</Text>
              </View>
            ) : null}
            {expressFee > 0 ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Express Service</Text>
                <Text style={styles.summaryValue}>{formatCurrency(expressFee)}</Text>
              </View>
            ) : null}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ETA</Text>
              <Text style={styles.summaryValue}>{etaMinutes} min</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.placeOrderButton, itemCount === 0 && styles.placeOrderButtonDisabled]}
            onPress={handlePlaceOrderPress}
            activeOpacity={0.9}
          >
            <MaterialCommunityIcons name="clipboard-check-outline" size={18} color="#FFFFFF" />
            <Text style={styles.placeOrderButtonText}>
              {itemCount === 0 ? 'Add items to place order' : 'Confirm & Place Order'}
            </Text>
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
  stepBadge: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FED7AA',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  stepBadgeText: {
    color: '#9A3412',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 26,
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
  noteInput: {
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: 12,
    minHeight: 80,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#431407',
    backgroundColor: '#FFF7ED',
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
  placeOrderButton: {
    marginTop: 2,
    backgroundColor: '#F97316',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#FDBA74',
  },
  placeOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  successIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#14532D',
    marginBottom: 3,
    textAlign: 'center',
  },
  successSubtitle: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 14,
    marginBottom: 14,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  successLabel: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '600',
  },
  successValue: {
    color: '#14532D',
    fontSize: 13,
    fontWeight: '800',
  },
  successDivider: {
    height: 1,
    backgroundColor: '#DCFCE7',
    marginVertical: 8,
  },
  successTotalLabel: {
    color: '#14532D',
    fontSize: 15,
    fontWeight: '800',
  },
  successTotalValue: {
    color: '#166534',
    fontSize: 16,
    fontWeight: '900',
  },
  noteChip: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  noteChipText: {
    flex: 1,
    color: '#9A3412',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  successActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDBA74',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#9A3412',
    fontSize: 14,
    fontWeight: '800',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#16A34A',
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