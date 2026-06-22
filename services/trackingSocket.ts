import { io, Socket } from 'socket.io-client';

import { BASE_URL } from '@/services/apiClient';

export interface LiveVehiclePayload {
  id?: string;
  vehicleId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SocketAck {
  success: boolean;
  message: string;
  data?: LiveVehiclePayload;
}

let trackingSocket: Socket | null = null;

export const connectTrackingSocket = (): Socket => {
  if (trackingSocket) {
    return trackingSocket;
  }

  trackingSocket = io(BASE_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  return trackingSocket;
};

export const disconnectTrackingSocket = () => {
  trackingSocket?.disconnect();
  trackingSocket = null;
};

export const onVehicleLocationUpdated = (handler: (payload: LiveVehiclePayload) => void): (() => void) => {
  const socket = connectTrackingSocket();

  socket.on('gps:vehicle-location-updated', handler);

  return () => {
    socket.off('gps:vehicle-location-updated', handler);
  };
};

export const onBootstrapVehicleLocations = (
  handler: (payload: { success: boolean; data: LiveVehiclePayload[] }) => void
): (() => void) => {
  const socket = connectTrackingSocket();

  socket.on('gps:vehicles-bootstrap', handler);

  return () => {
    socket.off('gps:vehicles-bootstrap', handler);
  };
};

export const onTrackingError = (handler: (payload: { success: boolean; message: string }) => void): (() => void) => {
  const socket = connectTrackingSocket();

  socket.on('gps:error', handler);

  return () => {
    socket.off('gps:error', handler);
  };
};

export const emitLiveVehicleLocation = async (
  payload: Omit<LiveVehiclePayload, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SocketAck> => {
  const socket = connectTrackingSocket();

  return new Promise((resolve, reject) => {
    socket.emit('gps:update-location', payload, (ack: SocketAck) => {
      if (!ack || !ack.success) {
        reject(new Error(ack?.message || 'Unable to update live vehicle location'));
        return;
      }

      resolve(ack);
    });
  });
};
