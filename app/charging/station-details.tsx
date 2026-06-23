import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StationData } from '@/components/station-card';

// Same dummy data as stations list
const DUMMY_STATIONS: Record<string, StationData> = {
  '1': {
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
  '2': {
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
  '3': {
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
  '4': {
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
  '5': {
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
  '6': {
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
};

export default function StationDetailsScreen() {
  const router = useRouter();
  const { stationId } = useLocalSearchParams();
  const [selectedConnectorType, setSelectedConnectorType] = useState<'AC' | 'DC'>('AC');

  // Get station data from ID
  const station = DUMMY_STATIONS[stationId as string];

  if (!station) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
          <Text style={styles.notFoundText}>Station not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const availabilityPercentage = (station.availability / station.totalSlots) * 100;

  const handleSelectConnector = () => {
    router.push({
      pathname: '/charging/connector-selection',
      params: { stationId, connectorType: selectedConnectorType },
    });
  };

  const handleBookSlot = () => {
    alert('Booking functionality - Coming Soon');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Station Details</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Banner Image */}
        <View style={[styles.bannerImage, { backgroundColor: station.colorTheme }]}>
          <MaterialCommunityIcons name="ev-station" size={120} color="rgba(255,255,255,0.2)" />
          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: station.isAvailable ? '#10b981' : '#ef4444' },
            ]}
          >
            <MaterialCommunityIcons
              name={station.isAvailable ? 'check-circle' : 'close-circle'}
              size={16}
              color="#ffffff"
            />
            <Text style={styles.statusText}>
              {station.isAvailable ? 'Available' : 'Busy'}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Station Header Info */}
          <View style={styles.headerInfo}>
            <View style={styles.titleSection}>
              <Text style={styles.stationName}>{station.name}</Text>
              <View style={styles.ratingBadge}>
                <MaterialCommunityIcons name="star" size={18} color="#f59e0b" />
                <Text style={styles.ratingText}>{station.rating.toFixed(1)}</Text>
                <Text style={styles.reviewCount}>(248 reviews)</Text>
              </View>
            </View>
          </View>

          {/* Address Section */}
          <View style={styles.addressSection}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#10b981" />
            <View style={styles.addressContent}>
              <Text style={styles.addressLabel}>{station.location}</Text>
              <Text style={styles.addressDetail}>{station.address}</Text>
            </View>
          </View>

          {/* Pricing & Hours Card */}
          <View style={styles.premiumCard}>
            <View style={styles.priceSection}>
              <View style={styles.priceItem}>
                <View style={styles.priceIconBg}>
                  <MaterialCommunityIcons name="currency-usd" size={20} color="#10b981" />
                </View>
                <View>
                  <Text style={styles.priceLabel}>Price per Hour</Text>
                  <Text style={styles.priceValue}>Rs. {station.pricePerHour.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.dividerVertical} />

              <View style={styles.hoursItem}>
                <View style={styles.hoursIconBg}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#3b82f6" />
                </View>
                <View style={styles.hoursContent}>
                  <Text style={styles.hoursLabel}>Operating Hours</Text>
                  <Text style={styles.hoursValue}>
                    {station.openTime} - {station.closeTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Slots & Connectors */}
          <View style={styles.slotSection}>
            <Text style={styles.sectionTitle}>Available Slots</Text>

            {/* Availability Overview */}
            <View style={styles.availabilityCard}>
              <View style={styles.progressSection}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${availabilityPercentage}%`,
                        backgroundColor:
                          availabilityPercentage > 50
                            ? '#10b981'
                            : availabilityPercentage > 25
                              ? '#f59e0b'
                              : '#ef4444',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.availabilityPercent}>
                  {availabilityPercentage.toFixed(0)}%
                </Text>
              </View>

              <View style={styles.slotStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Available</Text>
                  <Text style={styles.statValue}>{station.availability}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total</Text>
                  <Text style={styles.statValue}>{station.totalSlots}</Text>
                </View>
              </View>
            </View>

            {/* Connector Types */}
            <Text style={styles.connectorTitle}>Select Connector Type</Text>
            <View style={styles.connectorGrid}>
              <TouchableOpacity
                style={[
                  styles.connectorCard,
                  selectedConnectorType === 'AC' && styles.connectorCardActive,
                ]}
                onPress={() => setSelectedConnectorType('AC')}
              >
                <View
                  style={[
                    styles.connectorIconBg,
                    selectedConnectorType === 'AC' && styles.connectorIconBgActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="lightning-bolt"
                    size={28}
                    color={selectedConnectorType === 'AC' ? '#10b981' : '#9ca3af'}
                  />
                </View>
                <Text style={styles.connectorName}>AC Charging</Text>
                <Text
                  style={[
                    styles.connectorCount,
                    selectedConnectorType === 'AC' && styles.connectorCountActive,
                  ]}
                >
                  {station.acSlots} available
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.connectorCard,
                  selectedConnectorType === 'DC' && styles.connectorCardActive,
                ]}
                onPress={() => setSelectedConnectorType('DC')}
              >
                <View
                  style={[
                    styles.connectorIconBg,
                    selectedConnectorType === 'DC' && styles.connectorIconBgActiveDC,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="lightning-bolt"
                    size={28}
                    color={selectedConnectorType === 'DC' ? '#dc2626' : '#9ca3af'}
                  />
                </View>
                <Text style={styles.connectorName}>DC Fast</Text>
                <Text
                  style={[
                    styles.connectorCount,
                    selectedConnectorType === 'DC' && styles.connectorCountActiveDC,
                  ]}
                >
                  {station.dcSlots} available
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.amenitiesSection}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {station.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <View style={styles.amenityIconBg}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#10b981"
                    />
                  </View>
                  <Text style={styles.amenityLabel} numberOfLines={1}>
                    {amenity}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Map Preview Placeholder */}
          <View style={styles.mapSection}>
            <Text style={styles.sectionTitle}>Location Map</Text>
            <View style={styles.mapPlaceholder}>
              <MaterialCommunityIcons name="map" size={64} color="#d1d5db" />
              <Text style={styles.mapPlaceholderText}>Map Preview</Text>
              <Text style={styles.mapPlaceholderSubtext}>Tap to view on map</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.selectConnectorBtn}
              onPress={handleSelectConnector}
            >
              <MaterialCommunityIcons name="check" size={20} color="#ffffff" />
              <Text style={styles.selectConnectorBtnText}>Select Connector</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookSlotBtn}
              onPress={handleBookSlot}
              disabled={!station.isAvailable}
            >
              <MaterialCommunityIcons name="calendar-check" size={20} color="#10b981" />
              <Text style={styles.bookSlotBtnText}>Book Slot</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  bannerImage: {
    width: '100%',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerInfo: {
    marginBottom: 16,
  },
  titleSection: {
    gap: 10,
  },
  stationName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f59e0b',
  },
  reviewCount: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  addressSection: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  addressContent: {
    flex: 1,
    justifyContent: 'center',
  },
  addressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  addressDetail: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  premiumCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  dividerVertical: {
    width: 1,
    height: 50,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
  },
  hoursItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hoursIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoursContent: {
    flex: 1,
  },
  hoursLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  hoursValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  slotSection: {
    marginBottom: 24,
  },
  availabilityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  availabilityPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    minWidth: 40,
  },
  slotStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e5e7eb',
  },
  connectorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  connectorGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  connectorCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  connectorCardActive: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  connectorIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  connectorIconBgActive: {
    backgroundColor: '#d1fae5',
  },
  connectorIconBgActiveDC: {
    backgroundColor: '#fee2e2',
  },
  connectorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  connectorCount: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  connectorCountActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  connectorCountActiveDC: {
    color: '#dc2626',
    fontWeight: '600',
  },
  amenitiesSection: {
    marginBottom: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexBasis: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  amenityIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amenityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  mapSection: {
    marginBottom: 24,
  },
  mapPlaceholder: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },
  actionsSection: {
    gap: 12,
    marginBottom: 20,
  },
  selectConnectorBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  selectConnectorBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  bookSlotBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  bookSlotBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10b981',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
  },
  backButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#10b981',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
