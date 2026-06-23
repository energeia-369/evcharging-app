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
    name: 'Tata Nexon EV - Fleet A',
    model: 'Nexon EV Prime',
    number: 'MH-12-EV-4501',
    battery: 85,
    status: 'in-trip',
    location: 'Ramwadi Metro Station, Pune',
    latitude: 18.5583,
    longitude: 73.9142,
    driverId: 'driver-1',
    driverName: 'Rahul Patil',
    currentMileage: 25230,
    lastChargeTime: 'Today 08:30 AM',
    nextServiceDate: formatDate(addDays(15)),
    maintenanceStatus: 'good',
    imageLabel: 'Premium Nexon EV SUV',
    tripStatus: 'Active trip to Pune Airport',
    estimatedRange: 285,
  },
  {
    id: 'vehicle-2',
    name: 'MG ZS EV - Fleet B',
    model: 'ZS EV Excite',
    number: 'MH-12-EV-7809',
    battery: 42,
    status: 'charging',
    location: 'Swargate EV Charging Hub, Zone 1',
    latitude: 18.5018,
    longitude: 73.8636,
    driverId: 'driver-2',
    driverName: 'Suresh Deshmukh',
    currentMileage: 18156,
    lastChargeTime: 'Today 12:15 PM',
    nextServiceDate: formatDate(addDays(8)),
    maintenanceStatus: 'good',
    imageLabel: 'Premium MG EV SUV',
    tripStatus: 'Charging - 45 mins remaining',
    estimatedRange: 220,
  },
  {
    id: 'vehicle-3',
    name: 'Tata Tiago EV - Fleet C',
    model: 'Tiago EV XT',
    number: 'MH-14-EV-2032',
    battery: 95,
    status: 'available',
    location: 'Vanaz Metro Station Parking, Kothrud',
    latitude: 18.5073,
    longitude: 73.8012,
    driverId: 'driver-3',
    driverName: 'Anil Kadam',
    currentMileage: 12450,
    lastChargeTime: 'Today 06:00 AM',
    nextServiceDate: formatDate(addDays(22)),
    maintenanceStatus: 'good',
    imageLabel: 'Compact Tiago hatchback',
    tripStatus: 'Ready for assignment',
    estimatedRange: 195,
  },
  {
    id: 'vehicle-4',
    name: 'Mahindra XUV400 - Fleet D',
    model: 'XUV400 EL',
    number: 'MH-12-EV-9911',
    battery: 28,
    status: 'maintenance',
    location: 'PCMC Service Depot, Nigdi',
    latitude: 18.6500,
    longitude: 73.7667,
    driverId: 'driver-4',
    driverName: 'Ganesh Shinde',
    currentMileage: 31789,
    lastChargeTime: 'Yesterday 05:30 PM',
    nextServiceDate: formatDate(today),
    maintenanceStatus: 'critical',
    imageLabel: 'Mahindra EV SUV',
    tripStatus: 'Under scheduled maintenance',
    estimatedRange: 110,
  },
  {
    id: 'vehicle-5',
    name: 'BYD E6 - Fleet E',
    model: 'E6 MPV',
    number: 'MH-12-EV-5544',
    battery: 72,
    status: 'idle',
    location: 'Chandani Chowk Bypass Point',
    latitude: 18.5085,
    longitude: 73.7749,
    driverId: 'driver-5',
    driverName: 'Sachin Joshi',
    currentMileage: 28921,
    lastChargeTime: 'Today 02:00 PM',
    nextServiceDate: formatDate(addDays(12)),
    maintenanceStatus: 'good',
    imageLabel: 'Premium Long Range BYD MPV',
    tripStatus: 'Idle - awaiting assignment',
    estimatedRange: 410,
  },
  {
    id: 'vehicle-6',
    name: 'Tata Tigor EV - Fleet F',
    model: 'Tigor EV XZ+',
    number: 'MH-14-EV-8844',
    battery: 58,
    status: 'in-trip',
    location: 'Hinjawadi Phase 2 IT Corridor',
    latitude: 18.5910,
    longitude: 73.7380,
    driverId: 'driver-1',
    driverName: 'Rahul Patil',
    currentMileage: 19203,
    lastChargeTime: 'Today 11:00 AM',
    nextServiceDate: formatDate(addDays(18)),
    maintenanceStatus: 'warning',
    imageLabel: 'Compact Tigor Sedan EV',
    tripStatus: 'Active trip to Kothrud',
    estimatedRange: 160,
  },
]

