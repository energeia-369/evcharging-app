import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ModuleId =
  | 'dashboard-analytics'
  | 'user-management'
  | 'ev-station-management'
  | 'cafe-management'
  | 'service-management'
  | 'fleet-management'
  | 'franchise-approval'
  | 'charging-fleet-management'
  | 'dealership-management'
  | 'reports-analytics'
  | 'token-management';

type BadgeTone = 'success' | 'warning' | 'neutral' | 'danger' | 'info';

interface ModuleCard {
  id: ModuleId;
  title: string;
  description: string;
  icon: string;
  tone: BadgeTone;
  status: string;
  accent: string;
}

interface StatCard {
  label: string;
  value: string;
  delta: string;
  icon: string;
  accent: string;
}

interface UserRecord {
  id: string;
  name: string;
  role: 'Customer' | 'Fleet Manager' | 'Service Manager' | 'Franchise Owner' | 'Admin';
  status: 'Active' | 'Inactive' | 'Banned';
  email: string;
  spend: string;
}

interface StationRecord {
  name: string;
  location: string;
  availability: string;
  queue: string;
  revenue: string;
}

interface CafeRecord {
  name: string;
  category: string;
  orders: string;
  revenue: string;
  rating: string;
}

interface ServiceRecord {
  vehicle: string;
  status: string;
  technician: string;
  due: string;
}

interface FleetRecord {
  vehicle: string;
  driver: string;
  battery: string;
  trips: string;
  revenue: string;
}

interface FranchiseRecord {
  business: string;
  owner: string;
  location: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface ChargingFleetRecord {
  vehicle: string;
  chargeStatus: string;
  battery: string;
  schedule: string;
}

interface DealershipRecord {
  dealer: string;
  inventory: string;
  sales: string;
  ranking: string;
}

interface TokenRecord {
  user: string;
  balance: string;
  redeem: string;
  rewards: string;
}

const moduleCards: ModuleCard[] = [
  {
    id: 'dashboard-analytics',
    title: 'Dashboard Analytics',
    description: 'Live KPIs, revenue trends, and platform health at a glance.',
    icon: 'chart-line',
    tone: 'success',
    status: 'Live',
    accent: '#16a34a',
  },
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Search, filter, edit, and moderate platform users safely.',
    icon: 'account-group',
    tone: 'info',
    status: 'Active',
    accent: '#0891b2',
  },
  {
    id: 'ev-station-management',
    title: 'EV Station Management',
    description: 'Monitor charger availability, queues, and station revenue.',
    icon: 'car-electric',
    tone: 'success',
    status: 'Online',
    accent: '#10b981',
  },
  {
    id: 'cafe-management',
    title: 'Cafe Management',
    description: 'Track menu items, orders, ratings, and cafe sales performance.',
    icon: 'store',
    tone: 'warning',
    status: 'Running',
    accent: '#d97706',
  },
  {
    id: 'service-management',
    title: 'Service Management',
    description: 'Handle service bookings, technicians, and support tickets.',
    icon: 'tools',
    tone: 'neutral',
    status: 'Queue Open',
    accent: '#7c3aed',
  },
  {
    id: 'fleet-management',
    title: 'Fleet Management',
    description: 'Oversee drivers, vehicle health, trips, and fleet revenue.',
    icon: 'car-electric',
    tone: 'success',
    status: 'Optimized',
    accent: '#059669',
  },
  {
    id: 'franchise-approval',
    title: 'Franchise Approval',
    description: 'Approve or reject franchise requests with business context.',
    icon: 'account-tie',
    tone: 'warning',
    status: 'Pending',
    accent: '#ef4444',
  },
  {
    id: 'charging-fleet-management',
    title: 'Charging Fleet Management',
    description: 'Coordinate charging schedules and battery analytics.',
    icon: 'battery-charging',
    tone: 'info',
    status: 'Scheduled',
    accent: '#0f766e',
  },
  {
    id: 'dealership-management',
    title: 'Dealership Management',
    description: 'Review inventory, sales, and dealer rankings in one place.',
    icon: 'office-building',
    tone: 'neutral',
    status: 'Tracking',
    accent: '#2563eb',
  },
  {
    id: 'reports-analytics',
    title: 'Reports & Analytics',
    description: 'Export revenue, fleet, charging, and growth reports instantly.',
    icon: 'file-document',
    tone: 'success',
    status: 'Ready',
    accent: '#14b8a6',
  },
  {
    id: 'token-management',
    title: 'Token Management',
    description: 'Manage reward balances, redemption flow, and loyalty tiers.',
    icon: 'qrcode-scan',
    tone: 'warning',
    status: 'Tracked',
    accent: '#f59e0b',
  },
];

