export type FranchisePlan = {
  id: string
  name: string
  investment: string
  support: string
  margin: string
}

export type VehicleItem = {
  id: string
  model: string
  variant: string
  color: string
  price: number
  rangeKm: number
  chargingSpeedKw: number
  stock: number
  image: string
}

export type StaffMember = {
  id: string
  name: string
  role: 'Technician' | 'Sales Manager' | 'Service Advisor' | 'Dispatcher' | 'Admin'
  rating: number
  attendance: 'Present' | 'Absent' | 'On Leave'
  phone: string
  email: string
  performance: number
}

export const dashboardStats = {
  totalRevenue: 28500000,
  monthlySales: 68,
  inventoryCount: 124,
  pendingDeliveries: 9,
  activeCustomers: 213,
}

export const dashboardNotifications = [
  '3 new franchise leads in premium locations',
  '5 vehicles require inventory restock review',
  '2 deliveries are currently out for dispatch',
  'Revenue is 18% higher than last month',
]

export const franchisePlans: FranchisePlan[] = [
  { id: 'basic', name: 'Core EV Hub', investment: '₹45L - ₹60L', support: 'Branding, CRM, setup', margin: '12% average margin' },
  { id: 'premium', name: 'Prime EV Studio', investment: '₹75L - ₹1.2Cr', support: 'Premium showroom, AI support', margin: '18% average margin' },
  { id: 'flagship', name: 'Flagship Mobility Center', investment: '₹1.5Cr+', support: 'Exclusive territory and fleet ops', margin: '22% average margin' },
]

export const verificationTimeline = [
  { title: 'Application Submitted', detail: 'Your franchise application is received and queued.', icon: 'file-document' },
  { title: 'Documents Verified', detail: 'GST, PAN, and business papers are being checked.', icon: 'clipboard-check' },
  { title: 'Business Review', detail: 'Location, investment, and market fit are under review.', icon: 'account-tie' },
  { title: 'Financial Approval', detail: 'Funding and margin profile are being assessed.', icon: 'cash' },
  { title: 'Approved', detail: 'The dealership is ready for setup and launch.', icon: 'store' },
]

export const sampleVehicles: VehicleItem[] = [
  { id: 'veh-1', model: 'Energeia E1', variant: 'Long Range', color: 'Pearl White', price: 2499000, rangeKm: 520, chargingSpeedKw: 120, stock: 18, image: 'EV' },
  { id: 'veh-2', model: 'Energeia E2', variant: 'Performance', color: 'Forest Green', price: 3299000, rangeKm: 610, chargingSpeedKw: 150, stock: 10, image: 'EV' },
  { id: 'veh-3', model: 'Energeia Urban', variant: 'City Edition', color: 'Midnight Silver', price: 1899000, rangeKm: 400, chargingSpeedKw: 90, stock: 24, image: 'EV' },
  { id: 'veh-4', model: 'Energeia X', variant: 'Luxury Pack', color: 'Ocean Blue', price: 4199000, rangeKm: 650, chargingSpeedKw: 170, stock: 8, image: 'EV' },
]

export const monthlyRevenue = [
  { month: 'Jan', revenue: 2100000 },
  { month: 'Feb', revenue: 2400000 },
  { month: 'Mar', revenue: 2650000 },
  { month: 'Apr', revenue: 2900000 },
  { month: 'May', revenue: 3150000 },
  { month: 'Jun', revenue: 3400000 },
]

export const staffMembers: StaffMember[] = [
  { id: 'st-1', name: 'Asha Kulkarni', role: 'Technician', rating: 4.9, attendance: 'Present', phone: '+91 90000 11111', email: 'asha.k@energeia.com', performance: 92 },
  { id: 'st-2', name: 'Neha Patil', role: 'Sales Manager', rating: 4.8, attendance: 'Present', phone: '+91 90000 22222', email: 'neha.p@energeia.com', performance: 89 },
  { id: 'st-3', name: 'Ravi Singh', role: 'Service Advisor', rating: 4.6, attendance: 'On Leave', phone: '+91 90000 33333', email: 'ravi.s@energeia.com', performance: 77 },
  { id: 'st-4', name: 'Priya Nair', role: 'Dispatcher', rating: 4.7, attendance: 'Present', phone: '+91 90000 44444', email: 'priya.n@energeia.com', performance: 84 },
]

export const commissionData = {
  availableEarnings: 125000,
  monthlyCommission: 86000,
  pendingPayouts: 32000,
  walletBalance: 157000,
  taxWithheld: 11250,
}

export const analyticsLeaderBoard = [
  { name: 'Energeia South', city: 'Bangalore', score: 96, revenue: 4180000 },
  { name: 'Energeia Prime', city: 'Mumbai', score: 94, revenue: 3850000 },
  { name: 'Energeia Central', city: 'Pune', score: 91, revenue: 3460000 },
]

export const salesGrowth = { percent: 18.6, period: 'last 6 months' }
export const topSellingVehicles = [
  { name: 'Energeia E1', units: 188 },
  { name: 'Energeia E2', units: 144 },
  { name: 'Energeia Urban', units: 122 },
]

export const profitSummary = {
  grossProfit: 9700000,
  netProfit: 6200000,
  marginPercent: 21,
}

export const customerGrowth = [
  { month: 'Jan', customers: 52 },
  { month: 'Feb', customers: 61 },
  { month: 'Mar', customers: 67 },
  { month: 'Apr', customers: 74 },
  { month: 'May', customers: 81 },
  { month: 'Jun', customers: 95 },
]

export const aiInsights = [
  'Prime location fit detected near high-income EV corridors.',
  'Premium plan has the strongest projected margin profile.',
  'Inventory velocity is highest for long-range city EVs.',
]

export function formatINR(amount: number) {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}
