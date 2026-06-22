/**
 * Environment Configuration Service
 * Centralized configuration for all environment variables
 * Supports local development and production deployments
 * Works with Expo, EAS builds, and CI/CD platforms
 * Handles platform-specific networking (Android localhost issue)
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Convert localhost to platform-specific IP for development
 * Android emulator cannot reach localhost, must use 10.0.2.2
 * Physical Android devices need machine IP address
 * iOS can use localhost normally
 */
const convertLocalhostUrl = (url: string): string => {
  if (!url || !url.includes('localhost')) {
    return url; // Not localhost, return as-is
  }

  // For iOS or production, keep localhost
  if (Platform.OS !== 'android' || url.includes('https://')) {
    return url;
  }

  // For Android development:
  // Try 10.0.2.2 first (Android emulator special IP)
  // If that doesn't work, user should update .env.local with their machine IP
  const machineIp = process.env.VITE_MACHINE_IP || '10.0.2.2';
  const port = new URL(url).port || '5001';

  console.log(`[Config] Android detected, converting localhost to ${machineIp}:${port}`);
  return url.replace(/localhost/, machineIp);
};

/**
 * Get environment variable with fallback
 * Supports both Expo Constants and standard process.env
 */
const getEnvVariable = (key: string, defaultValue?: string): string => {
  // Try expo-constants first (for Expo/EAS builds)
  const expoValue = Constants.expoConfig?.extra?.[key];
  if (expoValue !== undefined && expoValue !== null) {
    return String(expoValue);
  }

  // Fall back to process.env for web/Metro
  const envValue = process.env[`VITE_${key}`] || process.env[key];
  if (envValue !== undefined && envValue !== null) {
    return String(envValue);
  }

  // Use default or throw error
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  console.warn(`Environment variable ${key} is not defined`);
  return '';
};

export const config = {
  // API Configuration
  api: {
    baseUrl: convertLocalhostUrl(getEnvVariable('API_BASE_URL', 'http://localhost:5001')),
    timeout: parseInt(getEnvVariable('API_TIMEOUT', '30000'), 10),
    socketUrl: convertLocalhostUrl(getEnvVariable('SOCKET_URL', getEnvVariable('API_BASE_URL', 'http://localhost:5001'))),
  },

  // Google Maps Configuration
  maps: {
    apiKeyIOS: getEnvVariable('GOOGLE_MAPS_API_KEY_IOS', ''),
    apiKeyAndroid: getEnvVariable('GOOGLE_MAPS_API_KEY_ANDROID', ''),
  },

  // Feature Flags
  features: {
    debugLogs: getEnvVariable('ENABLE_DEBUG_LOGS', 'false') === 'true',
    mockData: getEnvVariable('ENABLE_MOCK_DATA', 'false') === 'true',
  },

  // Environment
  environment: getEnvVariable('ENV', 'development'),
  isDevelopment: getEnvVariable('ENV', 'development') === 'development',
  isProduction: getEnvVariable('ENV', 'development') === 'production',
  platform: Platform.OS,
};

/**
 * Validate that all required environment variables are set
 * Call this on app startup to fail fast if configuration is missing
 */
export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required API URL
  if (!config.api.baseUrl) {
    errors.push('VITE_API_BASE_URL is not configured');
  }

  // Check for invalid URL format
  if (config.api.baseUrl && !isValidUrl(config.api.baseUrl)) {
    errors.push(`VITE_API_BASE_URL is invalid: ${config.api.baseUrl}`);
  }

  // Check socket URL
  if (config.api.socketUrl && !isValidUrl(config.api.socketUrl)) {
    errors.push(`VITE_SOCKET_URL is invalid: ${config.api.socketUrl}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Helper to validate URL format
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get config value with type safety
 */
export const getConfig = <T extends keyof typeof config>(section: T) => {
  return config[section];
};

/**
 * Get API base URL (most commonly used)
 */
export const getApiUrl = (): string => {
  return config.api.baseUrl;
};

/**
 * Get Socket URL for real-time features
 */
export const getSocketUrl = (): string => {
  return config.api.socketUrl;
};

/**
 * Check if in production
 */
export const isProduction = (): boolean => {
  return config.isProduction;
};

/**
 * Check if in development
 */
export const isDevelopment = (): boolean => {
  return config.isDevelopment;
};

/**
 * Log configuration (safe for console, doesn't log sensitive data)
 */
export const logConfiguration = (): void => {
  if (config.features.debugLogs) {
    console.log('[Config] Environment Configuration:', {
      environment: config.environment,
      apiBaseUrl: config.api.baseUrl,
      socketUrl: config.api.socketUrl,
      apiTimeout: config.api.timeout,
    });
  }
};

export default config;
