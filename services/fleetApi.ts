import { apiRequest, toApiResponse, ApiResponse, BackendEnvelope } from './apiClient';

export type TripStatus = 'idle' | 'en-route' | 'completed' | 'maintenance';
export type ChargingStatus = 'not-charging' | 'charging' | 'fully-charged';
export type LiveStatus = 'online' | 'offline';

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

export interface FleetVehicle {
  vehicleId: string;
  vehicleNumber: string;
  vehicleModel: string;
  driverName: string;
  batteryPercentage: number;
  currentSpeed: number;
  gpsCoordinates: GpsCoordinates;
  tripStatus: TripStatus;
  chargingStatus: ChargingStatus;
}

export interface VehicleDetails extends FleetVehicle {
  assignedRegion: string;
  lastServiceDate: string;
  odometerKm: number;
}

export interface LiveTrackingItem {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  routeInfo: string;
  liveStatus: LiveStatus;
  updatedAt: string;
}

export interface TripHistoryItem {
  tripId: string;
  vehicleId: string;
  vehicleNumber: string;
  driverName: string;
  startLocation: string;
  endLocation: string;
  distanceKm: number;
  durationMinutes: number;
  status: 'completed' | 'cancelled';
  completedAt: string;
  revenue: number;
}

export interface FleetAnalytics {
  totalVehicles: number;
  activeTrips: number;
  chargingVehicles: number;
  completedTrips: number;
  totalRevenue: number;
}

export interface AssignDriverRequest {
  vehicleId: string;
  driverName: string;
}

const mapVehicle = (vehicle: {
  _id: string;
  vehicleName: string;
  vehicleNumber: string;
  batteryStatus: number;
  location: string;
  driverName: string;
  status: string;
}): FleetVehicle => ({
  vehicleId: vehicle._id,
  vehicleNumber: vehicle.vehicleNumber,
  vehicleModel: vehicle.vehicleName,
  driverName: vehicle.driverName,
  batteryPercentage: vehicle.batteryStatus,
  currentSpeed: 0,
  gpsCoordinates: { latitude: 0, longitude: 0 },
  tripStatus: vehicle.status === 'maintenance' ? 'maintenance' : vehicle.status === 'inactive' ? 'idle' : 'en-route',
  chargingStatus: vehicle.batteryStatus >= 90 ? 'fully-charged' : vehicle.batteryStatus < 40 ? 'charging' : 'not-charging',
});

export async function getFleetVehicles(): Promise<ApiResponse<FleetVehicle[]>> {
  const payload = await apiRequest<BackendEnvelope<Array<Parameters<typeof mapVehicle>[0]>>>('/api/fleet');
  return toApiResponse((payload.data ?? []).map(mapVehicle), payload.message || 'Fleet vehicles fetched successfully.');
}

export async function getVehicleDetails(vehicleId: string): Promise<ApiResponse<VehicleDetails | null>> {
  const payload = await apiRequest<BackendEnvelope<Parameters<typeof mapVehicle>[0]>>(`/api/fleet/${vehicleId}`);
  if (!payload.data) return toApiResponse(null, payload.message || 'Vehicle not found.');

  return toApiResponse(
    {
      ...mapVehicle(payload.data),
      assignedRegion: payload.data.location,
      lastServiceDate: new Date().toISOString(),
      odometerKm: 0,
    },
    payload.message || 'Vehicle details fetched successfully.',
  );
}

export async function createFleetVehicle(body: {
  vehicleName: string;
  vehicleNumber: string;
  batteryStatus: number;
  location: string;
  driverName: string;
  status?: string;
}): Promise<ApiResponse<FleetVehicle>> {
  const payload = await apiRequest<BackendEnvelope<Parameters<typeof mapVehicle>[0]>>('/api/fleet', {
    method: 'POST',
    body,
  });

  if (!payload.data) throw new Error(payload.message || 'Failed to create fleet vehicle.');
  return toApiResponse(mapVehicle(payload.data), payload.message || 'Fleet vehicle created successfully.');
}

