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
  addCafeItemToCart,
  getCafeCartItems,
  subscribeCafeCart,
} from '@/lib/oasis-cafe-cart';

type MenuItem = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  prepTime: string;
  calories: string;
};

type MenuSection = {
  title: string;
  icon: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    title: 'Coffee & Tea',
    icon: 'coffee',
    items: [
      {
        id: 'espresso',
        name: 'Espresso',
        subtitle: 'Single shot, strong roast',
        description: 'Freshly extracted Arabica shot with bold flavor and rich crema.',
        price: 120,
        prepTime: '4 min',
        calories: '9 kcal',
      },
      {
        id: 'cappuccino',
        name: 'Cappuccino',
        subtitle: 'Milk foam and cocoa dust',
        description: 'Double espresso blended with steamed milk and silky foam.',
        price: 180,
        prepTime: '6 min',
        calories: '142 kcal',
      },
      {
        id: 'masala-chai',
        name: 'Masala Chai',
        subtitle: 'Indian spiced tea',
        description: 'Strong tea leaves brewed with cardamom, ginger, and clove.',
        price: 90,
        prepTime: '5 min',
        calories: '84 kcal',
      },
    ],
  },
  {
    title: 'Quick Bites',
    icon: 'food-outline',
    items: [
      {
        id: 'veg-sandwich',
        name: 'Veg Sandwich',
        subtitle: 'Grilled with cheese',
        description: 'Crunchy veggie filling, toasted bread, and melted cheese.',
        price: 150,
        prepTime: '8 min',
        calories: '286 kcal',
      },
      {
        id: 'paneer-wrap',
        name: 'Paneer Wrap',
        subtitle: 'Mint sauce and salad',
        description: 'Soft wrap loaded with spiced paneer, lettuce, and mint mayo.',
        price: 210,
        prepTime: '10 min',
        calories: '372 kcal',
      },
      {
        id: 'french-fries',
        name: 'French Fries',
        subtitle: 'Salted, peri-peri optional',
        description: 'Crispy golden fries with optional peri-peri seasoning.',
        price: 130,
        prepTime: '7 min',
        calories: '312 kcal',
      },
    ],
  },
  {
    title: 'Combo Deals',
    icon: 'silverware-fork-knife',
    items: [
      {
        id: 'coffee-sandwich-combo',
        name: 'Coffee + Sandwich',
        subtitle: 'Best seller combo',
        description: 'Cappuccino and grilled veg sandwich combo at a reduced price.',
        price: 299,
        prepTime: '12 min',
        calories: '428 kcal',
      },
      {
        id: 'tea-fries-combo',
        name: 'Tea + Fries',
        subtitle: 'Evening snack combo',
        description: 'Classic chai served with hot, crispy fries.',
        price: 199,
        prepTime: '9 min',
        calories: '396 kcal',
      },
      {
        id: 'cappuccino-wrap-combo',
        name: 'Cappuccino + Wrap',
        subtitle: 'Premium combo',
        description: 'Filling paneer wrap paired with a smooth cappuccino.',
        price: 349,
        prepTime: '13 min',
        calories: '514 kcal',
      },
    ],
  },
];

export default function OasisCafeViewMenuScreen() {
  const router = useRouter();
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const refreshCount = () => {
      const total = getCafeCartItems().reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    refreshCount();
    return subscribeCafeCart(refreshCount);
  }, []);

  const totalMenuItems = useMemo(
    () => menuSections.reduce((sum, section) => sum + section.items.length, 0),
    []
  );

  const formatCurrency = (value: number) => `₹${value}`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8ED" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.85}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#7C2D12" />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.eyebrow}>Oasis Cafe</Text>
          <Text style={styles.title}>View Menu</Text>
        </View>

        <View style={styles.menuBadge}>
          <Text style={styles.menuBadgeText}>{totalMenuItems} Items</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.cartCta}
        activeOpacity={0.9}
        onPress={() => router.push('/oasis-cafe-cart')}
      >
        <View style={styles.cartLeft}>
          <MaterialCommunityIcons name="cart-outline" size={20} color="#7C2D12" />
          <Text style={styles.cartCtaText}>Add to Cart</Text>
        </View>
        <View style={styles.cartCountBadge}>
          <Text style={styles.cartCountText}>{cartCount}</Text>
        </View>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {menuSections.map((section) => (
          <View key={section.title} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons name={section.icon as any} size={20} color="#16A34A" />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            {section.items.map((item) => {
              const isExpanded = expandedItemId === item.id;

              return (
                <View key={item.id} style={styles.itemBlock}>
                  <TouchableOpacity
                    style={styles.menuItemRow}
                    activeOpacity={0.9}
                    onPress={() => setExpandedItemId(isExpanded ? null : item.id)}
                  >
                    <View style={styles.itemTextWrap}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                    </View>
                    <View style={styles.itemRight}>
                      <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                      <MaterialCommunityIcons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="#B45309"
                      />
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.itemDetailsCard}>
                      <Text style={styles.itemDescription}>{item.description}</Text>

                      <View style={styles.itemMetaRow}>
                        <View style={styles.metaChip}>
                          <MaterialCommunityIcons name="timer-outline" size={14} color="#9A3412" />
                          <Text style={styles.metaChipText}>{item.prepTime}</Text>
                        </View>
                        <View style={styles.metaChip}>
                          <MaterialCommunityIcons name="fire" size={14} color="#9A3412" />
                          <Text style={styles.metaChipText}>{item.calories}</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.addButton}
                        activeOpacity={0.9}
                        onPress={() => {
                          addCafeItemToCart({
                            id: item.id,
                            name: item.name,
                            subtitle: item.subtitle,
                            price: item.price,
                          });
                        }}
                      >
                        <MaterialCommunityIcons name="cart-plus" size={16} color="#FFFFFF" />
                        <Text style={styles.addButtonText}>Add to Cart</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.payButton}
                        activeOpacity={0.9}
                        onPress={() => {
                          addCafeItemToCart({
                            id: item.id,
                            name: item.name,
                            subtitle: item.subtitle,
                            price: item.price,
                          });
                          router.push('/oasis-cafe-cart');
                        }}
                      >
                        <MaterialCommunityIcons name="credit-card-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.payButtonText}>Pay Now</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
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
  menuBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  menuBadgeText: {
    fontSize: 12,
    color: '#9A3412',
    fontWeight: '700',
  },
  cartCta: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    backgroundColor: '#FFF4E6',
    borderWidth: 1,
    borderColor: '#FCD9B6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartCtaText: {
    fontSize: 14,
    color: '#7C2D12',
    fontWeight: '700',
  },
  cartCountBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F97316',
    paddingHorizontal: 8,
  },
  cartCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
    gap: 12,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FCD9B6',
    padding: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#431407',
    fontWeight: '800',
  },
  itemBlock: {
    borderTopWidth: 1,
    borderTopColor: '#FEEDDA',
    paddingTop: 2,
    paddingBottom: 8,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
  },
  itemTextWrap: {
    flex: 1,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemName: {
    fontSize: 15,
    color: '#431407',
    fontWeight: '700',
    marginBottom: 2,
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
  itemDetailsCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
    marginTop: 2,
  },
  itemDescription: {
    fontSize: 13,
    color: '#7C2D12',
    lineHeight: 19,
    marginBottom: 10,
  },
  itemMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaChipText: {
    color: '#9A3412',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#F97316',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  payButton: {
    backgroundColor: '#7C2D12',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
