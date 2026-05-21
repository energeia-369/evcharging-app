import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type TabType = 'dashboard' | 'book-service' | 'diagnostics' | 'spare-parts' | 'maintenance' | 'billing' | 'invoices' | 'requests';

interface Service {
  id: string;
  name: string;
  description: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
  technician?: string;
}

interface DiagnosticReport {
  id: string;
  vehicleId: string;
  date: string;
  status: 'pending' | 'completed';
  issues?: string[];
}

interface SparePart {
  id: string;
  name: string;
  category: string;
  price: string;
  availability: 'in-stock' | 'out-of-stock' | 'pre-order';
  quantity?: number;
}

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  lastService: string;
  nextDue: string;
  status: 'up-to-date' | 'due-soon' | 'overdue';
}

interface BillingInfo {
  id: string;
  serviceId: string;
  amount: string;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending';
  serviceDetails: string;
}

interface ServiceRequest {
  id: string;
  type: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'submitted' | 'acknowledged' | 'in-progress' | 'resolved';
  createdDate: string;
}

// Mock Data
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Oil Change & Filter Replacement',
    description: 'Regular maintenance service',
    date: '2024-05-10',
    status: 'completed',
    technician: 'John Smith',
  },
  {
    id: '2',
    name: 'Battery Health Check',
    description: 'EV battery diagnostics',
    date: '2024-05-12',
    status: 'in-progress',
    technician: 'Mike Johnson',
  },
  {
    id: '3',
    name: 'Brake Pad Replacement',
    description: 'Front brake maintenance',
    date: '2024-05-15',
    status: 'pending',
  },
];

const mockDiagnostics: DiagnosticReport[] = [
  {
    id: '1',
    vehicleId: 'VEH001',
    date: '2024-05-10',
    status: 'completed',
    issues: ['Minor battery degradation', 'Tire pressure low'],
  },
  {
    id: '2',
    vehicleId: 'VEH001',
    date: '2024-05-12',
    status: 'pending',
  },
];

const mockSpareParts: SparePart[] = [
  {
    id: '1',
    name: 'EV Battery Module',
    category: 'Battery',
    price: '₹45,000',
    availability: 'in-stock',
    quantity: 2,
  },
  {
    id: '2',
    name: 'DC Charging Port',
    category: 'Charging',
    price: '₹8,500',
    availability: 'in-stock',
    quantity: 5,
  },
  {
    id: '3',
    name: 'Motor Controller Unit',
    category: 'Motor',
    price: '₹35,000',
    availability: 'pre-order',
  },
];

const mockMaintenance: MaintenanceRecord[] = [
  {
    id: '1',
    vehicleId: 'VEH001',
    type: 'Regular Maintenance',
    lastService: '2024-04-15',
    nextDue: '2024-07-15',
    status: 'up-to-date',
  },
  {
    id: '2',
    vehicleId: 'VEH001',
    type: 'Battery Check',
    lastService: '2024-03-10',
    nextDue: '2024-06-10',
    status: 'up-to-date',
  },
];

const mockBilling: BillingInfo[] = [
  {
    id: '1',
    serviceId: '1',
    amount: '₹2,500',
    status: 'paid',
    dueDate: '2024-05-10',
  },
  {
    id: '2',
    serviceId: '2',
    amount: '₹5,000',
    status: 'pending',
    dueDate: '2024-05-15',
  },
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-0001',
    date: '2024-05-10',
    amount: '₹2,500',
    status: 'paid',
    serviceDetails: 'Oil Change & Filter Replacement',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-0002',
    date: '2024-05-12',
    amount: '₹5,000',
    status: 'pending',
    serviceDetails: 'Battery Health Check',
  },
];

const mockServiceRequests: ServiceRequest[] = [
  {
    id: '1',
    type: 'Urgent Repair',
    description: 'AC unit not working properly',
    priority: 'high',
    status: 'in-progress',
    createdDate: '2024-05-12',
  },
  {
    id: '2',
    type: 'Maintenance Inquiry',
    description: 'Schedule regular maintenance',
    priority: 'low',
    status: 'acknowledged',
    createdDate: '2024-05-11',
  },
];

