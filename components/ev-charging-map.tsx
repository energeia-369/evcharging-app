import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

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
  void onSelectStation;

  return (
    <View style={[styleSheet.container, style]}>
      <MaterialCommunityIcons name="monitor-eye" size={34} color="#16A34A" />
      <Text style={styleSheet.title}>Map preview disabled on web presentation mode</Text>
      <Text style={styleSheet.subtitle}>
        Native map rendering is available on Android/iOS. Use the Stations tab for the same data.
      </Text>
      <View style={styleSheet.metaRow}>
        <Text style={styleSheet.meta}>Stations: {stationCoordinates.length}</Text>
        <Text style={styleSheet.meta}>Location: {userLocation ? 'Ready' : 'Pending'}</Text>
      </View>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#14532D',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
  metaRow: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 12,
  },
  meta: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '700',
    backgroundColor: '#DCFCE7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