export async function updateFleetVehicle(
  vehicleId: string,
  body: Partial<{ vehicleName: string; vehicleNumber: string; batteryStatus: number; location: string; driverName: string; status: string }>,
): Promise<ApiResponse<FleetVehicle>> {
  const payload = await apiRequest<BackendEnvelope<Parameters<typeof mapVehicle>[0]>>(`/api/fleet/${vehicleId}`, {
    method: 'PUT',
    body,
  });

  if (!payload.data) throw new Error(payload.message || 'Failed to update fleet vehicle.');
  return toApiResponse(mapVehicle(payload.data), payload.message || 'Fleet vehicle updated successfully.');
}

export async function deleteFleetVehicle(vehicleId: string): Promise<ApiResponse<null>> {
  const payload = await apiRequest<BackendEnvelope<null>>(`/api/fleet/${vehicleId}`, { method: 'DELETE' });
  return toApiResponse(null, payload.message || 'Fleet vehicle deleted successfully.');
}

export async function getLiveTracking(): Promise<ApiResponse<LiveTrackingItem[]>> {
  const vehicles = await getFleetVehicles();
  return toApiResponse(
    vehicles.data.map((vehicle) => ({
      vehicleId: vehicle.vehicleId,
      latitude: vehicle.gpsCoordinates.latitude,
      longitude: vehicle.gpsCoordinates.longitude,
      speed: vehicle.currentSpeed,
      routeInfo: vehicle.tripStatus === 'en-route' ? 'Active route' : 'No active route assigned',
      liveStatus: vehicle.tripStatus === 'maintenance' ? 'offline' : 'online',
      updatedAt: new Date().toISOString(),
    })),
    'Live tracking snapshot fetched successfully.',
  );
}

export async function getTripHistory(): Promise<ApiResponse<TripHistoryItem[]>> {
  const vehicles = await getFleetVehicles();
  return toApiResponse(
    vehicles.data.map((vehicle) => ({
      tripId: `trip-${vehicle.vehicleId}`,
      vehicleId: vehicle.vehicleId,
      vehicleNumber: vehicle.vehicleNumber,
      driverName: vehicle.driverName,
      startLocation: vehicle.vehicleModel,
      endLocation: vehicle.vehicleModel,
      distanceKm: 0,
      durationMinutes: 0,
      status: 'completed',
      completedAt: new Date().toISOString(),
      revenue: 0,
    })),
    'Trip history fetched successfully.',
  );
}

export async function assignDriver(
  request: AssignDriverRequest,
): Promise<ApiResponse<{ vehicleId: string; vehicleNumber: string; driverName: string; tripStatus: TripStatus } | null>> {
  const updated = await updateFleetVehicle(request.vehicleId, { driverName: request.driverName });
  return toApiResponse(
    {
      vehicleId: updated.data.vehicleId,
      vehicleNumber: updated.data.vehicleNumber,
      driverName: updated.data.driverName,
      tripStatus: updated.data.tripStatus,
    },
    'Driver assignment updated successfully.',
  );
}

export async function getFleetAnalytics(): Promise<ApiResponse<FleetAnalytics>> {
  const vehicles = await getFleetVehicles();
  const activeTrips = vehicles.data.filter((vehicle) => vehicle.tripStatus === 'en-route').length;
  const chargingVehicles = vehicles.data.filter((vehicle) => vehicle.chargingStatus === 'charging').length;
  const completedTrips = vehicles.data.filter((vehicle) => vehicle.tripStatus === 'completed').length;

  return toApiResponse(
    {
      totalVehicles: vehicles.data.length,
      activeTrips,
      chargingVehicles,
      completedTrips,
      totalRevenue: 0,
    },
    'Fleet analytics fetched successfully.',
  );
}