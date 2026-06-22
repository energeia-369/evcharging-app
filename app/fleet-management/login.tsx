import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      Alert.alert('Login successful', 'Welcome back.');
      router.push('/fleet-management/dashboard');
      return;
    }

    if (result.status === 401) {
      Alert.alert('Invalid credentials', result.message || 'Invalid credentials');
      return;
    }

    if (result.status === 400) {
      Alert.alert('Missing fields', result.message || 'Please enter your email and password.');
      return;
    }

    if (result.status === 500) {
      Alert.alert('Server error', result.message || 'Server error. Please try again later.');
      return;
    }

    Alert.alert('Login failed', result.message || 'Login failed');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Fleet Manager Login</Text>
        <Text style={styles.hint}>Sign in to manage your fleet, shifts, and drivers.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
        </View>

        <View style={styles.row}> 
          <TouchableOpacity onPress={() => setRemember(!remember)} style={styles.checkbox}>
            <View style={[styles.box, remember && { backgroundColor: '#059669' }]} />
            <Text style={styles.small}> Remember me</Text>
          </TouchableOpacity>
          <Text style={styles.forgot}>Forgot?</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.primaryText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.socialRow}>
          <View style={styles.socialPlaceholder}><MaterialCommunityIcons name={'account-tie' as any} size={20} color="#065f46" /></View>
          <View style={styles.socialPlaceholder}><MaterialCommunityIcons name={'qrcode-scan' as any} size={20} color="#065f46" /></View>
        </View>

        <TouchableOpacity onPress={() => router.push('/fleet-management/register') }>
          <Text style={styles.link}>Create New Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fffb' },
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: '700', color: '#064e3b', marginBottom: 6 },
  hint: { color: '#065f46', marginBottom: 18 },
  inputGroup: { marginBottom: 12 },
  label: { color: '#065f46', marginBottom: 6 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderColor: '#e6f4f1', borderWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  checkbox: { flexDirection: 'row', alignItems: 'center' },
  box: { width: 18, height: 18, borderRadius: 4, borderColor: '#c8f7ee', borderWidth: 1, marginRight: 8 },
  small: { color: '#065f46' },
  forgot: { color: '#064e3b', fontWeight: '600' },
  primaryButton: { backgroundColor: '#059669', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 18 },
  primaryText: { color: '#fff', fontWeight: '700' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  socialPlaceholder: { backgroundColor: '#e6fff6', padding: 12, marginHorizontal: 8, borderRadius: 10 },
  link: { color: '#064e3b', textAlign: 'center', marginTop: 16, fontWeight: '600' },
});
