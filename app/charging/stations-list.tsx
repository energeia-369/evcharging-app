import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StationCard, StationData } from '@/components/station-card';

// Dummy charging station data
const DUMMY_STATIONS: StationData[] = [
  {
    id: '1',
    name: 'Downtown EV Hub',
    location: 'Central Business District',
    address: '123 Main Street, Downtown, Metro City',
    rating: 4.8,
    acSlots: 6,
    dcSlots: 4,
    distance: 0.5,
    availability: 7,
    totalSlots: 10,
    isAvailable: true,
    colorTheme: '#0ea5e9',
    pricePerHour: 3.0,
    openTime: '6:00 AM',
    closeTime: '11:00 PM',
    amenities: ['WiFi', 'Café', 'Restroom', 'Security Camera'],
  },
  {
    id: '2',
    name: 'Airport Charging Station',
    location: 'Terminal 2 Parking',
    address: 'Terminal 2 Level 3, International Airport, Metro City',
    rating: 4.5,
    acSlots: 8,
    dcSlots: 6,
    distance: 2.3,
    availability: 5,
    totalSlots: 14,
    isAvailable: true,
    colorTheme: '#f59e0b',
    pricePerHour: 3.6,
    openTime: '24 Hours',
    closeTime: '24 Hours',
    amenities: ['WiFi', 'Restaurant', 'Lounge', 'Parking'],
  },
  {
    id: '3',
    name: 'Mall Charging Point',
    location: 'Shopping Center Basement',
    address: '456 Market Avenue, Westside Mall, Metro City',
    rating: 4.6,
    acSlots: 4,
    dcSlots: 2,
    distance: 1.8,
    availability: 2,
    totalSlots: 6,
    isAvailable: true,
    colorTheme: '#8b5cf6',
    pricePerHour: 2.4,
    openTime: '10:00 AM',
    closeTime: '10:00 PM',
    amenities: ['WiFi', 'Shopping', 'Food Court', 'Free Parking'],
  },
  {
    id: '4',
    name: 'Tech Park Charging Station',
    location: 'Innovation Drive',
    address: '789 Tech Boulevard, Innovation Park, Metro City',
    rating: 4.9,
    acSlots: 10,
    dcSlots: 5,
    distance: 3.2,
    availability: 0,
    totalSlots: 15,
    isAvailable: false,
    colorTheme: '#ec4899',
    pricePerHour: 4.2,
    openTime: '7:00 AM',
    closeTime: '9:00 PM',
    amenities: ['WiFi', 'Office Space', 'Conference Room', 'Security'],
  },
  {
    id: '5',
    name: 'Highway Rest Area',
    location: 'Mile Marker 45',
    address: 'Expressway Service Area, Mile Marker 45, State Route 101',
    rating: 4.3,
    acSlots: 5,
    dcSlots: 3,
    distance: 5.1,
    availability: 6,
    totalSlots: 8,
    isAvailable: true,
    colorTheme: '#06b6d4',
    pricePerHour: 2.6,
    openTime: '24 Hours',
    closeTime: '24 Hours',
    amenities: ['Restroom', 'Diner', 'Convenience Store', 'Parking'],
  },
  {
    id: '6',
    name: 'University Campus Station',
    location: 'Engineering Building Lot',
    address: 'Building E-5, Engineering Campus, State University',
    rating: 4.7,
    acSlots: 12,
    dcSlots: 4,
    distance: 4.5,
    availability: 10,
    totalSlots: 16,
    isAvailable: true,
    colorTheme: '#10b981',
    pricePerHour: 1.8,
    openTime: '24 Hours',
    closeTime: '24 Hours',
    amenities: ['WiFi', 'Library Access', 'Campus Support', 'Security'],
  },
];

type FilterOption = 'all' | 'available' | 'dc-fast' | 'ac-only';

export default function ChargingStationsListScreen() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');

  // Filter stations based on selected filter
  const filteredStations = DUMMY_STATIONS.filter((station) => {
    switch (filterType) {
      case 'available':
        return station.isAvailable && station.availability > 0;
      case 'dc-fast':
        return station.dcSlots > 0;
      case 'ac-only':
        return station.dcSlots === 0;
      case 'all':
      default:
        return true;
    }
  });

  // Sort stations
  const sortedStations = [...filteredStations].sort((a, b) => {
    if (sortBy === 'distance') {
      return a.distance - b.distance;
    }
    return b.rating - a.rating;
  });

  const handleStationPress = (stationId: string) => {
    router.push({
      pathname: '/charging/station-details',
      params: { stationId },
    });
  };

  const handleMapView = () => {
    // TODO: Navigate to map view when available
    alert('Map View - Coming Soon');
  };

  const renderStationCard = ({ item }: { item: StationData }) => (
    <Animated.View entering={FadeInDown.springify()}>
      <StationCard station={item} onPress={() => handleStationPress(item.id)} />
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Title Bar */}
      <View style={styles.titleBar}>
        <View>
          <Text style={styles.greeting}>Nearby Charging</Text>
          <Text style={styles.subtitle}>Stations</Text>
        </View>
        <TouchableOpacity style={styles.mapButton} onPress={handleMapView}>
          <MaterialCommunityIcons name="map" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Filter and Sort Controls */}
      <View style={styles.controlsContainer}>
        {/* Filter Buttons */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'all' && styles.filterButtonTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'available' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType('available')}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={14}
              color={filterType === 'available' ? '#ffffff' : '#6b7280'}
            />
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'available' && styles.filterButtonTextActive,
              ]}
            >
              Available
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'dc-fast' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType('dc-fast')}
          >
            <MaterialCommunityIcons
              name="flash"
              size={14}
              color={filterType === 'dc-fast' ? '#ffffff' : '#6b7280'}
            />
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'dc-fast' && styles.filterButtonTextActive,
              ]}
            >
              DC Fast
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'ac-only' && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType('ac-only')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === 'ac-only' && styles.filterButtonTextActive,
              ]}
            >
              AC
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sort Selector */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'distance' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('distance')}
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={14}
              color={sortBy === 'distance' ? '#10b981' : '#6b7280'}
            />
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'distance' && styles.sortButtonTextActive,
              ]}
            >
              Distance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'rating' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('rating')}
          >
            <MaterialCommunityIcons
              name="star"
              size={14}
              color={sortBy === 'rating' ? '#10b981' : '#6b7280'}
            />
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'rating' && styles.sortButtonTextActive,
              ]}
            >
              Rating
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        {sortedStations.length} charging {sortedStations.length === 1 ? 'station' : 'stations'} found
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="ev-station" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No Stations Found</Text>
      <Text style={styles.emptyText}>Try adjusting your filters to see available stations</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <FlatList
        data={sortedStations}
        renderItem={renderStationCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        scrollIndicatorInsets={{ right: 1 }}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    marginBottom: 4,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  mapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  controlsContainer: {
    marginBottom: 12,
    gap: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sortButtonActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  sortButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6b7280',
  },
  sortButtonTextActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    paddingHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
