import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';

import { Coordinates, getCurrentCoordinates, requestLocationPermission, watchCurrentCoordinates } from '@/services/locationService';
import {
  LiveVehiclePayload,
  connectTrackingSocket,
  disconnectTrackingSocket,
  emitLiveVehicleLocation,
  onBootstrapVehicleLocations,
  onTrackingError,
  onVehicleLocationUpdated,
} from '@/services/trackingSocket';

const MY_VEHICLE_ID = 'EV-1001';
const MY_DRIVER_ID = 'DRV-1001';

const FALLBACK_REGION: Region = {
  latitude: 28.6139,
  longitude: 77.209,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const toRegion = (coords: Coordinates): Region => ({
  latitude: coords.latitude,
  longitude: coords.longitude,
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
});

const asVehicleRecord = (list: LiveVehiclePayload[]) => {
  return list.reduce<Record<string, LiveVehiclePayload>>((acc, item) => {
    acc[item.vehicleId] = item;
    return acc;
  }, {});
};

export default function LiveVehicleTrackingScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [myCoords, setMyCoords] = useState<Coordinates | null>(null);
  const [vehicles, setVehicles] = useState<Record<string, LiveVehiclePayload>>({});
  const [statusText, setStatusText] = useState('Connecting to tracking server...');
  const [errorText, setErrorText] = useState<string | null>(null);

  const vehicleList = useMemo(() => Object.values(vehicles), [vehicles]);

  useEffect(() => {
    let isMounted = true;
    let removeLocationWatch: (() => void) | null = null;

    const socket = connectTrackingSocket();

    const offBootstrap = onBootstrapVehicleLocations((payload) => {
      if (!isMounted || !payload.success) {
        return;
      }

      setVehicles(asVehicleRecord(payload.data));
      setStatusText('Live tracking active');
    });

    const offVehicleUpdate = onVehicleLocationUpdated((payload) => {
      if (!isMounted) {
        return;
      }

      setVehicles((previous) => ({
        ...previous,
        [payload.vehicleId]: payload,
      }));
    });

    const offTrackingError = onTrackingError((payload) => {
      if (!isMounted) {
        return;
      }

      setErrorText(payload.message);
      setStatusText('Tracking error');
    });

    socket.on('connect', () => {
      if (!isMounted) {
        return;
      }

      setStatusText('Connected to live tracking');
      setErrorText(null);
    });

    socket.on('disconnect', () => {
      if (!isMounted) {
        return;
      }

      setStatusText('Disconnected, retrying...');
    });

    const sendLiveUpdate = async (coords: Coordinates) => {
      const payload = {
        vehicleId: MY_VEHICLE_ID,
        driverId: MY_DRIVER_ID,
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: new Date().toISOString(),
      };

      setVehicles((previous) => ({
        ...previous,
        [payload.vehicleId]: payload,
      }));

      try {
        await emitLiveVehicleLocation(payload);
      } catch (error) {
        if (isMounted) {
          setErrorText(error instanceof Error ? error.message : 'Unable to emit live location');
        }
      }
    };

    const startTracking = async () => {
      const permissionResult = await requestLocationPermission();
      if (!isMounted) {
        return;
      }

      if (!permissionResult.data) {
        setStatusText('Location permission denied');
        setErrorText(permissionResult.error || 'Location permission required for live tracking');
        return;
      }

      const currentResult = await getCurrentCoordinates();
      if (!isMounted) {
        return;
      }

      if (!currentResult.data) {
        setStatusText('Unable to fetch current location');
        setErrorText(currentResult.error || 'Unable to fetch coordinates');
        return;
      }

      setMyCoords(currentResult.data.coords);
      setStatusText('Sending live coordinates every few seconds');
      setErrorText(null);
      mapRef.current?.animateToRegion(toRegion(currentResult.data.coords), 700);
      await sendLiveUpdate(currentResult.data.coords);

      const watchResult = await watchCurrentCoordinates(
        ({ coords }) => {
          setMyCoords(coords);
          mapRef.current?.animateToRegion(toRegion(coords), 500);
          void sendLiveUpdate(coords);
        },
        (message) => {
          setStatusText('Live tracking paused');
          setErrorText(message);
        }
      );

      if (!watchResult.data) {
        setStatusText('Live tracking unavailable');
        setErrorText(watchResult.error || 'Unable to watch coordinates');
        return;
      }

      removeLocationWatch = () => watchResult.data?.remove();
    };

    void startTracking();

    return () => {
      isMounted = false;
      removeLocationWatch?.();
      offBootstrap();
      offVehicleUpdate();
      offTrackingError();
      socket.off('connect');
      socket.off('disconnect');
      disconnectTrackingSocket();
    };
  }, []);

  const handleRecenter = () => {
    if (!myCoords) {
      return;
    }

    mapRef.current?.animateToRegion(toRegion(myCoords), 500);
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.webCard}>
          <MaterialCommunityIcons name="map-clock" size={40} color="#22C55E" />
          <Text style={styles.title}>Live tracking preview</Text>
          <Text style={styles.subtitle}>Use Android or iOS build to see real-time vehicle movement with Socket.IO.</Text>
          <Text style={styles.metaText}>{statusText}</Text>
          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Real-time Fleet</Text>
          <Text style={styles.title}>Live vehicle tracking</Text>
        </View>

        <Pressable style={styles.recenterButton} onPress={handleRecenter}>
          <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#0F172A" />
          <Text style={styles.recenterLabel}>Recenter</Text>
        </Pressable>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.metaText}>{statusText}</Text>
        <Text style={styles.metaText}>Tracked vehicles: {vehicleList.length}</Text>
        <Text style={styles.metaText}>Update mode: every few seconds</Text>
      </View>

      <View style={styles.mapContainer}>
        {myCoords ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={toRegion(myCoords)}
            showsUserLocation
            zoomEnabled
            scrollEnabled
            rotateEnabled
            pitchEnabled
          >
            {vehicleList.map((vehicle) => (
              <Marker
                key={vehicle.vehicleId}
                coordinate={{
                  latitude: vehicle.latitude,
                  longitude: vehicle.longitude,
                }}
                title={vehicle.vehicleId}
                description={`Driver: ${vehicle.driverId}`}
                pinColor={vehicle.vehicleId === MY_VEHICLE_ID ? '#2563EB' : '#F97316'}
              />
            ))}
          </MapView>
        ) : (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#22C55E" size="large" />
            <Text style={styles.metaText}>Acquiring GPS and connecting live socket...</Text>
          </View>
        )}
      </View>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070E1B',
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kicker: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#86EFAC',
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    color: '#F8FAFC',
    fontWeight: '800',
    marginTop: 2,
  },
  recenterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  recenterLabel: {
    color: '#0F172A',
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 20,
    padding: 14,
    gap: 8,
  },
  metaText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: '#0F172A',
  },
  map: {
    flex: 1,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 20,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '600',
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  webCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#111827',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 10,
  },
});
