import { apiRequest, toApiResponse, ApiResponse, BackendEnvelope } from './apiClient';

export type CarSpecifications = {
  motorType: string;
  topSpeedKmph: number;
  seatingCapacity: number;
  accelerationZeroToHundredSeconds: number;
  driveType: string;
};

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
  status: 'booked' | 'completed' | 'cancelled' | 'confirmed';
  createdAt: string;
}

const mapVehicle = (vehicle: {
  _id: string;
  vehicleName: string;
  model: string;
  price: number;
  batteryRange: number;
  stock: number;
  image: string;
}): EvCar => ({
  id: vehicle._id,
  carName: vehicle.vehicleName,
  price: vehicle.price,
  batteryRangeKm: vehicle.batteryRange,
  chargingTimeHours: 0,
  specifications: {
    motorType: vehicle.model,
    topSpeedKmph: 0,
    seatingCapacity: vehicle.stock > 0 ? 5 : 0,
    accelerationZeroToHundredSeconds: 0,
    driveType: 'FWD',
  },
  images: vehicle.image ? [vehicle.image] : [],
});

export async function getCars(): Promise<ApiResponse<EvCar[]>> {
  const payload = await apiRequest<BackendEnvelope<Array<Parameters<typeof mapVehicle>[0]>>>('/api/showroom');
  return toApiResponse((payload.data ?? []).map(mapVehicle), payload.message || 'Vehicles fetched successfully.');
}

export async function getCarDetails(carId: string): Promise<ApiResponse<EvCar | null>> {
  const payload = await apiRequest<BackendEnvelope<Parameters<typeof mapVehicle>[0]>>(`/api/showroom/${carId}`);
  return toApiResponse(payload.data ? mapVehicle(payload.data) : null, payload.message || 'Vehicle fetched successfully.');
}

export async function createVehicle(body: {
  vehicleName: string;
  model: string;
  price: number;
  batteryRange: number;
  stock: number;
  image: string;
}): Promise<ApiResponse<EvCar>> {
  const payload = await apiRequest<BackendEnvelope<Parameters<typeof mapVehicle>[0]>>('/api/showroom', {
    method: 'POST',
    body,
  });

  if (!payload.data) throw new Error(payload.message || 'Failed to add vehicle.');
  return toApiResponse(mapVehicle(payload.data), payload.message || 'Vehicle added successfully.');
}

export async function updateVehicle(
  vehicleId: string,
  body: Partial<{ vehicleName: string; model: string; price: number; batteryRange: number; stock: number; image: string }>,
): Promise<ApiResponse<EvCar>> {
  const payload = await apiRequest<BackendEnvelope<Parameters<typeof mapVehicle>[0]>>(`/api/showroom/${vehicleId}`, {
    method: 'PUT',
    body,
  });

  if (!payload.data) throw new Error(payload.message || 'Failed to update vehicle.');
  return toApiResponse(mapVehicle(payload.data), payload.message || 'Vehicle updated successfully.');
}

export async function deleteVehicle(vehicleId: string): Promise<ApiResponse<null>> {
  const payload = await apiRequest<BackendEnvelope<null>>(`/api/showroom/${vehicleId}`, { method: 'DELETE' });
  return toApiResponse(null, payload.message || 'Vehicle deleted successfully.');
}

export async function bookTestDrive(
  request: TestDriveRequest,
): Promise<ApiResponse<TestDriveBooking>> {
  const payload = await apiRequest<BackendEnvelope<{ _id: string; vehicle: string; customerName: string; phone: string; preferredDate: string; status: 'requested' | 'confirmed' | 'completed' | 'cancelled'; createdAt: string }>>(
    '/api/showroom/book-test-drive',
    {
      method: 'POST',
      body: {
        vehicleId: request.carId,
        customerName: request.customerName,
        phone: request.customerPhone,
        preferredDate: request.preferredDate,
        notes: request.preferredTimeSlot,
      },
    },
  );

  if (!payload.data) throw new Error(payload.message || 'Failed to book test drive.');

  return toApiResponse(
    {
      bookingId: payload.data._id,
      carId: request.carId,
      carName: 'Vehicle',
      customerName: payload.data.customerName,
      customerPhone: payload.data.phone,
      preferredDate: payload.data.preferredDate,
      preferredTimeSlot: request.preferredTimeSlot,
      status: 'booked',
      createdAt: payload.data.createdAt,
    },
    payload.message || 'Test drive booked successfully.',
  );
}

export async function getBookings(): Promise<ApiResponse<TestDriveBooking[]>> {
  const payload = await apiRequest<BackendEnvelope<Array<{ _id: string; vehicle: { _id: string; vehicleName: string }; customerName: string; phone: string; preferredDate: string; notes: string; status: 'requested' | 'confirmed' | 'completed' | 'cancelled'; createdAt: string }>>>('/api/showroom/bookings');

  return toApiResponse(
    (payload.data ?? []).map((booking) => ({
      bookingId: booking._id,
      carId: booking.vehicle._id,
      carName: booking.vehicle.vehicleName,
      customerName: booking.customerName,
      customerPhone: booking.phone,
      preferredDate: booking.preferredDate,
      preferredTimeSlot: booking.notes,
      status: booking.status === 'requested' ? 'booked' : booking.status,
      createdAt: booking.createdAt,
    })),
    payload.message || 'Test drive bookings fetched successfully.',
  );
}