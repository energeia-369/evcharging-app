import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView, { Circle, Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getNearbyChargingStations, NearbyChargingStation } from '@/services/chargingApi';
import { getFranchiseData } from '@/services/franchiseApi';
import {
  Coordinates,
  DEFAULT_COORDINATES,
  formatCoordinates,
  getCurrentCoordinates,
  requestLocationPermission,
  watchCurrentCoordinates,
} from '@/services/locationService';
import { emitLiveVehicleLocation, LiveVehiclePayload, onBootstrapVehicleLocations, onVehicleLocationUpdated } from '@/services/trackingSocket';
import { useAuth } from './fleet-management/AuthContext';

type ChargerMarker = Coordinates & {
  id: string;
  name: string;
  status: 'available' | 'busy';
};

const DEFAULT_REGION: Region = {
  latitude: DEFAULT_COORDINATES.latitude,
  longitude: DEFAULT_COORDINATES.longitude,
  latitudeDelta: 0.06,
  longitudeDelta: 0.03,
};

const createDemoChargers = (location: Coordinates | null): ChargerMarker[] => {
  const baseLatitude = location?.latitude ?? DEFAULT_REGION.latitude;
  const baseLongitude = location?.longitude ?? DEFAULT_REGION.longitude;

  return [
    {
      id: 'charger-1',
      name: 'Energeia Fast Charge',
      status: 'available',
      latitude: baseLatitude + 0.008,
      longitude: baseLongitude + 0.006,
    },
    {
      id: 'charger-2',
      name: 'City Center EV Hub',
      status: 'busy',
      latitude: baseLatitude - 0.01,
      longitude: baseLongitude - 0.007,
    },
  ];
};

const buildRegion = (coords: Coordinates): Region => ({
  latitude: coords.latitude,
  longitude: coords.longitude,
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
});

const LOCATION_DELTA_THRESHOLD = 0.0009;
const API_THROTTLE_MS = 20000;

const hasSignificantCoordinateChange = (previous: Coordinates | null, next: Coordinates): boolean => {
  if (!previous) {
    return true;
  }

  return (
    Math.abs(next.latitude - previous.latitude) >= LOCATION_DELTA_THRESHOLD ||
    Math.abs(next.longitude - previous.longitude) >= LOCATION_DELTA_THRESHOLD
  );
};