const overviewStats: StatCard[] = [
  { label: 'Total Users', value: '18.4K', delta: '+12.4%', icon: 'account-group', accent: '#0891b2' },
  { label: 'Total Revenue', value: '$2.48M', delta: '+18.9%', icon: 'cash', accent: '#16a34a' },
  { label: 'Active Charging Sessions', value: '284', delta: '+7.2%', icon: 'battery-charging', accent: '#10b981' },
  { label: 'Fleet Performance', value: '96%', delta: '+4.1%', icon: 'car-electric', accent: '#7c3aed' },
  { label: 'Pending Franchise Requests', value: '14', delta: '-2', icon: 'account-tie', accent: '#ef4444' },
  { label: 'Active Dealerships', value: '42', delta: '+5', icon: 'office-building', accent: '#2563eb' },
  { label: 'Service Requests', value: '128', delta: '+9.6%', icon: 'tools', accent: '#d97706' },
  { label: 'Token Transactions', value: '7.8K', delta: '+21%', icon: 'qrcode-scan', accent: '#0f766e' },
];

const notifications = [
  { title: '3 franchise approvals need review', time: '2 mins ago', tone: 'warning' as const },
  { title: 'Revenue up 18.9% this week', time: '18 mins ago', tone: 'success' as const },
  { title: 'Station 14 has 2 chargers available', time: '34 mins ago', tone: 'info' as const },
  { title: 'Fleet battery health average is 94%', time: '1 hour ago', tone: 'neutral' as const },
];

const quickActions = [
  { label: 'Approve Franchise', icon: 'clipboard-check', anchor: 'franchise-approval' as ModuleId },
  { label: 'Add Station', icon: 'map-marker', anchor: 'ev-station-management' as ModuleId },
  { label: 'Export Report', icon: 'file-document', anchor: 'reports-analytics' as ModuleId },
  { label: 'Manage Tokens', icon: 'wallet', anchor: 'token-management' as ModuleId },
];

const adminHighlights = [
  { label: 'Executive visibility', value: '24/7 monitoring', icon: 'chart-line' },
  { label: 'Operational control', value: 'Role-based access', icon: 'shield-account' },
  { label: 'Platform readiness', value: 'Mock data enabled', icon: 'file-document' },
];

const users: UserRecord[] = [
  { id: 'U-102', name: 'Aarav Sharma', role: 'Customer', status: 'Active', email: 'aarav@energeia.app', spend: '$2,340' },
  { id: 'U-221', name: 'Nisha Patel', role: 'Fleet Manager', status: 'Active', email: 'nisha@energeia.app', spend: '$8,120' },
  { id: 'U-332', name: 'Rahul Verma', role: 'Admin', status: 'Active', email: 'rahul@energeia.app', spend: '$0' },
  { id: 'U-408', name: 'Sneha Iyer', role: 'Service Manager', status: 'Inactive', email: 'sneha@energeia.app', spend: '$410' },
  { id: 'U-515', name: 'Karan Mehta', role: 'Franchise Owner', status: 'Banned', email: 'karan@energeia.app', spend: '$12,880' },
];

const stationRecords: StationRecord[] = [
  { name: 'Central Plaza', location: 'Downtown', availability: '6 / 8 chargers free', queue: '2 vehicles queued', revenue: '$41,200' },
  { name: 'Green Point', location: 'Airport Road', availability: '4 / 6 chargers free', queue: '1 vehicle queued', revenue: '$29,840' },
  { name: 'North Hub', location: 'Tech Park', availability: '2 / 10 chargers free', queue: '5 vehicles queued', revenue: '$56,430' },
];

const cafeRecords: CafeRecord[] = [
  { name: 'Protein Wrap', category: 'Food', orders: '184 orders', revenue: '$2,760', rating: '4.8' },
  { name: 'Cold Brew', category: 'Beverage', orders: '241 orders', revenue: '$1,684', rating: '4.9' },
  { name: 'Energy Bowl', category: 'Food', orders: '133 orders', revenue: '$2,265', rating: '4.7' },
];

const serviceRecords: ServiceRecord[] = [
  { vehicle: 'EV-1008', status: 'Pending', technician: 'Aman', due: 'Today, 3:30 PM' },
  { vehicle: 'EV-1211', status: 'Completed', technician: 'Riya', due: 'Today, 11:00 AM' },
  { vehicle: 'EV-1440', status: 'In Progress', technician: 'Mohit', due: 'Tomorrow, 9:00 AM' },
];

