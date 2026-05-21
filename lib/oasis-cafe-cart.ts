export type CafeCartItem = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
};

let cartItems: CafeCartItem[] = [];
const subscribers = new Set<() => void>();

const notify = () => {
  subscribers.forEach((listener) => listener());
};

export const subscribeCafeCart = (listener: () => void) => {
  subscribers.add(listener);
  return () => {
    subscribers.delete(listener);
  };
};

export const getCafeCartItems = () => cartItems;

export const addCafeItemToCart = (item: Omit<CafeCartItem, 'quantity'>) => {
  const existing = cartItems.find((cartItem) => cartItem.id === item.id);

  if (existing) {
    cartItems = cartItems.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  } else {
    cartItems = [...cartItems, { ...item, quantity: 1 }];
  }

  notify();
};

export const updateCafeCartQuantity = (id: string, quantity: number) => {
  if (quantity <= 0) {
    cartItems = cartItems.filter((cartItem) => cartItem.id !== id);
  } else {
    cartItems = cartItems.map((cartItem) =>
      cartItem.id === id ? { ...cartItem, quantity } : cartItem
    );
  }

  notify();
};

export const clearCafeCart = () => {
  cartItems = [];
  notify();
};
