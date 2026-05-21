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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

// Mock transport layer can be swapped with real network client in future.
interface ApiTransport {
  request<T>(handler: () => T, message: string): Promise<ApiResponse<T>>;
}

const MOCK_DELAY_MS = 500;

const fleetVehicles: FleetVehicle[] = [
  {
    vehicleId: 'veh-001',
    vehicleNumber: 'MH12AB1001',
    vehicleModel: 'Tata Ace EV',
    driverName: 'Ravi Sharma',
    batteryPercentage: 78,
    currentSpeed: 42,
    gpsCoordinates: {
      latitude: 18.52043,
      longitude: 73.85674,
    },
    tripStatus: 'en-route',
    chargingStatus: 'not-charging',
  },
  {
    vehicleId: 'veh-002',
    vehicleNumber: 'MH14CD2002',
    vehicleModel: 'Mahindra Treo Zor',
    driverName: 'Neha Joshi',
    batteryPercentage: 36,
    currentSpeed: 0,
    gpsCoordinates: {
      latitude: 18.53112,
      longitude: 73.84431,
    },
    tripStatus: 'idle',
    chargingStatus: 'charging',
  },
  {
    vehicleId: 'veh-003',
    vehicleNumber: 'MH01EF3003',
    vehicleModel: 'Euler HiLoad EV',
    driverName: 'Karan Patel',
    batteryPercentage: 92,
    currentSpeed: 0,
    gpsCoordinates: {
      latitude: 18.50624,
      longitude: 73.80791,
    },
    tripStatus: 'completed',
    chargingStatus: 'fully-charged',
  },
];

const vehicleDetailsMap: Record<string, VehicleDetails> = {
  'veh-001': {
    ...fleetVehicles[0],
    assignedRegion: 'Pune Central',
    lastServiceDate: '2026-04-28T10:00:00.000Z',
    odometerKm: 28750,
  },
  'veh-002': {
    ...fleetVehicles[1],
    assignedRegion: 'Pimpri-Chinchwad',
    lastServiceDate: '2026-04-10T09:30:00.000Z',
    odometerKm: 19300,
  },
  'veh-003': {
    ...fleetVehicles[2],
    assignedRegion: 'Pune South',
    lastServiceDate: '2026-05-02T08:15:00.000Z',
    odometerKm: 31240,
  },
};

const tripHistory: TripHistoryItem[] = [
  {
    tripId: 'trip-9001',
    vehicleId: 'veh-003',
    vehicleNumber: 'MH01EF3003',
    driverName: 'Karan Patel',
    startLocation: 'Hinjewadi Phase 2',
    endLocation: 'Koregaon Park',
    distanceKm: 24.6,
    durationMinutes: 68,
    status: 'completed',
    completedAt: '2026-05-14T06:45:00.000Z',
    revenue: 1850,
  },
  {
    tripId: 'trip-9002',
    vehicleId: 'veh-001',
    vehicleNumber: 'MH12AB1001',
    driverName: 'Ravi Sharma',
    startLocation: 'Baner',
    endLocation: 'Viman Nagar',
    distanceKm: 17.2,
    durationMinutes: 49,
    status: 'completed',
    completedAt: '2026-05-13T14:20:00.000Z',
    revenue: 1320,
  },
];

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const mockTransport: ApiTransport = {
  async request<T>(handler: () => T, message: string): Promise<ApiResponse<T>> {
    await wait(MOCK_DELAY_MS);

    return {
      success: true,
      data: handler(),
      message,
      timestamp: new Date().toISOString(),
    };
  },
};

function computeFleetAnalytics(): FleetAnalytics {
  const totalVehicles = fleetVehicles.length;
  const activeTrips = fleetVehicles.filter((vehicle) => vehicle.tripStatus === 'en-route').length;
  const chargingVehicles = fleetVehicles.filter(
    (vehicle) => vehicle.chargingStatus === 'charging',
  ).length;
  const completedTrips = tripHistory.filter((trip) => trip.status === 'completed').length;
  const totalRevenue = tripHistory.reduce((sum, trip) => sum + trip.revenue, 0);

  return {
    totalVehicles,
    activeTrips,
    chargingVehicles,
    completedTrips,
    totalRevenue,
  };
}

function buildLiveTrackingSnapshot(): LiveTrackingItem[] {
  return fleetVehicles.map((vehicle) => {
    const speedVariance = Math.floor(Math.random() * 8) - 4;
    const latitudeDrift = (Math.random() - 0.5) * 0.002;
    const longitudeDrift = (Math.random() - 0.5) * 0.002;
    const simulatedSpeed = Math.max(vehicle.currentSpeed + speedVariance, 0);

    return {
      vehicleId: vehicle.vehicleId,
      latitude: Number((vehicle.gpsCoordinates.latitude + latitudeDrift).toFixed(6)),
      longitude: Number((vehicle.gpsCoordinates.longitude + longitudeDrift).toFixed(6)),
      speed: simulatedSpeed,
      routeInfo:
        vehicle.tripStatus === 'en-route'
          ? 'Active route: Pickup -> Delivery'
          : 'No active route assigned',
      liveStatus: vehicle.tripStatus === 'maintenance' ? 'offline' : 'online',
      updatedAt: new Date().toISOString(),
    };
  });
}

export async function getFleetVehicles(): Promise<ApiResponse<FleetVehicle[]>> {
  return mockTransport.request(() => fleetVehicles, 'Fleet vehicles fetched successfully (mock).');
}

export async function getVehicleDetails(
  vehicleId: string,
): Promise<ApiResponse<VehicleDetails | null>> {
  return mockTransport.request(
    () => vehicleDetailsMap[vehicleId] ?? null,
    vehicleDetailsMap[vehicleId]
      ? 'Vehicle details fetched successfully (mock).'
      : 'Vehicle not found in mock dataset.',
  );
}

export async function getLiveTracking(): Promise<ApiResponse<LiveTrackingItem[]>> {
  return mockTransport.request(
    () => buildLiveTrackingSnapshot(),
    'Live tracking snapshot fetched successfully (mock).',
  );
}

export async function getTripHistory(): Promise<ApiResponse<TripHistoryItem[]>> {
  return mockTransport.request(() => tripHistory, 'Trip history fetched successfully (mock).');
}

export async function assignDriver(
  request: AssignDriverRequest,
): Promise<
  ApiResponse<{
    vehicleId: string;
    vehicleNumber: string;
    driverName: string;
    tripStatus: TripStatus;
  } | null>
> {
  return mockTransport.request(
    () => {
      const vehicle = fleetVehicles.find((item) => item.vehicleId === request.vehicleId);

      if (!vehicle) {
        return null;
      }

      vehicle.driverName = request.driverName;
      if (vehicleDetailsMap[vehicle.vehicleId]) {
        vehicleDetailsMap[vehicle.vehicleId].driverName = request.driverName;
      }

      return {
        vehicleId: vehicle.vehicleId,
        vehicleNumber: vehicle.vehicleNumber,
        driverName: vehicle.driverName,
        tripStatus: vehicle.tripStatus,
      };
    },
    'Driver assignment updated successfully (mock).',
  );
}

export async function getFleetAnalytics(): Promise<ApiResponse<FleetAnalytics>> {
  return mockTransport.request(
    () => computeFleetAnalytics(),
    'Fleet analytics fetched successfully (mock).',
  );
}
