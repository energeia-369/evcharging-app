export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface TechnicianDetails {
  technicianId: string;
  name: string;
  specialization: string;
  rating: number;
  phone: string;
}

export interface ServiceTimeline {
  createdAt: string;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface ServiceItem {
  serviceId: string;
  serviceType: string;
  bookingStatus: BookingStatus;
  technicianDetails: TechnicianDetails;
  estimatedCost: number;
  serviceTimeline: ServiceTimeline;
}

export interface ServiceBookingRequest {
  userId: string;
  serviceId: string;
  preferredDate: string;
  vehicleModel: string;
  issueNotes?: string;
}

export interface ServiceHistoryItem {
  bookingId: string;
  serviceType: string;
  bookingStatus: BookingStatus;
  technicianDetails: TechnicianDetails;
  estimatedCost: number;
  serviceTimeline: ServiceTimeline;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

const MOCK_DELAY_MS = 400;

const mockTechnicians: TechnicianDetails[] = [
  {
    technicianId: 'tech-001',
    name: 'Arjun Mehta',
    specialization: 'Battery Diagnostics',
    rating: 4.8,
    phone: '+91-9000000001',
  },
  {
    technicianId: 'tech-002',
    name: 'Nisha Verma',
    specialization: 'Motor & Controller Repair',
    rating: 4.7,
    phone: '+91-9000000002',
  },
  {
    technicianId: 'tech-003',
    name: 'Rahul Iyer',
    specialization: 'General EV Maintenance',
    rating: 4.6,
    phone: '+91-9000000003',
  },
];

const mockServices: ServiceItem[] = [
  {
    serviceId: 'svc-001',
    serviceType: 'Battery Health Check',
    bookingStatus: 'confirmed',
    technicianDetails: mockTechnicians[0],
    estimatedCost: 1299,
    serviceTimeline: {
      createdAt: '2026-05-14T06:00:00.000Z',
      scheduledAt: '2026-05-15T09:30:00.000Z',
    },
  },
  {
    serviceId: 'svc-002',
    serviceType: 'Motor Inspection',
    bookingStatus: 'pending',
    technicianDetails: mockTechnicians[1],
    estimatedCost: 1899,
    serviceTimeline: {
      createdAt: '2026-05-13T10:15:00.000Z',
      scheduledAt: '2026-05-16T11:00:00.000Z',
    },
  },
  {
    serviceId: 'svc-003',
    serviceType: 'Annual EV Maintenance',
    bookingStatus: 'in-progress',
    technicianDetails: mockTechnicians[2],
    estimatedCost: 2499,
    serviceTimeline: {
      createdAt: '2026-05-12T08:20:00.000Z',
      scheduledAt: '2026-05-14T08:00:00.000Z',
      startedAt: '2026-05-14T08:05:00.000Z',
    },
  },
];

const mockServiceHistory: ServiceHistoryItem[] = [
  {
    bookingId: 'book-8001',
    serviceType: 'Brake System Check',
    bookingStatus: 'completed',
    technicianDetails: mockTechnicians[2],
    estimatedCost: 999,
    serviceTimeline: {
      createdAt: '2026-05-08T07:00:00.000Z',
      scheduledAt: '2026-05-09T10:00:00.000Z',
      startedAt: '2026-05-09T10:05:00.000Z',
      completedAt: '2026-05-09T11:00:00.000Z',
    },
  },
  {
    bookingId: 'book-8002',
    serviceType: 'Software Update & Calibration',
    bookingStatus: 'completed',
    technicianDetails: mockTechnicians[0],
    estimatedCost: 1499,
    serviceTimeline: {
      createdAt: '2026-05-05T12:30:00.000Z',
      scheduledAt: '2026-05-06T09:00:00.000Z',
      startedAt: '2026-05-06T09:10:00.000Z',
      completedAt: '2026-05-06T10:25:00.000Z',
    },
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

export async function getServices(): Promise<ApiResponse<ServiceItem[]>> {
  return buildResponse(mockServices, 'Service list fetched successfully.');
}

export async function bookService(
  request: ServiceBookingRequest,
): Promise<
  ApiResponse<{
    bookingId: string;
    serviceType: string;
    bookingStatus: BookingStatus;
    technicianDetails: TechnicianDetails;
    estimatedCost: number;
    serviceTimeline: ServiceTimeline;
  }>
> {
  const service = mockServices.find((item) => item.serviceId === request.serviceId);

  if (!service) {
    return buildResponse(
      {
        bookingId: '',
        serviceType: 'Unknown Service',
        bookingStatus: 'cancelled',
        technicianDetails: mockTechnicians[0],
        estimatedCost: 0,
        serviceTimeline: {
          createdAt: new Date().toISOString(),
          scheduledAt: request.preferredDate,
        },
      },
      'Service not found in mock dataset.',
    );
  }

  const bookingTimeline: ServiceTimeline = {
    createdAt: new Date().toISOString(),
    scheduledAt: request.preferredDate,
  };

  return buildResponse(
    {
      bookingId: `book-${Date.now()}`,
      serviceType: service.serviceType,
      bookingStatus: 'confirmed',
      technicianDetails: service.technicianDetails,
      estimatedCost: service.estimatedCost,
      serviceTimeline: bookingTimeline,
    },
    'Service booked successfully (mock).',
  );
}

export async function getServiceHistory(): Promise<ApiResponse<ServiceHistoryItem[]>> {
  return buildResponse(mockServiceHistory, 'Service history fetched successfully.');
}

export async function getTechnicians(): Promise<ApiResponse<TechnicianDetails[]>> {
  return buildResponse(mockTechnicians, 'Technician list fetched successfully.');
}