export default function GpsMapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const latestLocationRef = useRef<Coordinates>(DEFAULT_COORDINATES);
  const lastNearbyFetchAtRef = useRef(0);
  const isNearbyFetchingRef = useRef(false);
  const nearbyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAnimatedLocationRef = useRef<Coordinates | null>(null);
  const vehicleIdRef = useRef<string | null>(null);
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<Coordinates>(DEFAULT_COORDINATES);
  const [accuracy, setAccuracy] = useState<number>(25);
  const [statusText, setStatusText] = useState('Requesting location permission...');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [vehicleMarkers, setVehicleMarkers] = useState<LiveVehiclePayload[]>([]);
  const [stationMarkers, setStationMarkers] = useState<NearbyChargingStation[]>([]);
  const [dealershipMarkers, setDealershipMarkers] = useState<any[]>([]);
  const [nearbyStatus, setNearbyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [nearbyError, setNearbyError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const chargerMarkers = useMemo(() => createDemoChargers(currentLocation), [currentLocation]);

  useEffect(() => {
    let isMounted = true;
    let removeLocationSubscription: (() => void) | null = null;
    let removeVehicleListener: (() => void) | null = null;
    let removeBootstrapListener: (() => void) | null = null;
    let watchStarted = false;

    const loadNearbyData = async (initialCoords: Coordinates, reason: 'initial' | 'movement' | 'retry' = 'initial') => {
      if (isNearbyFetchingRef.current) {
        return;
      }

      isNearbyFetchingRef.current = true;
      setNearbyStatus('loading');
      setNearbyError(null);

      const [stationsResult, dealersResult] = await Promise.allSettled([
        getNearbyChargingStations({
          latitude: initialCoords.latitude,
          longitude: initialCoords.longitude,
          radiusKm: 5,
          limit: 40,
        }),
        getFranchiseData(),
      ]);

      if (!isMounted) {
        isNearbyFetchingRef.current = false;
        return;
      }

      const hasStations = stationsResult.status === 'fulfilled' && Array.isArray(stationsResult.value.data);
      const hasDealers = dealersResult.status === 'fulfilled' && Array.isArray(dealersResult.value.data);

      if (hasStations) {
        setStationMarkers(stationsResult.value.data);
      } else if (stationsResult.status === 'rejected') {
        const message = stationsResult.reason instanceof Error ? stationsResult.reason.message : 'Unable to load nearby stations.';
        console.error('[GPS] Nearby stations API error', stationsResult.reason);
        setNearbyError(message);
      }

      if (hasDealers) {
        setDealershipMarkers(dealersResult.value.data.map((d) => ({ ...d })));
      } else if (dealersResult.status === 'rejected') {
        const message = dealersResult.reason instanceof Error ? dealersResult.reason.message : 'Unable to load franchise markers.';
        console.error('[GPS] Dealership API error', dealersResult.reason);
        setNearbyError((previous) => previous ?? message);
      }

      if (hasStations || hasDealers) {
        setNearbyStatus('success');
        if (reason !== 'movement') {
          console.log('[GPS] Nearby data loaded');
        }
      } else {
        setNearbyStatus('error');
        setNearbyError((previous) => previous ?? 'Unable to load nearby stations right now.');
      }

      lastNearbyFetchAtRef.current = Date.now();
      isNearbyFetchingRef.current = false;
    };

    const setupLocation = async () => {
      const permissionResult = await requestLocationPermission();
      if (!isMounted) {
        return;
      }

      if (!permissionResult.data) {
        Alert.alert('Location permission required', permissionResult.error ?? 'Location access denied.');
        setStatusText('Location permission denied');
        setErrorText(permissionResult.error ?? 'Location access denied.');
        setCurrentLocation(DEFAULT_COORDINATES);
        void loadNearbyData(DEFAULT_COORDINATES);
        return;
      }

      setStatusText('Finding your current location...');

      const currentLocationResult = await getCurrentCoordinates();
      if (!isMounted) {
        return;
      }

      const initialCoords = currentLocationResult.data?.coords ?? DEFAULT_COORDINATES;
      latestLocationRef.current = initialCoords;
      setCurrentLocation(initialCoords);
      setAccuracy(currentLocationResult.data?.accuracy ?? 25);
      setErrorText(currentLocationResult.error ?? null);
      setStatusText(currentLocationResult.error ? 'Using default coordinates' : 'Live GPS tracking active');
      mapRef.current?.animateToRegion(buildRegion(initialCoords), 700);
      lastAnimatedLocationRef.current = initialCoords;

      const watchResult = await watchCurrentCoordinates(
        ({ coords, accuracy: nextAccuracy }) => {
          const previous = latestLocationRef.current;
          latestLocationRef.current = coords;

          setCurrentLocation(coords);
          setAccuracy(nextAccuracy);
          setStatusText('Live GPS tracking active');
          setErrorText(null);

          const shouldAnimate = hasSignificantCoordinateChange(lastAnimatedLocationRef.current, coords);
          if (shouldAnimate) {
            mapRef.current?.animateToRegion(buildRegion(coords), 500);
            lastAnimatedLocationRef.current = coords;
          }

          const movedEnough = hasSignificantCoordinateChange(previous, coords);
          const now = Date.now();
          const throttlePassed = now - lastNearbyFetchAtRef.current >= API_THROTTLE_MS;

          if (movedEnough && throttlePassed) {
            if (nearbyDebounceRef.current) {
              clearTimeout(nearbyDebounceRef.current);
            }

            nearbyDebounceRef.current = setTimeout(() => {
              void loadNearbyData(coords, 'movement');
            }, 1000);
          }

          // emit live vehicle location to backend (socket)
          try {
            if (!vehicleIdRef.current) {
              vehicleIdRef.current = user?.email ? user.email : `mobile-${Math.floor(Math.random() * 100000)}`;
            }

            const vehicleId = vehicleIdRef.current;
            void emitLiveVehicleLocation({ vehicleId, driverId: vehicleId, latitude: coords.latitude, longitude: coords.longitude, timestamp: new Date().toISOString() }).catch(() => {});
          } catch {
            // noop
          }
        },
        (message) => {
          setStatusText('Live tracking paused');
          setErrorText(message);
        }
      );

      if (!watchResult.data) {
        setStatusText('Live tracking unavailable');
        setErrorText(watchResult.error ?? 'Unable to start live location updates.');
        return;
      }

      removeLocationSubscription = () => watchResult.data?.remove();
      watchStarted = true;

      // subscribe to socket updates for other vehicles
      removeVehicleListener = onVehicleLocationUpdated((payload) => {
        setVehicleMarkers((prev) => {
          const idx = prev.findIndex((v) => v.vehicleId === payload.vehicleId);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = payload;
            return copy;
          }
          return [payload, ...prev].slice(0, 100);
        });
      });

      // bootstrap initial vehicles list
      removeBootstrapListener = onBootstrapVehicleLocations((res) => {
        if (res && res.data) {
          setVehicleMarkers(res.data.map((d) => ({ ...d })));
        }
      });

      // fetch nearby charging stations and dealerships once
      void loadNearbyData(initialCoords, 'initial');
    };

    void setupLocation();

    return () => {
      isMounted = false;
      if (watchStarted) {
        removeLocationSubscription?.();
      }
      if (nearbyDebounceRef.current) {
        clearTimeout(nearbyDebounceRef.current);
      }
      removeVehicleListener?.();
      removeBootstrapListener?.();
    };
  }, [reloadIndex]);

  const handleRecenter = () => {
    if (!currentLocation) {
      return;
    }

    mapRef.current?.animateToRegion(buildRegion(currentLocation), 500);
  };

  const handleRetry = () => {
    setErrorText(null);
    setNearbyError(null);
    setNearbyStatus('idle');
    setStatusText('Retrying location and station lookup...');
    lastNearbyFetchAtRef.current = 0;
    setReloadIndex((value) => value + 1);
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.webCard}>
          <MaterialCommunityIcons name="map-marker-radius" size={42} color="#16A34A" />
          <Text style={styles.title}>GPS map preview</Text>
          <Text style={styles.subtitle}>
            Native maps are available on Android and iOS. Use the installed app on a device or emulator to see the live blue location dot.
          </Text>
          <Text style={styles.status}>{statusText}</Text>
          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>GPS + Maps</Text>
          <Text style={styles.title}>Live EV map</Text>
        </View>

        <Pressable style={styles.recenterButton} onPress={handleRecenter}>
          <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#0F172A" />
          <Text style={styles.recenterText}>Recenter</Text>
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status</Text>
          <Text style={styles.summaryValue}>{statusText}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Blue dot</Text>
          <Text style={styles.summaryValue}>{currentLocation ? 'Visible' : 'Waiting'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Coordinates</Text>
          <Text style={styles.summaryValue}>{formatCoordinates(currentLocation)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Zoom</Text>
          <Text style={styles.summaryValue}>Pinch, drag, or tap recenter</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Accuracy</Text>
          <Text style={styles.summaryValue}>{Math.round(accuracy)} m</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Nearby data</Text>
          <Text style={styles.summaryValue}>
            {nearbyStatus === 'loading' ? 'Loading...' : nearbyStatus === 'success' ? 'Loaded' : nearbyStatus === 'error' ? 'Needs retry' : 'Idle'}
          </Text>
        </View>
      </View>

      {(errorText || nearbyError) ? (
        <View style={styles.retryCard}>
          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
          {nearbyError ? <Text style={styles.errorText}>{nearbyError}</Text> : null}
          <Pressable style={styles.retryButton} onPress={handleRetry}>
            <MaterialCommunityIcons name="reload" size={18} color="#0F172A" />
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.mapCard}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={buildRegion(currentLocation)}
          showsUserLocation
          showsMyLocationButton
          zoomEnabled
          scrollEnabled
          rotateEnabled
          pitchEnabled
          toolbarEnabled
        >
          <Circle
            center={currentLocation}
            radius={Math.max(accuracy, 25)}
            strokeColor="rgba(34, 197, 94, 0.35)"
            fillColor="rgba(34, 197, 94, 0.12)"
          />

          <Marker
            coordinate={currentLocation}
            title="Your live location"
            description="GPS position from expo-location"
          />

          {/* Live vehicles / drivers */}
          {vehicleMarkers.map((v) => (
            <Marker
              key={`veh-${v.vehicleId}`}
              coordinate={{ latitude: v.latitude, longitude: v.longitude }}
              title={`Vehicle ${v.vehicleId}`}
              description={`Driver: ${v.driverId}`}
              pinColor="#0ea5e9"
            />
          ))}

          {/* Nearby charging stations from backend */}
          {stationMarkers.map((s) => (
            <Marker
              key={s.id || s._id || `${s.coordinates.latitude}-${s.coordinates.longitude}`}
              coordinate={{ latitude: s.coordinates.latitude, longitude: s.coordinates.longitude }}
              title={s.stationName || s.name || 'Charging Station'}
              description={`${s.availableSlots ?? s.availableSlots} slots · ${s.chargerType || s.chargerType}`}
              pinColor="#16A34A"
            />
          ))}

          {/* Dealerships / franchises */}
          {dealershipMarkers.map((d) => (
            d.latitude && d.longitude ? (
              <Marker
                key={d._id || d.id || d.businessName}
                coordinate={{ latitude: d.latitude, longitude: d.longitude }}
                title={d.businessName || d.partnerName || 'Dealership'}
                description={d.city ?? ''}
                pinColor="#7c3aed"
              />
            ) : null
          ))}

          {/* Demo chargers (fallback) */}
          {chargerMarkers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.name}
              description={marker.status === 'available' ? 'Available charger' : 'Busy charger'}
              pinColor={marker.status === 'available' ? '#16A34A' : '#F59E0B'}
            />
          ))}
        </MapView>
      </View>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08111F',
    padding: 16,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kicker: {
    color: '#7DD3FC',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  recenterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  recenterText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  summaryValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    flex: 1.7,
    textAlign: 'right',
  },
  mapCard: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: '#0B1220',
  },
  map: {
    flex: 1,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  loadingTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  retryCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    gap: 10,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    paddingVertical: 10,
  },
  retryText: {
    color: '#0F172A',
    fontWeight: '800',
  },
  webCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 28,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  status: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
});