const fleetRecords: FleetRecord[] = [
  { vehicle: 'Fleet A-01', driver: 'Rajesh', battery: '92%', trips: '148 trips', revenue: '$18,920' },
  { vehicle: 'Fleet A-02', driver: 'Pooja', battery: '88%', trips: '131 trips', revenue: '$16,430' },
  { vehicle: 'Fleet B-07', driver: 'Arjun', battery: '95%', trips: '172 trips', revenue: '$20,280' },
];

const franchiseRecords: FranchiseRecord[] = [
  { business: 'EcoCharge Hub', owner: 'Vikram Singh', location: 'Pune', status: 'Pending' },
  { business: 'Volt Market', owner: 'Anjali Rao', location: 'Ahmedabad', status: 'Pending' },
  { business: 'Prime EV Systems', owner: 'Salim Khan', location: 'Bengaluru', status: 'Approved' },
];

const chargingFleetRecords: ChargingFleetRecord[] = [
  { vehicle: 'CF-11', chargeStatus: 'Charging now', battery: '72%', schedule: '07:00 - 08:15 PM' },
  { vehicle: 'CF-14', chargeStatus: 'Queued', battery: '41%', schedule: '08:30 - 09:45 PM' },
  { vehicle: 'CF-20', chargeStatus: 'Fully charged', battery: '100%', schedule: 'Completed' },
];

const dealershipRecords: DealershipRecord[] = [
  { dealer: 'Energeia Auto Prime', inventory: '124 vehicles', sales: '$421K', ranking: '#1' },
  { dealer: 'Green Drive Motors', inventory: '88 vehicles', sales: '$318K', ranking: '#2' },
  { dealer: 'Future Wheels', inventory: '97 vehicles', sales: '$276K', ranking: '#3' },
];

const reportCards = [
  { title: 'Revenue Report', subtitle: 'Monthly earnings and margin trends', icon: 'cash' },
  { title: 'Fleet Report', subtitle: 'Trip efficiency, uptime, and driver stats', icon: 'car-electric' },
  { title: 'Charging Report', subtitle: 'Station load, queue, and utilization', icon: 'battery-charging' },
  { title: 'User Growth Report', subtitle: 'Registrations and retention by role', icon: 'account-group' },
];

const tokenRecords: TokenRecord[] = [
  { user: 'Aarav Sharma', balance: '1,280 tokens', redeem: 'Voucher pending', rewards: 'Silver tier' },
  { user: 'Nisha Patel', balance: '2,540 tokens', redeem: 'Charge credit ready', rewards: 'Gold tier' },
  { user: 'Karan Mehta', balance: '840 tokens', redeem: 'Redeem blocked', rewards: 'Bronze tier' },
];

const roleFilters = ['All', 'Customer', 'Fleet Manager', 'Service Manager', 'Franchise Owner', 'Admin'] as const;

