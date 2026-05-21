import type { ImageSourcePropType } from 'react-native'

export type ShowroomVehicle = {
  id: string
  name: string
  model: string
  brand: string
  price: number
  rangeKm: number
  chargingTime: string
  topSpeed: number
  rating: number
  colors: string[]
  category: string
  badge: string
  batteryKwh: number
  chargingType: string
  performance: string
  features: string[]
  safety: string[]
  emi: number
  warranty: string
  description: string
  savings: number
  showrooms: string[]
  galleryPhotos: ImageSourcePropType[]
}

export type ShowroomBranch = {
  id: string
  name: string
  address: string
  distance: string
  phone: string
}

export type FinancingOption = {
  id: string
  title: string
  subtitle: string
  rate: string
  tenure: string
  monthly: number
}

export type QuoteBreakdown = {
  label: string
  amount: number
}

export type SupportTicket = {
  id: string
  title: string
  status: 'Open' | 'Resolved' | 'In Progress'
  detail: string
}

export const showroomVehicles: ShowroomVehicle[] = [
  {
    id: 'v1',
    name: 'Nexa Volt X',
    model: 'Volt X',
    brand: 'Nexa',
    price: 4299000,
    rangeKm: 540,
    chargingTime: '35 min',
    topSpeed: 220,
    rating: 4.9,
    colors: ['Forest Green', 'Arctic White', 'Midnight Black'],
    category: 'SUV',
    badge: 'Featured',
    batteryKwh: 88,
    chargingType: 'Fast DC Charging',
    performance: '0-100 km/h in 5.8s',
    features: ['Adaptive Cruise', 'Smart Cabin AI', 'Over-the-air updates', 'Solar roof assist'],
    safety: ['Lane Assist', '360° camera', 'Auto Emergency Braking', 'Driver Alert'],
    emi: 79999,
    warranty: '5 years / 100,000 km',
    description: 'A premium electric SUV designed for range, comfort and intelligent charging management.',
    savings: 720000,
    showrooms: ['s1', 's2'],
    galleryPhotos: [
      require('../../assets/cars/car1.jpg'),
      require('../../assets/cars/car2.jpg'),
      require('../../assets/cars/car3.jpg'),
      require('../../assets/cars/car4.jpg'),
    ],
  },
  {
    id: 'v2',
    name: 'Eon Falcon R',
    model: 'Falcon R',
    brand: 'Eon',
    price: 3599000,
    rangeKm: 480,
    chargingTime: '30 min',
    topSpeed: 205,
    rating: 4.7,
    colors: ['Solar Yellow', 'Platinum Silver', 'Ocean Blue'],
    category: 'Sedan',
    badge: 'New Launch',
    batteryKwh: 78,
    chargingType: 'Ultra Fast Charging',
    performance: '0-100 km/h in 6.5s',
    features: ['Smart Park Assist', 'AI Driver Coach', 'Premium sound system', 'Adaptive LED Matrix'],
    safety: ['Side Impact Protection', 'Blind Spot Monitor', 'Tyre Pressure Monitor', 'Crash Assist'],
    emi: 64999,
    warranty: '4 years / 80,000 km',
    description: 'A sleek electric sedan with intelligent range management and premium interior comforts.',
    savings: 540000,
    showrooms: ['s1', 's3'],
    galleryPhotos: [
      require('../../assets/cars/car2.jpg'),
      require('../../assets/cars/car3.jpg'),
      require('../../assets/cars/car4.jpg'),
      require('../../assets/cars/car1.jpg'),
    ],
  },
  {
    id: 'v3',
    name: 'Volt Aero GT',
    model: 'Aero GT',
    brand: 'Volt',
    price: 5199000,
    rangeKm: 600,
    chargingTime: '28 min',
    topSpeed: 240,
    rating: 4.8,
    colors: ['Graphite Gray', 'Ivory White', 'Emerald Green'],
    category: 'Coupe',
    badge: 'Popular',
    batteryKwh: 95,
    chargingType: 'HyperCharge',
    performance: '0-100 km/h in 4.9s',
    features: ['AI Recommendation', 'Performance Launch Mode', 'Smart Glass Roof', 'Battery Prediction'],
    safety: ['Adaptive Cruise', 'Auto Brake', 'Night Vision Assist', 'Airbag Suite'],
    emi: 99999,
    warranty: '5 years / 120,000 km',
    description: 'A high-performance electric coupé with elite handling and advanced smart driving features.',
    savings: 960000,
    showrooms: ['s2', 's3'],
    galleryPhotos: [
      require('../../assets/cars/car3.jpg'),
      require('../../assets/cars/car4.jpg'),
      require('../../assets/cars/car1.jpg'),
      require('../../assets/cars/car2.jpg'),
    ],
  },
]

