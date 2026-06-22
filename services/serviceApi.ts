import { apiRequest, toApiResponse, ApiResponse, BackendEnvelope } from './apiClient';

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

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
  technicianDetails: { technicianId: string; name: string; specialization: string; rating: number; phone: string };
  estimatedCost: number;
  serviceTimeline: ServiceTimeline;
}

export interface ServiceBookingRequest {
  customerName: string;
  vehicleNumber: string;
  issue: string;
  serviceDate: string;
  status?: BookingStatus;
}

const mapRequest = (request: {
  _id: string;
  customerName: string;
  vehicleNumber: string;
  issue: string;
  serviceDate: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}): ServiceItem => ({
  serviceId: request._id,
  serviceType: request.issue,
  bookingStatus: request.status,
  technicianDetails: {
    technicianId: 'assigned',
    name: 'Assigned Technician',
    specialization: 'EV Service',
    rating: 0,
    phone: '',
  },
  estimatedCost: 0,
  serviceTimeline: {
    createdAt: request.createdAt,
    scheduledAt: request.serviceDate,
  },
});

export async function getServices(): Promise<ApiResponse<ServiceItem[]>> {
  const payload = await apiRequest<BackendEnvelope<Array<Parameters<typeof mapRequest>[0]>>>('/api/service');
  return toApiResponse((payload.data ?? []).map(mapRequest), payload.message || 'Service requests fetched successfully.');
}

export async function createServiceRequest(body: ServiceBookingRequest): Promise<ApiResponse<ServiceItem>> {
  const payload = await apiRequest<BackendEnvelope<Parameters<typeof mapRequest>[0]>>('/api/service', {
    method: 'POST',
    body,
  });

  if (!payload.data) throw new Error(payload.message || 'Failed to create service request.');
  return toApiResponse(mapRequest(payload.data), payload.message || 'Service request created successfully.');
}

export async function updateServiceRequest(
  serviceId: string,
  body: Partial<ServiceBookingRequest>,
): Promise<ApiResponse<ServiceItem>> {
  const payload = await apiRequest<BackendEnvelope<Parameters<typeof mapRequest>[0]>>(`/api/service/${serviceId}`, {
    method: 'PUT',
    body,
  });

  if (!payload.data) throw new Error(payload.message || 'Failed to update service request.');
  return toApiResponse(mapRequest(payload.data), payload.message || 'Service request updated successfully.');
}

export async function deleteServiceRequest(serviceId: string): Promise<ApiResponse<null>> {
  const payload = await apiRequest<BackendEnvelope<null>>(`/api/service/${serviceId}`, { method: 'DELETE' });
  return toApiResponse(null, payload.message || 'Service request deleted successfully.');
}

export async function bookService(body: ServiceBookingRequest): Promise<ApiResponse<ServiceItem>> {
  return createServiceRequest(body);
}

export async function getServiceHistory(): Promise<ApiResponse<ServiceItem[]>> {
  return getServices();
}

export async function getTechnicians(): Promise<ApiResponse<Array<ServiceItem['technicianDetails']>>> {
  return toApiResponse([], 'Technician list is managed by the backend service requests.');
}