export type ServiceCenter = {
  id: string
  name: string
  address: string
  distanceKm: number
  rating: number
  categories: string[]
  services: string[]
  image?: string
}

export type Vehicle = { id: string; name: string; model: string; year: number }

export type Technician = { id: string; name: string; experience: number; rating: number }

export type ServiceType = {
  id: string
  name: string
  description: string
  icon: string
  durationMins: number
  price: number
  badge: string
}

export type PaymentMethod = {
  id: string
  name: string
  subtitle: string
  icon: string
}

export type Booking = {
  id: string
  centerId: string
  centerName?: string
  serviceTypeId: string
  serviceTypeName?: string
  vehicleId: string
  vehicleName?: string
  services: string[]
  date: string
  time: string
  pickupDrop: boolean
  paymentMethod?: string
  estimatedAmount: number
  actualAmount?: number
  status: string
  technicianId?: string
}

export type Diagnostic = { id: string; vehicleId: string; code: string; message: string; severity: 'low' | 'medium' | 'high' }

export type Invoice = { id: string; bookingId: string; amount: number; paid: boolean }

export const serviceCenters: ServiceCenter[] = [
  {
    id: 'c1',
    name: 'GreenCharge Service Hub',
    address: '12 Solar Ave, Green City',
    distanceKm: 2.3,
    rating: 4.8,
    categories: ['Fast Service', 'Mobile Repair'],
    services: ['Battery Check', 'Tire', 'Software Update'],
  },
  {
    id: 'c2',
    name: 'EV Care Center',
    address: '101 Electric St',
    distanceKm: 5.1,
    rating: 4.6,
    categories: ['Maintenance', 'Diagnostics'],
    services: ['Full Service', 'Diagnostics', 'AC Repair'],
  },
]

export const vehicles: Vehicle[] = [
  { id: 'v1', name: 'Tesla Model 3', model: 'Model 3', year: 2021 },
  { id: 'v2', name: 'Nissan Leaf', model: 'Leaf', year: 2019 },
]

export const technicians: Technician[] = [
  { id: 't1', name: 'Asha Kulkarni', experience: 6, rating: 4.9 },
  { id: 't2', name: 'Ravi Singh', experience: 4, rating: 4.7 },
]

export const serviceTypes: ServiceType[] = [
  {
    id: 'battery-health',
    name: 'Battery Health Check',
    description: 'Live diagnostics, thermal scan, charging curve analysis, and pack health report.',
    icon: 'battery-charging-outline',
    durationMins: 45,
    price: 799,
    badge: 'Best for range issues',
  },
  {
    id: 'full-maintenance',
    name: 'Full EV Maintenance',
    description: 'Brake, suspension, fluids, filters, cabin comfort, and EV system review.',
    icon: 'car-wrench',
    durationMins: 120,
    price: 1999,
    badge: 'Popular service',
  },
  {
    id: 'software-update',
    name: 'Software Update',
    description: 'Infotainment, BMS, and firmware update with post-install validation.',
    icon: 'update',
    durationMins: 60,
    price: 999,
    badge: 'Fast turnaround',
  },
  {
    id: 'ac-repair',
    name: 'AC & Cooling Repair',
    description: 'HVAC calibration, cooling system test, and cabin temperature optimization.',
    icon: 'snowflake',
    durationMins: 90,
    price: 1499,
    badge: 'Comfort upgrade',
  },
]

export const paymentMethods: PaymentMethod[] = [
  { id: 'upi', name: 'UPI', subtitle: 'Instant approval', icon: 'qrcode-scan' },
  { id: 'card', name: 'Debit / Credit Card', subtitle: 'Secure card payment', icon: 'credit-card-outline' },
  { id: 'wallet', name: 'Wallet', subtitle: 'Saved balance', icon: 'wallet-outline' },
  { id: 'netbanking', name: 'Net Banking', subtitle: 'Bank transfer', icon: 'bank-outline' },
]

export const timeSlots = [
  '08:30 AM',
  '09:30 AM',
  '10:30 AM',
  '11:30 AM',
  '01:00 PM',
  '02:00 PM',
  '03:30 PM',
  '04:30 PM',
  '05:30 PM',
]

export const trackingStages = [
  {
    key: 'scheduled',
    title: 'Booking Confirmed',
    detail: 'Service bay reserved and technician assigned.',
    icon: 'calendar-check',
    status: 'completed' as const,
  },
  {
    key: 'pickup',
    title: 'Pickup Team En Route',
    detail: 'Your pickup request is being coordinated with the nearest driver.',
    icon: 'truck-delivery-outline',
    status: 'current' as const,
  },
  {
    key: 'inspection',
    title: 'Inspection Started',
    detail: 'Technician is scanning the vehicle and recording the service checklist.',
    icon: 'clipboard-text-outline',
    status: 'pending' as const,
  },
  {
    key: 'service',
    title: 'Service In Progress',
    detail: 'Repair, replacement, and calibration are underway.',
    icon: 'car-wrench',
    status: 'pending' as const,
  },
  {
    key: 'handover',
    title: 'Quality Check & Handover',
    detail: 'Final test drive, QA sign-off, and delivery preparation.',
    icon: 'flag-checkered',
    status: 'pending' as const,
  },
]

export let bookings: Booking[] = []
export let diagnostics: Diagnostic[] = [
  { id: 'd1', vehicleId: 'v1', code: 'P0A80', message: 'Battery degraded (fake)', severity: 'medium' },
]
export let invoices: Invoice[] = []

export function addBooking(b: Omit<Booking, 'id' | 'status'>) {
  const id = 'b' + Math.random().toString(36).slice(2, 9)
  const booking = { id, status: 'created', ...b }
  bookings.push(booking as Booking)
  return booking as Booking
}

export function updateBooking(id: string, patch: Partial<Booking>) {
  const booking = bookings.find(item => item.id === id)
  if (booking) {
    Object.assign(booking, patch)
  }
  return booking
}

export function updateBookingStatus(id: string, status: string) {
  const b = bookings.find(x => x.id === id)
  if (b) b.status = status
}

export function addInvoice(inv: Omit<Invoice, 'id'>) {
  const id = 'inv' + Math.random().toString(36).slice(2, 9)
  const invoice = { id, ...inv }
  invoices.push(invoice)
  return invoice
}

export function getBooking(id: string) {
  return bookings.find(item => item.id === id)
}

export function getInvoice(id: string) {
  return invoices.find(item => item.id === id)
}

export function getServiceCenter(id: string) {
  return serviceCenters.find(item => item.id === id)
}

export function getVehicle(id: string) {
  return vehicles.find(item => item.id === id)
}

export function getServiceType(id: string) {
  return serviceTypes.find(item => item.id === id)
}

export function getPaymentMethod(id: string) {
  return paymentMethods.find(item => item.id === id)
}

export function estimateBookingAmount(serviceTypeId: string, pickupDrop: boolean) {
  const service = getServiceType(serviceTypeId)
  const pickupFee = pickupDrop ? 299 : 0
  const serviceFee = service?.price ?? 0
  return serviceFee + pickupFee
}

export function formatCurrency(amount: number) {
  return `₹ ${amount.toLocaleString('en-IN')}`
}
