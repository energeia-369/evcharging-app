export type ServiceCenter = {
  id: string
  name: string
  address: string
  distanceKm: number
  rating: number
  openStatus: 'Open now' | 'Closing soon' | 'Closed'
  closingTime: string
  phone: string
  imageLabel: string
  categories: string[]
  services: string[]
  technicians: Array<{
    name: string
    role: string
    rating: number
    experienceYears: number
  }>
  activeBookings: number
}

export type ServiceCategory = {
  id: string
  name: string
  description: string
  icon: string
  price: number
  durationMins: number
}

export type Vehicle = {
  id: string
  name: string
  model: string
  battery: string
  rangeKm: number
  plate: string
}

export type PaymentMethodId = 'upi' | 'card' | 'wallet' | 'netbanking'

export type BookingStatus = 'upcoming' | 'in-progress' | 'completed' | 'cancelled'

export type BookingDraft = {
  centerId: string
  vehicleId: string
  serviceId: string
  date: string
  time: string
  pickupDrop: boolean
  description: string
  paymentMethod: PaymentMethodId
}

export type BookingRecord = BookingDraft & {
  id: string
  bookingNumber: string
  invoiceNumber: string
  centerName: string
  centerAddress: string
  serviceName: string
  serviceIcon: string
  vehicleName: string
  vehiclePlate: string
  technicianName: string
  technicianRole: string
  technicianRating: number
  technicianExperienceYears: number
  status: BookingStatus
  paymentStatus: 'Paid' | 'Pending' | 'Refunded'
  estimatedCost: number
  taxAmount: number
  totalAmount: number
  rewardPoints: number
  eta: string
  createdAt: string
  timelineStep: number
}

export type TimelineStep = {
  key: string
  title: string
  detail: string
  icon: string
}

const today = new Date()

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })

const addDays = (days: number) => {
  const next = new Date(today)
  next.setDate(today.getDate() + days)
  return next
}

export const serviceCenters: ServiceCenter[] = [
  {
    id: 'center-1',
    name: 'GreenCharge EV Service Hub',
    address: '12 Solar Avenue, Green City',
    distanceKm: 1.8,
    rating: 4.9,
    openStatus: 'Open now',
    closingTime: '08:00 PM',
    phone: '+91 90000 11111',
    imageLabel: 'Premium EV service hub',
    categories: ['Battery', 'Diagnostics', 'Emergency'],
    services: ['Battery Health Check', 'Full EV Service', 'Emergency Roadside'],
    technicians: [
      { name: 'Asha Kulkarni', role: 'Senior EV Technician', rating: 4.9, experienceYears: 8 },
      { name: 'Ravi Singh', role: 'Diagnostics Specialist', rating: 4.8, experienceYears: 6 },
    ],
    activeBookings: 14,
  },
  {
    id: 'center-2',
    name: 'Urban EV Care Point',
    address: '104 Electric Street, Metro Park',
    distanceKm: 3.4,
    rating: 4.8,
    openStatus: 'Closing soon',
    closingTime: '07:30 PM',
    phone: '+91 90000 22222',
    imageLabel: 'City side service and repair',
    categories: ['Maintenance', 'Tyres', 'Software'],
    services: ['Tire Rotation', 'Software Update', 'Charging System Check'],
    technicians: [
      { name: 'Neha Patil', role: 'Service Advisor', rating: 4.7, experienceYears: 5 },
      { name: 'Arun Mehta', role: 'HV System Lead', rating: 4.8, experienceYears: 7 },
    ],
    activeBookings: 9,
  },
  {
    id: 'center-3',
    name: 'SparkLine EV Care Studio',
    address: '21 Future Bay, Tech District',
    distanceKm: 5.2,
    rating: 4.7,
    openStatus: 'Open now',
    closingTime: '09:00 PM',
    phone: '+91 90000 33333',
    imageLabel: 'Modern premium care studio',
    categories: ['Body', 'Brakes', 'Inspection'],
    services: ['Brake Inspection', 'Body Check', 'Fast Diagnostics'],
    technicians: [
      { name: 'Sanjay Rao', role: 'Master Technician', rating: 4.9, experienceYears: 10 },
      { name: 'Priya Nair', role: 'Quality Check Lead', rating: 4.8, experienceYears: 6 },
    ],
    activeBookings: 6,
  },
]

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'battery-health',
    name: 'Battery Health Check',
    description: 'Battery diagnostics, cell balance review, and thermal inspection.',
    icon: 'battery-charging-outline',
    price: 799,
    durationMins: 45,
  },
  {
    id: 'full-service',
    name: 'Full EV Service',
    description: 'Complete preventive maintenance for your EV system and cabin.',
    icon: 'car-wrench',
    price: 1899,
    durationMins: 120,
  },
  {
    id: 'emergency-roadside',
    name: 'Emergency Roadside Help',
    description: 'Tow, jump assist, or immediate mobile technician dispatch.',
    icon: 'car-emergency',
    price: 999,
    durationMins: 30,
  },
  {
    id: 'tire-care',
    name: 'Tire Care & Alignment',
    description: 'Pressure check, alignment, rotation, and wear inspection.',
    icon: 'tire',
    price: 649,
    durationMins: 50,
  },
  {
    id: 'software-update',
    name: 'Software Update',
    description: 'Firmware, infotainment, and charging profile update package.',
    icon: 'update',
    price: 499,
    durationMins: 35,
  },
  {
    id: 'diagnostics',
    name: 'Full Diagnostics',
    description: 'Motor, brake, battery, and high-voltage system inspection.',
    icon: 'clipboard-text-search-outline',
    price: 899,
    durationMins: 60,
  },
]

