export type CafeCategory = 'Coffee' | 'Snacks' | 'Desserts' | 'Beverages';

export interface CafeMenuItem {
  id: string;
  itemName: string;
  price: number;
  image: string;
  category: CafeCategory;
  rating: number;
}

export interface CartItem {
  id: string;
  itemName: string;
  price: number;
  image: string;
  category: CafeCategory;
  rating: number;
  quantity: number;
}

export interface OrderRequest {
  userId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
}

export interface OrderHistoryItem {
  orderId: string;
  itemName: string;
  price: number;
  image: string;
  category: CafeCategory;
  rating: number;
  quantity: number;
  orderedAt: string;
  status: 'placed' | 'preparing' | 'completed';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

const MOCK_DELAY_MS = 350;

const mockMenu: CafeMenuItem[] = [
  {
    id: 'menu-001',
    itemName: 'Caramel Cold Brew',
    price: 149,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    category: 'Coffee',
    rating: 4.7,
  },
  {
    id: 'menu-002',
    itemName: 'Paneer Wrap',
    price: 179,
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759',
    category: 'Snacks',
    rating: 4.5,
  },
  {
    id: 'menu-003',
    itemName: 'Blueberry Cheesecake Slice',
    price: 199,
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81',
    category: 'Desserts',
    rating: 4.8,
  },
  {
    id: 'menu-004',
    itemName: 'Fresh Lime Soda',
    price: 99,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
    category: 'Beverages',
    rating: 4.4,
  },
];

const mockCart: CartItem[] = [
  {
    id: 'cart-001',
    itemName: 'Caramel Cold Brew',
    price: 149,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    category: 'Coffee',
    rating: 4.7,
    quantity: 1,
  },
  {
    id: 'cart-002',
    itemName: 'Paneer Wrap',
    price: 179,
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759',
    category: 'Snacks',
    rating: 4.5,
    quantity: 2,
  },
];

const mockOrderHistory: OrderHistoryItem[] = [
  {
    orderId: 'ord-1001',
    itemName: 'Blueberry Cheesecake Slice',
    price: 199,
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81',
    category: 'Desserts',
    rating: 4.8,
    quantity: 1,
    orderedAt: '2026-05-12T11:15:00.000Z',
    status: 'completed',
  },
  {
    orderId: 'ord-1002',
    itemName: 'Fresh Lime Soda',
    price: 99,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
    category: 'Beverages',
    rating: 4.4,
    quantity: 2,
    orderedAt: '2026-05-13T17:40:00.000Z',
    status: 'completed',
  },
];

const wait = async (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

async function buildResponse<T>(data: T, message: string): Promise<ApiResponse<T>> {
  await wait(MOCK_DELAY_MS);

  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

export async function getCafeMenu(): Promise<ApiResponse<CafeMenuItem[]>> {
  return buildResponse(mockMenu, 'Cafe menu fetched successfully.');
}

export async function getCartItems(): Promise<ApiResponse<CartItem[]>> {
  return buildResponse(mockCart, 'Cart items fetched successfully.');
}

export async function placeOrder(
  request: OrderRequest,
): Promise<
  ApiResponse<{
    orderId: string;
    userId: string;
    totalAmount: number;
    itemCount: number;
    status: 'placed';
  }>
> {
  const totalAmount = request.items.reduce((sum, item) => {
    const menuItem = mockMenu.find((menu) => menu.id === item.menuItemId);
    return sum + (menuItem?.price ?? 0) * item.quantity;
  }, 0);

  const itemCount = request.items.reduce((sum, item) => sum + item.quantity, 0);

  return buildResponse(
    {
      orderId: `ord-${Date.now()}`,
      userId: request.userId,
      totalAmount,
      itemCount,
      status: 'placed',
    },
    'Order placed successfully (mock).',
  );
}

export async function getOrderHistory(): Promise<ApiResponse<OrderHistoryItem[]>> {
  return buildResponse(mockOrderHistory, 'Order history fetched successfully.');
}
