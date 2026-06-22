import { useEffect, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface StationCoordinate {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  acSlots: number;
  dcSlots: number;
  status: 'available' | 'busy' | 'offline';
  distanceKm?: number;
}

interface EvChargingMapProps {
  userLocation: LocationCoords | null;
  stationCoordinates: StationCoordinate[];
  onSelectStation: (stationId: string) => void;
  style: StyleProp<ViewStyle>;
}

export default function EvChargingMap({
  userLocation,
  stationCoordinates,
  onSelectStation,
  style,
}: EvChargingMapProps) {
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (!userLocation) {
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.04,
      },
      650
    );
  }, [userLocation]);

  if (!userLocation) {
    return null;
  }

  return (
    <MapView
      ref={mapRef}
      style={style}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation
      showsMyLocationButton
      zoomEnabled
      loadingEnabled
    >
      <Marker
        coordinate={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        }}
        title="Your Location"
        description="Current position"
        pinColor="#2563EB"
      />

      {stationCoordinates.map((station) => (
        <Marker
          key={station.id}
          coordinate={{
            latitude: station.latitude,
            longitude: station.longitude,
          }}
          title={station.name}
          description={`${station.distanceKm !== undefined ? `${station.distanceKm.toFixed(2)} km away · ` : ''}AC: ${station.acSlots} | DC: ${station.dcSlots}`}
          pinColor={station.status === 'available' ? '#0891b2' : station.status === 'busy' ? '#f59e0b' : '#94a3b8'}
          onPress={() => onSelectStation(station.id)}
        />
      ))}
    </MapView>
  );
}
