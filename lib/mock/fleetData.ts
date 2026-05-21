export type Vehicle = {
  id: string
  name: string
  model: string
  number: string
  battery: number
  status: 'idle' | 'charging' | 'in-trip' | 'maintenance' | 'available'
  location: string
  latitude: number
  longitude: number
  driverId: string
  driverName: string
  currentMileage: number
  lastChargeTime: string
  nextServiceDate: string
  maintenanceStatus: 'good' | 'warning' | 'critical'
  imageLabel: string
  tripStatus: string
  estimatedRange: number
}

export type Driver = {
  id: string
  name: string
  email: string
  phone: string
  rating: number
  totalTrips: number
  availability: 'available' | 'on-trip' | 'off-duty'
  assignedVehicleId: string | null
  licenseNumber: string
  profileImage: string
  joinDate: string
}

export type Trip = {
  id: string
  vehicleId: string
  driverId: string
  startTime: string
  endTime: string
  distance: number
  duration: string
  startLocation: string
  endLocation: string
  cost: number
  status: 'completed' | 'cancelled'
}

export type ChargingSession = {
  id: string
  vehicleId: string
  stationName: string
  stationLocation: string
  startTime: string
  endTime: string
  batteryStart: number
  batteryEnd: number
  energyDelivered: number
  cost: number
  status: 'completed' | 'in-progress' | 'cancelled'
}

export type MaintenanceRecord = {
  id: string
  vehicleId: string
  type: 'routine' | 'battery' | 'electrical' | 'brake' | 'suspension'
  description: string
  scheduledDate: string
  status: 'scheduled' | 'in-progress' | 'completed'
  estimatedCost: number
  priority: 'low' | 'medium' | 'high'
}

export type Notification = {
  id: string
  type: 'charging' | 'battery' | 'maintenance' | 'driver' | 'emergency'
  title: string
  message: string
  timestamp: string
  read: boolean
  vehicleId?: string
  driverId?: string
}

export type AnalyticsData = {
  totalVehicles: number
  activeVehicles: number
  chargingVehicles: number
  inService: number
  averageBatteryHealth: number
  totalKmThisMonth: number
  totalCostThisMonth: number
  averageCostPerKm: number
  fleetUtilization: number
  chargingTimeByHour: Array<{ hour: number; sessions: number }>
  batteryUsageDaily: Array<{ day: string; percentage: number }>
  vehicleHealthScore: number
}

export type Invoice = {
  id: string
  vehicleId: string
  invoiceNumber: string
  date: string
  chargeAmount: number
  maintenanceAmount: number
  totalAmount: number
  status: 'paid' | 'pending'
}

const today = new Date()
const formatDate = (date: Date) => date.toLocaleDateString('en-IN')
const addDays = (days: number) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000)

