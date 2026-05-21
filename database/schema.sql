-- ============================================================================
-- ENERGEIA EV ECOSYSTEM PLATFORM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Comprehensive schema for EV charging, fleet management, café orders,
-- service bookings, trips, payments, and franchise partnerships.
-- ============================================================================

-- Create database
CREATE DATABASE IF NOT EXISTS energeia_db;
USE energeia_db;

-- ============================================================================
-- 1. USERS TABLE - Core user management
-- ============================================================================
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone_number VARCHAR(15) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  user_type ENUM('customer', 'driver', 'franchise_partner', 'admin') NOT NULL DEFAULT 'customer',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_image_url VARCHAR(500),
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(10),
  country VARCHAR(100) DEFAULT 'India',
  date_of_birth DATE,
  aadhar_number VARCHAR(12) UNIQUE,
  pan_number VARCHAR(10) UNIQUE,
  driving_license_number VARCHAR(20) UNIQUE,
  account_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  kyc_verified BOOLEAN DEFAULT FALSE,
  kyc_verified_at TIMESTAMP NULL,
  total_transactions INT DEFAULT 0,
  wallet_balance DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  INDEX idx_email (email),
  INDEX idx_phone (phone_number),
  INDEX idx_user_type (user_type),
  INDEX idx_city (city),
  INDEX idx_account_status (account_status),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- 2. CHARGING STATIONS TABLE - EV charging infrastructure
-- ============================================================================
CREATE TABLE charging_stations (
  station_id INT AUTO_INCREMENT PRIMARY KEY,
  station_name VARCHAR(150) NOT NULL,
  station_code VARCHAR(50) UNIQUE NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  address VARCHAR(500) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  charging_type ENUM('AC', 'DC Fast', 'Ultra Fast') NOT NULL,
  total_slots INT NOT NULL DEFAULT 4,
  available_slots INT NOT NULL DEFAULT 4,
  price_per_unit DECIMAL(8, 2) NOT NULL,
  operating_hours_start TIME DEFAULT '06:00:00',
  operating_hours_end TIME DEFAULT '22:00:00',
  amenities JSON,
  partner_id INT,
  installation_date DATE,
  status ENUM('operational', 'maintenance', 'inactive') DEFAULT 'operational',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_city (city),
  INDEX idx_charging_type (charging_type),
  INDEX idx_status (status),
  INDEX idx_coordinates (latitude, longitude)
);