export const drivers: Driver[] = [
  {
    id: 'driver-1',
    name: 'Rahul Patil',
    email: 'rahul.patil@energeia.in',
    phone: '+91 98230 45678',
    rating: 4.8,
    totalTrips: 156,
    availability: 'on-trip',
    assignedVehicleId: 'vehicle-1',
    licenseNumber: 'MH-12-2021-0089423',
    profileImage: 'Professional Pune EV Cab driver',
    joinDate: formatDate(addDays(-365)),
  },
  {
    id: 'driver-2',
    name: 'Suresh Deshmukh',
    email: 'suresh.deshmukh@energeia.in',
    phone: '+91 91580 12345',
    rating: 4.9,
    totalTrips: 203,
    availability: 'on-trip',
    assignedVehicleId: 'vehicle-2',
    licenseNumber: 'MH-12-2019-0123556',
    profileImage: 'Professional driver based in Swargate',
    joinDate: formatDate(addDays(-520)),
  },
  {
    id: 'driver-3',
    name: 'Anil Kadam',
    email: 'anil.kadam@energeia.in',
    phone: '+91 88888 77766',
    rating: 4.7,
    totalTrips: 128,
    availability: 'available',
    assignedVehicleId: 'vehicle-3',
    licenseNumber: 'MH-14-2022-0056789',
    profileImage: 'Professional driver based in Kothrud',
    joinDate: formatDate(addDays(-380)),
  },
  {
    id: 'driver-4',
    name: 'Ganesh Shinde',
    email: 'ganesh.shinde@energeia.in',
    phone: '+91 99750 99887',
    rating: 4.6,
    totalTrips: 92,
    availability: 'off-duty',
    assignedVehicleId: null,
    licenseNumber: 'MH-12-2020-0044556',
    profileImage: 'Professional driver based in Nigdi PCMC',
    joinDate: formatDate(addDays(-220)),
  },
  {
    id: 'driver-5',
    name: 'Sachin Joshi',
    email: 'sachin.joshi@energeia.in',
    phone: '+91 94220 94220',
    rating: 4.8,
    totalTrips: 171,
    availability: 'available',
    assignedVehicleId: 'vehicle-5',
    licenseNumber: 'MH-12-2018-0099881',
    profileImage: 'Professional driver based in Chandani Chowk',
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
    distance: 6.0,
    duration: '25m',
    startLocation: 'Ramwadi',
    endLocation: 'Airport',
    cost: 252,
    status: 'completed',
  },
  {
    id: 'trip-2',
    vehicleId: 'vehicle-2',
    driverId: 'driver-2',
    startTime: '2026-05-16 10:00',
    endTime: '2026-05-16 11:20',
    distance: 7.0,
    duration: '35m',
    startLocation: 'Swargate',
    endLocation: 'Katraj',
    cost: 294,
    status: 'completed',
  },
  {
    id: 'trip-3',
    vehicleId: 'vehicle-3',
    driverId: 'driver-3',
    startTime: '2026-05-16 06:00',
    endTime: '2026-05-16 07:30',
    distance: 4.0,
    duration: '20m',
    startLocation: 'Wanaj',
    endLocation: 'Chandani chawk',
    cost: 168,
    status: 'completed',
  },
]

export const chargingSessions: ChargingSession[] = [
  {
    id: 'session-1',
    vehicleId: 'vehicle-1',
    stationName: 'Ramwadi Metro Fast Charger',
    stationLocation: 'Viman Nagar Road, Pune',
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
    stationName: 'Swargate EV Charging Station',
    stationLocation: 'Jedhe Square Swargate, Pune',
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
    stationName: 'Chandani Chowk BYD Charger',
    stationLocation: 'Bavdhan Bypass Highway',
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
    description: 'Routine maintenance at Nigdi Depot',
    scheduledDate: formatDate(today),
    status: 'in-progress',
    estimatedCost: 2500,
    priority: 'high',
  },
  {
    id: 'maint-2',
    vehicleId: 'vehicle-2',
    type: 'battery',
    description: 'Battery health balancing check',
    scheduledDate: formatDate(addDays(8)),
    status: 'scheduled',
    estimatedCost: 3500,
    priority: 'medium',
  },
  {
    id: 'maint-3',
    vehicleId: 'vehicle-1',
    type: 'electrical',
    description: 'Charging connector pin inspection',
    scheduledDate: formatDate(addDays(15)),
    status: 'scheduled',
    estimatedCost: 1200,
    priority: 'low',
  },
  {
    id: 'maint-4',
    vehicleId: 'vehicle-6',
    type: 'suspension',
    description: 'Pune pothole shock absorber alignment',
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
    message: 'Vehicle MH-12-EV-7809 charging completed. Battery at 100%.',
    timestamp: 'Today 2:30 PM',
    read: false,
    vehicleId: 'vehicle-2',
  },
  {
    id: 'notif-2',
    type: 'battery',
    title: 'Low Battery Alert',
    message: 'Vehicle MH-12-EV-9911 battery at critical level (28%).',
    timestamp: 'Today 1:45 PM',
    read: false,
    vehicleId: 'vehicle-4',
  },
  {
    id: 'notif-3',
    type: 'maintenance',
    title: 'Maintenance Due',
    message: 'Scheduled maintenance for MH-12-EV-4501 is due in 15 days.',
    timestamp: 'Today 12:00 PM',
    read: true,
    vehicleId: 'vehicle-1',
  },
  {
    id: 'notif-4',
    type: 'driver',
    title: 'Driver Assignment',
    message: 'Driver Sachin Joshi has been assigned to vehicle MH-12-EV-5544.',
    timestamp: 'Today 11:30 AM',
    read: true,
    driverId: 'driver-5',
  },
  {
    id: 'notif-5',
    type: 'emergency',
    title: 'Vehicle Alert',
    message: 'Alert: Vehicle MH-14-EV-8844 reported low tire pressure.',
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
    invoiceNumber: 'INV-2026-001',
    date: formatDate(addDays(-5)),
    chargeAmount: 2850,
    maintenanceAmount: 1200,
    totalAmount: 4050,
    status: 'paid',
  },
  {
    id: 'inv-2',
    vehicleId: 'vehicle-2',
    invoiceNumber: 'INV-2026-002',
    date: formatDate(addDays(-3)),
    chargeAmount: 1950,
    maintenanceAmount: 0,
    totalAmount: 1950,
    status: 'paid',
  },
  {
    id: 'inv-3',
    vehicleId: 'vehicle-3',
    invoiceNumber: 'INV-2026-003',
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
