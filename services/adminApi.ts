export interface DashboardStats {
  totalUsers: number;
  chargingSessions: number;
  totalRevenue: number;
  activeFleets: number;
  cafeOrders: number;
  lastUpdatedAt: string;
}

export interface UserData {
  userId: string;
  userName: string;
  email: string;
  phone: string;
  userType: 'customer' | 'driver' | 'admin';
  registrationDate: string;
  status: 'active' | 'inactive' | 'suspended';
  totalTransactions: number;
}

export interface ChargingReport {
  reportId: string;
  stationName: string;
  city: string;
  sessionsCount: number;
  totalEnergyKwh: number;
  peakHourUsage: number;
  averageChargingDurationMinutes: number;
  revenueGenerated: number;
  periodEndDate: string;
}

export interface RevenueAnalytics {
  period: string;
  chargingRevenue: number;
  serviceRevenue: number;
  cafeRevenue: number;
  fleetManagementRevenue: number;
  totalRevenue: number;
  growthPercentage: number;
  transactionCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

const MOCK_DELAY_MS = 450;

// Mock Dashboard Statistics
const mockDashboardStats: DashboardStats = {
  totalUsers: 5843,
  chargingSessions: 12456,
  totalRevenue: 18750000,
  activeFleets: 142,
  cafeOrders: 8932,
  lastUpdatedAt: new Date().toISOString(),
};

// Mock Users Data
const mockUsers: UserData[] = [
  {
    userId: 'usr-001',
    userName: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91-9876543201',
    userType: 'customer',
    registrationDate: '2026-01-15T10:30:00.000Z',
    status: 'active',
    totalTransactions: 24,
  },
  {
    userId: 'usr-002',
    userName: 'Priya Singh',
    email: 'priya.singh@example.com',
    phone: '+91-9876543202',
    userType: 'driver',
    registrationDate: '2026-02-20T08:15:00.000Z',
    status: 'active',
    totalTransactions: 156,
  },
  {
    userId: 'usr-003',
    userName: 'Arjun Desai',
    email: 'arjun.desai@example.com',
    phone: '+91-9876543203',
    userType: 'customer',
    registrationDate: '2026-03-10T14:45:00.000Z',
    status: 'active',
    totalTransactions: 8,
  },
  {
    userId: 'usr-004',
    userName: 'Admin User',
    email: 'admin@energeia.com',
    phone: '+91-9876543204',
    userType: 'admin',
    registrationDate: '2025-12-01T09:00:00.000Z',
    status: 'active',
    totalTransactions: 1204,
  },
  {
    userId: 'usr-005',
    userName: 'Nisha Verma',
    email: 'nisha.verma@example.com',
    phone: '+91-9876543205',
    userType: 'customer',
    registrationDate: '2026-04-05T11:20:00.000Z',
    status: 'inactive',
    totalTransactions: 3,
  },
];

// Mock Charging Reports
const mockChargingReports: ChargingReport[] = [
  {
    reportId: 'chrg-rpt-001',
    stationName: 'Energeia Hub - Downtown',
    city: 'Pune',
    sessionsCount: 342,
    totalEnergyKwh: 8450,
    peakHourUsage: 1240,
    averageChargingDurationMinutes: 38,
    revenueGenerated: 2850000,
    periodEndDate: '2026-05-14T23:59:59.000Z',
  },
  {
    reportId: 'chrg-rpt-002',
    stationName: 'Green Route Station - North',
    city: 'Pune',
    sessionsCount: 278,
    totalEnergyKwh: 6890,
    peakHourUsage: 1050,
    averageChargingDurationMinutes: 42,
    revenueGenerated: 2340000,
    periodEndDate: '2026-05-14T23:59:59.000Z',
  },
  {
    reportId: 'chrg-rpt-003',
    stationName: 'ChargePoint Arena - Central',
    city: 'Bangalore',
    sessionsCount: 456,
    totalEnergyKwh: 11200,
    peakHourUsage: 1680,
    averageChargingDurationMinutes: 35,
    revenueGenerated: 3920000,
    periodEndDate: '2026-05-14T23:59:59.000Z',
  },
  {
    reportId: 'chrg-rpt-004',
    stationName: 'EV Power Hub - West',
    city: 'Hyderabad',
    sessionsCount: 389,
    totalEnergyKwh: 9650,
    peakHourUsage: 1450,
    averageChargingDurationMinutes: 40,
    revenueGenerated: 3280000,
    periodEndDate: '2026-05-14T23:59:59.000Z',
  },
];

// Mock Revenue Analytics
const mockRevenueAnalytics: RevenueAnalytics[] = [
  {
    period: '2026-04',
    chargingRevenue: 5200000,
    serviceRevenue: 2150000,
    cafeRevenue: 1890000,
    fleetManagementRevenue: 3420000,
    totalRevenue: 12660000,
    growthPercentage: 8.5,
    transactionCount: 3245,
  },
  {
    period: '2026-05',
    chargingRevenue: 5640000,
    serviceRevenue: 2380000,
    cafeRevenue: 2120000,
    fleetManagementRevenue: 3750000,
    totalRevenue: 13890000,
    growthPercentage: 9.7,
    transactionCount: 3521,
  },
  {
    period: '2026-03',
    chargingRevenue: 4890000,
    serviceRevenue: 1980000,
    cafeRevenue: 1720000,
    fleetManagementRevenue: 3150000,
    totalRevenue: 11740000,
    growthPercentage: 5.2,
    transactionCount: 2984,
  },
];

const wait = (ms: number): Promise<void> =>
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

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  // Update timestamp on each call to reflect current state
  const updatedStats = {
    ...mockDashboardStats,
    lastUpdatedAt: new Date().toISOString(),
  };

  return buildResponse(updatedStats, 'Dashboard statistics fetched successfully.');
}

export async function getUsers(): Promise<ApiResponse<UserData[]>> {
  return buildResponse(mockUsers, 'User list fetched successfully.');
}

export async function getChargingReports(): Promise<ApiResponse<ChargingReport[]>> {
  return buildResponse(mockChargingReports, 'Charging reports fetched successfully.');
}

export async function getRevenueAnalytics(): Promise<ApiResponse<RevenueAnalytics[]>> {
  return buildResponse(mockRevenueAnalytics, 'Revenue analytics fetched successfully.');
}