export const vehicles: Vehicle[] = [
  {
    id: 'vehicle-1',
    name: 'Tesla Model 3 - Fleet A',
    model: 'Model 3',
    number: 'MH-01-EV-2024',
    battery: 85,
    status: 'in-trip',
    location: 'Downtown Metro, Sector 5',
    latitude: 19.076,
    longitude: 72.8479,
    driverId: 'driver-1',
    driverName: 'Raj Kumar',
    currentMileage: 45230,
    lastChargeTime: 'Today 08:30 AM',
    nextServiceDate: formatDate(addDays(15)),
    maintenanceStatus: 'good',
    imageLabel: 'Premium EV charging vehicle',
    tripStatus: 'Active trip to Airport',
    estimatedRange: 285,
  },
  {
    id: 'vehicle-2',
    name: 'Nissan Leaf - Fleet B',
    model: 'Leaf',
    number: 'MH-02-EV-2024',
    battery: 42,
    status: 'charging',
    location: 'Central Charging Hub, Zone 3',
    latitude: 19.0844,
    longitude: 72.8326,
    driverId: 'driver-2',
    driverName: 'Priya Sharma',
    currentMileage: 32156,
    lastChargeTime: 'Today 12:15 PM',
    nextServiceDate: formatDate(addDays(8)),
    maintenanceStatus: 'good',
    imageLabel: 'Compact EV model',
    tripStatus: 'Charging - 45 mins remaining',
    estimatedRange: 156,
  },
  {
    id: 'vehicle-3',
    name: 'MG ZS EV - Fleet C',
    model: 'ZS EV',
    number: 'MH-03-EV-2024',
    battery: 95,
    status: 'available',
    location: 'Fleet Depot, Bay 2',
    latitude: 19.0176,
    longitude: 72.8469,
    driverId: 'driver-3',
    driverName: 'Arjun Singh',
    currentMileage: 28450,
    lastChargeTime: 'Today 06:00 AM',
    nextServiceDate: formatDate(addDays(22)),
    maintenanceStatus: 'good',
    imageLabel: 'Mid-size EV SUV',
    tripStatus: 'Ready for assignment',
    estimatedRange: 352,
  },
  {
    id: 'vehicle-4',
    name: 'BMW i3 - Fleet D',
    model: 'i3',
    number: 'MH-04-EV-2024',
    battery: 28,
    status: 'maintenance',
    location: 'Service Center, Bldg A',
    latitude: 19.2183,
    longitude: 72.9781,
    driverId: 'driver-4',
    driverName: 'Neha Verma',
    currentMileage: 56789,
    lastChargeTime: 'Yesterday 05:30 PM',
    nextServiceDate: formatDate(today),
    maintenanceStatus: 'critical',
    imageLabel: 'Luxury compact EV',
    tripStatus: 'Under scheduled maintenance',
    estimatedRange: 95,
  },
  {
    id: 'vehicle-5',
    name: 'Hyundai Kona - Fleet E',
    model: 'Kona Electric',
    number: 'MH-05-EV-2024',
    battery: 72,
    status: 'idle',
    location: 'Parking Zone C',
    latitude: 19.1136,
    longitude: 72.8697,
    driverId: 'driver-5',
    driverName: 'Vikram Gupta',
    currentMileage: 38921,
    lastChargeTime: 'Today 02:00 PM',
    nextServiceDate: formatDate(addDays(12)),
    maintenanceStatus: 'good',
    imageLabel: 'Mid-size EV crossover',
    tripStatus: 'Idle - awaiting assignment',
    estimatedRange: 258,
  },
  {
    id: 'vehicle-6',
    name: 'Tata Nexon EV - Fleet F',
    model: 'Nexon EV',
    number: 'MH-06-EV-2024',
    battery: 58,
    status: 'in-trip',
    location: 'Westside Corridor',
    latitude: 19.0546,
    longitude: 72.7868,
    driverId: 'driver-1',
    driverName: 'Raj Kumar',
    currentMileage: 41203,
    lastChargeTime: 'Today 11:00 AM',
    nextServiceDate: formatDate(addDays(18)),
    maintenanceStatus: 'warning',
    imageLabel: 'Popular compact SUV EV',
    tripStatus: 'Active trip to Business Park',
    estimatedRange: 198,
  },
]

export const drivers: Driver[] = [
  {
    id: 'driver-1',
    name: 'Raj Kumar',
    email: 'raj.kumar@fleet.com',
    phone: '+91 98765 43210',
    rating: 4.8,
    totalTrips: 156,
    availability: 'on-trip',
    assignedVehicleId: 'vehicle-1',
    licenseNumber: 'DL-13-K-1234567',
    profileImage: 'Professional driver',
    joinDate: formatDate(addDays(-365)),
  },
  {
    id: 'driver-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@fleet.com',
    phone: '+91 98765 43211',
    rating: 4.9,
    totalTrips: 203,
    availability: 'on-trip',
    assignedVehicleId: 'vehicle-2',
    licenseNumber: 'DL-13-K-1234568',
    profileImage: 'Professional driver',
    joinDate: formatDate(addDays(-520)),
  },
  {
    id: 'driver-3',
    name: 'Arjun Singh',
    email: 'arjun.singh@fleet.com',
    phone: '+91 98765 43212',
    rating: 4.7,
    totalTrips: 128,
    availability: 'available',
    assignedVehicleId: 'vehicle-3',
    licenseNumber: 'DL-13-K-1234569',
    profileImage: 'Professional driver',
    joinDate: formatDate(addDays(-380)),
  },
  {
    id: 'driver-4',
    name: 'Neha Verma',
    email: 'neha.verma@fleet.com',
    phone: '+91 98765 43213',
    rating: 4.6,
    totalTrips: 92,
    availability: 'off-duty',
    assignedVehicleId: null,
    licenseNumber: 'DL-13-K-1234570',
    profileImage: 'Professional driver',
    joinDate: formatDate(addDays(-220)),
  },
  {
    id: 'driver-5',
    name: 'Vikram Gupta',
    email: 'vikram.gupta@fleet.com',
    phone: '+91 98765 43214',
    rating: 4.8,
    totalTrips: 171,
    availability: 'available',
    assignedVehicleId: 'vehicle-5',
    licenseNumber: 'DL-13-K-1234571',
    profileImage: 'Professional driver',
    joinDate: formatDate(addDays(-445)),
  },
]

