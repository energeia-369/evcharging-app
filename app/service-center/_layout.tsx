import { Stack } from 'expo-router'
import React from 'react'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#F4FBF6' },
        headerTintColor: '#0F5132',
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: '#F4FBF6' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Select Center' }} />
      <Stack.Screen name="details" options={{ title: 'Select Service Type' }} />
      <Stack.Screen name="book-service" options={{ title: 'Select Vehicle & Slot' }} />
      <Stack.Screen name="booking-summary" options={{ title: 'Booking Summary' }} />
      <Stack.Screen name="payment" options={{ title: 'Payment' }} />
      <Stack.Screen name="tracking" options={{ title: 'Service Tracking' }} />
      <Stack.Screen name="diagnostics" options={{ title: 'Diagnostics' }} />
      <Stack.Screen name="invoice" options={{ title: 'Invoice' }} />
      <Stack.Screen name="history" options={{ title: 'Service History' }} />
    </Stack>
  )
}
