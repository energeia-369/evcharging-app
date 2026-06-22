import { apiRequest, toApiResponse, ApiResponse, BackendEnvelope } from './apiClient';

export interface CafeOrderItem {
  itemName: string;
  quantity: number;
  price: number;
}

export interface CafeOrder {
  id: string;
  customerName: string;
  items: CafeOrderItem[];
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const mapOrder = (order: {
  _id: string;
  customerName: string;
  items: CafeOrderItem[];
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}): CafeOrder => ({
  id: order._id,
  customerName: order.customerName,
  items: order.items,
  amount: order.amount,
  paymentStatus: order.paymentStatus,
  orderStatus: order.orderStatus,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

export async function getCafeOrders(): Promise<ApiResponse<CafeOrder[]>> {
  const payload = await apiRequest<BackendEnvelope<Array<Parameters<typeof mapOrder>[0]>>>('/api/cafe');
  return toApiResponse((payload.data ?? []).map(mapOrder), payload.message || 'Cafe orders fetched successfully.');
}

export async function createCafeOrder(body: {
  customerName: string;
  items: CafeOrderItem[];
  amount: number;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  orderStatus?: 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}): Promise<ApiResponse<CafeOrder>> {
  const payload = await apiRequest<BackendEnvelope<Parameters<typeof mapOrder>[0]>>('/api/cafe', {
    method: 'POST',
    body,
  });

  if (!payload.data) throw new Error(payload.message || 'Failed to create cafe order.');
  return toApiResponse(mapOrder(payload.data), payload.message || 'Cafe order created successfully.');
}

export async function updateCafeOrder(
  orderId: string,
  body: Partial<{
    customerName: string;
    items: CafeOrderItem[];
    amount: number;
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderStatus: 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  }>,
): Promise<ApiResponse<CafeOrder>> {
  const payload = await apiRequest<BackendEnvelope<Parameters<typeof mapOrder>[0]>>(`/api/cafe/${orderId}`, {
    method: 'PUT',
    body,
  });

  if (!payload.data) throw new Error(payload.message || 'Failed to update cafe order.');
  return toApiResponse(mapOrder(payload.data), payload.message || 'Cafe order updated successfully.');
}

export async function deleteCafeOrder(orderId: string): Promise<ApiResponse<null>> {
  const payload = await apiRequest<BackendEnvelope<null>>(`/api/cafe/${orderId}`, { method: 'DELETE' });
  return toApiResponse(null, payload.message || 'Cafe order deleted successfully.');
}

// Compatibility helper for older screens that expected an order history list.
export async function getOrderHistory(): Promise<ApiResponse<CafeOrder[]>> {
  return getCafeOrders();
}

export async function getCafeMenu(): Promise<ApiResponse<CafeOrderItem[]>> {
  const orders = await getCafeOrders();
  return toApiResponse(orders.data.flatMap((order) => order.items), 'Cafe menu derived from live orders.');
}

export async function getCartItems(): Promise<ApiResponse<CafeOrderItem[]>> {
  return toApiResponse([], 'Cart items are managed locally in the UI.');
}

export async function placeOrder(body: {
  customerName: string;
  items: CafeOrderItem[];
  amount: number;
}): Promise<ApiResponse<{ orderId: string; userId: string; totalAmount: number; itemCount: number; status: 'placed' }>> {
  const created = await createCafeOrder(body);
  return toApiResponse(
    {
      orderId: created.data.id,
      userId: '',
      totalAmount: created.data.amount,
      itemCount: created.data.items.reduce((sum, item) => sum + item.quantity, 0),
      status: 'placed',
    },
    created.message,
  );
}