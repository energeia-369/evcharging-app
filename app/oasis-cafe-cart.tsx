import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    CafeCartItem,
    clearCafeCart,
    getCafeCartItems,
    subscribeCafeCart,
    updateCafeCartQuantity,
} from '@/lib/oasis-cafe-cart';

const formatCurrency = (value: number) => `₹${value}`;

export default function OasisCafeCartScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CafeCartItem[]>(getCafeCartItems());

  useEffect(() => {
    const unsubscribe = subscribeCafeCart(() => {
      setItems([...getCafeCartItems()]);
    });

    return unsubscribe;
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8ED" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.85}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#7C2D12" />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.eyebrow}>Oasis Cafe</Text>
          <Text style={styles.title}>Add to Cart</Text>
        </View>

        {items.length > 0 ? (
          <TouchableOpacity style={styles.clearButton} onPress={clearCafeCart} activeOpacity={0.85}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <MaterialCommunityIcons name="cart-outline" size={28} color="#F97316" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Go to View Menu and add items. They will appear here instantly.</Text>
          <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/oasis-cafe-view-menu')} activeOpacity={0.9}>
            <Text style={styles.exploreButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <View key={item.id} style={styles.cartCard}>
                <View style={styles.itemTopRow}>
                  <View style={styles.itemMeta}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                </View>

                <View style={styles.itemBottomRow}>
                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateCafeCartQuantity(item.id, item.quantity - 1)}
                      activeOpacity={0.85}
                    >
                      <MaterialCommunityIcons name="minus" size={16} color="#7C2D12" />
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateCafeCartQuantity(item.id, item.quantity + 1)}
                      activeOpacity={0.85}
                    >
                      <MaterialCommunityIcons name="plus" size={16} color="#7C2D12" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.lineTotal}>{formatCurrency(item.price * item.quantity)}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (5%)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(gst)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(grandTotal)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => router.push('/oasis-cafe-place-order')}
              activeOpacity={0.9}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Billing</Text>
            </TouchableOpacity>
          </View>
        </>
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
  clearButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: '#9A3412',
    fontSize: 12,
    fontWeight: '700',
  },
  placeholder: {
    width: 56,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED7AA',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#431407',
    fontWeight: '800',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#7C2D12',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  exploreButton: {
    backgroundColor: '#F97316',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  cartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FCD9B6',
    padding: 14,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  itemMeta: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#431407',
    fontWeight: '800',
    marginBottom: 3,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#9A3412',
  },
  itemPrice: {
    fontSize: 15,
    color: '#166534',
    fontWeight: '800',
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#431407',
  },
  lineTotal: {
    fontSize: 16,
    color: '#431407',
    fontWeight: '900',
  },
  summaryCard: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#FCD9B6',
    backgroundColor: '#FFF4E6',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#7C2D12',
    fontSize: 14,
  },
  summaryValue: {
    color: '#431407',
    fontSize: 14,
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#FCD9B6',
    marginVertical: 8,
  },
  totalLabel: {
    color: '#431407',
    fontSize: 16,
    fontWeight: '800',
  },
  totalValue: {
    color: '#166534',
    fontSize: 18,
    fontWeight: '900',
  },
  checkoutButton: {
    marginTop: 12,
    backgroundColor: '#F97316',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
  },
});
