import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FleetCard, SectionHeader } from '../../components/fleet/Shared'
import { formatCurrency, invoices, vehicles } from '../../lib/mock/fleetData'

export default function BillingScreen() {
  const router = useRouter()
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)

  const totalChargeAmount = invoices.reduce((sum, inv) => sum + inv.chargeAmount, 0)
  const totalMaintenanceAmount = invoices.reduce((sum, inv) => sum + inv.maintenanceAmount, 0)
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0)
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.totalAmount, 0)

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="file-document" size={24} color="#1f2937" />
          </Pressable>
          <Text style={styles.headerTitle}>Billing & Invoices</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryCardsGrid}>
          <FleetCard style={styles.summaryCard}>
            <MaterialCommunityIcons name="cash" size={24} color="#10b981" />
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalAmount)}</Text>
          </FleetCard>

          <FleetCard style={styles.summaryCard}>
            <MaterialCommunityIcons name="clipboard-check" size={24} color="#0ea5e9" />
            <Text style={styles.summaryLabel}>Paid</Text>
            <Text style={styles.summaryValue}>{formatCurrency(paidAmount)}</Text>
          </FleetCard>

          <FleetCard style={styles.summaryCard}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#f59e0b" />
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summaryValue}>{formatCurrency(pendingAmount)}</Text>
          </FleetCard>
        </View>

        {/* Breakdown */}
        <FleetCard style={styles.breakdownCard}>
          <SectionHeader title="Cost Breakdown" />
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <MaterialCommunityIcons name="battery-charging" size={16} color="#10b981" />
              <Text style={styles.breakdownLabel}>Charging</Text>
            </View>
            <Text style={styles.breakdownValue}>{formatCurrency(totalChargeAmount)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <MaterialCommunityIcons name="shield-check" size={16} color="#0ea5e9" />
              <Text style={styles.breakdownLabel}>Maintenance</Text>
            </View>
            <Text style={styles.breakdownValue}>{formatCurrency(totalMaintenanceAmount)}</Text>
          </View>
        </FleetCard>

        {/* Invoices List */}
        <SectionHeader title="Recent Invoices" />
        <View style={styles.invoicesList}>
          {invoices.map(invoice => {
            const vehicle = vehicles.find(v => v.id === invoice.vehicleId)
            const isExpanded = selectedInvoice === invoice.id

            return (
              <Pressable key={invoice.id} style={styles.invoiceCard} onPress={() => setSelectedInvoice(isExpanded ? null : invoice.id)}>
                <View style={styles.invoiceHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
                    <Text style={styles.invoiceVehicle}>{vehicle?.name || 'Vehicle'}</Text>
                    <Text style={styles.invoiceDate}>{invoice.date}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.invoiceAmount}>{formatCurrency(invoice.totalAmount)}</Text>
                    <View
                      style={[
                        styles.invoiceStatusBadge,
                        { backgroundColor: invoice.status === 'paid' ? '#d1fae5' : '#fef3c7' },
                      ]}
                    >
                      <Text style={[styles.invoiceStatusText, { color: invoice.status === 'paid' ? '#10b981' : '#f59e0b' }]}>
                        {invoice.status}
                      </Text>
                    </View>
                  </View>
                </View>

                {isExpanded && (
                  <View style={styles.invoiceDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Charging</Text>
                      <Text style={styles.detailValue}>{formatCurrency(invoice.chargeAmount)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Maintenance</Text>
                      <Text style={styles.detailValue}>{formatCurrency(invoice.maintenanceAmount)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Total</Text>
                      <Text style={styles.detailValueTotal}>{formatCurrency(invoice.totalAmount)}</Text>
                    </View>
                    <Pressable style={styles.downloadButton}>
                      <MaterialCommunityIcons name="download" size={16} color="#10b981" />
                      <Text style={styles.downloadButtonText}>Download Invoice</Text>
                    </Pressable>
                  </View>
                )}
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4fbf6' },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0f5132', flex: 1, textAlign: 'center' },
  summaryCardsGrid: { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  summaryCard: { flex: 1, minWidth: 100, alignItems: 'center', paddingVertical: 14 },
  summaryLabel: { fontSize: 11, color: '#6b7280', marginTop: 6 },
  summaryValue: { fontSize: 14, fontWeight: '900', color: '#0f5132', marginTop: 2 },
  breakdownCard: { marginBottom: 16 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e2efe5' },
  breakdownItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  breakdownLabel: { fontSize: 12, color: '#0f5132', fontWeight: '500' },
  breakdownValue: { fontSize: 14, fontWeight: '900', color: '#0f5132' },
  invoicesList: { gap: 10 },
  invoiceCard: { backgroundColor: '#ffffff', borderRadius: 14, borderWidth: 1, borderColor: '#e2efe5' },
  invoiceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 12 },
  invoiceNumber: { fontSize: 12, fontWeight: '900', color: '#0f5132' },
  invoiceVehicle: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  invoiceDate: { fontSize: 10, color: '#9ca3af', marginTop: 2 },
  invoiceAmount: { fontSize: 16, fontWeight: '900', color: '#0f5132' },
  invoiceStatusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 4 },
  invoiceStatusText: { fontSize: 10, fontWeight: '900', textTransform: 'capitalize' },
  invoiceDetails: { backgroundColor: '#f9fafb', borderTopWidth: 1, borderTopColor: '#e2efe5', padding: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  detailLabel: { fontSize: 12, color: '#6b7280' },
  detailValue: { fontSize: 12, color: '#0f5132', fontWeight: '600' },
  detailValueTotal: { fontSize: 13, color: '#0f5132', fontWeight: '900' },
  downloadButton: { marginTop: 10, backgroundColor: '#edf9f1', borderRadius: 8, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  downloadButtonText: { fontSize: 12, fontWeight: '600', color: '#10b981' },
})
