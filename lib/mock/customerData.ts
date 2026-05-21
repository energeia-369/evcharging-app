export type BookingRecord = {
  id: string
  date: string
  center: string
  service: string
  status: 'completed' | 'upcoming' | 'cancelled'
}

export type PurchaseRecord = {
  id: string
  date: string
  vehicle: string
  price: number
}

export type ServiceRecord = {
  id: string
  date: string
  center: string
  details: string
}

export type Customer = {
  id: string
  name: string
  phone: string
  email: string
  city: string
  loyaltyPoints: number
  premium: boolean
  wishlist: string[]
  bookings: BookingRecord[]
  purchases: PurchaseRecord[]
  services: ServiceRecord[]
}

const today = new Date().toLocaleDateString('en-IN')

export const customers: Customer[] = [
  {
    id: 'cus-01',
    name: 'Suresh Patel',
    phone: '+91 90000 10101',
    email: 'suresh.patel@example.com',
    city: 'Mumbai',
    loyaltyPoints: 4200,
    premium: true,
    wishlist: ['Energeia E1', 'Orion Prime'],
    bookings: [
      { id: 'b-001', date: today, center: 'GreenCharge EV Service Hub', service: 'Battery Health Check', status: 'completed' },
    ],
    purchases: [
      { id: 'p-001', date: '2025-11-12', vehicle: 'Energeia E1', price: 2499000 },
    ],
    services: [
      { id: 's-001', date: '2026-03-02', center: 'GreenCharge EV Service Hub', details: 'Battery diagnostic and firmware update' },
    ],
  },
  {
    id: 'cus-02',
    name: 'Kavita Rao',
    phone: '+91 90000 20202',
    email: 'kavita.rao@example.com',
    city: 'Pune',
    loyaltyPoints: 1200,
    premium: false,
    wishlist: ['Voltura V2'],
    bookings: [
      { id: 'b-002', date: '2026-04-28', center: 'Urban EV Care Point', service: 'Software Update', status: 'upcoming' },
    ],
    purchases: [],
    services: [],
  },
  {
    id: 'cus-03',
    name: 'Rahul Mehra',
    phone: '+91 90000 30303',
    email: 'rahul.mehra@example.com',
    city: 'Bangalore',
    loyaltyPoints: 300,
    premium: false,
    wishlist: [],
    bookings: [],
    purchases: [],
    services: [],
  },
]

export const customerAnalytics = {
  totalCustomers: customers.length,
  premiumCustomers: customers.filter(c => c.premium).length,
  totalLoyaltyPoints: customers.reduce((s, c) => s + c.loyaltyPoints, 0),
}

export function formatINR(amount: number) {
  return `₹${(amount / 100000).toFixed(1)}L`
}
