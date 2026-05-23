import { apiRequest, ApiResponse, BackendEnvelope, toApiResponse } from './apiClient';
import { getChargingHistory } from './chargingApi';
import { getServices } from './serviceApi';

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

export async function getDashboardStats(token?: string): Promise<ApiResponse<DashboardStats>> {
  if (token) {
    const payload = await apiRequest<BackendEnvelope<{
      totalUsers: number;
      chargingSessions: number;
      revenue: number;
      activeFleets: number;
      totalDrivers?: number;
    }>>('/api/admin/dashboard', { token });

    return toApiResponse(
      {
        totalUsers: payload.data?.totalUsers || 0,
        chargingSessions: payload.data?.chargingSessions || 0,
        totalRevenue: payload.data?.revenue || 0,
        activeFleets: payload.data?.activeFleets || 0,
        cafeOrders: payload.data?.totalDrivers || 0,
        lastUpdatedAt: new Date().toISOString(),
      },
      payload.message || 'Dashboard statistics fetched successfully.',
    );
  }

  const [chargingHistory, serviceRequests] = await Promise.all([
    getChargingHistory().catch(() => toApiResponse([], '')),
    getServices().catch(() => toApiResponse([], '')),
  ]);

  return toApiResponse(
    {
      totalUsers: 0,
      chargingSessions: chargingHistory.data.length,
      totalRevenue: 0,
      activeFleets: 0,
      cafeOrders: serviceRequests.data.length,
      lastUpdatedAt: new Date().toISOString(),
    },
    'Dashboard statistics fetched with public fallback mode.',
  );
}

export async function getUsers(token?: string): Promise<ApiResponse<UserData[]>> {
  if (!token) {
    return toApiResponse([], 'User list requires an authenticated admin token.');
  }

  const payload = await apiRequest<BackendEnvelope<{ id: string; name: string; email: string; role: string }>>('/api/auth/profile', { token });
  if (!payload.data) return toApiResponse([], payload.message || 'User profile not available.');

  return toApiResponse(
    [
      {
        userId: payload.data.id,
        userName: payload.data.name,
        email: payload.data.email,
        phone: '',
        userType: payload.data.role === 'admin' ? 'admin' : 'customer',
        registrationDate: new Date().toISOString(),
        status: 'active',
        totalTransactions: 0,
      },
    ],
    'Authenticated user fetched successfully.',
  );
}

export async function getChargingReports(): Promise<ApiResponse<ChargingReport[]>> {
  const [stations, bookings] = await Promise.all([getChargingStations(), getChargingHistory().catch(() => toApiResponse([], ''))]);

  return toApiResponse(
    stations.data.map((station) => ({
      reportId: station.id,
      stationName: station.stationName,
      city: 'Unknown',
      sessionsCount: bookings.data.filter((booking) => booking.id && booking.id.includes(station.id)).length,
      totalEnergyKwh: 0,
      peakHourUsage: 0,
      averageChargingDurationMinutes: 0,
      revenueGenerated: 0,
      periodEndDate: new Date().toISOString(),
    })),
    'Charging reports fetched successfully.',
  );
}

export async function getRevenueAnalytics(): Promise<ApiResponse<RevenueAnalytics[]>> {
  const [cafeOrders, serviceRequests, chargingReports] = await Promise.all([
    getCafeOrders(),
    getServices(),
    getChargingReports(),
  ]);

  const totalRevenue = cafeOrders.data.reduce((sum, order) => sum + order.amount, 0);

  return toApiResponse(
    [
      {
        period: new Date().toISOString().slice(0, 7),
        chargingRevenue: 0,
        serviceRevenue: 0,
        cafeRevenue: totalRevenue,
        fleetManagementRevenue: 0,
        totalRevenue,
        growthPercentage: 0,
        transactionCount: cafeOrders.data.length + serviceRequests.data.length + chargingReports.data.length,
      },
    ],
    'Revenue analytics fetched successfully.',
  );
}