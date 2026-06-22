import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from './fleet-management/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="register"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="role-selection"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="module-selection"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ev-charging-station"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="gps-map"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="live-vehicle-tracking"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="charging"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ev-service"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ev-service-center"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="fleet-management"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="dealership"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="oasis-cafe"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="oasis-cafe-view-menu"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="oasis-cafe-cart"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="oasis-cafe-place-order"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="oasis-cafe-pos-billing"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="oasis-cafe-payment-receipt"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="modal"
              options={{
                presentation: 'modal',
                title: 'Modal',
              }}
            />
          </Stack>
        </AuthProvider>

        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}