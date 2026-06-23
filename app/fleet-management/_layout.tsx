import { Stack } from 'expo-router'
import React from 'react'
import { FleetOpsProvider } from './FleetOpsContext'

export default function FleetManagementLayout() {
  return (
    <FleetOpsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Fleet Dashboard' }} />
        <Stack.Screen name="dashboard" options={{ title: 'Fleet Dashboard' }} />
        <Stack.Screen name="login" options={{ title: 'Fleet Login' }} />
        <Stack.Screen name="register" options={{ title: 'Fleet Registration' }} />
        <Stack.Screen name="vehicles" options={{ title: 'Vehicles & Drivers' }} />
        <Stack.Screen name="trip-booking" options={{ title: 'Trip Booking' }} />
        <Stack.Screen name="assign-vehicle" options={{ title: 'Assign Vehicle' }} />
        <Stack.Screen name="tracking" options={{ title: 'Live Tracking' }} />
        <Stack.Screen name="trip-completion" options={{ title: 'Trip Completion' }} />
        <Stack.Screen name="invoice" options={{ title: 'Invoice' }} />
        <Stack.Screen name="reports" options={{ title: 'Reports' }} />
        <Stack.Screen name="charging" options={{ title: 'Charging' }} />
        <Stack.Screen name="shift-selection" options={{ title: 'Shift Selection' }} />
        <Stack.Screen name="vehicle-kyc" options={{ title: 'Vehicle KYC' }} />
        <Stack.Screen name="driver-kyc" options={{ title: 'Driver KYC' }} />
        <Stack.Screen name="manager-kyc" options={{ title: 'Manager KYC' }} />
        <Stack.Screen name="verification" options={{ title: 'Verification' }} />
        <Stack.Screen name="vehicle-details" options={{ title: 'Vehicle Details' }} />
        <Stack.Screen name="driver-management" options={{ title: 'Drivers' }} />
        <Stack.Screen name="charging-session" options={{ title: 'Charging' }} />
        <Stack.Screen name="live-tracking" options={{ title: 'Live Tracking' }} />
        <Stack.Screen name="analytics" options={{ title: 'Analytics' }} />
        <Stack.Screen name="maintenance" options={{ title: 'Maintenance' }} />
        <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
        <Stack.Screen name="billing" options={{ title: 'Billing' }} />
        <Stack.Screen name="history" options={{ title: 'History' }} />
      </Stack>
    </FleetOpsProvider>
  )
}