-- ============================================================================
-- 3. CHARGING SESSIONS TABLE - User charging transactions
-- ============================================================================
CREATE TABLE charging_sessions (
  session_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  station_id INT NOT NULL,
  vehicle_model VARCHAR(100),
  battery_percentage_start INT,
  battery_percentage_end INT,
  energy_consumed_kwh DECIMAL(8, 3),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NULL,
  duration_minutes INT,
  cost DECIMAL(10, 2),
  payment_id INT,
  session_status ENUM('booked', 'charging', 'completed', 'cancelled') DEFAULT 'booked',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (station_id) REFERENCES charging_stations(station_id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_station_id (station_id),
  INDEX idx_session_status (session_status),
  INDEX idx_start_time (start_time),
  INDEX idx_end_time (end_time)
);

-- ============================================================================
-- 4. FLEET VEHICLES TABLE - Company fleet management
-- ============================================================================
CREATE TABLE fleet_vehicles (
  vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_model VARCHAR(100) NOT NULL,
  vehicle_type ENUM('sedan', 'suv', 'truck', 'van') DEFAULT 'sedan',
  manufacturer VARCHAR(100),
  manufacture_year INT,
  battery_capacity_kwh DECIMAL(6, 2),
  max_range_km INT,
  current_battery_percentage INT DEFAULT 100,
  current_speed_kmph INT DEFAULT 0,
  odometer_km DECIMAL(10, 2) DEFAULT 0,
  gps_latitude DECIMAL(10, 8),
  gps_longitude DECIMAL(11, 8),
  assigned_driver_id INT,
  fleet_owner_id INT,
  assigned_region VARCHAR(100),
  trip_status ENUM('idle', 'en-route', 'completed', 'maintenance') DEFAULT 'idle',
  charging_status ENUM('not-charging', 'charging', 'fully-charged') DEFAULT 'not-charging',
  last_service_date DATE,
  next_service_date DATE,
  maintenance_status ENUM('good', 'fair', 'poor', 'needs-service') DEFAULT 'good',
  total_trips INT DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (assigned_driver_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (fleet_owner_id) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_vehicle_number (vehicle_number),
  INDEX idx_assigned_driver (assigned_driver_id),
  INDEX idx_trip_status (trip_status),
  INDEX idx_charging_status (charging_status),
  INDEX idx_region (assigned_region)
);

-- ============================================================================
-- 5. TRIPS TABLE - Fleet trips/deliveries
-- ============================================================================
CREATE TABLE trips (
  trip_id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id INT NOT NULL,
  driver_id INT NOT NULL,
  start_location VARCHAR(500) NOT NULL,
  end_location VARCHAR(500) NOT NULL,
  start_latitude DECIMAL(10, 8),
  start_longitude DECIMAL(11, 8),
  end_latitude DECIMAL(10, 8),
  end_longitude DECIMAL(11, 8),
  distance_km DECIMAL(10, 2),
  duration_minutes INT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NULL,
  trip_status ENUM('planned', 'in-progress', 'completed', 'cancelled') DEFAULT 'planned',
  route_info JSON,
  stops_count INT DEFAULT 0,
  packages_count INT DEFAULT 0,
  fuel_used_units DECIMAL(8, 3),
  revenue_generated DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (vehicle_id) REFERENCES fleet_vehicles(vehicle_id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_vehicle_id (vehicle_id),
  INDEX idx_driver_id (driver_id),
  INDEX idx_trip_status (trip_status),
  INDEX idx_start_time (start_time)
);

-- ============================================================================
-- 6. CAFÉ MENU ITEMS TABLE - Oasis Recharge Café menu
-- ============================================================================
CREATE TABLE cafe_menu_items (
  menu_item_id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(150) NOT NULL,
  category ENUM('Coffee', 'Snacks', 'Desserts', 'Beverages') NOT NULL,
  description TEXT,
  price DECIMAL(8, 2) NOT NULL,
  image_url VARCHAR(500),
  rating DECIMAL(3, 2),
  rating_count INT DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  preparation_time_minutes INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_category (category),
  INDEX idx_price (price),
  INDEX idx_is_available (is_available)
);

-- ============================================================================
-- 7. CAFÉ ORDERS TABLE - Café order management
-- ============================================================================
CREATE TABLE cafe_orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0.00,
  final_amount DECIMAL(10, 2) NOT NULL,
  order_status ENUM('placed', 'preparing', 'ready', 'picked-up', 'cancelled') DEFAULT 'placed',
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  payment_id INT,
  delivery_type ENUM('pickup', 'delivery') DEFAULT 'pickup',
  delivery_address VARCHAR(500),
  special_instructions TEXT,
  estimated_ready_time TIMESTAMP,
  actual_ready_time TIMESTAMP NULL,
  picked_up_time TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_order_status (order_status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- 8. CAFÉ ORDER ITEMS TABLE - Items in each order
-- ============================================================================
CREATE TABLE cafe_order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(8, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  special_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES cafe_orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES cafe_menu_items(menu_item_id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id)
);

-- ============================================================================
-- 9. SERVICE BOOKINGS TABLE - EV service center bookings
-- ============================================================================
CREATE TABLE service_bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  service_type ENUM('Battery Diagnostics', 'Motor Repair', 'General Maintenance', 'Brake System', 'Software Update', 'Annual Service') NOT NULL,
  vehicle_model VARCHAR(100),
  vehicle_number VARCHAR(20),
  issue_notes TEXT,
  estimated_cost DECIMAL(10, 2) NOT NULL,
  actual_cost DECIMAL(10, 2),
  technician_id INT,
  booking_status ENUM('pending', 'confirmed', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  start_time TIMESTAMP NULL,
  completion_time TIMESTAMP NULL,
  duration_minutes INT,
  parts_replaced JSON,
  notes_by_technician TEXT,
  rating DECIMAL(3, 2),
  payment_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (technician_id) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_service_type (service_type),
  INDEX idx_booking_status (booking_status),
  INDEX idx_scheduled_date (scheduled_date)
);

-- ============================================================================
-- 10. PAYMENTS TABLE - Transaction management
-- ============================================================================
CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_method ENUM('credit_card', 'debit_card', 'upi', 'wallet', 'net_banking') NOT NULL,
  transaction_type ENUM('charging', 'café', 'service', 'franchise', 'refund') NOT NULL,
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  reference_id INT,
  transaction_id VARCHAR(100) UNIQUE,
  gateway_response JSON,
  notes TEXT,
  refund_amount DECIMAL(12, 2) DEFAULT 0.00,
  refund_reason VARCHAR(500),
  refund_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_payment_status (payment_status),
  INDEX idx_transaction_type (transaction_type),
  INDEX idx_created_at (created_at),
  INDEX idx_transaction_id (transaction_id)
);

-- ============================================================================
-- 11. FRANCHISE PARTNERS TABLE - Dealership and franchise management
-- ============================================================================
CREATE TABLE franchise_partners (
  franchise_id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id INT,
  partner_name VARCHAR(200) NOT NULL,
  business_type ENUM('dealership', 'charging_station_operator', 'service_center', 'café', 'fleet_manager') NOT NULL,
  contact_person_name VARCHAR(100),
  contact_email VARCHAR(150),
  contact_phone VARCHAR(15),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  address VARCHAR(500),
  website_url VARCHAR(500),
  registration_number VARCHAR(50),
  gst_number VARCHAR(15),
  bank_account_number VARCHAR(20),
  bank_ifsc_code VARCHAR(11),
  territory_region VARCHAR(100),
  territory_area VARCHAR(500),
  estimated_population INT,
  competitor_count INT,
  active_showrooms INT DEFAULT 0,
  active_charging_stations INT DEFAULT 0,
  total_vehicles_sold INT DEFAULT 0,
  total_revenue DECIMAL(14, 2) DEFAULT 0.00,
  monthly_revenue DECIMAL(12, 2) DEFAULT 0.00,
  quarterly_growth DECIMAL(6, 2) DEFAULT 0.00,
  team_size INT DEFAULT 0,
  customer_satisfaction_score DECIMAL(3, 2),
  partnership_status ENUM('prospective', 'approved', 'active', 'inactive', 'terminated') DEFAULT 'prospective',
  agreement_start_date DATE,
  agreement_end_date DATE,
  performance_metrics JSON,
  last_quarter_performance TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (partner_id) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_partner_id (partner_id),
  INDEX idx_city (city),
  INDEX idx_business_type (business_type),
  INDEX idx_partnership_status (partnership_status),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- 12. FRANCHISE APPLICATIONS TABLE - Track partnership applications
-- ============================================================================
CREATE TABLE franchise_applications (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  applicant_name VARCHAR(150) NOT NULL,
  applicant_email VARCHAR(150) NOT NULL,
  applicant_phone VARCHAR(15) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  experience_years INT,
  proposed_investment DECIMAL(12, 2),
  business_background TEXT,
  territory_preference VARCHAR(500),
  application_status ENUM('submitted', 'under-review', 'approved', 'rejected', 'on-hold') DEFAULT 'submitted',
  review_notes TEXT,
  reviewed_by_id INT,
  review_date TIMESTAMP NULL,
  decision_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reviewed_by_id) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_applicant_email (applicant_email),
  INDEX idx_application_status (application_status),
  INDEX idx_city (city),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- 13. EV SHOWROOM CARS TABLE - Dealership inventory
-- ============================================================================
CREATE TABLE showroom_cars (
  car_id INT AUTO_INCREMENT PRIMARY KEY,
  car_name VARCHAR(150) NOT NULL,
  manufacturer VARCHAR(100),
  model_year INT,
  color VARCHAR(50),
  price DECIMAL(12, 2) NOT NULL,
  battery_capacity_kwh DECIMAL(6, 2),
  battery_range_km INT,
  charging_time_fast_hours DECIMAL(4, 2),
  charging_time_standard_hours DECIMAL(4, 2),
  max_speed_kmph INT,
  acceleration_0_100_seconds DECIMAL(4, 2),
  seating_capacity INT,
  motor_type VARCHAR(100),
  drive_type ENUM('FWD', 'RWD', 'AWD') DEFAULT 'FWD',
  image_url_primary VARCHAR(500),
  image_urls JSON,
  specifications JSON,
  available_units INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_car_name (car_name),
  INDEX idx_price (price),
  INDEX idx_available_units (available_units)
);

-- ============================================================================
-- 14. TEST DRIVE BOOKINGS TABLE - Showroom test drive management
-- ============================================================================
CREATE TABLE test_drive_bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  customer_id INT,
  customer_name VARCHAR(150),
  customer_phone VARCHAR(15),
  customer_email VARCHAR(150),
  preferred_date DATE NOT NULL,
  preferred_time TIME,
  time_slot ENUM('09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00') DEFAULT '10:00-11:00',
  booking_status ENUM('booked', 'completed', 'cancelled', 'no-show') DEFAULT 'booked',
  test_drive_completed_time TIMESTAMP NULL,
  customer_feedback TEXT,
  customer_rating DECIMAL(3, 2),
  salesperson_id INT,
  notes VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (car_id) REFERENCES showroom_cars(car_id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (salesperson_id) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_car_id (car_id),
  INDEX idx_customer_id (customer_id),
  INDEX idx_preferred_date (preferred_date),
  INDEX idx_booking_status (booking_status)
);

-- ============================================================================
-- 15. REVIEWS & RATINGS TABLE - User feedback management
-- ============================================================================
CREATE TABLE reviews_ratings (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  entity_type ENUM('charging_station', 'service_booking', 'café_order', 'fleet_driver', 'franchise_partner') NOT NULL,
  entity_id INT NOT NULL,
  rating DECIMAL(3, 2) NOT NULL,
  title VARCHAR(200),
  review_text TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  unhelpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_entity_type_id (entity_type, entity_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- 16. NOTIFICATIONS TABLE - System notifications
-- ============================================================================
CREATE TABLE notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  notification_type ENUM('charging', 'service', 'café', 'trip', 'payment', 'franchise', 'system') NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  reference_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  action_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- 17. ANALYTICS & AUDIT TABLE - System activity tracking
-- ============================================================================
CREATE TABLE audit_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status ENUM('success', 'failed') DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================================================

-- Index for vehicle GPS tracking
ALTER TABLE fleet_vehicles ADD INDEX idx_gps (gps_latitude, gps_longitude);

-- Index for payment analytics
ALTER TABLE payments ADD INDEX idx_transaction_type_date (transaction_type, created_at);

-- Index for charging analytics
ALTER TABLE charging_sessions ADD INDEX idx_session_date_range (start_time, end_time);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