export default function EVServiceCenterScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceType, setServiceType] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePriority, setServicePriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [services, setServices] = useState(mockServices);
  
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);
  const [diagnosticsVehicleId, setDiagnosticsVehicleId] = useState('');
  const [diagnosticsDate, setDiagnosticsDate] = useState('');
  const [diagnostics, setDiagnostics] = useState(mockDiagnostics);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'up-to-date':
      case 'resolved':
      case 'in-stock':
        return '#10b981';
      case 'in-progress':
      case 'acknowledged':
        return '#f59e0b';
      case 'pending':
      case 'overdue':
      case 'out-of-stock':
      case 'submitted':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const renderDashboard = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { borderTopColor: '#10b981' }]}>
          <MaterialCommunityIcons name="wrench" size={28} color="#10b981" />
          <Text style={styles.statValue}>{mockServices.length}</Text>
          <Text style={styles.statLabel}>Total Services</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#0891b2' }]}>
          <MaterialCommunityIcons name="file-document" size={28} color="#0891b2" />
          <Text style={styles.statValue}>{mockInvoices.length}</Text>
          <Text style={styles.statLabel}>Invoices</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#f59e0b' }]}>
          <MaterialCommunityIcons name="tools" size={28} color="#f59e0b" />
          <Text style={styles.statValue}>{mockMaintenance.length}</Text>
          <Text style={styles.statLabel}>Maintenance</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#8b5cf6' }]}>
          <MaterialCommunityIcons name="alert-circle" size={28} color="#8b5cf6" />
          <Text style={styles.statValue}>{mockServiceRequests.length}</Text>
          <Text style={styles.statLabel}>Requests</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Services</Text>
        {mockServices.slice(0, 2).map((service) => (
          <View key={service.id} style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text style={styles.itemTitle}>{service.name}</Text>
              <Text style={styles.itemSubtitle}>{service.date}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(service.status) },
              ]}
            >
              <Text style={styles.statusText}>{service.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderBookService = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => setShowServiceModal(true)}
      >
        <MaterialCommunityIcons name="plus" size={20} color="white" />
        <Text style={styles.buttonText}>New Service Request</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Active Bookings</Text>
      {services.map((service) => (
        <View key={service.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.itemTitle}>{service.name}</Text>
            <Text style={styles.itemSubtitle}>{service.description}</Text>
            <Text style={styles.itemDate}>{service.date}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(service.status) },
            ]}
          >
            <Text style={styles.statusText}>{service.status}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderDiagnostics = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => setShowDiagnosticsModal(true)}
      >
        <MaterialCommunityIcons name="plus" size={20} color="white" />
        <Text style={styles.buttonText}>Schedule Diagnostic</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Diagnostic Reports</Text>
      {diagnostics.map((report) => (
        <View key={report.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.itemTitle}>Vehicle: {report.vehicleId}</Text>
            <Text style={styles.itemDate}>{report.date}</Text>
            {report.issues && (
              <View style={styles.issuesContainer}>
                {report.issues.map((issue, idx) => (
                  <Text key={idx} style={styles.issueText}>
                    • {issue}
                  </Text>
                ))}
              </View>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(report.status) },
            ]}
          >
            <Text style={styles.statusText}>{report.status}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderSpareParts = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Available Spare Parts</Text>
      {mockSpareParts.map((part) => (
        <View key={part.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.itemTitle}>{part.name}</Text>
            <Text style={styles.itemSubtitle}>{part.category}</Text>
            <Text style={styles.itemPrice}>{part.price}</Text>
            {part.quantity && (
              <Text style={styles.quantityText}>Stock: {part.quantity} units</Text>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(part.availability) },
            ]}
          >
            <Text style={styles.statusText}>{part.availability}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderMaintenance = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Maintenance Records</Text>
      {mockMaintenance.map((record) => (
        <View key={record.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.itemTitle}>{record.type}</Text>
            <Text style={styles.itemSubtitle}>Last Service: {record.lastService}</Text>
            <Text style={styles.itemDate}>Next Due: {record.nextDue}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(record.status) },
            ]}
          >
            <Text style={styles.statusText}>{record.status}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderBilling = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Billing Information</Text>
      {mockBilling.map((bill) => (
        <View key={bill.id} style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text style={styles.itemTitle}>{bill.amount}</Text>
            <Text style={styles.itemSubtitle}>Service ID: {bill.serviceId}</Text>
            <Text style={styles.itemDate}>Due: {bill.dueDate}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(bill.status) },
            ]}
          >
            <Text style={styles.statusText}>{bill.status}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderInvoices = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Service Invoices</Text>
      {mockInvoices.map((invoice) => (
        <View key={invoice.id} style={styles.invoiceCard}>
          <View style={styles.invoiceHeader}>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(invoice.status) },
              ]}
            >
              <Text style={styles.statusText}>{invoice.status}</Text>
            </View>
          </View>
          <Text style={styles.itemSubtitle}>{invoice.serviceDetails}</Text>
          <View style={styles.invoiceFooter}>
            <Text style={styles.invoiceAmount}>{invoice.amount}</Text>
            <Text style={styles.itemDate}>{invoice.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderServiceRequests = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => setShowServiceModal(true)}
      >
        <MaterialCommunityIcons name="plus" size={20} color="white" />
        <Text style={styles.buttonText}>Submit Service Request</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Service Requests</Text>
      {mockServiceRequests.map((request) => (
        <View key={request.id} style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <Text style={styles.itemTitle}>{request.type}</Text>
            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor:
                    request.priority === 'high'
                      ? '#ef4444'
                      : request.priority === 'medium'
                      ? '#f59e0b'
                      : '#10b981',
                },
              ]}
            >
              <Text style={styles.statusText}>{request.priority}</Text>
            </View>
          </View>
          <Text style={styles.itemSubtitle}>{request.description}</Text>
          <View style={styles.requestFooter}>
            <Text style={styles.itemDate}>{request.createdDate}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(request.status) },
              ]}
            >
              <Text style={styles.statusText}>{request.status}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'book-service':
        return renderBookService();
      case 'diagnostics':
        return renderDiagnostics();
      case 'spare-parts':
        return renderSpareParts();
      case 'maintenance':
        return renderMaintenance();
      case 'billing':
        return renderBilling();
      case 'invoices':
        return renderInvoices();
      case 'requests':
        return renderServiceRequests();
      default:
        return renderDashboard();
    }
  };

  const handleSubmitServiceRequest = () => {
    if (!serviceType.trim() || !serviceDescription.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newService: Service = {
      id: (services.length + 1).toString(),
      name: serviceType,
      description: serviceDescription,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    setServices([...services, newService]);
    setShowServiceModal(false);
    setServiceType('');
    setServiceDescription('');
    setServicePriority('medium');
    alert('Service request submitted successfully!');
  };

  const handleScheduleDiagnostics = () => {
    if (!diagnosticsVehicleId.trim() || !diagnosticsDate.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newDiagnostic: DiagnosticReport = {
      id: (diagnostics.length + 1).toString(),
      vehicleId: diagnosticsVehicleId,
      date: diagnosticsDate,
      status: 'pending',
    };

    setDiagnostics([...diagnostics, newDiagnostic]);
    setShowDiagnosticsModal(false);
    setDiagnosticsVehicleId('');
    setDiagnosticsDate('');
    alert('Diagnostic scheduled successfully!');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0891b2" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>EV Service Center</Text>
          <Text style={styles.headerSubtitle}>Manage your vehicle services</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      {/* Tab Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabNavigation}
        contentContainerStyle={styles.tabNavigationContent}
      >
        <TouchableOpacity
          onPress={() => setActiveTab('dashboard')}
          style={[styles.tab, activeTab === 'dashboard' && styles.tabActive]}
        >
          <MaterialCommunityIcons
            name="home"
            size={20}
            color={activeTab === 'dashboard' ? '#0891b2' : '#9ca3af'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'dashboard' && styles.tabLabelActive,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('book-service')}
          style={[styles.tab, activeTab === 'book-service' && styles.tabActive]}
        >
          <MaterialCommunityIcons
            name="calendar-plus"
            size={20}
            color={activeTab === 'book-service' ? '#0891b2' : '#9ca3af'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'book-service' && styles.tabLabelActive,
            ]}
          >
            Book
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('diagnostics')}
          style={[styles.tab, activeTab === 'diagnostics' && styles.tabActive]}
        >
          <MaterialCommunityIcons
            name="stethoscope"
            size={20}
            color={activeTab === 'diagnostics' ? '#0891b2' : '#9ca3af'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'diagnostics' && styles.tabLabelActive,
            ]}
          >
            Diagnostic
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('spare-parts')}
          style={[styles.tab, activeTab === 'spare-parts' && styles.tabActive]}
        >
          <MaterialCommunityIcons
            name="warehouse"
            size={20}
            color={activeTab === 'spare-parts' ? '#0891b2' : '#9ca3af'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'spare-parts' && styles.tabLabelActive,
            ]}
          >
            Parts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('maintenance')}
          style={[styles.tab, activeTab === 'maintenance' && styles.tabActive]}
        >
          <MaterialCommunityIcons
            name="wrench"
            size={20}
            color={activeTab === 'maintenance' ? '#0891b2' : '#9ca3af'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'maintenance' && styles.tabLabelActive,
            ]}
          >
            Maintenance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('billing')}
          style={[styles.tab, activeTab === 'billing' && styles.tabActive]}
        >
          <MaterialCommunityIcons
            name="receipt"
            size={20}
            color={activeTab === 'billing' ? '#0891b2' : '#9ca3af'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'billing' && styles.tabLabelActive,
            ]}
          >
            Billing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('invoices')}
          style={[styles.tab, activeTab === 'invoices' && styles.tabActive]}
        >
          <MaterialCommunityIcons
            name="file-document-multiple"
            size={20}
            color={activeTab === 'invoices' ? '#0891b2' : '#9ca3af'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'invoices' && styles.tabLabelActive,
            ]}
          >
            Invoices
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('requests')}
          style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
        >
          <MaterialCommunityIcons
            name="bell-alert"
            size={20}
            color={activeTab === 'requests' ? '#0891b2' : '#9ca3af'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'requests' && styles.tabLabelActive,
            ]}
          >
            Requests
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Service Request Modal */}
      <Modal
        visible={showServiceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowServiceModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>New Service Request</Text>
                <TouchableOpacity
                  onPress={() => setShowServiceModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="#1f2937"
                  />
                </TouchableOpacity>
              </View>

              {/* Modal Body */}
              <ScrollView style={styles.modalBody}>
                {/* Service Type */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Service Type</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Urgent Repair, Maintenance"
                    placeholderTextColor="#9ca3af"
                    value={serviceType}
                    onChangeText={setServiceType}
                  />
                </View>

                {/* Description */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Description</Text>
                  <TextInput
                    style={[styles.textInput, styles.textAreaInput]}
                    placeholder="Describe your service request in detail..."
                    placeholderTextColor="#9ca3af"
                    value={serviceDescription}
                    onChangeText={setServiceDescription}
                    multiline
                    numberOfLines={5}
                  />
                </View>

                {/* Priority Selection */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Priority Level</Text>
                  <View style={styles.priorityContainer}>
                    {(['low', 'medium', 'high'] as const).map((priority) => (
                      <TouchableOpacity
                        key={priority}
                        onPress={() => setServicePriority(priority)}
                        style={[
                          styles.priorityButton,
                          servicePriority === priority &&
                            styles.priorityButtonActive,
                          {
                            borderColor:
                              priority === 'high'
                                ? '#ef4444'
                                : priority === 'medium'
                                ? '#f59e0b'
                                : '#10b981',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.priorityButtonText,
                            servicePriority === priority &&
                              styles.priorityButtonTextActive,
                          ]}
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              {/* Modal Footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowServiceModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitServiceRequest}
                >
                  <Text style={styles.submitButtonText}>Submit Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Diagnostics Modal */}
      <Modal
        visible={showDiagnosticsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDiagnosticsModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Schedule Diagnostic</Text>
                <TouchableOpacity
                  onPress={() => setShowDiagnosticsModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="#1f2937"
                  />
                </TouchableOpacity>
              </View>

              {/* Modal Body */}
              <ScrollView style={styles.modalBody}>
                {/* Vehicle ID */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Vehicle ID</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., VEH001, VEH002"
                    placeholderTextColor="#9ca3af"
                    value={diagnosticsVehicleId}
                    onChangeText={setDiagnosticsVehicleId}
                  />
                </View>

                {/* Diagnostic Date */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Preferred Date</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9ca3af"
                    value={diagnosticsDate}
                    onChangeText={setDiagnosticsDate}
                  />
                </View>

                {/* Diagnostic Type */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Diagnostic Type</Text>
                  <View style={styles.diagnosticTypeContainer}>
                    <View style={styles.diagnosticTypeButton}>
                      <Text style={styles.diagnosticTypeText}>Full System Check</Text>
                    </View>
                    <View style={styles.diagnosticTypeButton}>
                      <Text style={styles.diagnosticTypeText}>Battery Health</Text>
                    </View>
                    <View style={styles.diagnosticTypeButton}>
                      <Text style={styles.diagnosticTypeText}>Motor Check</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Modal Footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowDiagnosticsModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleScheduleDiagnostics}
                >
                  <Text style={styles.submitButtonText}>Schedule</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#0891b2',
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#cffafe',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tabContent: {
    paddingBottom: 16,
  },
  tabNavigation: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: 'white',
    maxHeight: 80,
  },
  tabNavigationContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 4,
    minWidth: 70,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#0891b2',
  },
  tabLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#0891b2',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 0.48,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listItemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
    marginTop: 4,
  },
  quantityText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  issuesContainer: {
    marginTop: 8,
  },
  issueText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  invoiceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  invoiceAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0891b2',
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 0,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  textAreaInput: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  priorityButtonActive: {
    backgroundColor: '#f0fdf4',
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  priorityButtonTextActive: {
    color: '#10b981',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#0891b2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  diagnosticTypeContainer: {
    gap: 10,
  },
  diagnosticTypeButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  diagnosticTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0891b2',
  },
});
