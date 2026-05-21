export interface CarSpecifications {
  motorType: string;
  topSpeedKmph: number;
  seatingCapacity: number;
  accelerationZeroToHundredSeconds: number;
  driveType: string;
}

export interface EvCar {
  id: string;
  carName: string;
  price: number;
  batteryRangeKm: number;
  chargingTimeHours: number;
  specifications: CarSpecifications;
  images: string[];
}

export interface TestDriveRequest {
  carId: string;
  customerName: string;
  customerPhone: string;
  preferredDate: string;
  preferredTimeSlot: string;
}

export interface TestDriveBooking {
  bookingId: string;
  carId: string;
  carName: string;
  customerName: string;
  customerPhone: string;
  preferredDate: string;
  preferredTimeSlot: string;
  status: 'booked' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

const MOCK_DELAY_MS = 380;

const mockCars: EvCar[] = [
  {
    id: 'car-001',
    carName: 'Energeia Volt X',
    price: 1899000,
    batteryRangeKm: 420,
    chargingTimeHours: 1.2,
    specifications: {
      motorType: 'Permanent Magnet Synchronous',
      topSpeedKmph: 160,
      seatingCapacity: 5,
      accelerationZeroToHundredSeconds: 7.4,
      driveType: 'FWD',
    },
    images: [
      'https://images.unsplash.com/photo-1549924231-f129b911e442',
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a',
    ],
  },
  {
    id: 'car-002',
    carName: 'Energeia Urban E-SUV',
    price: 2499000,
    batteryRangeKm: 510,
    chargingTimeHours: 1.5,
    specifications: {
      motorType: 'Dual Motor AWD',
      topSpeedKmph: 180,
      seatingCapacity: 5,
      accelerationZeroToHundredSeconds: 6.1,
      driveType: 'AWD',
    },
    images: [
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
    ],
  },
  {
    id: 'car-003',
    carName: 'Energeia City Compact',
    price: 1399000,
    batteryRangeKm: 320,
    chargingTimeHours: 0.9,
    specifications: {
      motorType: 'Single Motor',
      topSpeedKmph: 140,
      seatingCapacity: 4,
      accelerationZeroToHundredSeconds: 9.2,
      driveType: 'FWD',
    },
    images: [
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d',
    ],
  },
];

const mockBookings: TestDriveBooking[] = [
  {
    bookingId: 'td-1001',
    carId: 'car-001',
    carName: 'Energeia Volt X',
    customerName: 'Aarav Singh',
    customerPhone: '+91-9876500011',
    preferredDate: '2026-05-16',
    preferredTimeSlot: '10:00-11:00',
    status: 'booked',
    createdAt: '2026-05-14T08:30:00.000Z',
  },
  {
    bookingId: 'td-1002',
    carId: 'car-002',
    carName: 'Energeia Urban E-SUV',
    customerName: 'Isha Kulkarni',
    customerPhone: '+91-9876500022',
    preferredDate: '2026-05-15',
    preferredTimeSlot: '14:00-15:00',
    status: 'completed',
    createdAt: '2026-05-13T11:45:00.000Z',
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

export async function getCars(): Promise<ApiResponse<EvCar[]>> {
  return buildResponse(mockCars, 'EV cars fetched successfully.');
}

export async function getCarDetails(carId: string): Promise<ApiResponse<EvCar | null>> {
  const car = mockCars.find((item) => item.id === carId) ?? null;

  return buildResponse(
    car,
    car ? 'EV car details fetched successfully.' : 'Car not found in mock dataset.',
  );
}

export async function bookTestDrive(
  request: TestDriveRequest,
): Promise<ApiResponse<TestDriveBooking>> {
  const car = mockCars.find((item) => item.id === request.carId);

  const booking: TestDriveBooking = {
    bookingId: `td-${Date.now()}`,
    carId: request.carId,
    carName: car?.carName ?? 'Unknown Car',
    customerName: request.customerName,
    customerPhone: request.customerPhone,
    preferredDate: request.preferredDate,
    preferredTimeSlot: request.preferredTimeSlot,
    status: 'booked',
    createdAt: new Date().toISOString(),
  };

  mockBookings.unshift(booking);

  return buildResponse(booking, 'Test drive booked successfully (mock).');
}

export async function getBookings(): Promise<ApiResponse<TestDriveBooking[]>> {
  return buildResponse(mockBookings, 'Test drive bookings fetched successfully.');
}
