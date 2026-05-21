import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { bookings, formatCurrency, invoices } from '../../lib/mock/serviceData'

export default function History() {
  const router = useRouter()
  return (
    <View style={styles.screen}>
      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <MaterialCommunityIcons name="history" size={26} color="#1B7F4B" />
            <Text style={styles.headerTitle}>Service history</Text>
            <Text style={styles.headerText}>All bookings created in this mock flow are stored locally for quick review.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={({ pressed }) => [styles.bookingCard, pressed && styles.pressedCard]} onPress={() => router.push(`/service-center/booking-summary?centerId=${item.centerId}&serviceTypeId=${item.serviceTypeId}&vehicleId=${item.vehicleId}&date=${item.date}&time=${item.time}&pickupDrop=${item.pickupDrop ? '1' : '0'}`)}>
            <View style={styles.bookingHeader}>
              <View style={styles.bookingIconWrap}>
                <MaterialCommunityIcons name="car-electric-outline" size={20} color="#1B7F4B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bookingTitle}>{item.serviceTypeName ?? item.services.join(', ')}</Text>
                <Text style={styles.bookingMeta}>{item.centerName ?? 'Service center'} • {item.vehicleName ?? 'Vehicle'}</Text>
              </View>
              <Text style={styles.bookingStatus}>{item.status}</Text>
            </View>
            <Text style={styles.bookingMeta}>{item.date} • {item.time} • {item.pickupDrop ? 'Pickup & drop' : 'Self drop-off'}</Text>
            <Text style={styles.bookingAmount}>{formatCurrency(item.estimatedAmount)}</Text>
          </Pressable>
        )}
        ListFooterComponent={
          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>Invoices</Text>
            {invoices.length === 0 ? (
              <Text style={styles.footerText}>No invoices yet.</Text>
            ) : invoices.map(invoice => (
              <Pressable key={invoice.id} style={styles.invoiceRow} onPress={() => router.push(`/service-center/invoice?invoiceId=${invoice.id}`)}>
                <MaterialCommunityIcons name="receipt-text-outline" size={18} color="#1B7F4B" />
                <Text style={styles.invoiceText}>{invoice.id}</Text>
                <Text style={styles.invoiceAmount}>{formatCurrency(invoice.amount)}</Text>
              </Pressable>
            ))}
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FBF6' },
  container: { padding: 16, paddingBottom: 36, gap: 12 },
  headerCard: { backgroundColor: '#FFFFFF', borderRadius: 26, padding: 18, borderWidth: 1, borderColor: '#E3EFE6', marginBottom: 4 },
  headerTitle: { color: '#0F5132', fontSize: 20, fontWeight: '900', marginTop: 10 },
  headerText: { color: '#6B7D72', marginTop: 6, lineHeight: 20 },
  bookingCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#E3EFE6' },
  pressedCard: { transform: [{ scale: 0.99 }] },
  bookingHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bookingIconWrap: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#ECF9EF', alignItems: 'center', justifyContent: 'center' },
  bookingTitle: { color: '#0F5132', fontSize: 15, fontWeight: '900' },
  bookingMeta: { color: '#6B7D72', marginTop: 5, fontSize: 12 },
  bookingStatus: { color: '#1B7F4B', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  bookingAmount: { color: '#0F5132', fontWeight: '900', marginTop: 12, fontSize: 16 },
  footerCard: { backgroundColor: '#FFFFFF', borderRadius: 26, padding: 18, borderWidth: 1, borderColor: '#E3EFE6', marginTop: 4 },
  footerTitle: { color: '#0F5132', fontSize: 18, fontWeight: '900', marginBottom: 10 },
  footerText: { color: '#6B7D72' },
  invoiceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  invoiceText: { flex: 1, color: '#0F5132', fontWeight: '800' },
  invoiceAmount: { color: '#1B7F4B', fontWeight: '900' },
})
