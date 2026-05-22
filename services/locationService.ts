import * as Location from 'expo-location';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export const DEFAULT_COORDINATES: Coordinates = {
  latitude: 18.5204,
  longitude: 73.8567,
};

export type LocationResult<T> = {
  data?: T;
  error?: string;
};

const DEFAULT_ACCURACY_METERS = 25;

const toCoordinates = (locationObject: Location.LocationObject): Coordinates => ({
  latitude: locationObject.coords.latitude,
  longitude: locationObject.coords.longitude,
});

export const formatCoordinates = (coords: Coordinates | null): string => {
  if (!coords) {
    return 'Waiting for coordinates';
  }

  return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
};

export async function requestLocationPermission(): Promise<LocationResult<boolean>> {
  try {
    const response = await Location.requestForegroundPermissionsAsync();

    if (response.status !== 'granted') {
      console.error('[GPS] Permission denied');
      return {
        data: false,
        error: 'Location permission denied. Enable permission from device settings.',
      };
    }

    console.log('[GPS] Permission granted');

    return { data: true };
  } catch {
    console.error('[GPS] Permission request failed');
    return {
      data: false,
      error: 'Unable to request location permission.',
    };
  }
}

export async function getCurrentCoordinates(): Promise<LocationResult<{ coords: Coordinates; accuracy: number }>> {
  try {
    const locationObject = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    console.log('[GPS] Location fetched');

    return {
      data: {
        coords: toCoordinates(locationObject),
        accuracy: locationObject.coords.accuracy ?? DEFAULT_ACCURACY_METERS,
      },
    };
  } catch (error) {
    console.error('[GPS] Failed to read current location', {
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      data: {
        coords: DEFAULT_COORDINATES,
        accuracy: DEFAULT_ACCURACY_METERS,
      },
      error: 'Unable to fetch current location. Using default coordinates instead.',
    };
  }
}

export async function watchCurrentCoordinates(
  onChange: (payload: { coords: Coordinates; accuracy: number }) => void,
  onError?: (message: string) => void
): Promise<LocationResult<Location.LocationSubscription>> {
  try {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 15000,
        distanceInterval: 100,
      },
      (nextPosition) => {
        onChange({
          coords: {
            latitude: nextPosition.coords.latitude,
            longitude: nextPosition.coords.longitude,
          },
          accuracy: nextPosition.coords.accuracy ?? DEFAULT_ACCURACY_METERS,
        });
      }
    );

    console.log('[GPS] Tracking started');

    return { data: subscription };
  } catch (error) {
    console.error('[GPS] Failed to start location watch', {
      error: error instanceof Error ? error.message : String(error),
    });

    onError?.('Unable to start live location tracking.');
    return {
      error: 'Unable to start live location tracking.',
    };
  }
}
