import { apiRequest, ApiResponse, BackendEnvelope, toApiResponse } from './apiClient';

export async function getLandingData(): Promise<ApiResponse<any>> {
  const payload = await apiRequest<BackendEnvelope<any>>('/api/landing');
  return toApiResponse(payload.data || {}, payload.message || 'Landing data fetched successfully');
}

export async function getAdminDashboard(token: string): Promise<ApiResponse<any>> {
  const payload = await apiRequest<BackendEnvelope<any>>('/api/admin/dashboard', { token });
  return toApiResponse(payload.data || {}, payload.message || 'Admin dashboard fetched successfully');
}

export async function getReports(token: string): Promise<ApiResponse<any>> {
  const payload = await apiRequest<BackendEnvelope<any>>('/api/reports', { token });
  return toApiResponse(payload.data || {}, payload.message || 'Reports fetched successfully');
}

export async function getDrivers(token: string, vehicleId?: string): Promise<ApiResponse<any[]>> {
  const payload = await apiRequest<BackendEnvelope<any[]>>('/api/drivers', {
    token,
    query: { vehicleId },
  });
  return toApiResponse(payload.data || [], payload.message || 'Drivers fetched successfully');
}

export async function createDriver(token: string, body: Record<string, unknown>): Promise<ApiResponse<any>> {
  const payload = await apiRequest<BackendEnvelope<any>>('/api/drivers', {
    method: 'POST',
    token,
    body,
  });
  return toApiResponse(payload.data || {}, payload.message || 'Driver created successfully');
}

export async function getTrips(token: string): Promise<ApiResponse<any[]>> {
  const payload = await apiRequest<BackendEnvelope<any[]>>('/api/trips', { token });
  return toApiResponse(payload.data || [], payload.message || 'Trips fetched successfully');
}

export async function createTrip(token: string, body: Record<string, unknown>): Promise<ApiResponse<any>> {
  const payload = await apiRequest<BackendEnvelope<any>>('/api/trips', {
    method: 'POST',
    token,
    body,
  });
  return toApiResponse(payload.data || {}, payload.message || 'Trip created successfully');
}

export async function getNotifications(token: string): Promise<ApiResponse<any[]>> {
  const payload = await apiRequest<BackendEnvelope<any[]>>('/api/notifications', { token });
  return toApiResponse(payload.data || [], payload.message || 'Notifications fetched successfully');
}

export async function getTokenLedger(token: string): Promise<ApiResponse<any>> {
  const payload = await apiRequest<BackendEnvelope<any>>('/api/tokens', { token });
  return toApiResponse(payload.data || {}, payload.message || 'Token ledger fetched successfully');
}
