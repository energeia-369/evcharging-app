import { Stack } from 'expo-router';

export default function ChargingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="stations-list" />
      <Stack.Screen name="station-details" />
      <Stack.Screen name="connector-selection" />
      <Stack.Screen name="slot-booking" />
      <Stack.Screen name="booking-summary" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="payment-success" />
      <Stack.Screen name="live-charging" />
      <Stack.Screen name="charging-complete" />
      <Stack.Screen name="invoice" />
    </Stack>
  );
}
