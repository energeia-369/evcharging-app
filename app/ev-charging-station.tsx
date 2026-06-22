import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import EvChargingMap from '@/components/ev-charging-map';
import {
  getNearbyChargingStations,
  NearbyChargingStation,
} from '@/services/chargingApi';
import {
  Coordinates,
  getCurrentCoordinates,
  requestLocationPermission,
  watchCurrentCoordinates,
} from '@/services/locationService';

type TabType = 'map' | 'stations' | 'availability' | 'booking' | 'session' | 'history' | 'payment' | 'invoice';

type StationStatus = 'available' | 'busy';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface Station {
  distanceKm?: number;
  id: string;
  name: string;
  location: string;
  rating: number;
  acSlots: number;
  dcSlots: number;
  status: StationStatus;
  latitude: number;
  longitude: number;
  availableSlots?: number;
}

interface ChargingSession {
  id: string;
  stationName: string;
  startTime: string;
  duration: string;
  energyCharged: string;
  cost: string;
  status: 'active' | 'completed';
}

interface BookingSlot {
  id: string;
  stationName: string;
  date: string;
  time: string;
  type: 'AC' | 'DC';
  duration: string;
  status: 'confirmed' | 'pending';
}

const SEARCH_RADIUS_METERS = 5000;

const fallbackStations: Station[] = [
  {
    id: '1',
    name: 'Downtown Charging Hub',
    location: 'Downtown',
    rating: 4.8,
    acSlots: 4,
    dcSlots: 2,
    status: 'available',
    latitude: 37.443,
    longitude: -122.145,
  },
  {
    id: '2',
    name: 'Airport EV Station',
    location: 'Airport District',
    rating: 4.5,
    acSlots: 6,
    dcSlots: 4,
    status: 'available',
    latitude: 37.6213,
    longitude: -122.379,
  },
  {
    id: '3',
    name: 'Mall Charging Point',
    location: 'Shopping Center',
    rating: 4.6,
    acSlots: 3,
    dcSlots: 1,
    status: 'busy',
    latitude: 37.4847,
    longitude: -122.1484,
  },
];

const LOCATION_REFRESH_INTERVAL_MS = 6000;
const LOCATION_MOVE_THRESHOLD_KM = 0.01;

const mockHistory: ChargingSession[] = [
  {
    id: '1',
    stationName: 'Downtown Charging Hub',
    startTime: '2024-05-10 10:30 AM',
    duration: '45 mins',
    energyCharged: '25 kWh',
    cost: '₹375',
    status: 'completed',
  },
  {
    id: '2',
    stationName: 'Airport EV Station',
    startTime: '2024-05-09 02:15 PM',
    duration: '60 mins',
    energyCharged: '35 kWh',
    cost: '₹525',
    status: 'completed',
  },
];

const mockBookings: BookingSlot[] = [
  {
    id: '1',
    stationName: 'Downtown Charging Hub',
    date: '2024-05-15',
    time: '03:00 PM',
    type: 'DC',
    duration: '30 mins',
    status: 'confirmed',
  },
];

const getNumber = (value: string | number | undefined): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const parsed = typeof value === 'number' ? value : Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const getStationArea = (tags: Record<string, string>): string => {
  return (
    tags['addr:suburb'] ||
    tags['addr:city'] ||
    tags['addr:town'] ||
    tags['addr:village'] ||
    tags.operator ||
    'Nearby area'
  );
};

