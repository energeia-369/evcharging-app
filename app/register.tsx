import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useAuth } from './fleet-management/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};

    if (!fullName.trim()) {
      next.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      next.email = 'Email is required';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      next.email = 'Enter a valid email';
    }

    if (!mobile.trim()) {
      next.mobile = 'Mobile number is required';
    } else if (!/^\+?[0-9]{7,15}$/.test(mobile)) {
      next.mobile = 'Enter a valid phone number';
    }

    if (!password) {
      next.password = 'Password is required';
    } else if (password.length < 8) {
      next.password = 'Minimum 8 characters';
    }

    if (confirmPassword !== password) {
      next.confirmPassword = 'Passwords do not match';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;

    const registered = await register({
      fullName,
      email: email.trim(),
      phone: mobile.trim(),
      password,
    });

    if (!registered) {
      Alert.alert('Registration failed', 'Please try again.');
      return;
    }

    router.push('/role-selection');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Join the Energeia EV Ecosystem
          </Text>
        </View>

        <View style={styles.card}>
          {/* Full Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>

            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            {!!errors.fullName && (
              <Text style={styles.error}>{errors.fullName}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            {!!errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
          </View>

          {/* Mobile */}
          <View style={styles.field}>
            <Text style={styles.label}>Mobile Number</Text>

            <TextInput
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              placeholder="+1234567890"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            {!!errors.mobile && (
              <Text style={styles.error}>{errors.mobile}</Text>
            )}
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>

            <View style={styles.row}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Create a password"
                placeholderTextColor="#9ca3af"
                style={[styles.input, { flex: 1 }]}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.toggleButton}
              >
                <Text style={styles.toggleText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>

            {!!errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Confirm Password</Text>

            <View style={styles.row}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                placeholder="Confirm password"
                placeholderTextColor="#9ca3af"
                style={[styles.input, { flex: 1 }]}
              />

              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.toggleButton}
              >
                <Text style={styles.toggleText}>
                  {showConfirm ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>

            {!!errors.confirmPassword && (
              <Text style={styles.error}>
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleRegister}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              Register
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginLink}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },

  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
  },

  card: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 3,
  },

  field: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    color: '#111827',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  toggleButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
  },

  toggleText: {
    color: '#059669',
    fontWeight: '600',
  },

  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 6,
  },

  primaryButton: {
    marginTop: 10,
    backgroundColor: '#10b981',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },

  bottomText: {
    color: '#6b7280',
  },

  loginLink: {
    color: '#10b981',
    fontWeight: '700',
  },
});