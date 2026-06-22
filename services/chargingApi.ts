import { apiRequest, ApiResponse, BackendEnvelope, toApiResponse } from './apiClient';

export type ChargingType = 'AC' | 'DC Fast' | 'Ultra Fast';
export type ChargingStatus = 'idle' | 'booked' | 'charging' | 'completed';

export interface ChargingStation {
  id: string;
  stationName: string;
  chargingType: ChargingType;
  slotAvailability: number;
  chargingStatus: ChargingStatus;
  chargingDurationMinutes: number;
}

export interface ChargingHistoryRecord {
  id: string;
  stationName: string;
  chargingType: ChargingType;
  slotAvailability: number;
  chargingStatus: ChargingStatus;
  chargingDurationMinutes: number;
  startedAt: string;
  endedAt: string;
  energyConsumedKwh: number;
}

export interface NearbyChargingStation {
  id: string;
  _id?: string;
  name?: string;
  stationName: string;
  location: string;
  latitude?: number;
  longitude?: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
  distanceKm: number;
  availableSlots: number;
  acSlots?: number;
  dcSlots?: number;
  chargerType: string;
  status: string;
}

export interface BookingRequest {
  stationId: string;
  slotsBooked?: number;
}

export interface ChargingSessionRequest {
  stationId: string;
  userId: string;
}

export interface ChargingSessionStopRequest {
  sessionId: string;
}

export const FALLBACK_NEARBY_STATIONS: NearbyChargingStation[] = [
  {
    id: 'fallback-downtown-charging-hub',
    stationName: 'Downtown Charging Hub',
    location: 'Central district',
    latitude: 18.5265,
    longitude: 73.8547,
    coordinates: { latitude: 18.5265, longitude: 73.8547 },
    distanceKm: 0.8,
    availableSlots: 4,
    acSlots: 2,
    dcSlots: 2,
    chargerType: 'DC Fast',
    status: 'active',
  },
  {
    id: 'fallback-mall-charging-point',
    stationName: 'Mall Charging Point',
    location: 'Shopping complex',
    latitude: 18.5168,
    longitude: 73.8621,
    coordinates: { latitude: 18.5168, longitude: 73.8621 },
    distanceKm: 1.9,
    availableSlots: 3,
    acSlots: 2,
    dcSlots: 1,
    chargerType: 'AC/DC',
    status: 'active',
  },
  {
    id: 'fallback-airport-ev-station',
    stationName: 'Airport EV Station',
    location: 'Airport road',
    latitude: 18.5798,
    longitude: 73.9126,
    coordinates: { latitude: 18.5798, longitude: 73.9126 },
    distanceKm: 8.1,
    availableSlots: 5,
    acSlots: 3,
    dcSlots: 2,
    chargerType: 'Ultra Fast',
    status: 'active',
  },
];

export const normalizeNearbyChargingStation = (
  station: Partial<NearbyChargingStation> & { id?: string; _id?: string },
  index = 0,
): NearbyChargingStation | null => {
  const latitude = station.coordinates?.latitude ?? station.latitude;
  const longitude = station.coordinates?.longitude ?? station.longitude;

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }

  const distanceKm = Number.isFinite(station.distanceKm ?? station.distance) ? Number(station.distanceKm ?? station.distance) : 0;
  const availableSlots = Number.isFinite(station.availableSlots) ? Number(station.availableSlots) : 0;

  return {
    id: station.id || station._id || `station-${index}`,
    _id: station._id || station.id,
    name: station.name || station.stationName || 'Charging Station',
    stationName: station.stationName || station.name || 'Charging Station',
    location: station.location || 'Nearby charging station',
    latitude,
    longitude,
    coordinates: {
      latitude,
      longitude,
    },
    distance: Number.isFinite(station.distance) ? Number(station.distance) : distanceKm,
    distanceKm,
    availableSlots,
    acSlots: Number.isFinite(station.acSlots) ? Number(station.acSlots) : undefined,
    dcSlots: Number.isFinite(station.dcSlots) ? Number(station.dcSlots) : undefined,
    chargerType: station.chargerType || 'AC',
    status: station.status || 'active',
  };
};

export const createFallbackNearbyStations = (
  coords: { latitude: number; longitude: number },
): NearbyChargingStation[] =>
  FALLBACK_NEARBY_STATIONS.map((station, index) => ({
    ...station,
    id: `${station.id}-${index}`,
    _id: `${station.id}-${index}`,
    distanceKm: Number((1 + index * 1.75).toFixed(2)),
    coordinates: {
      latitude: coords.latitude + (index === 0 ? 0.006 : index === 1 ? -0.007 : 0.009),
      longitude: coords.longitude + (index === 0 ? 0.005 : index === 1 ? 0.006 : -0.008),
    },
    latitude: coords.latitude + (index === 0 ? 0.006 : index === 1 ? -0.007 : 0.009),
    longitude: coords.longitude + (index === 0 ? 0.005 : index === 1 ? 0.006 : -0.008),
  }));

const mapStation = (station: {
  _id: string;
  stationName: string;
  location?: {
    type?: 'Point';
    coordinates?: [number, number];
  } | string;
  address?: string;
  latitude?: number;
  longitude?: number;
  chargerType: string;
  chargingSpeed?: string;
  totalConnectors?: number;
  availableSlots: number;
  rating?: number;
  status: string;
}): ChargingStation => ({
  id: station._id,
  stationName: station.stationName,
  chargingType: (station.chargerType as ChargingType) || 'AC',
  slotAvailability: station.availableSlots,
  chargingStatus: station.status === 'maintenance' ? 'completed' : station.status === 'inactive' ? 'idle' : 'booked',
  chargingDurationMinutes: 0,
});