export const showroomBranches: ShowroomBranch[] = [
  {
    id: 's1',
    name: 'Green City EV Showroom',
    address: '12 Solar Avenue, City Center',
    distance: '1.8 km',
    phone: '+91 98765 43210',
  },
  {
    id: 's2',
    name: 'Elite EV Experience',
    address: '78 Innovation Drive, Sector 5',
    distance: '4.5 km',
    phone: '+91 91234 56780',
  },
  {
    id: 's3',
    name: 'Premium EV Gallery',
    address: '45 Greenway Road, East Park',
    distance: '3.2 km',
    phone: '+91 99876 54321',
  },
]

export const filterBrands = ['All', 'Nexa', 'Eon', 'Volt']
export const categories = ['All', 'SUV', 'Sedan', 'Coupe']
export const offers = [
  { id: 'o1', title: 'Zero Down Payment', subtitle: 'Available on premium plans', icon: 'cash' },
  { id: 'o2', title: 'Free Home Charging Kit', subtitle: 'Valid for first 50 bookings', icon: 'battery-charging' },
  { id: 'o3', title: 'Complimentary Insurance', subtitle: 'One year full cover', icon: 'shield-check' },
]

export const financingOptions: FinancingOption[] = [
  { id: 'f1', title: 'Standard EMI', subtitle: '36 months @ 9.5%', rate: '9.5%', tenure: '36 mo', monthly: 89999 },
  { id: 'f2', title: 'Flexible EMI', subtitle: '48 months @ 10.2%', rate: '10.2%', tenure: '48 mo', monthly: 72999 },
  { id: 'f3', title: 'Luxury Finance', subtitle: '60 months @ 11.0%', rate: '11.0%', tenure: '60 mo', monthly: 59999 },
]

export const quoteBreakdown: QuoteBreakdown[] = [
  { label: 'Base price', amount: 4299000 },
  { label: 'Insurance', amount: 189900 },
  { label: 'Registration', amount: 89900 },
  { label: 'Accessories', amount: 79900 },
  { label: 'GST', amount: 389000 },
  { label: 'Discounts', amount: -120000 },
]

export const paymentMethods = [
  { id: 'upi', title: 'UPI', icon: 'qrcode-scan' },
  { id: 'card', title: 'Credit Card', icon: 'credit-card' },
  { id: 'wallet', title: 'Wallet', icon: 'wallet' },
  { id: 'netbanking', title: 'Net Banking', icon: 'cash' },
]

export const supportTickets: SupportTicket[] = [
  { id: 't1', title: 'Battery warranty claim', status: 'Open', detail: 'Pending technician approval for health check.' },
  { id: 't2', title: 'Software update request', status: 'Resolved', detail: 'Latest BMS software installed remotely.' },
  { id: 't3', title: 'Roadside assistance', status: 'In Progress', detail: 'Assistance team en route with fast charger.' },
]

export const comparePairs = [
  { label: 'Battery range', v1: '540 km', v2: '480 km' },
  { label: 'Charging speed', v1: '35 min', v2: '30 min' },
  { label: 'Price', v1: '₹42.9L', v2: '₹35.9L' },
  { label: 'Top speed', v1: '220 km/h', v2: '205 km/h' },
  { label: 'Safety rating', v1: '4.9', v2: '4.7' },
  { label: 'Features', v1: 'AI Assist, Solar roof', v2: 'Smart Park, Matrix LEDs' },
]

export function getVehicleById(id: string | null) {
  return showroomVehicles.find((item) => item.id === id) || null
}

export function getBranchById(id: string | null) {
  return showroomBranches.find((item) => item.id === id) || null
}
