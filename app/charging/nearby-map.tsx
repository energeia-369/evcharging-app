import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createFallbackNearbyStations, getNearbyChargingStations, NearbyChargingStation } from '@/services/chargingApi';
import {
    Coordinates,
    DEFAULT_COORDINATES,
    getCurrentCoordinates,
    requestLocationPermission,
    watchCurrentCoordinates,
} from '@/services/locationService';

const DEFAULT_REGION: Region = {
  latitude: DEFAULT_COORDINATES.latitude,
  longitude: DEFAULT_COORDINATES.longitude,
  latitudeDelta: 0.08,
  longitudeDelta: 0.05,
};

const buildRegion = (coords: Coordinates): Region => ({
  latitude: coords.latitude,
  longitude: coords.longitude,
  latitudeDelta: 0.05,
  longitudeDelta: 0.04,
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

export default function NearbyChargingMapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<Coordinates>(DEFAULT_COORDINATES);
  const [nearbyStations, setNearbyStations] = useState<NearbyChargingStation[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<NearbyChargingStation | null>(null);
  const [isNavigationActive, setIsNavigationActive] = useState(false);
  const [estimatedDistanceKm, setEstimatedDistanceKm] = useState<number | null>(null);
  const [estimatedDurationMin, setEstimatedDurationMin] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingStations, setIsFetchingStations] = useState(false);
  const [statusText, setStatusText] = useState('Finding your location...');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [stationStatusText, setStationStatusText] = useState('Loading nearby charging stations...');
  const googleDirectionsApiKey = process.env.EXPO_PUBLIC_GOOGLE_DIRECTIONS_API_KEY || '';
  const lastLoadedCoordinatesRef = useRef<Coordinates | null>(null);
  const latestCoordinatesRef = useRef<Coordinates>(DEFAULT_COORDINATES);
  const lastRequestAtRef = useRef(0);
  const isFetchingRef = useRef(false);
  const lastRequestKeyRef = useRef<string | null>(null);
  const loadDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nearestStation = useMemo(() => nearbyStations[0] ?? null, [nearbyStations]);

  const calculateDistanceKm = (origin: Coordinates, destination: Coordinates) => {
    const radiusKm = 6371;
    const latitudeDelta = ((destination.latitude - origin.latitude) * Math.PI) / 180;
    const longitudeDelta = ((destination.longitude - origin.longitude) * Math.PI) / 180;
    const a =
      Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
      Math.cos((origin.latitude * Math.PI) / 180) *
        Math.cos((destination.latitude * Math.PI) / 180) *
        Math.sin(longitudeDelta / 2) *
        Math.sin(longitudeDelta / 2);
    return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const normalizeStations = (coords: Coordinates, responseStations: NearbyChargingStation[]) => {
    const normalized = responseStations
      .filter((station) => {
        const latitude = station.coordinates?.latitude ?? station.latitude;
        const longitude = station.coordinates?.longitude ?? station.longitude;
        return typeof latitude === 'number' && typeof longitude === 'number';
      })
      .map((station) => {
        const latitude = station.coordinates?.latitude ?? station.latitude ?? coords.latitude;
        const longitude = station.coordinates?.longitude ?? station.longitude ?? coords.longitude;
        return {
          ...station,
          latitude,
          longitude,
          coordinates: { latitude, longitude },
          distanceKm: calculateDistanceKm(coords, { latitude, longitude }),
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return normalized;
  };

  const loadNearbyStations = async (coords: Coordinates, allowFallback = true, reason: 'initial' | 'movement' | 'retry' = 'initial') => {
    const requestKey = `${coords.latitude.toFixed(4)}:${coords.longitude.toFixed(4)}`;

    if (isFetchingRef.current) {
      return;
    }

    if (reason === 'movement' && requestKey === lastRequestKeyRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsFetchingStations(true);
    setIsLoading(true);
    setErrorText(null);
    setStationStatusText('Fetching nearby charging stations...');

    try {
      const response = await getNearbyChargingStations({
        latitude: coords.latitude,
        longitude: coords.longitude,
        radiusKm: 50,
        limit: 30,
      });

      const stations = normalizeStations(coords, response.data);
      setNearbyStations(stations);
      setSelectedDestination(stations[0] ?? null);
      lastLoadedCoordinatesRef.current = coords;
      lastRequestKeyRef.current = requestKey;
      lastRequestAtRef.current = Date.now();

      if (response.data.length === 0) {
        setStationStatusText('No nearby stations found in the current radius.');
      } else {
        if (reason !== 'movement') {
          console.log('[Nearby Map] Nearby stations loaded');
        }
        setStationStatusText('Nearby charging stations loaded');
      }

      mapRef.current?.animateToRegion(buildRegion(coords), 700);
    } catch (error) {
      console.error('[Nearby Map] API error', error);

      if (allowFallback) {
        const fallbackStations = createFallbackNearbyStations(coords);
        setNearbyStations(fallbackStations);
        setSelectedDestination(fallbackStations[0] ?? null);
        setStationStatusText('Station API unavailable. Showing fallback stations.');
      }

      setErrorText(error instanceof Error ? error.message : 'Failed to load nearby stations.');
    } finally {
      setIsLoading(false);
      setIsFetchingStations(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    let isMounted = true;
    let watchSubscription: { remove: () => void } | null = null;

    const bootstrapNearbyStations = async () => {
      const permissionResult = await requestLocationPermission();
      if (!isMounted) {
        return;
      }

      if (!permissionResult.data) {
        Alert.alert('Location permission required', permissionResult.error || 'Location permission is required to find nearby stations.');
        setStatusText('Location permission denied');
        setErrorText(permissionResult.error || 'Location permission is required to find nearby stations.');
        setUserCoordinates(DEFAULT_COORDINATES);
        await loadNearbyStations(DEFAULT_COORDINATES, true);
        return;
      }

      const locationResult = await getCurrentCoordinates();
      if (!isMounted) {
        return;
      }

      const coords = locationResult.data?.coords ?? DEFAULT_COORDINATES;
      latestCoordinatesRef.current = coords;
      setUserCoordinates(coords);
      setStatusText(locationResult.error ? 'Using default coordinates' : 'Fetching nearest charging stations...');
      if (locationResult.error) {
        setErrorText(locationResult.error);
      }

      const watchResult = await watchCurrentCoordinates(
        async ({ coords: nextCoords }) => {
          if (!isMounted) {
            return;
          }

          const previousCoords = latestCoordinatesRef.current;
          latestCoordinatesRef.current = nextCoords;

          const movedEnough = hasSignificantCoordinateChange(previousCoords, nextCoords);
          const now = Date.now();
          const throttlePassed = now - lastRequestAtRef.current >= API_THROTTLE_MS;

          setUserCoordinates(nextCoords);
          if (movedEnough && throttlePassed) {
            if (loadDebounceRef.current) {
              clearTimeout(loadDebounceRef.current);
            }

            loadDebounceRef.current = setTimeout(() => {
              void loadNearbyStations(nextCoords, true, 'movement');
            }, 1000);
          }
        },
        (message) => {
          if (isMounted) {
            setErrorText(message);
          }
        },
      );

      if (watchResult.data) {
        watchSubscription = watchResult.data;
      }

      await loadNearbyStations(coords, true, 'initial');
    };

    void bootstrapNearbyStations();

    return () => {
      isMounted = false;
      watchSubscription?.remove();
      if (loadDebounceRef.current) {
        clearTimeout(loadDebounceRef.current);
      }
    };
  }, []);

  const handleRecenter = () => {
    mapRef.current?.animateToRegion(buildRegion(userCoordinates), 500);
  };

  const handleRetry = () => {
    setErrorText(null);
    setStationStatusText('Retrying nearby stations...');
    lastRequestAtRef.current = 0;
    void loadNearbyStations(userCoordinates, true, 'retry');
  };

  const handleDestinationSelect = (station: NearbyChargingStation) => {
    setSelectedDestination(station);
    setEstimatedDistanceKm(null);
    setEstimatedDurationMin(null);
    setIsNavigationActive(false);

    mapRef.current?.animateToRegion(
      {
        latitude: station.coordinates.latitude,
        longitude: station.coordinates.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      500,
    );
  };

  const handleStartNavigation = () => {
    if (!selectedDestination || !userCoordinates) {
      setErrorText('Select a destination and ensure current location is available.');
      return;
    }

    if (!googleDirectionsApiKey) {
      setErrorText('Missing EXPO_PUBLIC_GOOGLE_DIRECTIONS_API_KEY for route navigation.');
      return;
    }

    setErrorText(null);
    setStatusText('Navigation started');
    setIsNavigationActive(true);
  };

  const handleStopNavigation = () => {
    setIsNavigationActive(false);
    setStatusText('Navigation stopped');
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.webCard}>
          <MaterialCommunityIcons name="map-search" size={42} color="#16A34A" />
          <Text style={styles.title}>Nearby station map</Text>
          <Text style={styles.subtitle}>Use Android or iOS build to view native map markers and distances.</Text>
          <Text style={styles.status}>{statusText}</Text>
          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Nearby Finder</Text>
          <Text style={styles.title}>Charging stations map</Text>
        </View>

        <Pressable style={styles.recenterButton} onPress={handleRecenter}>
          <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#0F172A" />
          <Text style={styles.recenterButtonText}>Recenter</Text>
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.status}>{statusText}</Text>
        <Text style={styles.metaText}>{stationStatusText}</Text>
        <Text style={styles.metaText}>Stations found: {nearbyStations.length}</Text>
        <Text style={styles.metaText}>Fetch state: {isFetchingStations ? 'Fetching' : 'Idle'}</Text>
        <Text style={styles.metaText}>
          Nearest: {nearestStation ? `${nearestStation.stationName} (${nearestStation.distanceKm.toFixed(2)} km)` : 'Not available'}
        </Text>
        <Text style={styles.metaText}>
          Destination: {selectedDestination ? selectedDestination.stationName : 'Select a station marker'}
        </Text>
        <Text style={styles.metaText}>
          Estimated distance: {estimatedDistanceKm !== null ? `${estimatedDistanceKm.toFixed(2)} km` : 'Not available'}
        </Text>
        <Text style={styles.metaText}>
          Estimated time: {estimatedDurationMin !== null ? `${Math.round(estimatedDurationMin)} mins` : 'Not available'}
        </Text>

        {isNavigationActive ? (
          <TouchableOpacity style={[styles.navigationButton, styles.navigationButtonStop]} onPress={handleStopNavigation}>
            <MaterialCommunityIcons name="navigation-variant-off" size={18} color="#ffffff" />
            <Text style={styles.navigationButtonText}>Stop Navigation</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navigationButton} onPress={handleStartNavigation}>
            <MaterialCommunityIcons name="navigation-variant" size={18} color="#ffffff" />
            <Text style={styles.navigationButtonText}>Start Navigation</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.stationListCard}>
        <View style={styles.stationListHeader}>
          <MaterialCommunityIcons name="ev-station" size={18} color="#16A34A" />
          <Text style={styles.stationListTitle}>Nearby stations</Text>
          <Text style={styles.stationListCount}>{nearbyStations.length}</Text>
        </View>

        {nearbyStations.length > 0 ? (
          nearbyStations.slice(0, 3).map((station) => (
            <TouchableOpacity
              key={station.id}
              style={styles.stationListItem}
              activeOpacity={0.86}
              onPress={() => handleDestinationSelect(station)}
            >
              <View style={styles.stationListIcon}>
                <MaterialCommunityIcons name="map-marker-radius" size={18} color="#16A34A" />
              </View>
              <View style={styles.stationListInfo}>
                <Text style={styles.stationListName} numberOfLines={1}>
                  {station.stationName}
                </Text>
                <Text style={styles.stationListMeta} numberOfLines={1}>
                  {station.location} · {station.distanceKm.toFixed(2)} km · {station.availableSlots} slots
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.metaText}>No nearby stations were returned by the API.</Text>
        )}
      </View>

      <View style={styles.mapCard}>
        {errorText ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{errorText}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.9}>
              <MaterialCommunityIcons name="reload" size={18} color="#0F172A" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#22C55E" />
            <Text style={styles.metaText}>Loading nearby stations...</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={userCoordinates ? buildRegion(userCoordinates) : DEFAULT_REGION}
            showsUserLocation
            zoomEnabled
            scrollEnabled
            rotateEnabled
            pitchEnabled
          >
            {userCoordinates ? (
              <Marker
                coordinate={userCoordinates}
                title="Your location"
                description="Current GPS coordinates"
                pinColor="#2563EB"
              />
            ) : null}

            {nearbyStations.map((station) => (
              <Marker
                key={station.id}
                coordinate={{
                  latitude: station.coordinates.latitude,
                  longitude: station.coordinates.longitude,
                }}
                title={selectedDestination?.id === station.id ? `${station.stationName} (Destination)` : station.stationName}
                description={`${station.distanceKm.toFixed(2)} km away`}
                pinColor={selectedDestination?.id === station.id ? '#EF4444' : station.status === 'active' ? '#16A34A' : '#F59E0B'}
                onPress={() => handleDestinationSelect(station)}
              />
            ))}

            {isNavigationActive &&
            userCoordinates &&
            selectedDestination &&
            googleDirectionsApiKey ? (
              <MapViewDirections
                origin={userCoordinates}
                destination={selectedDestination.coordinates}
                apikey={googleDirectionsApiKey}
                strokeColor="#38BDF8"
                strokeWidth={5}
                mode="DRIVING"
                onReady={(result) => {
                  setEstimatedDistanceKm(result.distance);
                  setEstimatedDurationMin(result.duration);
                }}
                onError={(message) => {
                  setErrorText(`Directions error: ${message}`);
                }}
              />
            ) : null}
          </MapView>
        )}
      </View>

      {!errorText ? null : <Text style={styles.errorText}>{errorText}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07131F',
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kicker: {
    color: '#86EFAC',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 26,
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
  recenterButtonText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  stationListCard: {
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  stationListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stationListTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  stationListCount: {
    color: '#86EFAC',
    fontSize: 12,
    fontWeight: '700',
  },
  stationListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 14,
    padding: 12,
  },
  stationListIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(22, 163, 74, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationListInfo: {
    flex: 1,
    gap: 2,
  },
  stationListName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  stationListMeta: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
  },
  navigationButton: {
    marginTop: 6,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  navigationButtonStop: {
    backgroundColor: '#DC2626',
  },
  navigationButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  mapCard: {
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
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  metaText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  status: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '600',
  },
  errorCard: {
    gap: 10,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    borderRadius: 16,
    padding: 14,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#0F172A',
    fontWeight: '800',
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
    backgroundColor: '#111827',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 24,
    gap: 12,
  },
});
