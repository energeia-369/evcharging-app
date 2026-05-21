import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface StationData {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  acSlots: number;
  dcSlots: number;
  distance: number;
  availability: number;
  totalSlots: number;
  image?: number;
  isAvailable: boolean;
  colorTheme: string;
  pricePerHour: number;
  openTime: string;
  closeTime: string;
  amenities: string[];
}

interface StationCardProps {
  station: StationData;
  onPress: () => void;
}

export const StationCard: React.FC<StationCardProps> = ({ station, onPress }) => {
  const availabilityPercentage = (station.availability / station.totalSlots) * 100;
  const availabilityColor = availabilityPercentage > 50 ? '#10b981' : availabilityPercentage > 25 ? '#f59e0b' : '#ef4444';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Station Image/Icon Background */}
      <View style={[styles.stationImage, { backgroundColor: station.colorTheme }]}>
        <MaterialCommunityIcons name="ev-station" size={80} color="rgba(255,255,255,0.3)" />
      </View>

      {/* Availability Badge */}
      <View
        style={[
          styles.availabilityBadge,
          { backgroundColor: station.isAvailable ? '#10b981' : '#ef4444' },
        ]}
      >
        <Text style={styles.availabilityText}>{station.isAvailable ? 'Available' : 'Busy'}</Text>
      </View>

      {/* Station Content */}
      <View style={styles.content}>
        {/* Header: Name and Rating */}
        <View style={styles.headerRow}>
          <Text style={styles.stationName} numberOfLines={1}>
            {station.name}
          </Text>
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={16} color="#f59e0b" />
            <Text style={styles.ratingText}>{station.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <MaterialCommunityIcons name="map-marker" size={14} color="#6b7280" />
          <Text style={styles.locationText} numberOfLines={1}>
            {station.location}
          </Text>
          <Text style={styles.distanceText}>{station.distance.toFixed(1)} km</Text>
        </View>

        {/* Connectors Row */}
        <View style={styles.connectorsRow}>
          {/* AC Connector */}
          <View style={styles.connectorBadge}>
            <MaterialCommunityIcons name="lightning-bolt" size={12} color="#ffffff" />
            <Text style={styles.connectorLabel}>AC</Text>
            <Text style={styles.connectorCount}>{station.acSlots}</Text>
          </View>

          {/* DC Connector */}
          <View style={[styles.connectorBadge, { backgroundColor: '#dc2626' }]}>
            <MaterialCommunityIcons name="lightning-bolt" size={12} color="#ffffff" />
            <Text style={styles.connectorLabel}>DC</Text>
            <Text style={styles.connectorCount}>{station.dcSlots}</Text>
          </View>

          {/* Availability Progress */}
          <View style={styles.availabilityInfo}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${availabilityPercentage}%`,
                    backgroundColor: availabilityColor,
                  },
                ]}
              />
            </View>
            <Text style={styles.availabilityCount}>
              {station.availability}/{station.totalSlots} available
            </Text>
          </View>
        </View>

        {/* Select Button */}
        <TouchableOpacity style={styles.selectButton} onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.selectButtonText}>Select Station</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  stationImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  availabilityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 4,
  },
  connectorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  connectorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#10b981',
  },
  connectorLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  connectorCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  availabilityInfo: {
    flex: 1,
    gap: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  availabilityCount: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    marginTop: 4,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
