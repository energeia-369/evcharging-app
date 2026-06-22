import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const AVAILABLE_SLOTS: TimeSlot[] = [
  { id: '1', time: '10:00 AM', available: true },
  { id: '2', time: '10:30 AM', available: true },
  { id: '3', time: '11:00 AM', available: false },
  { id: '4', time: '11:30 AM', available: true },
  { id: '5', time: '12:00 PM', available: true },
  { id: '6', time: '12:30 PM', available: false },
  { id: '7', time: '01:00 PM', available: true },
  { id: '8', time: '01:30 PM', available: true },
];

const DURATIONS = [
  { id: '30', label: '30 min', value: 30 },
  { id: '60', label: '1 hour', value: 60 },
  { id: '90', label: '1.5 hours', value: 90 },
  { id: '120', label: '2 hours', value: 120 },
];

const AVAILABLE_DATES = [
  { id: '1', label: 'Today', date: 'May 15' },
  { id: '2', label: 'Tomorrow', date: 'May 16' },
  { id: '3', label: 'May 17', date: 'Friday' },
  { id: '4', label: 'May 18', date: 'Saturday' },
];

export default function SlotBookingScreen() {
  const router = useRouter();

  const { stationId, connectorId, connectorName } =
    useLocalSearchParams();

  const [selectedDate, setSelectedDate] = useState<string>('1');
  const [selectedSlot, setSelectedSlot] = useState<string>('1');
  const [selectedDuration, setSelectedDuration] =
    useState<string>('60');

  const selectedDateData = AVAILABLE_DATES.find(
    (d) => d.id === selectedDate
  );

  const selectedSlotData = AVAILABLE_SLOTS.find(
    (s) => s.id === selectedSlot
  );

  const selectedDurationData = DURATIONS.find(
    (d) => d.id === selectedDuration
  );

  const pricePerHour = 15;

  const totalPrice =
    ((selectedDurationData?.value || 60) / 60) *
    pricePerHour;

  const handleConfirmSlot = () => {
    router.push({
      pathname: '/charging/booking-summary',
      params: {
        stationId,
        connectorId,
        connectorName,
        selectedDate,
        selectedSlot,
        selectedDuration,
        totalPrice: totalPrice.toFixed(2),
        slotTime: selectedSlotData?.time,
        dateLabel: selectedDateData?.label,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#1f2937"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Select Time Slot
          </Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>
              Schedule Your Charging
            </Text>

            <Text style={styles.subtitle}>
              Choose date, time and duration
            </Text>
          </View>

          {/* Connector Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconBg}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={24}
                color="#10b981"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                {connectorName}
              </Text>

              <Text style={styles.infoSubtitle}>
                Station #{stationId}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color="#10b981"
            />
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="calendar"
                size={18}
                color="#10b981"
              />

              <Text style={styles.sectionTitle}>
                Select Date
              </Text>
            </View>

            <View style={styles.dateGrid}>
              {AVAILABLE_DATES.map((date) => (
                <TouchableOpacity
                  key={date.id}
                  style={[
                    styles.dateCard,
                    selectedDate === date.id &&
                      styles.dateCardSelected,
                  ]}
                  onPress={() =>
                    setSelectedDate(date.id)
                  }
                >
                  <Text
                    style={[
                      styles.dateLabel,
                      selectedDate === date.id &&
                        styles.dateLabelSelected,
                    ]}
                  >
                    {date.label}
                  </Text>

                  <Text
                    style={[
                      styles.dateSubtext,
                      selectedDate === date.id &&
                        styles.dateSubtextSelected,
                    ]}
                  >
                    {date.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Slots */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={18}
                color="#10b981"
              />

              <Text style={styles.sectionTitle}>
                Select Time
              </Text>
            </View>

            <View style={styles.slotsGrid}>
              {AVAILABLE_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.slotCard,
                    selectedSlot === slot.id &&
                      styles.slotCardSelected,
                    !slot.available &&
                      styles.slotCardDisabled,
                  ]}
                  onPress={() =>
                    slot.available &&
                    setSelectedSlot(slot.id)
                  }
                  disabled={!slot.available}
                >
                  <Text
                    style={[
                      styles.slotTime,
                      selectedSlot === slot.id &&
                        styles.slotTimeSelected,
                    ]}
                  >
                    {slot.time}
                  </Text>

                  {!slot.available && (
                    <Text style={styles.unavailableLabel}>
                      Booked
                    </Text>
                  )}

                  {selectedSlot === slot.id && (
                    <View style={styles.selectedIndicator}>
                      <MaterialCommunityIcons
                        name="check"
                        size={12}
                        color="#ffffff"
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="timer-outline"
                size={18}
                color="#10b981"
              />

              <Text style={styles.sectionTitle}>
                Duration
              </Text>
            </View>

            <View style={styles.durationGrid}>
              {DURATIONS.map((duration) => (
                <TouchableOpacity
                  key={duration.id}
                  style={[
                    styles.durationCard,
                    selectedDuration === duration.id &&
                      styles.durationCardSelected,
                  ]}
                  onPress={() =>
                    setSelectedDuration(duration.id)
                  }
                >
                  <Text
                    style={[
                      styles.durationLabel,
                      selectedDuration === duration.id &&
                        styles.durationLabelSelected,
                    ]}
                  >
                    {duration.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              Booking Summary
            </Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Date
              </Text>

              <Text style={styles.summaryValue}>
                {selectedDateData?.label}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Time
              </Text>

              <Text style={styles.summaryValue}>
                {selectedSlotData?.time}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Duration
              </Text>

              <Text style={styles.summaryValue}>
                {selectedDurationData?.label}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>
                Total
              </Text>

              <Text style={styles.totalValue}>
                Rs. {totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmSlot}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color="#ffffff"
            />

            <Text style={styles.confirmButtonText}>
              Confirm Slot
            </Text>
          </TouchableOpacity>
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
    paddingVertical: 14,
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
    fontWeight: '700',
    color: '#1f2937',
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  titleSection: {
    marginBottom: 20,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6b7280',
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
  },

  infoIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  infoSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#6b7280',
  },

  section: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  dateGrid: {
    flexDirection: 'row',
    gap: 10,
  },

  dateCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },

  dateCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },

  dateLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  dateLabelSelected: {
    color: '#10b981',
  },

  dateSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },

  dateSubtextSelected: {
    color: '#10b981',
  },

  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  slotCard: {
    width: '23%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    position: 'relative',
  },

  slotCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },

  slotCardDisabled: {
    backgroundColor: '#f3f4f6',
    opacity: 0.5,
  },

  slotTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },

  slotTimeSelected: {
    color: '#10b981',
  },

  unavailableLabel: {
    marginTop: 4,
    fontSize: 9,
    color: '#ef4444',
    fontWeight: '700',
  },

  selectedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },

  durationGrid: {
    flexDirection: 'row',
    gap: 10,
  },

  durationCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },

  durationCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },

  durationLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  durationLabelSelected: {
    color: '#10b981',
  },

  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 13,
    color: '#6b7280',
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },

  confirmButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 14,
  },

  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});