export const trips: Trip[] = [
  {
    id: 'trip-1',
    vehicleId: 'vehicle-1',
    driverId: 'driver-1',
    startTime: '2026-05-16 08:30',
    endTime: '2026-05-16 09:45',
    distance: 28.5,
    duration: '1h 15m',
    startLocation: 'Bandra Office',
    endLocation: 'Mumbai Airport',
    cost: 285,
    status: 'completed',
  },
  {
    id: 'trip-2',
    vehicleId: 'vehicle-2',
    driverId: 'driver-2',
    startTime: '2026-05-16 10:00',
    endTime: '2026-05-16 11:20',
    distance: 35.2,
    duration: '1h 20m',
    startLocation: 'Downtown Metro',
    endLocation: 'Tech Park',
    cost: 352,
    status: 'completed',
  },
  {
    id: 'trip-3',
    vehicleId: 'vehicle-3',
    driverId: 'driver-3',
    startTime: '2026-05-16 06:00',
    endTime: '2026-05-16 07:30',
    distance: 22.1,
    duration: '1h 30m',
    startLocation: 'Fleet Depot',
    endLocation: 'Business Complex',
    cost: 221,
    status: 'completed',
  },
]

export const chargingSessions: ChargingSession[] = [
  {
    id: 'session-1',
    vehicleId: 'vehicle-1',
    stationName: 'Downtown Hub Station',
    stationLocation: 'Sector 5, Central Business District',
    startTime: 'Today 08:00 AM',
    endTime: 'Today 09:30 AM',
    batteryStart: 20,
    batteryEnd: 85,
    energyDelivered: 45.5,
    cost: 455,
    status: 'completed',
  },
  {
    id: 'session-2',
    vehicleId: 'vehicle-2',
    stationName: 'Central Charging Hub',
    stationLocation: 'Zone 3, Premium Charging Area',
    startTime: 'Today 12:00 PM',
    endTime: 'In Progress',
    batteryStart: 12,
    batteryEnd: 42,
    energyDelivered: 28.3,
    cost: 283,
    status: 'in-progress',
  },
  {
    id: 'session-3',
    vehicleId: 'vehicle-5',
    stationName: 'West Side Fast Charge',
    stationLocation: 'Westside Corridor',
    startTime: 'Today 02:00 PM',
    endTime: 'Today 03:15 PM',
    batteryStart: 15,
    batteryEnd: 72,
    energyDelivered: 38.7,
    cost: 387,
    status: 'completed',
  },
]

export const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'maint-1',
    vehicleId: 'vehicle-4',
    type: 'routine',
    description: 'Regular 40,000 km service',
    scheduledDate: formatDate(today),
    status: 'in-progress',
    estimatedCost: 2500,
    priority: 'high',
  },
  {
    id: 'maint-2',
    vehicleId: 'vehicle-2',
    type: 'battery',
    description: 'Battery health check and balancing',
    scheduledDate: formatDate(addDays(8)),
    status: 'scheduled',
    estimatedCost: 3500,
    priority: 'medium',
  },
  {
    id: 'maint-3',
    vehicleId: 'vehicle-1',
    type: 'electrical',
    description: 'Charging port inspection',
    scheduledDate: formatDate(addDays(15)),
    status: 'scheduled',
    estimatedCost: 1200,
    priority: 'low',
  },
  {
    id: 'maint-4',
    vehicleId: 'vehicle-6',
    type: 'suspension',
    description: 'Suspension alignment check',
    scheduledDate: formatDate(addDays(18)),
    status: 'scheduled',
    estimatedCost: 2000,
    priority: 'medium',
  },
]

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'charging',
    title: 'Charging Complete',
    message: 'Vehicle MH-02-EV-2024 charging completed. Battery at 100%.',
    timestamp: 'Today 2:30 PM',
    read: false,
    vehicleId: 'vehicle-2',
  },
  {
    id: 'notif-2',
    type: 'battery',
    title: 'Low Battery Alert',
    message: 'Vehicle MH-04-EV-2024 battery at critical level (28%).',
    timestamp: 'Today 1:45 PM',
    read: false,
    vehicleId: 'vehicle-4',
  },
  {
    id: 'notif-3',
    type: 'maintenance',
    title: 'Maintenance Due',
    message: 'Scheduled maintenance for MH-01-EV-2024 is due in 15 days.',
    timestamp: 'Today 12:00 PM',
    read: true,
    vehicleId: 'vehicle-1',
  },
  {
    id: 'notif-4',
    type: 'driver',
    title: 'Driver Assignment',
    message: 'Driver Vikram Gupta has been assigned to vehicle MH-05-EV-2024.',
    timestamp: 'Today 11:30 AM',
    read: true,
    driverId: 'driver-5',
  },
  {
    id: 'notif-5',
    type: 'emergency',
    title: 'Vehicle Breakdown',
    message: 'Alert: Vehicle MH-06-EV-2024 has reported low tire pressure.',
    timestamp: 'Today 10:15 AM',
    read: false,
    vehicleId: 'vehicle-6',
  },
]