export async function getChargingStations(): Promise<ApiResponse<ChargingStation[]>> {
  const payload = await apiRequest<BackendEnvelope<Array<Parameters<typeof mapStation>[0]>>>('/api/charging');
  return toApiResponse((payload.data ?? []).map(mapStation), payload.message || 'Charging stations fetched successfully.');
}

export async function getNearbyChargingStations(params: {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  limit?: number;
}): Promise<ApiResponse<NearbyChargingStation[]>> {
  try {
    const payload = await apiRequest<BackendEnvelope<NearbyChargingStation[]> & { stations?: NearbyChargingStation[] }>(
      '/api/charging/nearby',
      {
        query: {
          lat: params.latitude,
          lng: params.longitude,
          radiusKm: params.radiusKm,
          limit: params.limit,
        },
      },
    );

    const normalizedStations = (payload.stations ?? payload.data ?? [])
      .map((station, index) => normalizeNearbyChargingStation(station, index))
      .filter((station): station is NearbyChargingStation => station !== null)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    console.log('[Charging API] Nearby stations loaded', { count: normalizedStations.length });

    return toApiResponse(normalizedStations, payload.message || 'Nearby charging stations fetched successfully.');
  } catch (error) {
    console.error('[Charging API] Nearby stations API error', error);
    throw error;
  }
}

export async function getChargingHistory(token?: string): Promise<ApiResponse<ChargingHistoryRecord[]>> {
  const payload = await apiRequest<BackendEnvelope<Array<{ _id: string; station: { stationName: string; chargerType: string }; slotsBooked: number; bookingStatus: 'confirmed' | 'cancelled' | 'completed'; createdAt: string }>>>(
    '/api/charging/bookings',
    token ? { token } : undefined,
  );

  return toApiResponse(
    (payload.data ?? []).map((booking) => ({
      id: booking._id,
      stationName: booking.station.stationName,
      chargingType: booking.station.chargerType as ChargingType,
      slotAvailability: booking.slotsBooked,
      chargingStatus: booking.bookingStatus === 'completed' ? 'completed' : 'booked',
      chargingDurationMinutes: 0,
      startedAt: booking.createdAt,
      endedAt: booking.createdAt,
      energyConsumedKwh: 0,
    })),
    payload.message || 'Charging bookings fetched successfully.',
  );
}

export async function createChargingStation(body: {
  stationName: string;
  location: string;
  latitude?: number;
  longitude?: number;
  chargerType: string;
  availableSlots: number;
  pricePerUnit: number;
  status?: string;
}): Promise<ApiResponse<ChargingStation>> {
  const payload = await apiRequest<BackendEnvelope<Parameters<typeof mapStation>[0]>>('/api/charging', {
    method: 'POST',
    body,
  });

  if (!payload.data) throw new Error(payload.message || 'Failed to create charging station.');

  return toApiResponse(mapStation(payload.data), payload.message || 'Charging station created successfully.');
}

export async function updateChargingStation(
  id: string,
  body: Partial<{
    stationName: string;
    location: string;
    latitude: number;
    longitude: number;
    chargerType: string;
    availableSlots: number;
    pricePerUnit: number;
    status: string;
  }>,
): Promise<ApiResponse<ChargingStation>> {
  const payload = await apiRequest<BackendEnvelope<Parameters<typeof mapStation>[0]>>(`/api/charging/${id}`, {
    method: 'PUT',
    body,
  });

  if (!payload.data) throw new Error(payload.message || 'Failed to update charging station.');

  return toApiResponse(mapStation(payload.data), payload.message || 'Charging station updated successfully.');
}

export async function deleteChargingStation(id: string): Promise<ApiResponse<null>> {
  const payload = await apiRequest<BackendEnvelope<null>>(`/api/charging/${id}`, { method: 'DELETE' });
  return toApiResponse(null, payload.message || 'Charging station deleted successfully.');
}

export async function bookChargingSlot(
  request: BookingRequest,
  token?: string,
): Promise<ApiResponse<{ bookingId: string; stationId: string; chargingStatus: ChargingStatus }>> {
  const payload = await apiRequest<BackendEnvelope<{ booking: { _id: string; slotsBooked: number }; station: { _id: string } }>>(
    '/api/charging/book-slot',
    {
      method: 'POST',
      token,
      body: {
        stationId: request.stationId,
        slotsBooked: request.slotsBooked ?? 1,
      },
    },
  );

  if (!payload.data) throw new Error(payload.message || 'Failed to book charging slot.');

  return toApiResponse(
    {
      bookingId: payload.data.booking._id,
      stationId: payload.data.station._id,
      chargingStatus: 'booked',
    },
    payload.message || 'Charging slot booked successfully.',
  );
}

export async function startChargingSession(request: ChargingSessionRequest): Promise<ApiResponse<{ sessionId: string; stationId: string; chargingStatus: ChargingStatus }>> {
  const booking = await bookChargingSlot({ stationId: request.stationId, slotsBooked: 1 });
  return toApiResponse({ sessionId: booking.data.bookingId, stationId: booking.data.stationId, chargingStatus: 'charging' }, `Charging session started for ${request.userId}.`);
}

export async function stopChargingSession(request: ChargingSessionStopRequest): Promise<ApiResponse<{ sessionId: string; chargingStatus: ChargingStatus; chargingDurationMinutes: number }>> {
  return toApiResponse({ sessionId: request.sessionId, chargingStatus: 'completed', chargingDurationMinutes: 0 }, 'Charging session stopped.');
}