const createFallbackStations = (coords: LocationCoords): Station[] => {
  return fallbackStations
    .map((station, index) => ({
      ...station,
      id: `${station.id}-${index}`,
      latitude: station.latitude + (coords.latitude - 37.441) * 0.01,
      longitude: station.longitude + (coords.longitude - -122.145) * 0.01,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

const normalizeNearbyStations = (stations: NearbyChargingStation[], coords: LocationCoords): Station[] => {
  return stations
    .map((station, index) => {
      const latitude = station.coordinates?.latitude ?? station.latitude ?? coords.latitude;
      const longitude = station.coordinates?.longitude ?? station.longitude ?? coords.longitude;
      const isDc = /dc|fast/i.test(station.chargerType || '');
      const availableSlots = station.availableSlots ?? 0;

      return {
        id: station.id || station._id || `${index}`,
        name: station.name || station.stationName,
        location: station.location || 'Nearby charging station',
        rating: 4.5,
        acSlots: station.acSlots ?? (isDc ? 0 : availableSlots),
        dcSlots: station.dcSlots ?? (isDc ? availableSlots : 0),
        status:
          station.status === 'maintenance' || station.status === 'inactive'
            ? 'busy'
            : (station.status as StationStatus) || 'available',
        latitude,
        longitude,
        availableSlots,
        distanceKm: station.distanceKm ?? station.distance,
      } satisfies Station;
    })
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
};

const buildLiveStationList = (elements: any[], coords: LocationCoords): Station[] => {
  return elements
    .map((element, index) => {
      const latitude = element.lat ?? element.center?.lat;
      const longitude = element.lon ?? element.center?.lon;

      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return null;
      }

      const tags: Record<string, string> = element.tags ?? {};
      const totalConnectors =
        getNumber(tags.capacity) ??
        getNumber(tags['capacity:dc']) ??
        getNumber(tags['capacity:ac']) ??
        4;
      const acSlots =
        getNumber(tags['socket:type2:qty']) ??
        getNumber(tags['socket:type1:qty']) ??
        getNumber(tags['capacity:ac']) ??
        Math.max(1, Math.round(totalConnectors * 0.65));
      const dcSlots =
        getNumber(tags['socket:ccs:qty']) ??
        getNumber(tags['socket:chademo:qty']) ??
        getNumber(tags['capacity:dc']) ??
        Math.max(1, Math.round(totalConnectors * 0.35));

      return {
        id: `${element.type}-${element.id ?? index}`,
        name: tags.name || tags.operator || `Charging Station ${index + 1}`,
        location: getStationArea(tags),
        rating: Number((4.2 + Math.min(0.7, totalConnectors * 0.08)).toFixed(1)),
        acSlots,
        dcSlots,
        status: tags.access === 'private' || tags.access === 'no' ? 'busy' : 'available',
        latitude,
        longitude,
      } satisfies Station;
    })
    .filter(
  (station): station is Station =>
    station !== null
)
    .sort((a, b) => {
      const aDistance = Math.hypot(a.latitude - coords.latitude, a.longitude - coords.longitude);
      const bDistance = Math.hypot(b.latitude - coords.latitude, b.longitude - coords.longitude);
      return aDistance - bDistance;
    });
};

export default function EVChargingStationScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [stations, setStations] = useState<Station[]>(fallbackStations);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [stationsError, setStationsError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const locationSubscriptionRef = useRef<{ remove: () => void } | null>(null);
  const lastFetchedLocationRef = useRef<LocationCoords | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const bootstrapNearbyStations = async () => {
      setStationsLoading(true);
      setStationsError(null);
      setLocationError(null);

      try {
        const permissionResult = await requestLocationPermission();

        if (!isMountedRef.current) {
          return;
        }

        if (!permissionResult.data) {
          setLocationError(permissionResult.error || 'Location permission denied');
          setStations(createFallbackStations({ latitude: fallbackStations[0].latitude, longitude: fallbackStations[0].longitude }));
          setIsInitialLoading(false);
          return;
        }

        const currentLocationResult = await getCurrentCoordinates();

        if (!isMountedRef.current) {
          return;
        }

        if (!currentLocationResult.data) {
          setLocationError(currentLocationResult.error || 'Unable to read your current location');
          setStations(createFallbackStations({ latitude: fallbackStations[0].latitude, longitude: fallbackStations[0].longitude }));
          setIsInitialLoading(false);
          return;
        }

        const currentLocation = currentLocationResult.data.coords;
        setUserLocation(currentLocation);
        lastFetchedLocationRef.current = currentLocation;
        await fetchNearbyStations(currentLocation, true);

        const watchResult = await watchCurrentCoordinates(
          ({ coords }) => {
            if (!isMountedRef.current) {
              return;
            }

            const previousLocation = lastFetchedLocationRef.current;
            const hasMovedEnough =
              !previousLocation ||
              calculateDistance(
                previousLocation.latitude,
                previousLocation.longitude,
                coords.latitude,
                coords.longitude
              ) >= LOCATION_MOVE_THRESHOLD_KM;

            setUserLocation(coords);

            if (hasMovedEnough) {
              lastFetchedLocationRef.current = coords;
              void fetchNearbyStations(coords, true);
            }
          },
          (message) => {
            if (!isMountedRef.current) {
              return;
            }

            setLocationError(message);
          }
        );

        if (watchResult.data) {
          locationSubscriptionRef.current = watchResult.data;
        }

        refreshTimerRef.current = setInterval(() => {
          const latestLocation = lastFetchedLocationRef.current;
          if (latestLocation) {
            void fetchNearbyStations(latestLocation, true);
          }
        }, LOCATION_REFRESH_INTERVAL_MS);
      } catch {
        if (!isMountedRef.current) {
          return;
        }

        setLocationError('Unable to read your current location');
        setStations(createFallbackStations({ latitude: fallbackStations[0].latitude, longitude: fallbackStations[0].longitude }));
      } finally {
        if (isMountedRef.current) {
          setStationsLoading(false);
          setIsInitialLoading(false);
        }
      }
    };

    void bootstrapNearbyStations();

    return () => {
      isMountedRef.current = false;
      locationSubscriptionRef.current?.remove();
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNearbyStations = async (coords: LocationCoords, allowFallback = true) => {
    setStationsLoading(true);
    setStationsError(null);

    try {
      const response = await getNearbyChargingStations({
        latitude: coords.latitude,
        longitude: coords.longitude,
        radiusKm: 25,
        limit: 20,
      });

      const normalizedStations = normalizeNearbyStations(response.data, coords);

      if (normalizedStations.length > 0) {
        setStations(normalizedStations);
      } else if (allowFallback) {
        setStations(createFallbackStations(coords));
        setStationsError('No nearby charging stations found. Showing fallback stations.');
      } else {
        setStations([]);
      }
    } catch (error) {
      if (allowFallback) {
        setStations(createFallbackStations(coords));
      }

      setStationsError(error instanceof Error ? error.message : 'Nearby charging station data is temporarily unavailable');
    } finally {
      setStationsLoading(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (sessionActive) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [sessionActive]);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const stationsWithDistance = useMemo(() => {
    if (!userLocation) {
      return stations;
    }

    return stations
      .map((station) => ({
        ...station,
        distanceKm: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          station.latitude,
          station.longitude
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [stations, userLocation]);

  const nearbyStations = stationsWithDistance;

  const openConnectorCount = useMemo(() => {
    return stationsWithDistance.reduce((sum, station) => sum + station.acSlots + station.dcSlots, 0);
  }, [stationsWithDistance]);

  const averageRating = useMemo(() => {
    if (stationsWithDistance.length === 0) {
      return '4.7';
    }

    const rating =
      stationsWithDistance.reduce((sum, station) => sum + station.rating, 0) / stationsWithDistance.length;
    return rating.toFixed(1);
  }, [stationsWithDistance]);

  const getStationDistanceText = (station: Station & { distanceKm?: number }) => {
    if (userLocation && typeof station.distanceKm === 'number') {
      return `${station.distanceKm.toFixed(1)} km away`;
    }

    return station.location;
  };

  const handleSelectStation = (station: Station) => {
    setSelectedStation(station.id);
    router.push({
      pathname: '/charging/connector-selection',
      params: {
        stationId: station.id,
        stationName: station.name,
        stationLocation: station.location,
      },
    });
  };

  const handleCurrentLocationPress = () => {
    if (!userLocation) {
      return;
    }

    setSelectedStation(null);
    setUserLocation({ ...userLocation });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const tabs: { id: TabType; label: string; icon: string }[] = useMemo(
    () => [
      { id: 'map', label: 'Map', icon: 'map' },
      { id: 'stations', label: 'Stations', icon: 'map-marker' },
      { id: 'availability', label: 'Availability', icon: 'battery-charging' },
      { id: 'booking', label: 'Booking', icon: 'calendar-clock' },
      { id: 'session', label: 'Session', icon: 'lightning-bolt' },
      { id: 'history', label: 'History', icon: 'history' },
      { id: 'payment', label: 'Payment', icon: 'credit-card' },
      { id: 'invoice', label: 'Invoice', icon: 'receipt-text' },
    ],
    []
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FBF7" />

      <View style={styles.hero}>
        <View style={styles.heroGlowTop} />
        <View style={styles.heroGlowBottom} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#14532D" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerEyebrow}>EV Network</Text>
            <Text style={styles.headerTitle}>Charging Station</Text>
          </View>

          <View style={styles.headerBadge}>
            <MaterialCommunityIcons name="map-marker-radius" size={16} color="#16A34A" />
            <Text style={styles.headerBadgeText}>Live</Text>
          </View>
        </View>

        <View style={styles.heroStats}>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>{stationsWithDistance.length}</Text>
            <Text style={styles.heroStatLabel}>Stations nearby</Text>
          </View>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>{openConnectorCount}</Text>
            <Text style={styles.heroStatLabel}>Open connectors</Text>
          </View>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>{averageRating}</Text>
            <Text style={styles.heroStatLabel}>Avg. rating</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabsShell}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons
                name={tab.icon as any}
                size={17}
                color={activeTab === tab.id ? '#166534' : '#94A3B8'}
              />
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'map' && (
          <View style={styles.mapTabContainer}>
            {stationsError ? (
              <Text
                style={{
                  marginBottom: 10,
                  color: '#B45309',
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {stationsError}
              </Text>
            ) : null}

            {/* Map Section */}
            <View style={styles.mapContainer}>
              {isInitialLoading ? (
                <View style={styles.mapPlaceholder}>
                  <MaterialCommunityIcons name="progress-clock" size={48} color="#16A34A" />
                  <Text style={styles.mapErrorText}>Locating your GPS and nearby stations...</Text>
                </View>
              ) : userLocation || isWeb ? (
                <View style={styles.mapWithButtonWrap}>
                  <EvChargingMap
                    style={styles.map}
                    userLocation={userLocation}
                    stationCoordinates={stationsWithDistance}
                    onSelectStation={(stationId) => setSelectedStation(stationId)}
                  />

                  <TouchableOpacity style={styles.currentLocationButton} onPress={handleCurrentLocationPress}>
                    <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#ffffff" />
                    <Text style={styles.currentLocationButtonText}>Current location</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.mapPlaceholder}>
                  <MaterialCommunityIcons name="map-marker-off" size={48} color="#d1d5db" />
                  <Text style={styles.mapErrorText}>
                    {locationError || 'Loading location...'}
                  </Text>
                </View>
              )}

              {stationsLoading && !isInitialLoading ? (
                <View style={styles.mapLoadingOverlay}>
                  <View style={styles.mapLoadingCard}>
                    <MaterialCommunityIcons name="cloud-sync" size={22} color="#16A34A" />
                    <Text style={styles.mapLoadingText}>Updating nearby stations...</Text>
                  </View>
                </View>
              ) : null}
            </View>

            {/* Selected Station Details Card */}
            {selectedStation && (
              <View style={styles.stationDetailsCard}>
                {stationsWithDistance
                  .filter((s) => s.id === selectedStation)
                  .map((station) => (
                    <View key={station.id} style={styles.stationDetailsContent}>
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor:
                              station.status === 'available'
                                ? '#10b981'
                                : station.status === 'busy'
                                  ? '#f59e0b'
                                  : '#94a3b8',
                          },
                        ]}
                      />
                      <View style={styles.stationDetailText}>
                        <Text style={styles.stationDetailsName}>{station.name}</Text>
                        <Text style={styles.stationDetailsSlots}>
                          AC: {station.acSlots} | DC: {station.dcSlots}
                        </Text>
                        <Text style={styles.stationDetailsStatus}>
                          {station.status === 'available'
                            ? '✓ Available'
                            : station.status === 'busy'
                              ? '⚠ Busy'
                              : '○ Offline'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setSelectedStation(null)}
                        style={styles.closeDetailsButton}
                      >
                        <MaterialCommunityIcons name="close" size={20} color="#6b7280" />
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            )}

            {/* Nearby Stations List Below Map */}
            {userLocation && nearbyStations.length > 0 && (
              <View style={styles.nearbyStationsContainer}>
                <View style={styles.nearbyStationsHeader}>
                  <MaterialCommunityIcons name="map-marker-radius" size={18} color="#10b981" />
                  <Text style={styles.nearbyStationsTitle}>Nearby Stations</Text>
                  <Text style={styles.nearbyStationsCount}>({nearbyStations.length})</Text>
                </View>

                {nearbyStations.map((station) => (
                  <TouchableOpacity
                    key={station.id}
                    onPress={() => setSelectedStation(station.id)}
                    style={styles.nearbyStationItem}
                    activeOpacity={0.85}
                  >
                    <View style={styles.nearbyStationIcon}>
                      <MaterialCommunityIcons
                        name="ev-station"
                        size={20}
                        color={station.status === 'available' ? '#0891b2' : '#f59e0b'}
                      />
                    </View>
                    <View style={styles.nearbyStationInfo}>
                      <Text style={styles.nearbyStationName}>{station.name}</Text>
                      <View style={styles.nearbyStationMeta}>
                        <MaterialCommunityIcons name="navigation" size={12} color="#6b7280" />
                        <Text style={styles.nearbyStationDistance}>
                          {(station.distanceKm ?? 0).toFixed(1)} km
                        </Text>
                        <Text style={styles.nearbyStationDot}>•</Text>
                        <Text
                          style={[
                            styles.nearbyStationStatus,
                            {
                              color:
                                station.status === 'available' ? '#10b981' : '#f59e0b',
                            },
                          ]}
                        >
                          {station.status === 'available' ? 'Available' : 'Busy'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.nearbyStationSlots}>
                      <View style={styles.slotBadge}>
                        <MaterialCommunityIcons name="flash" size={14} color="#F59E0B" />
                        <Text style={styles.slotCount}>{station.acSlots}</Text>
                      </View>
                      <View style={styles.slotBadge}>
                        <MaterialCommunityIcons name="flash" size={14} color="#EF4444" />
                        <Text style={styles.slotCount}>{station.dcSlots}</Text>
                      </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#d1d5db" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'stations' && (
          <View>
            <View style={styles.sectionHeadingRow}>
              <View>
                <Text style={styles.sectionKicker}>Nearby</Text>
                <Text style={styles.sectionTitle}>Charging stations</Text>
              </View>
              <TouchableOpacity style={styles.filterChip} activeOpacity={0.85}>
                <MaterialCommunityIcons name="tune-variant" size={16} color="#166534" />
                <Text style={styles.filterChipText}>Filter</Text>
              </TouchableOpacity>
            </View>

            {stationsWithDistance.map((station) => (
              <View key={station.id} style={styles.stationCard}>
                <View style={styles.stationTopRow}>
                  <View style={styles.stationIconWrap}>
                    <MaterialCommunityIcons name="ev-station" size={22} color="#166534" />
                  </View>

                  <View style={styles.stationInfo}>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <View style={styles.stationMetaRow}>
                      <MaterialCommunityIcons name="map-marker" size={15} color="#EF4444" />
                      <Text style={styles.stationLocation}>{station.location}</Text>
                      <Text style={styles.stationDot}>•</Text>
                      <MaterialCommunityIcons name="star" size={15} color="#F59E0B" />
                      <Text style={styles.stationRating}>{station.rating.toFixed(1)}</Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      station.status === 'available'
                        ? styles.statusAvailable
                        : station.status === 'busy'
                          ? styles.statusBusy
                          : styles.statusOffline,
                    ]}
                  >
                    <Text style={[
                      styles.statusText,
                      station.status === 'available'
                        ? styles.statusTextAvailable
                        : station.status === 'busy'
                          ? styles.statusTextBusy
                          : styles.statusTextOffline,
                    ]}>
                      {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.stationMetrics}>
                  <View style={styles.metricPill}>
                    <MaterialCommunityIcons name="lightning-bolt" size={16} color="#F59E0B" />
                    <Text style={styles.metricText}>AC {station.acSlots}</Text>
                  </View>
                  <View style={styles.metricPill}>
                    <MaterialCommunityIcons name="lightning-bolt" size={16} color="#EF4444" />
                    <Text style={styles.metricText}>DC {station.dcSlots}</Text>
                  </View>
                  <View style={styles.metricPillSoft}>
                    <MaterialCommunityIcons name="navigation" size={16} color="#475569" />
                    <Text style={styles.metricTextSoft}>{getStationDistanceText(station)}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => handleSelectStation(station)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.selectButtonText}>Select Station</Text>
                  <MaterialCommunityIcons name="chevron-right" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'availability' && (
          <View>
            <Text style={styles.sectionKicker}>Status</Text>
            <Text style={styles.sectionTitle}>Slot availability</Text>

            {stationsWithDistance.map((station) => (
              <View key={station.id} style={styles.availabilityCard}>
                <View style={styles.availabilityHeader}>
                  <View>
                    <Text style={styles.availabilityStation}>{station.name}</Text>
                    <Text style={styles.availabilitySubtext}>{station.location}</Text>
                  </View>
                  <Text style={styles.availabilityDistance}>{getStationDistanceText(station)}</Text>
                </View>

                <View style={styles.availabilityGrid}>
                  <View style={styles.availabilityItem}>
                    <View style={[styles.availabilityIcon, styles.acIcon]}>
                      <MaterialCommunityIcons name="flash" size={18} color="#F59E0B" />
                    </View>
                    <Text style={styles.availabilityLabel}>AC charger</Text>
                    <Text style={styles.availabilityValue}>{station.acSlots} available</Text>
                  </View>

                  <View style={styles.availabilityItem}>
                    <View style={[styles.availabilityIcon, styles.dcIcon]}>
                      <MaterialCommunityIcons name="flash" size={18} color="#EF4444" />
                    </View>
                    <Text style={styles.availabilityLabel}>DC charger</Text>
                    <Text style={styles.availabilityValue}>{station.dcSlots} available</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'booking' && (
          <View>
            <Text style={styles.sectionKicker}>Trips</Text>
            <Text style={styles.sectionTitle}>Your bookings</Text>

            {mockBookings.length > 0 ? (
              mockBookings.map((booking) => (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <View style={styles.bookingInfo}>
                      <Text style={styles.bookingStation}>{booking.stationName}</Text>
                      <Text style={styles.bookingDate}>{booking.date} at {booking.time}</Text>
                    </View>
                    <View style={[styles.bookingBadge, booking.status === 'confirmed' ? styles.bookingConfirmed : styles.bookingPending]}>
                      <Text style={styles.bookingBadgeText}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bookingPills}>
                    <View style={styles.bookingDetailPill}>
                      <Text style={styles.bookingDetailLabel}>Type</Text>
                      <Text style={styles.bookingDetailValue}>{booking.type} Charger</Text>
                    </View>
                    <View style={styles.bookingDetailPill}>
                      <Text style={styles.bookingDetailLabel}>Duration</Text>
                      <Text style={styles.bookingDetailValue}>{booking.duration}</Text>
                    </View>
                  </View>

                  <View style={styles.bookingActions}>
                    <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.9}>
                      <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      activeOpacity={0.9}
                      onPress={() =>
                        router.push({
                          pathname: '/charging/booking-summary',
                          params: {
                            stationId: booking.id,
                            connectorName: `${booking.type} Charger`,
                            dateLabel: booking.date,
                            slotTime: booking.time,
                            selectedDuration: booking.duration,
                            totalPrice: '12.50',
                          },
                        })
                      }
                    >
                      <Text style={styles.primaryButtonText}>View details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <MaterialCommunityIcons name="calendar-blank" size={28} color="#94A3B8" />
                </View>
                <Text style={styles.emptyText}>No active bookings</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.newBookingButton}
              activeOpacity={0.9}
              onPress={() => router.push('/charging/stations-list')}
            >
              <MaterialCommunityIcons name="plus" size={20} color="white" />
              <Text style={styles.newBookingButtonText}>New Booking</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'session' && (
          <View>
            <Text style={styles.sectionKicker}>Live charging</Text>
            <Text style={styles.sectionTitle}>Charging session</Text>

            {sessionActive ? (
              <View style={styles.sessionCard}>
                <View style={styles.sessionTop}>
                  <View>
                    <Text style={styles.sessionStationName}>Downtown Charging Hub</Text>
                    <Text style={styles.sessionLocation}>Fast DC connector · Bay 04</Text>
                  </View>
                  <View style={styles.sessionStatusBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.sessionStatusText}>Charging</Text>
                  </View>
                </View>

                <View style={styles.timerCard}>
                  <Text style={styles.timerLabel}>Charging time</Text>
                  <Text style={styles.timer}>{formatTime(sessionTime)}</Text>
                  <Text style={styles.timerHint}>Session stays active until you stop it</Text>
                </View>

                <View style={styles.sessionStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Energy charged</Text>
                    <Text style={styles.statValue}>{(sessionTime / 60).toFixed(1)} kWh</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Estimated cost</Text>
                    <Text style={styles.statValue}>₹{(sessionTime / 60 * 15).toFixed(0)}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.stopButton} onPress={() => setSessionActive(false)} activeOpacity={0.9}>
                  <MaterialCommunityIcons name="stop-circle-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.stopButtonText}>Stop charging</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyStateLarge}>
                <View style={styles.emptyIconWrapLarge}>
                  <MaterialCommunityIcons name="lightning-bolt-outline" size={30} color="#16A34A" />
                </View>
                <Text style={styles.emptyTitle}>No active charging session</Text>
                <Text style={styles.emptyDescription}>Start a session from a station card to see live energy and cost updates here.</Text>
                <TouchableOpacity style={styles.startSessionButton} onPress={() => setSessionActive(true)} activeOpacity={0.9}>
                  <MaterialCommunityIcons name="play" size={18} color="white" />
                  <Text style={styles.startSessionButtonText}>Start Session</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {activeTab === 'history' && (
          <View>
            <Text style={styles.sectionKicker}>Past activity</Text>
            <Text style={styles.sectionTitle}>Charging history</Text>

            {mockHistory.map((session) => (
              <View key={session.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View>
                    <Text style={styles.historyStation}>{session.stationName}</Text>
                    <Text style={styles.historyTime}>{session.startTime}</Text>
                  </View>
                  <View style={styles.historyBadge}>
                    <Text style={styles.historyStatus}>Completed</Text>
                  </View>
                </View>

                <View style={styles.historyDetails}>
                  <View style={styles.historyDetail}>
                    <Text style={styles.historyDetailLabel}>Duration</Text>
                    <Text style={styles.historyDetailValue}>{session.duration}</Text>
                  </View>
                  <View style={styles.historyDetail}>
                    <Text style={styles.historyDetailLabel}>Energy</Text>
                    <Text style={styles.historyDetailValue}>{session.energyCharged}</Text>
                  </View>
                  <View style={styles.historyDetail}>
                    <Text style={styles.historyDetailLabel}>Cost</Text>
                    <Text style={styles.historyDetailValue}>{session.cost}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'payment' && (
          <View>
            <Text style={styles.sectionKicker}>Billing</Text>
            <Text style={styles.sectionTitle}>Payment methods</Text>

            <View style={styles.paymentCard}>
              <View style={styles.paymentMethod}>
                <View style={[styles.paymentIcon, styles.paymentIconBlue]}>
                  <MaterialCommunityIcons name="credit-card" size={30} color="#0F766E" />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTitle}>Credit Card</Text>
                  <Text style={styles.paymentDetails}>**** **** **** 4242</Text>
                </View>
                <View style={styles.paymentRadio}>
                  <View style={styles.radioSelected} />
                </View>
              </View>
            </View>

            <View style={styles.paymentCard}>
              <View style={styles.paymentMethod}>
                <View style={[styles.paymentIcon, styles.paymentIconPurple]}>
                  <MaterialCommunityIcons name="wallet" size={30} color="#7C3AED" />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTitle}>Digital Wallet</Text>
                  <Text style={styles.paymentDetails}>Google Pay</Text>
                </View>
                <View style={styles.paymentRadio} />
              </View>
            </View>

            <View style={styles.paymentCard}>
              <View style={styles.paymentMethod}>
                <View style={[styles.paymentIcon, styles.paymentIconAmber]}>
                  <MaterialCommunityIcons name="bank" size={30} color="#B45309" />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTitle}>Bank Transfer</Text>
                  <Text style={styles.paymentDetails}>HDFC Bank</Text>
                </View>
                <View style={styles.paymentRadio} />
              </View>
            </View>

            <TouchableOpacity style={styles.addPaymentButton} activeOpacity={0.9}>
              <MaterialCommunityIcons name="plus" size={20} color="white" />
              <Text style={styles.addPaymentButtonText}>Add payment method</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'invoice' && (
          <View>
            <Text style={styles.sectionKicker}>Receipts</Text>
            <Text style={styles.sectionTitle}>Invoices</Text>

            {mockHistory.map((session) => (
              <View key={session.id} style={styles.invoiceCard}>
                <View style={styles.invoiceHeader}>
                  <View>
                    <Text style={styles.invoiceTitle}>Invoice</Text>
                    <Text style={styles.invoiceId}>ID: INV-{session.id}</Text>
                  </View>
                  <View style={styles.invoiceBadge}>
                    <MaterialCommunityIcons name="check-decagram" size={14} color="#166534" />
                    <Text style={styles.invoiceBadgeText}>Paid</Text>
                  </View>
                </View>

                <View style={styles.invoiceBody}>
                  <View style={styles.invoiceRow}>
                    <Text style={styles.invoiceLabel}>Station</Text>
                    <Text style={styles.invoiceValue}>{session.stationName}</Text>
                  </View>
                  <View style={styles.invoiceRow}>
                    <Text style={styles.invoiceLabel}>Date & time</Text>
                    <Text style={styles.invoiceValue}>{session.startTime}</Text>
                  </View>
                  <View style={styles.invoiceRow}>
                    <Text style={styles.invoiceLabel}>Duration</Text>
                    <Text style={styles.invoiceValue}>{session.duration}</Text>
                  </View>
                  <View style={styles.invoiceRow}>
                    <Text style={styles.invoiceLabel}>Energy</Text>
                    <Text style={styles.invoiceValue}>{session.energyCharged}</Text>
                  </View>
                </View>

                <View style={styles.invoiceDivider} />

                <View style={styles.invoiceFooter}>
                  <Text style={styles.invoiceTotalLabel}>Total amount</Text>
                  <Text style={styles.invoiceTotalValue}>{session.cost}</Text>
                </View>

                <TouchableOpacity style={styles.downloadButton} activeOpacity={0.9}>
                  <MaterialCommunityIcons name="download" size={20} color="white" />
                  <Text style={styles.downloadButtonText}>Download PDF</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FBF7',
  },
  hero: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroGlowTop: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    top: -110,
    right: -70,
  },
  heroGlowBottom: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 140,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    bottom: -90,
    left: -60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14532D',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerEyebrow: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: '#16A34A',
    fontWeight: '700',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  heroStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  heroStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  heroStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  heroStatLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  tabsShell: {
    marginTop: -12,
    paddingTop: 4,
    backgroundColor: '#F5FBF7',
  },
  tabsContainer: {
    paddingHorizontal: 18,
    paddingBottom: 10,
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  tabActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#166534',
  },
  contentScroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 40,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionKicker: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: '#16A34A',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: '#0F172A',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  stationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  stationTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  stationIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  stationMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  stationLocation: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  stationDot: {
    color: '#CBD5E1',
    fontSize: 14,
    marginHorizontal: 2,
  },
  stationRating: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statusAvailable: {
    backgroundColor: '#DCFCE7',
  },
  statusBusy: {
    backgroundColor: '#FEF3C7',
  },
  statusOffline: {
    backgroundColor: '#E2E8F0',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextAvailable: {
    color: '#166534',
  },
  statusTextBusy: {
    color: '#B45309',
  },
  statusTextOffline: {
    color: '#475569',
  },
  stationMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  metricPillSoft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  metricText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  metricTextSoft: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  selectButton: {
    backgroundColor: '#10B981',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  availabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  availabilityStation: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  availabilitySubtext: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  availabilityDistance: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  availabilityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  availabilityItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
  },
  availabilityIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  acIcon: {
    backgroundColor: '#FFF7ED',
  },
  dcIcon: {
    backgroundColor: '#FEF2F2',
  },
  availabilityLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '600',
  },
  availabilityValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingStation: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  bookingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  bookingConfirmed: {
    backgroundColor: '#DCFCE7',
  },
  bookingPending: {
    backgroundColor: '#FEF3C7',
  },
  bookingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
  },
  bookingPills: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  bookingDetailPill: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
  },
  bookingDetailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  bookingDetailValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#334155',
    fontWeight: '800',
    fontSize: 14,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  newBookingButton: {
    backgroundColor: '#10B981',
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  newBookingButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    padding: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  sessionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  sessionStationName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  sessionLocation: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  sessionStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#EF4444',
  },
  sessionStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },
  timerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  timerLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timer: {
    fontSize: 44,
    fontWeight: '900',
    color: '#16A34A',
    fontVariant: ['tabular-nums'],
  },
  timerHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  sessionStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  stopButton: {
    backgroundColor: '#EF4444',
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  stopButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateLarge: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 18,
  },
  emptyIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyIconWrapLarge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 300,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '600',
  },
  startSessionButton: {
    backgroundColor: '#10B981',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minWidth: 160,
  },
  startSessionButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  historyStation: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  historyBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  historyStatus: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
  },
  historyDetails: {
    flexDirection: 'row',
    gap: 10,
  },
  historyDetail: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
  },
  historyDetailLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  historyDetailValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentIconBlue: {
    backgroundColor: '#ECFEFF',
  },
  paymentIconPurple: {
    backgroundColor: '#F5F3FF',
  },
  paymentIconAmber: {
    backgroundColor: '#FFF7ED',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  paymentDetails: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  paymentRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  addPaymentButton: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  addPaymentButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  invoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  invoiceId: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  invoiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  invoiceBadgeText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '800',
  },
  invoiceBody: {
    gap: 10,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  invoiceLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  invoiceValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
    flexShrink: 1,
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  invoiceTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
  },
  downloadButton: {
    backgroundColor: '#10B981',
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  mapTabContainer: {
    flex: 1,
  },
  mapContainer: {
    height: 280,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    flex: 1,
  },
  mapWithButtonWrap: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  mapErrorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  currentLocationButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F766E',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  currentLocationButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  mapLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.58)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLoadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  mapLoadingText: {
    color: '#14532D',
    fontSize: 12,
    fontWeight: '700',
  },
  stationDetailsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  stationDetailsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stationDetailText: {
    flex: 1,
  },
  stationDetailsName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  stationDetailsSlots: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  stationDetailsStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  closeDetailsButton: {
    padding: 8,
  },
  nearbyStationsContainer: {
    paddingVertical: 12,
  },
  nearbyStationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  nearbyStationsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  nearbyStationsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  nearbyStationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  nearbyStationIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nearbyStationInfo: {
    flex: 1,
  },
  nearbyStationName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  nearbyStationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nearbyStationDistance: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  nearbyStationDot: {
    fontSize: 12,
    color: '#d1d5db',
    marginHorizontal: 2,
  },
  nearbyStationStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  nearbyStationSlots: {
    flexDirection: 'row',
    gap: 6,
  },
  slotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  slotCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
});

