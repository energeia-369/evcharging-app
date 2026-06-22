import { Stack } from 'expo-router'
import React from 'react'
import { EvServiceProvider } from '../../context/booking-context'

export default function EvServiceLayout() {
  return (
    <EvServiceProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#f4fbf6' },
          headerTintColor: '#0f5132',
          headerTitleStyle: { fontWeight: '900' },
          contentStyle: { backgroundColor: '#f4fbf6' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'EV Service Center' }} />
        <Stack.Screen name="service-details" options={{ title: 'Service Center Details' }} />
        <Stack.Screen name="book-service" options={{ title: 'Book Service' }} />
        <Stack.Screen name="booking-summary" options={{ title: 'Booking Summary' }} />
        <Stack.Screen name="payment" options={{ title: 'Payment' }} />
        <Stack.Screen name="tracking" options={{ title: 'Service Tracking' }} />
        <Stack.Screen name="invoice" options={{ title: 'Invoice' }} />
        <Stack.Screen name="history" options={{ title: 'Service History' }} />
      </Stack>
    </EvServiceProvider>
  )
}