function toneStyles(tone: BadgeTone) {
  switch (tone) {
    case 'success':
      return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
    case 'warning':
      return { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' };
    case 'danger':
      return { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' };
    case 'info':
      return { backgroundColor: '#dbeafe', color: '#1d4ed8', borderColor: '#bfdbfe' };
    default:
      return { backgroundColor: '#e5e7eb', color: '#374151', borderColor: '#d1d5db' };
  }
}

function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) {
  const badge = toneStyles(tone);
  return (
    <View style={[styles.badge, { backgroundColor: badge.backgroundColor, borderColor: badge.borderColor }]}>
      <Text style={[styles.badgeText, { color: badge.color }]}>{label}</Text>
    </View>
  );
}

function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
      {actionLabel ? (
        <TouchableOpacity activeOpacity={0.85} onPress={onAction} style={styles.sectionAction}>
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function MiniMetric({ label, value, icon, accent }: { label: string; value: string; icon: string; accent: string }) {
  return (
    <View style={styles.miniMetricCard}>
      <View style={[styles.miniMetricIcon, { backgroundColor: `${accent}18` }]}>
        <MaterialCommunityIcons name={icon as any} size={18} color={accent} />
      </View>
      <Text style={styles.miniMetricValue}>{value}</Text>
      <Text style={styles.miniMetricLabel}>{label}</Text>
    </View>
  );
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isNarrow = width < 640;
  const scrollRef = useRef<ScrollView | null>(null);
  const sectionOffsets = useRef<Partial<Record<ModuleId, number>>>({});
  const cardAnimations = useRef(moduleCards.map(() => new Animated.Value(0))).current;
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<(typeof roleFilters)[number]>('All');

  useEffect(() => {
    Animated.stagger(
      60,
      cardAnimations.map((value) =>
        Animated.timing(value, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [cardAnimations]);

  const moduleColumns = width >= 920 ? 3 : width >= 640 ? 2 : 1;
  const statColumns = 2;

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query || [user.name, user.email, user.role, user.id].some((value) => value.toLowerCase().includes(query));
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [roleFilter, search]);

  const handleQuickAction = (anchor: ModuleId) => {
    const targetY = sectionOffsets.current[anchor] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(targetY - 12, 0), animated: true });
  };

  const handleOpenModule = (id: ModuleId) => {
    // Map certain modules to app routes; fallback to scrolling to in-admin section
    switch (id) {
      case 'ev-station-management':
        router.push('/charging/stations-list');
        return;
      case 'cafe-management':
        router.push('/oasis-cafe');
        return;
      case 'service-management':
        router.push('/ev-service-center');
        return;
      case 'fleet-management':
        router.push('/fleet-management');
        return;
      case 'dealership-management':
        router.push('/dealership');
        return;
      case 'franchise-approval':
        // franchise operations live under dealership paths
        router.push('/dealership/apply-franchise');
        return;
      case 'charging-fleet-management':
        // charge fleet is part of fleet management UX
        router.push('/fleet-management');
        return;
      default:
        // For analytics, users, reports, tokens, scroll to the section inside admin
        handleQuickAction(id);
    }
  };

  const handleMockAction = (title: string) => {
    Alert.alert('Admin action', `${title} is wired to mock frontend data only.`);
  };

  const onSectionLayout = (key: ModuleId) => (event: LayoutChangeEvent) => {
    sectionOffsets.current[key] = event.nativeEvent.layout.y;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageShell}>
          <View style={styles.heroBackdrop} />
          <View style={styles.heroOrbOne} />
          <View style={styles.heroOrbTwo} />

          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backChip}>
                <MaterialCommunityIcons name="shield-account" size={18} color="#0f766e" />
                <Text style={styles.backChipText}>Admin Role</Text>
              </TouchableOpacity>
              <StatusBadge label="Premium Control Panel" tone="success" />
            </View>

            <View style={[styles.heroMainRow, isNarrow && styles.heroMainRowColumn]}>
              <View style={styles.heroCopy}>
                <Text style={styles.heroGreeting}>Administrator Dashboard</Text>
                <Text style={styles.heroTitle}>Unified operations console for Energeia.</Text>
                <Text style={styles.heroSubtitle}>
                  Oversee platform performance, approvals, and day-to-day operations from one secure workspace.
                </Text>
                <View style={styles.heroHighlightsRow}>
                  {adminHighlights?.map((highlight) => (
                    <View key={highlight.label} style={styles.heroHighlightCard}>
                      <View style={styles.heroHighlightIconWrap}>
                        <MaterialCommunityIcons name={highlight.icon as any} size={16} color="#0f766e" />
                      </View>
                      <Text style={styles.heroHighlightValue}>{highlight.value}</Text>
                      <Text style={styles.heroHighlightLabel}>{highlight.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={[styles.heroBadgeCard, isNarrow ? styles.heroBadgeCardNarrow : null]}>
                <View style={[styles.heroBadgeIcon, isNarrow ? styles.heroBadgeIconNarrow : null]}>
                  <MaterialCommunityIcons name="shield-account" size={isNarrow ? 22 : 30} color="#ffffff" />
                </View>
                <Text style={[styles.heroBadgeTitle, isNarrow ? styles.heroBadgeTitleNarrow : null]}>Enterprise Admin Console</Text>
                <Text style={styles.heroBadgeText}>Centralized oversight for analytics, approvals, and module operations.</Text>
              </View>
            </View>
          </View>

          <SectionHeader
            title="Executive Overview"
            subtitle="Track the core metrics that drive platform decisions."
            actionLabel="Refresh"
            onAction={() => handleMockAction('Refresh analytics')}
          />
          <View style={[styles.grid, { flexDirection: 'row', flexWrap: 'wrap' }]}>
            {overviewStats?.slice(0, 4).map((stat) => (
              <View key={stat.label} style={[styles.statWrap, { width: `${100 / statColumns}%` }]}>
                <View style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.accent}18` }]}>
                    <MaterialCommunityIcons name={stat.icon as any} size={20} color={stat.accent} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={styles.statDelta}>{stat.delta}</Text>
                </View>
              </View>
            ))}
          </View>

          <SectionHeader title="Operational Shortcuts" subtitle="Navigate directly to the highest-priority admin tasks." />
          <View style={styles.quickActionGrid}>
            {quickActions?.map((action) => (
              <TouchableOpacity
                key={action.label}
                activeOpacity={0.85}
                onPress={() => handleQuickAction(action.anchor)}
                style={styles.quickActionCard}
              >
                <View style={styles.quickActionLeft}>
                  <View style={styles.quickActionIcon}>
                    <MaterialCommunityIcons name={action.icon as any} size={22} color="#ffffff" />
                  </View>
                  <Text style={styles.quickActionText}>{action.label}</Text>
                </View>
                <MaterialCommunityIcons name="map-marker" size={18} color="#94a3b8" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dualPanelRow}>
            <View style={styles.panelCard}>
              <SectionHeader title="Activity Feed" subtitle="Recent alerts, approvals, and performance updates." />
              {notifications?.map((notification) => (
                <View key={notification.title} style={styles.notificationRow}>
                  <StatusBadge label={notification.tone} tone={notification.tone} />
                  <View style={styles.notificationCopy}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.panelCard}>
              <SectionHeader title="Module Management" subtitle="Tap a card to open the relevant admin workstream." />
              <View style={styles.moduleGrid}>
                {moduleCards?.map((moduleCard, index) => {
                  const animatedStyle = {
                    opacity: cardAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                    transform: [
                      {
                        translateY: cardAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [18, 0] }),
                      },
                    ],
                  };

                  return (
                    <Animated.View key={moduleCard.id} style={[styles.moduleCardWrap, { width: `${100 / moduleColumns}%` }, animatedStyle]}>
                      <TouchableOpacity activeOpacity={0.85} onPress={() => handleOpenModule(moduleCard.id)} style={styles.moduleCard}>
                        <View style={styles.moduleCardTopRow}>
                          <View style={[styles.moduleIcon, { backgroundColor: `${moduleCard.accent}18` }]}>
                            <MaterialCommunityIcons name={moduleCard.icon as any} size={24} color={moduleCard.accent} />
                          </View>
                          <StatusBadge label={moduleCard.status} tone={moduleCard.tone} />
                        </View>
                        <Text style={styles.moduleCardTitle}>{moduleCard.title}</Text>
                        <Text style={styles.moduleCardDescription}>{moduleCard.description}</Text>
                        <View style={styles.moduleCardFooter}>
                          <Text style={styles.moduleCardLink}>Open module</Text>
                          <MaterialCommunityIcons name="flash" size={18} color={moduleCard.accent} />
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          </View>

          <View onLayout={onSectionLayout('dashboard-analytics')}>
            <SectionHeader title="Dashboard Analytics" subtitle="High-level operational KPIs compiled from the mock admin dataset." />
            <View style={styles.analyticsStrip}>
              <MiniMetric label="Revenue" value="$2.48M" icon="cash" accent="#16a34a" />
              <MiniMetric label="Users" value="18.4K" icon="account-group" accent="#0891b2" />
              <MiniMetric label="Charging" value="284 sessions" icon="battery-charging" accent="#10b981" />
              <MiniMetric label="Fleet" value="96% uptime" icon="car-electric" accent="#7c3aed" />
            </View>
          </View>

          <View onLayout={onSectionLayout('user-management')}>
            <SectionHeader
              title="User Management"
              subtitle="Search, filter, and moderate platform accounts with precision."
              actionLabel="Add User"
              onAction={() => handleMockAction('Add user')}
            />
            <View style={styles.searchRow}>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search by user name, email, role, or account ID"
                placeholderTextColor="#94a3b8"
                style={styles.searchInput}
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {roleFilters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  activeOpacity={0.8}
                  onPress={() => setRoleFilter(filter)}
                  style={[styles.filterChip, roleFilter === filter && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, roleFilter === filter && styles.filterChipTextActive]}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.userGrid}>
              {filteredUsers?.map((user) => (
                <View key={user.id} style={styles.userCard}>
                  <View style={styles.userTopRow}>
                    <View>
                      <Text style={styles.userName}>{user.name}</Text>
                      <Text style={styles.userMeta}>
                        {user.id} • {user.email}
                      </Text>
                    </View>
                    <StatusBadge
                      label={user.status}
                      tone={user.status === 'Active' ? 'success' : user.status === 'Inactive' ? 'neutral' : 'danger'}
                    />
                  </View>
                  <View style={styles.userStatsRow}>
                    <View style={styles.userStatPill}>
                      <Text style={styles.userStatText}>{user.role}</Text>
                    </View>
                    <View style={styles.userStatPill}>
                      <Text style={styles.userStatText}>{user.spend}</Text>
                    </View>
                  </View>
                  <View style={styles.userActionsRow}>
                    <TouchableOpacity onPress={() => handleMockAction(`Edit ${user.name}`)} style={styles.userActionButton}>
                      <Text style={styles.userActionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleMockAction(`Ban ${user.name}`)} style={styles.userActionButton}>
                      <Text style={styles.userActionText}>Ban</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleMockAction(`Delete ${user.name}`)} style={styles.userActionButtonDanger}>
                      <Text style={styles.userActionTextDanger}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View onLayout={onSectionLayout('ev-station-management')}>
            <SectionHeader
              title="EV Station Management"
              subtitle="Availability, queue flow, and revenue by charging station."
              actionLabel="Add Station"
              onAction={() => handleMockAction('Add station')}
            />
            <View style={styles.detailGrid}>
              {stationRecords?.map((station) => (
                <View key={station.name} style={styles.detailCard}>
                  <View style={styles.detailTopRow}>
                    <View>
                      <Text style={styles.detailTitle}>{station.name}</Text>
                      <Text style={styles.detailSubtitle}>{station.location}</Text>
                    </View>
                    <MaterialCommunityIcons name="map-marker" size={22} color="#10b981" />
                  </View>
                  <Text style={styles.detailLine}>{station.availability}</Text>
                  <Text style={styles.detailLine}>{station.queue}</Text>
                  <Text style={styles.detailRevenue}>Revenue: {station.revenue}</Text>
                  <View style={styles.detailActionsRow}>
                    <TouchableOpacity onPress={() => handleMockAction(`Edit ${station.name}`)} style={styles.detailAction}>
                      <Text style={styles.detailActionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleMockAction(`Delete ${station.name}`)} style={styles.detailAction}>
                      <Text style={styles.detailActionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View onLayout={onSectionLayout('cafe-management')}>
            <SectionHeader
              title="Cafe Management"
              subtitle="Track products, orders, revenue, and customer ratings."
              actionLabel="Add Product"
              onAction={() => handleMockAction('Add cafe product')}
            />
            <View style={styles.detailGrid}>
              {cafeRecords?.map((item) => (
                <View key={item.name} style={styles.detailCard}>
                  <View style={styles.detailTopRow}>
                    <View>
                      <Text style={styles.detailTitle}>{item.name}</Text>
                      <Text style={styles.detailSubtitle}>{item.category}</Text>
                    </View>
                    <MaterialCommunityIcons name="store" size={22} color="#d97706" />
                  </View>
                  <Text style={styles.detailLine}>{item.orders}</Text>
                  <Text style={styles.detailLine}>Customer rating: {item.rating}/5</Text>
                  <Text style={styles.detailRevenue}>Revenue: {item.revenue}</Text>
                </View>
              ))}
            </View>
          </View>

          <View onLayout={onSectionLayout('service-management')}>
            <SectionHeader
              title="Service Management"
              subtitle="Oversee bookings, technicians, service history, and tickets."
              actionLabel="New Booking"
              onAction={() => handleMockAction('Create service booking')}
            />
            <View style={styles.detailGrid}>
              {serviceRecords?.map((service) => (
                <View key={service.vehicle} style={styles.detailCard}>
                  <View style={styles.detailTopRow}>
                    <View>
                      <Text style={styles.detailTitle}>{service.vehicle}</Text>
                      <Text style={styles.detailSubtitle}>Technician: {service.technician}</Text>
                    </View>
                    <StatusBadge
                      label={service.status}
                      tone={service.status === 'Completed' ? 'success' : service.status === 'Pending' ? 'warning' : 'info'}
                    />
                  </View>
                  <Text style={styles.detailLine}>Scheduled: {service.due}</Text>
                  <Text style={styles.detailLine}>Support ticket open</Text>
                </View>
              ))}
            </View>
          </View>

          <View onLayout={onSectionLayout('fleet-management')}>
            <SectionHeader
              title="Fleet Management"
              subtitle="Monitor vehicles, drivers, trips, battery health, and revenue."
              actionLabel="Fleet Report"
              onAction={() => handleMockAction('Open fleet report')}
            />
            <View style={styles.detailGrid}>
              {fleetRecords?.map((fleet) => (
                <View key={fleet.vehicle} style={styles.detailCard}>
                  <View style={styles.detailTopRow}>
                    <View>
                      <Text style={styles.detailTitle}>{fleet.vehicle}</Text>
                      <Text style={styles.detailSubtitle}>Driver: {fleet.driver}</Text>
                    </View>
                    <MaterialCommunityIcons name="car-electric" size={22} color="#059669" />
                  </View>
                  <Text style={styles.detailLine}>Battery health: {fleet.battery}</Text>
                  <Text style={styles.detailLine}>{fleet.trips}</Text>
                  <Text style={styles.detailRevenue}>Revenue: {fleet.revenue}</Text>
                </View>
              ))}
            </View>
          </View>

          <View onLayout={onSectionLayout('franchise-approval')}>
            <SectionHeader
              title="Franchise Approval"
              subtitle="Review franchise applications and business details before approval."
              actionLabel="Review Queue"
              onAction={() => handleMockAction('Open approval queue')}
            />
            <View style={styles.detailGrid}>
              {franchiseRecords?.map((record) => (
                <View key={record.business} style={styles.detailCard}>
                  <View style={styles.detailTopRow}>
                    <View>
                      <Text style={styles.detailTitle}>{record.business}</Text>
                      <Text style={styles.detailSubtitle}>
                        {record.owner} • {record.location}
                      </Text>
                    </View>
                    <StatusBadge
                      label={record.status}
                      tone={record.status === 'Pending' ? 'warning' : record.status === 'Approved' ? 'success' : 'danger'}
                    />
                  </View>
                  <View style={styles.approvalActionsRow}>
                    <TouchableOpacity onPress={() => handleMockAction(`Approve ${record.business}`)} style={styles.approveButton}>
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleMockAction(`Reject ${record.business}`)} style={styles.rejectButton}>
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View onLayout={onSectionLayout('charging-fleet-management')}>
            <SectionHeader
              title="Charging Fleet Management"
              subtitle="Coordinate charging schedules and battery analytics."
              actionLabel="Schedule"
              onAction={() => handleMockAction('Manage charging schedule')}
            />
            <View style={styles.detailGrid}>
              {chargingFleetRecords?.map((record) => (
                <View key={record.vehicle} style={styles.detailCard}>
                  <View style={styles.detailTopRow}>
                    <View>
                      <Text style={styles.detailTitle}>{record.vehicle}</Text>
                      <Text style={styles.detailSubtitle}>{record.chargeStatus}</Text>
                    </View>
                    <MaterialCommunityIcons name="battery-charging" size={22} color="#0f766e" />
                  </View>
                  <Text style={styles.detailLine}>Battery: {record.battery}</Text>
                  <Text style={styles.detailLine}>Schedule: {record.schedule}</Text>
                </View>
              ))}
            </View>
          </View>

          <View onLayout={onSectionLayout('dealership-management')}>
            <SectionHeader
              title="Dealership Management"
              subtitle="Track inventory, sales analytics, and dealer rankings."
              actionLabel="Dealer List"
              onAction={() => handleMockAction('Open dealership list')}
            />
            <View style={styles.detailGrid}>
              {dealershipRecords?.map((record) => (
                <View key={record.dealer} style={styles.detailCard}>
                  <View style={styles.detailTopRow}>
                    <View>
                      <Text style={styles.detailTitle}>{record.dealer}</Text>
                      <Text style={styles.detailSubtitle}>Ranking {record.ranking}</Text>
                    </View>
                    <MaterialCommunityIcons name="office-building" size={22} color="#2563eb" />
                  </View>
                  <Text style={styles.detailLine}>Inventory: {record.inventory}</Text>
                  <Text style={styles.detailRevenue}>Sales: {record.sales}</Text>
                </View>
              ))}
            </View>
          </View>

          <View onLayout={onSectionLayout('reports-analytics')}>
            <SectionHeader
              title="Reports & Analytics"
              subtitle="Download operational reports for leadership and compliance teams."
              actionLabel="Download All"
              onAction={() => handleMockAction('Download all reports')}
            />
            <View style={styles.detailGrid}>
              {reportCards?.map((report) => (
                <View key={report.title} style={styles.reportCard}>
                  <View style={styles.detailTopRow}>
                    <View>
                      <Text style={styles.detailTitle}>{report.title}</Text>
                      <Text style={styles.detailSubtitle}>{report.subtitle}</Text>
                    </View>
                    <MaterialCommunityIcons name={report.icon as any} size={22} color="#10b981" />
                  </View>
                  <TouchableOpacity activeOpacity={0.85} onPress={() => handleMockAction(`Download ${report.title}`)} style={styles.downloadButton}>
                    <Text style={styles.downloadButtonText}>Download report</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View onLayout={onSectionLayout('token-management')}>
            <SectionHeader
              title="Token Management"
              subtitle="Manage reward balances, redemptions, and loyalty activity."
              actionLabel="Create Reward"
              onAction={() => handleMockAction('Create loyalty reward')}
            />
            <View style={styles.detailGrid}>
              {tokenRecords?.map((record) => (
                <View key={record.user} style={styles.detailCard}>
                  <View style={styles.detailTopRow}>
                    <View>
                      <Text style={styles.detailTitle}>{record.user}</Text>
                      <Text style={styles.detailSubtitle}>{record.rewards}</Text>
                    </View>
                    <MaterialCommunityIcons name="wallet" size={22} color="#f59e0b" />
                  </View>
                  <Text style={styles.detailLine}>Balance: {record.balance}</Text>
                  <Text style={styles.detailLine}>Redeem status: {record.redeem}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  scrollContent: {
    flexGrow: 1,
  },
  pageShell: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  heroBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: '#dcfce7',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroOrbOne: {
    position: 'absolute',
    top: 16,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  heroOrbTwo: {
    position: 'absolute',
    top: 96,
    left: -36,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(8, 145, 178, 0.10)',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 12,
  },
  backChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ecfdf5',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  backChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f766e',
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroMainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    alignItems: 'stretch',
  },
  heroCopy: {
    flex: 1,
    minWidth: 250,
  },
  heroGreeting: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    color: '#0f172a',
  },
  heroSubtitle: {
    marginTop: 12,
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
  heroHighlightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  heroHighlightCard: {
    minWidth: 132,
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
  },
  heroHighlightIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroHighlightValue: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 13,
  },
  heroHighlightLabel: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },
  heroBadgeCard: {
    width: 220,
    borderRadius: 24,
    padding: 16,
    backgroundColor: '#064e3b',
    justifyContent: 'space-between',
  },
  heroBadgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroBadgeTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroBadgeText: {
    color: 'rgba(255,255,255,0.84)',
    lineHeight: 20,
    fontSize: 13,
  },
  heroMainRowColumn: {
    flexDirection: 'column',
    gap: 10,
  },
  heroBadgeCardNarrow: {
    width: '100%',
    marginTop: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  heroBadgeIconNarrow: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeTitleNarrow: {
    fontSize: 16,
    marginBottom: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 8,
    marginBottom: 14,
  },
  sectionHeaderCopy: {
    flex: 1,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 19,
  },
  sectionAction: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  sectionActionText: {
    color: '#0f766e',
    fontWeight: '800',
    fontSize: 12,
  },
  grid: {
    gap: 12,
  },
  statWrap: {
    padding: 6,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    minHeight: 128,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 5,
  },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  statLabel: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 12,
    lineHeight: 17,
  },
  statDelta: {
    marginTop: 8,
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '700',
  },
  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickActionCard: {
    width: '48%',
    minWidth: 155,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  quickActionIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 13,
    flexShrink: 1,
  },
  dualPanelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 18,
  },
  panelCard: {
    flex: 1,
    minWidth: 300,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  notificationRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  notificationCopy: {
    flex: 1,
  },
  notificationTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
  },
  notificationTime: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 3,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moduleCardWrap: {
    padding: 4,
  },
  moduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    minHeight: 172,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  moduleCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleCardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
  },
  moduleCardDescription: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  moduleCardFooter: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleCardLink: {
    color: '#0f766e',
    fontWeight: '800',
    fontSize: 12,
  },
  analyticsStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  miniMetricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  miniMetricIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  miniMetricValue: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 18,
  },
  miniMetricLabel: {
    color: '#64748b',
    marginTop: 4,
    fontSize: 12,
  },
  searchRow: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#0f172a',
    fontSize: 14,
  },
  filterRow: {
    gap: 10,
    paddingBottom: 6,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: '#0f766e',
    borderColor: '#0f766e',
  },
  filterChipText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '800',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  userGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  userCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  userTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  userName: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '900',
  },
  userMeta: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  userStatsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  userStatPill: {
    backgroundColor: '#f8fafc',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  userStatText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
  },
  userActionsRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  userActionButton: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userActionButtonDanger: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userActionText: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 12,
  },
  userActionTextDanger: {
    color: '#dc2626',
    fontWeight: '800',
    fontSize: 12,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  detailTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '900',
  },
  detailSubtitle: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  detailLine: {
    color: '#334155',
    fontSize: 13,
    marginBottom: 4,
  },
  detailRevenue: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  detailActionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 12,
  },
  detailAction: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  detailActionText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '800',
  },
  approvalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#b91c1c',
    fontWeight: '900',
    fontSize: 13,
  },
  reportCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  downloadButton: {
    marginTop: 14,
    backgroundColor: '#0f766e',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
  },
  bottomSpacer: {
    height: 32,
  },
});