export const vehicles: Vehicle[] = [
  { id: 'vehicle-1', name: 'Tesla Model 3', model: 'Model 3', battery: '82%', rangeKm: 382, plate: 'MH 14 EV 3012' },
  { id: 'vehicle-2', name: 'Nissan Leaf', model: 'Leaf', battery: '74%', rangeKm: 268, plate: 'MH 12 EV 7755' },
  { id: 'vehicle-3', name: 'MG ZS EV', model: 'ZS EV', battery: '88%', rangeKm: 355, plate: 'MH 01 EV 4488' },
]

export const paymentMethods: Array<{ id: PaymentMethodId; name: string; subtitle: string; icon: string }> = [
  { id: 'upi', name: 'UPI', subtitle: 'Instant and secure', icon: 'qrcode-scan' },
  { id: 'card', name: 'Credit Card', subtitle: 'Visa / MasterCard', icon: 'credit-card-outline' },
  { id: 'wallet', name: 'Wallet', subtitle: 'Saved balance', icon: 'wallet-outline' },
  { id: 'netbanking', name: 'Net Banking', subtitle: 'Direct bank transfer', icon: 'bank-outline' },
]

export const timelineSteps: TimelineStep[] = [
  {
    key: 'confirmed',
    title: 'Booking Confirmed',
    detail: 'The service slot is reserved and the center has received your request.',
    icon: 'calendar-check',
  },
  {
    key: 'picked-up',
    title: 'Vehicle Picked Up',
    detail: 'Pickup team has collected the EV and moved it into service intake.',
    icon: 'truck-delivery-outline',
  },
  {
    key: 'diagnosis',
    title: 'Diagnosis Started',
    detail: 'Technicians are reading live telemetry and fault traces.',
    icon: 'clipboard-text-search-outline',
  },
  {
    key: 'repair',
    title: 'Repair In Progress',
    detail: 'Replacement, calibration, and service work are underway.',
    icon: 'wrench-outline',
  },
  {
    key: 'quality',
    title: 'Quality Check',
    detail: 'Final inspection, test drive, and QA validation are in progress.',
    icon: 'check-decagram-outline',
  },
  {
    key: 'ready',
    title: 'Ready For Delivery',
    detail: 'The EV is ready for handover and final delivery confirmation.',
    icon: 'flag-checkered',
  },
]

