import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function OasisCafeTableOrder() {
  const router = useRouter();
  const [code, setCode] = useState('');

  const simulateScan = () => {
    const simulated = 'TBL-42';
    setCode(simulated);
    Alert.alert('QR scanned', `Table code: ${simulated}`);
  };

  const handleProceed = () => {
    const trimmed = code.trim();
    if (!trimmed) {
      Alert.alert('Missing code', 'Please enter or scan a table code to proceed.');
      return;
    }

    router.push(`/oasis-cafe-view-menu?tableId=${encodeURIComponent(trimmed)}` as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8ED" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.85}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#7C2D12" />
        </TouchableOpacity>

        <Text style={styles.title}>QR / Table Order</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.lead}>Allow customers to scan a table QR or enter the table code manually.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Scan QR code</Text>
          <Text style={styles.cardDesc}>Use the device camera to scan a QR on the table (simulated here).</Text>

          <TouchableOpacity style={styles.scanButton} onPress={simulateScan} activeOpacity={0.9}>
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#fff" />
            <Text style={styles.scanButtonText}>Simulate Scan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Enter table code</Text>
          <TextInput
            placeholder="e.g. TBL-42"
            style={styles.input}
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            returnKeyType="done"
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleProceed} activeOpacity={0.9}>
            <Text style={styles.primaryButtonText}>Open Menu for Table</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8ED' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C2D12',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  title: { fontSize: 20, fontWeight: '900', color: '#431407' },
  content: { padding: 18 },
  lead: { color: '#7C2D12', fontSize: 14, marginBottom: 12, fontWeight: '600' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FCD9B6',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#431407', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#7C2D12', marginBottom: 12, fontWeight: '500' },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0EA5E9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  scanButtonText: { color: '#fff', fontWeight: '800', marginLeft: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FEFEFE',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#F97316',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '800' },
});
