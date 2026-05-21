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

export interface BookingRequest {
  stationId: string;
  userId: string;
  preferredStartTime: string;
}

export interface ChargingSessionRequest {
  stationId: string;
  userId: string;
}

export interface ChargingSessionStopRequest {
  sessionId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

const MOCK_DELAY_MS = 450;

const mockStations: ChargingStation[] = [
  {
    id: 'st-001',
    stationName: 'Energeia Hub - Downtown',
    chargingType: 'DC Fast',
    slotAvailability: 2,
    chargingStatus: 'idle',
    chargingDurationMinutes: 0,
  },
  {
    id: 'st-002',
    stationName: 'Green Route Station - North',
    chargingType: 'AC',
    slotAvailability: 1,
    chargingStatus: 'booked',
    chargingDurationMinutes: 0,
  },
  {
    id: 'st-003',
    stationName: 'ChargePoint Arena - Central',
    chargingType: 'Ultra Fast',
    slotAvailability: 0,
    chargingStatus: 'charging',
    chargingDurationMinutes: 18,
  },
];

const mockHistory: ChargingHistoryRecord[] = [
  {
    id: 'hist-001',
    stationName: 'Energeia Hub - Downtown',
    chargingType: 'DC Fast',
    slotAvailability: 0,
    chargingStatus: 'completed',
    chargingDurationMinutes: 34,
    startedAt: '2026-05-11T09:15:00.000Z',
    endedAt: '2026-05-11T09:49:00.000Z',
    energyConsumedKwh: 21.6,
  },
  {
    id: 'hist-002',
    stationName: 'Green Route Station - North',
    chargingType: 'AC',
    slotAvailability: 1,
    chargingStatus: 'completed',
    chargingDurationMinutes: 62,
    startedAt: '2026-05-10T16:00:00.000Z',
    endedAt: '2026-05-10T17:02:00.000Z',
    energyConsumedKwh: 15.2,
  },
];

const activeSessions = new Map<string, {
  sessionId: string;
  stationId: string;
  userId: string;
  startedAt: string;
}>();

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

async function mockResponse<T>(data: T, message: string): Promise<ApiResponse<T>> {
  await wait(MOCK_DELAY_MS);

  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

export async function getChargingStations(): Promise<ApiResponse<ChargingStation[]>> {
  return mockResponse(mockStations, 'Charging stations fetched successfully.');
}

export async function getChargingHistory(): Promise<ApiResponse<ChargingHistoryRecord[]>> {
  return mockResponse(mockHistory, 'Charging history fetched successfully.');
}

export async function bookChargingSlot(
  request: BookingRequest,
): Promise<ApiResponse<{ bookingId: string; stationId: string; chargingStatus: ChargingStatus }>> {
  const station = mockStations.find((item) => item.id === request.stationId);

  if (!station) {
    return mockResponse(
      {
        bookingId: '',
        stationId: request.stationId,
        chargingStatus: 'idle',
      },
      'Station not found in mock dataset.',
    );
  }

  station.slotAvailability = Math.max(station.slotAvailability - 1, 0);
  station.chargingStatus = 'booked';

  return mockResponse(
    {
      bookingId: `bk-${Date.now()}`,
      stationId: station.id,
      chargingStatus: station.chargingStatus,
    },
    'Charging slot booked successfully (mock).',
  );
}

export async function startChargingSession(
  request: ChargingSessionRequest,
): Promise<ApiResponse<{ sessionId: string; stationId: string; chargingStatus: ChargingStatus }>> {
  const station = mockStations.find((item) => item.id === request.stationId);

  if (!station) {
    return mockResponse(
      {
        sessionId: '',
        stationId: request.stationId,
        chargingStatus: 'idle',
      },
      'Station not found in mock dataset.',
    );
  }

  const sessionId = `sess-${Date.now()}`;
  activeSessions.set(sessionId, {
    sessionId,
    stationId: station.id,
    userId: request.userId,
    startedAt: new Date().toISOString(),
  });

  station.chargingStatus = 'charging';
  station.chargingDurationMinutes = 0;

  return mockResponse(
    {
      sessionId,
      stationId: station.id,
      chargingStatus: station.chargingStatus,
    },
    'Charging session started (mock).',
  );
}

export async function stopChargingSession(
  request: ChargingSessionStopRequest,
): Promise<ApiResponse<{ sessionId: string; chargingStatus: ChargingStatus; chargingDurationMinutes: number }>> {
  const session = activeSessions.get(request.sessionId);

  if (!session) {
    return mockResponse(
      {
        sessionId: request.sessionId,
        chargingStatus: 'idle',
        chargingDurationMinutes: 0,
      },
      'Session not found in mock dataset.',
    );
  }

  const station = mockStations.find((item) => item.id === session.stationId);
  const startedAtMs = new Date(session.startedAt).getTime();
  const durationMinutes = Math.max(Math.round((Date.now() - startedAtMs) / 60000), 1);

  if (station) {
    station.chargingStatus = 'completed';
    station.chargingDurationMinutes = durationMinutes;
    station.slotAvailability += 1;
  }

  activeSessions.delete(request.sessionId);

  return mockResponse(
    {
      sessionId: request.sessionId,
      chargingStatus: station?.chargingStatus ?? 'completed',
      chargingDurationMinutes: durationMinutes,
    },
    'Charging session stopped (mock).',
  );
}