export const seedHistoryBookings: BookingRecord[] = [
  {
    id: 'booking-seed-1',
    bookingNumber: 'EVS-260514-001',
    invoiceNumber: 'INV-260514-001',
    centerId: 'center-1',
    centerName: serviceCenters[0].name,
    centerAddress: serviceCenters[0].address,
    vehicleId: 'vehicle-1',
    vehicleName: vehicles[0].name,
    vehiclePlate: vehicles[0].plate,
    serviceId: 'battery-health',
    serviceName: serviceCategories[0].name,
    serviceIcon: serviceCategories[0].icon,
    date: formatDate(addDays(-2)),
    time: '10:30 AM',
    pickupDrop: true,
    description: 'Battery check after fast charging trip',
    paymentMethod: 'upi',
    technicianName: serviceCenters[0].technicians[0].name,
    technicianRole: serviceCenters[0].technicians[0].role,
    technicianRating: serviceCenters[0].technicians[0].rating,
    technicianExperienceYears: serviceCenters[0].technicians[0].experienceYears,
    status: 'completed',
    paymentStatus: 'Paid',
    estimatedCost: 799,
    taxAmount: 144,
    totalAmount: 943,
    rewardPoints: 94,
    eta: '1h 15m',
    createdAt: formatDate(addDays(-2)),
    timelineStep: 5,
  },
  {
    id: 'booking-seed-2',
    bookingNumber: 'EVS-260513-008',
    invoiceNumber: 'INV-260513-008',
    centerId: 'center-2',
    centerName: serviceCenters[1].name,
    centerAddress: serviceCenters[1].address,
    vehicleId: 'vehicle-2',
    vehicleName: vehicles[1].name,
    vehiclePlate: vehicles[1].plate,
    serviceId: 'software-update',
    serviceName: serviceCategories[4].name,
    serviceIcon: serviceCategories[4].icon,
    date: formatDate(addDays(-5)),
    time: '01:00 PM',
    pickupDrop: false,
    description: 'Software update for charging module',
    paymentMethod: 'card',
    technicianName: serviceCenters[1].technicians[0].name,
    technicianRole: serviceCenters[1].technicians[0].role,
    technicianRating: serviceCenters[1].technicians[0].rating,
    technicianExperienceYears: serviceCenters[1].technicians[0].experienceYears,
    status: 'cancelled',
    paymentStatus: 'Refunded',
    estimatedCost: 499,
    taxAmount: 90,
    totalAmount: 589,
    rewardPoints: 58,
    eta: '45m',
    createdAt: formatDate(addDays(-5)),
    timelineStep: 1,
  },
  {
    id: 'booking-seed-3',
    bookingNumber: 'EVS-260516-014',
    invoiceNumber: 'INV-260516-014',
    centerId: 'center-3',
    centerName: serviceCenters[2].name,
    centerAddress: serviceCenters[2].address,
    vehicleId: 'vehicle-3',
    vehicleName: vehicles[2].name,
    vehiclePlate: vehicles[2].plate,
    serviceId: 'full-service',
    serviceName: serviceCategories[1].name,
    serviceIcon: serviceCategories[1].icon,
    date: formatDate(addDays(1)),
    time: '03:30 PM',
    pickupDrop: true,
    description: 'Scheduled inspection and cabin maintenance',
    paymentMethod: 'wallet',
    technicianName: serviceCenters[2].technicians[1].name,
    technicianRole: serviceCenters[2].technicians[1].role,
    technicianRating: serviceCenters[2].technicians[1].rating,
    technicianExperienceYears: serviceCenters[2].technicians[1].experienceYears,
    status: 'upcoming',
    paymentStatus: 'Pending',
    estimatedCost: 1899,
    taxAmount: 342,
    totalAmount: 2241,
    rewardPoints: 224,
    eta: '2h 15m',
    createdAt: formatDate(addDays(-1)),
    timelineStep: 0,
  },
]