export const analyticsData: AnalyticsData = {
  totalVehicles: 6,
  activeVehicles: 2,
  chargingVehicles: 1,
  inService: 1,
  averageBatteryHealth: 82,
  totalKmThisMonth: 1245,
  totalCostThisMonth: 12450,
  averageCostPerKm: 10,
  fleetUtilization: 78,
  chargingTimeByHour: [
    { hour: 6, sessions: 2 },
    { hour: 8, sessions: 4 },
    { hour: 10, sessions: 3 },
    { hour: 12, sessions: 5 },
    { hour: 14, sessions: 2 },
    { hour: 16, sessions: 3 },
    { hour: 18, sessions: 6 },
  ],
  batteryUsageDaily: [
    { day: 'Mon', percentage: 65 },
    { day: 'Tue', percentage: 72 },
    { day: 'Wed', percentage: 68 },
    { day: 'Thu', percentage: 80 },
    { day: 'Fri', percentage: 75 },
    { day: 'Sat', percentage: 58 },
    { day: 'Sun', percentage: 62 },
  ],
  vehicleHealthScore: 88,
}

export const invoices: Invoice[] = [
  {
    id: 'inv-1',
    vehicleId: 'vehicle-1',
    invoiceNumber: 'INV-2024-001',
    date: formatDate(addDays(-5)),
    chargeAmount: 2850,
    maintenanceAmount: 1200,
    totalAmount: 4050,
    status: 'paid',
  },
  {
    id: 'inv-2',
    vehicleId: 'vehicle-2',
    invoiceNumber: 'INV-2024-002',
    date: formatDate(addDays(-3)),
    chargeAmount: 1950,
    maintenanceAmount: 0,
    totalAmount: 1950,
    status: 'paid',
  },
  {
    id: 'inv-3',
    vehicleId: 'vehicle-3',
    invoiceNumber: 'INV-2024-003',
    date: formatDate(today),
    chargeAmount: 1820,
    maintenanceAmount: 2500,
    totalAmount: 4320,
    status: 'pending',
  },
]

// Helper functions
export function getVehicle(vehicleId: string) {
  return vehicles.find(v => v.id === vehicleId) ?? vehicles[0]
}

export function getDriver(driverId: string) {
  return drivers.find(d => d.id === driverId) ?? drivers[0]
}

export function formatCurrency(value: number) {
  return `₹ ${value.toLocaleString('en-IN')}`
}

export function getVehicleStatusColor(status: string) {
  switch (status) {
    case 'in-trip':
      return '#0ea5e9'
    case 'charging':
      return '#10b981'
    case 'available':
      return '#8b5cf6'
    case 'maintenance':
      return '#ef4444'
    case 'idle':
      return '#f59e0b'
    default:
      return '#6b7280'
  }
}

export function getMaintenanceColor(status: string) {
  switch (status) {
    case 'good':
      return '#10b981'
    case 'warning':
      return '#f59e0b'
    case 'critical':
      return '#ef4444'
    default:
      return '#6b7280'
  }
}

export function getNotificationIcon(type: string) {
  switch (type) {
    case 'charging':
      return 'battery-charging'
    case 'battery':
      return 'alert-circle'
    case 'maintenance':
      return 'wrench'
    case 'driver':
      return 'account-circle'
    case 'emergency':
      return 'alert-octagon'
    default:
      return 'bell'
  }
}