export const defaultBookingDraft: BookingDraft = {
  centerId: serviceCenters[0].id,
  vehicleId: vehicles[0].id,
  serviceId: serviceCategories[0].id,
  date: formatDate(addDays(1)),
  time: '10:30 AM',
  pickupDrop: true,
  description: '',
  paymentMethod: 'upi',
}

export function getServiceCenter(centerId: string) {
  return serviceCenters.find(center => center.id === centerId) ?? serviceCenters[0]
}

export function getServiceCategory(serviceId: string) {
  return serviceCategories.find(service => service.id === serviceId) ?? serviceCategories[0]
}

export function getVehicle(vehicleId: string) {
  return vehicles.find(vehicle => vehicle.id === vehicleId) ?? vehicles[0]
}

export function formatCurrency(value: number) {
  return `₹ ${value.toLocaleString('en-IN')}`
}

export function addMinutesToTime(time: string, minutes: number) {
  const normalized = time.trim().toUpperCase()
  const [clock, suffix] = normalized.split(' ')
  const [hoursRaw, minutesRaw] = clock.split(':')
  let hours = Number(hoursRaw)
  const mins = Number(minutesRaw)

  if (suffix === 'PM' && hours !== 12) hours += 12
  if (suffix === 'AM' && hours === 12) hours = 0

  const date = new Date()
  date.setHours(hours, mins + minutes, 0, 0)

  const finalHours = date.getHours()
  const finalSuffix = finalHours >= 12 ? 'PM' : 'AM'
  const displayHours = finalHours % 12 === 0 ? 12 : finalHours % 12
  const displayMinutes = String(date.getMinutes()).padStart(2, '0')
  return `${displayHours}:${displayMinutes} ${finalSuffix}`
}

export function buildBookingPricing(serviceId: string, pickupDrop: boolean) {
  const service = getServiceCategory(serviceId)
  const pickupFee = pickupDrop ? 299 : 0
  const subtotal = service.price + pickupFee
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax
  const rewardPoints = Math.round(total / 10)

  return {
    serviceFee: service.price,
    pickupFee,
    subtotal,
    tax,
    total,
    rewardPoints,
  }
}

export function createBookingFromDraft(draft: BookingDraft) {
  const center = getServiceCenter(draft.centerId)
  const service = getServiceCategory(draft.serviceId)
  const vehicle = getVehicle(draft.vehicleId)
  const technician = center.technicians[0]
  const pricing = buildBookingPricing(draft.serviceId, draft.pickupDrop)
  const idSuffix = Math.random().toString(36).slice(2, 8).toUpperCase()

  return {
    id: `booking-${idSuffix}`,
    bookingNumber: `EVS-${Date.now().toString().slice(-6)}-${idSuffix.slice(0, 3)}`,
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}-${idSuffix.slice(0, 3)}`,
    centerId: center.id,
    centerName: center.name,
    centerAddress: center.address,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    vehiclePlate: vehicle.plate,
    serviceId: service.id,
    serviceName: service.name,
    serviceIcon: service.icon,
    date: draft.date,
    time: draft.time,
    pickupDrop: draft.pickupDrop,
    description: draft.description,
    paymentMethod: draft.paymentMethod,
    technicianName: technician.name,
    technicianRole: technician.role,
    technicianRating: technician.rating,
    technicianExperienceYears: technician.experienceYears,
    status: 'in-progress' as BookingStatus,
    paymentStatus: 'Paid' as const,
    estimatedCost: pricing.serviceFee,
    taxAmount: pricing.tax,
    totalAmount: pricing.total,
    rewardPoints: pricing.rewardPoints,
    eta: addMinutesToTime(draft.time, service.durationMins + (draft.pickupDrop ? 50 : 0)),
    createdAt: formatDate(today),
    timelineStep: 0,
  }
}