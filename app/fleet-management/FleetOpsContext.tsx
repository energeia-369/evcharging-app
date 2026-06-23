import React, { createContext, ReactNode, useContext, useMemo, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from './AuthContext'
import { drivers, vehicles, type Driver, type Vehicle } from '../../lib/mock/fleetData'

type ShiftSlot = 'Morning shift' | 'Evening shift' | 'Night shift'
type ShiftDuration = '6 hour shift' | '8 hour shift'
type KycStatus = 'pending' | 'in-review' | 'verified' | 'rejected'

export type VehicleKycDocuments = {
  rcBook: string
  insurance: string
  pollutionCertificate: string
  vehicleImage: string
}

export type DriverKycDocuments = {
  aadhaarCard: string
  drivingLicense: string
  profilePhoto: string
  bankProof: string
}

export type FleetVehicleRecord = Vehicle & {
  fleetManagerId: string
  vehicleId: string
  vehicleNumber: string
  driverIds: string[]
  kycStatus: KycStatus
  verificationStatus: 'not-started' | 'under-review' | 'approved'
  kycDocuments: VehicleKycDocuments | null
}

export type FleetDriverRecord = Driver & {
  driverId: string
  vehicleId: string | null
  mobileNumber: string
  aadhaarNumber: string
  shift: ShiftSlot | null
  shiftDuration: ShiftDuration | null
  verificationStatus: 'not-started' | 'under-review' | 'verified'
  bankDetails: string
  emergencyContact: string
  kycStatus: KycStatus
  kycDocuments: DriverKycDocuments | null
}

type BookingDraft = {
  pickupLocation: string
  dropLocation: string
  passengerName: string
  contactNumber: string
  vehicleType: string
  estimatedFare: number
  distance: number
  scheduledAt: string
  priority: boolean
  paymentMethod?: string
}

type Assignment = {
  vehicleId: string
  driverId: string
}

type RegisterVehiclePayload = {
  vehicleNumber: string
  model: string
  location: string
  imageLabel: string
}

type AddDriverPayload = {
  driverName: string
  mobileNumber: string
  aadhaarNumber: string
  licenseNumber: string
  bankDetails: string
  emergencyContact: string
  vehicleId: string | null
  shift: ShiftSlot | null
  shiftDuration: ShiftDuration | null
}

type AssignShiftPayload = {
  driverId: string
  vehicleId: string
  shift: ShiftSlot
  shiftDuration: ShiftDuration
}

type TripSession = {
  progress: number
  batteryLevel: number
  currentSpeed: number
  eta: string
  pickupCompleted: boolean
  distanceCovered: number
  status: 'draft' | 'active' | 'completed'
}

type TripSummary = {
  totalDistance: number
  totalDuration: string
  driverRating: number
  customerFeedback: string
  fareAmount: number
  batteryConsumed: number
  carbonSavings: string
}

type InvoiceState = {
  invoiceNumber: string
  walletBalance: number
  pendingSettlements: number
  settlementComplete: boolean
}

type FleetOpsContextType = {
  bookingDraft: BookingDraft
  setBookingDraft: (draft: BookingDraft) => void
  assignment: Assignment
  setAssignment: (assignment: Assignment) => void
  fleetVehicles: FleetVehicleRecord[]
  fleetDrivers: FleetDriverRecord[]
  selectedVehicleForKycId: string | null
  setSelectedVehicleForKycId: (vehicleId: string | null) => void
  selectedDriverForKycId: string | null
  setSelectedDriverForKycId: (driverId: string | null) => void
  registerVehicle: (payload: RegisterVehiclePayload) => { ok: boolean; message: string; vehicleId?: string }
  completeVehicleKyc: (vehicleId: string, docs: VehicleKycDocuments) => { ok: boolean; message: string }
  addDriver: (payload: AddDriverPayload) => { ok: boolean; message: string; driverId?: string }
  updateDriver: (driverId: string, payload: Partial<AddDriverPayload>) => { ok: boolean; message: string }
  removeDriver: (driverId: string) => { ok: boolean; message: string }
  assignDriverShift: (payload: AssignShiftPayload) => { ok: boolean; message: string }
  completeDriverKyc: (driverId: string, docs: DriverKycDocuments) => { ok: boolean; message: string }
  getVehicleDrivers: (vehicleId: string) => FleetDriverRecord[]
  dashboardMetrics: {
    totalVehicles: number
    totalDrivers: number
    activeDrivers: number
    assignedDrivers: number
    pendingKyc: number
    vehicleDriverMapping: { vehicleId: string; vehicleNumber: string; drivers: string[] }[]
  }
  shiftSlots: ShiftSlot[]
  shiftDurations: ShiftDuration[]
  currentVehicle: Vehicle
  currentDriver: Driver
  tripSession: TripSession
  updateTripSession: (session: Partial<TripSession> | ((previous: TripSession) => Partial<TripSession>)) => void
  startTrip: () => void
  completeTrip: (summary: TripSummary) => void
  tripSummary: TripSummary | null
  invoiceState: InvoiceState
  completeSettlement: () => void
  resetOperations: () => void
  nxlTokens: number
  setNxlTokens: (tokens: number) => void
  useNxlTokens: boolean
  setUseNxlTokens: (use: boolean) => void
  earnNxlTokens: (fare: number) => void
  redeemNxlTokens: (fare: number) => number
}

const defaultVehicle = vehicles.find(vehicle => vehicle.status !== 'maintenance') ?? vehicles[0]
const defaultDriver = drivers.find(driver => driver.availability !== 'off-duty') ?? drivers[0]
const shiftSlots: ShiftSlot[] = ['Morning shift', 'Evening shift', 'Night shift']
const shiftDurations: ShiftDuration[] = ['6 hour shift', '8 hour shift']

const seededDrivers: FleetDriverRecord[] = drivers.map((driver, index) => ({
  ...driver,
  driverId: driver.id,
  vehicleId: driver.assignedVehicleId,
  mobileNumber: driver.phone.replace(/\D/g, '').slice(-10),
  aadhaarNumber: `1122${String(index + 1).padStart(8, '0')}`,
  shift: driver.availability === 'on-trip' ? 'Morning shift' : driver.availability === 'available' ? 'Evening shift' : null,
  shiftDuration: driver.availability === 'off-duty' ? null : '8 hour shift',
  verificationStatus: driver.availability === 'off-duty' ? 'under-review' : 'verified',
  bankDetails: 'ICICI • 8942',
  emergencyContact: '9000090000',
  kycStatus: driver.availability === 'off-duty' ? 'in-review' : 'verified',
  kycDocuments: driver.availability === 'off-duty'
    ? null
    : {
        aadhaarCard: 'aadhaar.pdf',
        drivingLicense: 'license.pdf',
        profilePhoto: 'profile.jpg',
        bankProof: 'bank-proof.pdf',
      },
}))

const seededVehicles: FleetVehicleRecord[] = vehicles.map((vehicle) => {
  const assignedIds = seededDrivers.filter((driver) => driver.vehicleId === vehicle.id).map((driver) => driver.id)
  const fallbackAssigned = vehicle.driverId && !assignedIds.includes(vehicle.driverId) ? [vehicle.driverId] : []
  const driverIds = [...assignedIds, ...fallbackAssigned]

  return {
    ...vehicle,
    vehicleId: vehicle.id,
    vehicleNumber: vehicle.number,
    fleetManagerId: 'fleet-manager-1',
    driverIds,
    kycStatus: 'pending',
    verificationStatus: 'not-started',
    kycDocuments: null,
  }
})

const initialBookingDraft: BookingDraft = {
  pickupLocation: 'Bandra West Metro Station',
  dropLocation: 'Mumbai Airport Terminal 2',
  passengerName: 'Aarav Mehta',
  contactNumber: '9876543210',
  vehicleType: 'Premium EV Sedan',
  estimatedFare: 780,
  distance: 18.6,
  scheduledAt: 'Today, 05:30 PM',
  priority: true,
  paymentMethod: 'Corporate wallet',
}

const initialTripSession: TripSession = {
  progress: 18,
  batteryLevel: defaultVehicle.battery,
  currentSpeed: 42,
  eta: '18 mins',
  pickupCompleted: true,
  distanceCovered: 3.4,
  status: 'draft',
}

const initialInvoiceState: InvoiceState = {
  invoiceNumber: 'INV-FLEET-2026-001',
  walletBalance: 184500,
  pendingSettlements: 3,
  settlementComplete: false,
}

const FleetOpsContext = createContext<FleetOpsContextType | undefined>(undefined)

export function FleetOpsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)
  const [bookingDraft, setBookingDraftState] = useState<BookingDraft>(initialBookingDraft)
  const [assignment, setAssignmentState] = useState<Assignment>({ vehicleId: defaultVehicle.id, driverId: defaultDriver.id })
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicleRecord[]>(seededVehicles)
  const [fleetDrivers, setFleetDrivers] = useState<FleetDriverRecord[]>(seededDrivers)
  const [selectedVehicleForKycId, setSelectedVehicleForKycId] = useState<string | null>(seededVehicles[0]?.id ?? null)
  const [selectedDriverForKycId, setSelectedDriverForKycId] = useState<string | null>(seededDrivers[0]?.id ?? null)
  const [tripSession, setTripSession] = useState<TripSession>(initialTripSession)
  const [tripSummary, setTripSummary] = useState<TripSummary | null>(null)
  const [invoiceState, setInvoiceState] = useState<InvoiceState>(initialInvoiceState)

  // Load data on user change
  useEffect(() => {
    setIsLoaded(false)
    if (!user?.email) {
      setFleetVehicles([])
      setFleetDrivers([])
      return
    }

    (async () => {
      try {
        const vehiclesRaw = await AsyncStorage.getItem(`@energeia_vehicles_user_${user.email}`)
        const driversRaw = await AsyncStorage.getItem(`@energeia_drivers_user_${user.email}`)
        
        let loadedVehicles = seededVehicles
        let loadedDrivers = seededDrivers

        if (vehiclesRaw) {
          loadedVehicles = JSON.parse(vehiclesRaw)
        }
        if (driversRaw) {
          loadedDrivers = JSON.parse(driversRaw)
        }

        setFleetVehicles(loadedVehicles)
        setFleetDrivers(loadedDrivers)

        if (loadedVehicles.length > 0 && loadedDrivers.length > 0) {
          setAssignmentState({
            vehicleId: loadedVehicles[0].id,
            driverId: loadedDrivers[0].id
          })
        }
      } catch (e) {
        console.warn('Failed to load user-specific fleet data', e)
      } finally {
        setIsLoaded(true)
      }
    })()
  }, [user?.email])

  // Save vehicles when they change
  useEffect(() => {
    if (isLoaded && user?.email) {
      AsyncStorage.setItem(`@energeia_vehicles_user_${user.email}`, JSON.stringify(fleetVehicles)).catch(() => {})
    }
  }, [fleetVehicles, user?.email, isLoaded])

  // Save drivers when they change
  useEffect(() => {
    if (isLoaded && user?.email) {
      AsyncStorage.setItem(`@energeia_drivers_user_${user.email}`, JSON.stringify(fleetDrivers)).catch(() => {})
    }
  }, [fleetDrivers, user?.email, isLoaded])
  const currentVehicle = useMemo(() => fleetVehicles.find(vehicle => vehicle.id === assignment.vehicleId) ?? defaultVehicle, [assignment.vehicleId, fleetVehicles])
  const currentDriver = useMemo(() => fleetDrivers.find(driver => driver.id === assignment.driverId) ?? defaultDriver, [assignment.driverId, fleetDrivers])

  const dashboardMetrics = useMemo(() => {
    const pendingVehicleKyc = fleetVehicles.filter((vehicle) => vehicle.kycStatus !== 'verified').length
    const pendingDriverKyc = fleetDrivers.filter((driver) => driver.kycStatus !== 'verified').length

    return {
      totalVehicles: fleetVehicles.length,
      totalDrivers: fleetDrivers.length,
      activeDrivers: fleetDrivers.filter((driver) => driver.availability !== 'off-duty').length,
      assignedDrivers: fleetDrivers.filter((driver) => Boolean(driver.vehicleId)).length,
      pendingKyc: pendingVehicleKyc + pendingDriverKyc,
      vehicleDriverMapping: fleetVehicles.map((vehicle) => ({
        vehicleId: vehicle.id,
        vehicleNumber: vehicle.number,
        drivers: fleetDrivers
          .filter((driver) => vehicle.driverIds.includes(driver.id))
          .map((driver) => `${driver.name}${driver.shift ? ` (${driver.shift})` : ''}`),
      })),
    }
  }, [fleetDrivers, fleetVehicles])

  function setBookingDraft(draft: BookingDraft) {
    setBookingDraftState(draft)
  }

  function setAssignment(nextAssignment: Assignment) {
    setAssignmentState(nextAssignment)
  }

  function getVehicleDrivers(vehicleId: string) {
    return fleetDrivers.filter((driver) => driver.vehicleId === vehicleId)
  }

  function registerVehicle(payload: RegisterVehiclePayload) {
    const normalizedVehicleNumber = payload.vehicleNumber.trim().toUpperCase()
    if (!normalizedVehicleNumber) {
      return { ok: false, message: 'Vehicle number is required.' }
    }

    if (fleetVehicles.some((vehicle) => vehicle.number.toUpperCase() === normalizedVehicleNumber)) {
      return { ok: false, message: 'Duplicate vehicle number is not allowed.' }
    }

    const nextVehicleId = `vehicle-${Date.now()}`
    const newVehicle: FleetVehicleRecord = {
      ...defaultVehicle,
      id: nextVehicleId,
      vehicleId: nextVehicleId,
      name: `${payload.model} - Fleet`,
      model: payload.model,
      number: normalizedVehicleNumber,
      vehicleNumber: normalizedVehicleNumber,
      location: payload.location.trim() || 'Fleet Depot',
      imageLabel: payload.imageLabel.trim() || 'Fleet EV vehicle',
      driverId: '',
      driverName: 'Unassigned',
      driverIds: [],
      status: 'available',
      tripStatus: 'Ready for assignment',
      fleetManagerId: 'fleet-manager-1',
      kycStatus: 'pending',
      verificationStatus: 'not-started',
      kycDocuments: null,
      battery: 100,
    }

    setFleetVehicles((previous) => [newVehicle, ...previous])
    setSelectedVehicleForKycId(nextVehicleId)
    return { ok: true, message: 'Vehicle registered. Continue with vehicle KYC.', vehicleId: nextVehicleId }
  }

  function completeVehicleKyc(vehicleId: string, docs: VehicleKycDocuments) {
    if (!docs.rcBook || !docs.insurance || !docs.pollutionCertificate || !docs.vehicleImage) {
      return { ok: false, message: 'All vehicle KYC uploads are required.' }
    }

    setFleetVehicles((previous) =>
      previous.map((vehicle) =>
        vehicle.id === vehicleId
          ? {
              ...vehicle,
              kycDocuments: docs,
              kycStatus: 'verified',
              verificationStatus: 'approved',
            }
          : vehicle,
      ),
    )

    return { ok: true, message: 'Vehicle KYC completed successfully.' }
  }

  function addDriver(payload: AddDriverPayload) {
    const name = payload.driverName.trim()
    const mobile = payload.mobileNumber.replace(/\D/g, '')
    const aadhaar = payload.aadhaarNumber.replace(/\D/g, '')
    const license = payload.licenseNumber.trim().toUpperCase()

    if (!name || !payload.bankDetails.trim() || !payload.emergencyContact.trim()) {
      return { ok: false, message: 'Driver profile fields are required.' }
    }
    if (mobile.length !== 10) {
      return { ok: false, message: 'Mobile number must be 10 digits.' }
    }
    if (aadhaar.length !== 12) {
      return { ok: false, message: 'Aadhaar number must be 12 digits.' }
    }
    if (fleetDrivers.some((driver) => driver.aadhaarNumber === aadhaar)) {
      return { ok: false, message: 'Duplicate Aadhaar is not allowed.' }
    }
    if (fleetDrivers.some((driver) => driver.licenseNumber.toUpperCase() === license)) {
      return { ok: false, message: 'Duplicate license number is not allowed.' }
    }

    const newDriverId = `driver-${Date.now()}`
    const newDriver: FleetDriverRecord = {
      ...defaultDriver,
      id: newDriverId,
      driverId: newDriverId,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@fleet.local`,
      phone: `+91 ${mobile}`,
      mobileNumber: mobile,
      aadhaarNumber: aadhaar,
      licenseNumber: license,
      bankDetails: payload.bankDetails.trim(),
      emergencyContact: payload.emergencyContact.trim(),
      assignedVehicleId: payload.vehicleId,
      vehicleId: payload.vehicleId,
      availability: payload.vehicleId ? 'available' : 'off-duty',
      shift: payload.shift,
      shiftDuration: payload.shiftDuration,
      verificationStatus: 'not-started',
      kycStatus: 'pending',
      kycDocuments: null,
      rating: 4.5,
      totalTrips: 0,
      profileImage: 'Driver profile',
      joinDate: new Date().toLocaleDateString('en-IN'),
    }

    setFleetDrivers((previous) => [newDriver, ...previous])
    setSelectedDriverForKycId(newDriverId)

    if (payload.vehicleId) {
      setFleetVehicles((previous) =>
        previous.map((vehicle) =>
          vehicle.id === payload.vehicleId
            ? {
                ...vehicle,
                driverIds: vehicle.driverIds.includes(newDriverId) ? vehicle.driverIds : [...vehicle.driverIds, newDriverId],
                driverName: vehicle.driverName === 'Unassigned' ? name : vehicle.driverName,
                driverId: vehicle.driverId || newDriverId,
              }
            : vehicle,
        ),
      )
    }

    return { ok: true, message: 'Driver added. Complete KYC for verification.', driverId: newDriverId }
  }

  function updateDriver(driverId: string, payload: Partial<AddDriverPayload>) {
    const existingDriver = fleetDrivers.find((driver) => driver.id === driverId)
    if (!existingDriver) {
      return { ok: false, message: 'Driver not found.' }
    }

    const nextAadhaar = payload.aadhaarNumber ? payload.aadhaarNumber.replace(/\D/g, '') : existingDriver.aadhaarNumber
    const nextLicense = payload.licenseNumber ? payload.licenseNumber.trim().toUpperCase() : existingDriver.licenseNumber

    if (
      fleetDrivers.some((driver) => driver.id !== driverId && driver.aadhaarNumber === nextAadhaar)
    ) {
      return { ok: false, message: 'Duplicate Aadhaar is not allowed.' }
    }

    if (
      fleetDrivers.some((driver) => driver.id !== driverId && driver.licenseNumber.toUpperCase() === nextLicense)
    ) {
      return { ok: false, message: 'Duplicate license number is not allowed.' }
    }

    setFleetDrivers((previous) =>
      previous.map((driver) => {
        if (driver.id !== driverId) {
          return driver
        }

        const updatedName = payload.driverName?.trim() || driver.name
        const updatedVehicleId = payload.vehicleId === undefined ? driver.vehicleId : payload.vehicleId

        return {
          ...driver,
          name: updatedName,
          mobileNumber: payload.mobileNumber ? payload.mobileNumber.replace(/\D/g, '').slice(-10) : driver.mobileNumber,
          phone: payload.mobileNumber ? `+91 ${payload.mobileNumber.replace(/\D/g, '').slice(-10)}` : driver.phone,
          aadhaarNumber: nextAadhaar,
          licenseNumber: nextLicense,
          bankDetails: payload.bankDetails?.trim() || driver.bankDetails,
          emergencyContact: payload.emergencyContact?.trim() || driver.emergencyContact,
          vehicleId: updatedVehicleId,
          assignedVehicleId: updatedVehicleId,
          shift: payload.shift === undefined ? driver.shift : payload.shift,
          shiftDuration: payload.shiftDuration === undefined ? driver.shiftDuration : payload.shiftDuration,
        }
      }),
    )

    return { ok: true, message: 'Driver updated successfully.' }
  }

  function removeDriver(driverId: string) {
    const targetDriver = fleetDrivers.find((driver) => driver.id === driverId)
    if (!targetDriver) {
      return { ok: false, message: 'Driver not found.' }
    }

    setFleetDrivers((previous) => previous.filter((driver) => driver.id !== driverId))
    setFleetVehicles((previous) =>
      previous.map((vehicle) => {
        if (!vehicle.driverIds.includes(driverId)) {
          return vehicle
        }

        const remainingDriverIds = vehicle.driverIds.filter((id) => id !== driverId)
        const replacementDriver = fleetDrivers.find((driver) => remainingDriverIds.includes(driver.id))

        return {
          ...vehicle,
          driverIds: remainingDriverIds,
          driverId: replacementDriver?.id ?? '',
          driverName: replacementDriver?.name ?? 'Unassigned',
        }
      }),
    )

    if (assignment.driverId === driverId) {
      setAssignmentState({ vehicleId: defaultVehicle.id, driverId: defaultDriver.id })
    }

    return { ok: true, message: 'Driver removed from fleet.' }
  }

  function assignDriverShift(payload: AssignShiftPayload) {
    setFleetDrivers((previous) =>
      previous.map((driver) =>
        driver.id === payload.driverId
          ? {
              ...driver,
              vehicleId: payload.vehicleId,
              assignedVehicleId: payload.vehicleId,
              shift: payload.shift,
              shiftDuration: payload.shiftDuration,
              availability: 'available',
            }
          : driver,
      ),
    )

    setFleetVehicles((previous) =>
      previous.map((vehicle) => {
        if (vehicle.id !== payload.vehicleId) {
          return vehicle
        }

        const driver = fleetDrivers.find((item) => item.id === payload.driverId)
        return {
          ...vehicle,
          driverIds: vehicle.driverIds.includes(payload.driverId) ? vehicle.driverIds : [...vehicle.driverIds, payload.driverId],
          driverId: vehicle.driverId || payload.driverId,
          driverName: vehicle.driverName === 'Unassigned' ? driver?.name ?? 'Assigned Driver' : vehicle.driverName,
        }
      }),
    )

    return { ok: true, message: 'Shift assigned successfully.' }
  }

  function completeDriverKyc(driverId: string, docs: DriverKycDocuments) {
    if (!docs.aadhaarCard || !docs.drivingLicense || !docs.profilePhoto || !docs.bankProof) {
      return { ok: false, message: 'All driver KYC uploads are required.' }
    }

    setFleetDrivers((previous) =>
      previous.map((driver) =>
        driver.id === driverId
          ? {
              ...driver,
              kycDocuments: docs,
              kycStatus: 'verified',
              verificationStatus: 'verified',
            }
          : driver,
      ),
    )

    return { ok: true, message: 'Driver KYC completed successfully.' }
  }

  function updateTripSession(session: Partial<TripSession> | ((previous: TripSession) => Partial<TripSession>)) {
    setTripSession(previous => {
      const nextSession = typeof session === 'function' ? session(previous) : session
      return { ...previous, ...nextSession }
    })
  }

  function startTrip() {
    setTripSession(previous => ({
      ...previous,
      status: 'active',
      pickupCompleted: true,
      progress: Math.max(previous.progress, 28),
    }))
  }

  const [nxlTokens, setNxlTokens] = useState(250) // start with a welcome gift of 250 NXL tokens
  const [useNxlTokens, setUseNxlTokens] = useState(false)

  // Load NXL tokens on user change
  useEffect(() => {
    if (user?.email) {
      AsyncStorage.getItem(`@energeia_nxl_tokens_${user.email}`).then((val) => {
        if (val) {
          setNxlTokens(Number(val))
        } else {
          setNxlTokens(250)
        }
      })
    }
  }, [user?.email])

  // Save NXL tokens when they change
  useEffect(() => {
    if (user?.email) {
      AsyncStorage.setItem(`@energeia_nxl_tokens_${user.email}`, String(nxlTokens)).catch(() => {})
    }
  }, [nxlTokens, user?.email])

  function earnNxlTokens(fare: number) {
    const earned = Math.round(fare * 0.05)
    setNxlTokens(prev => prev + earned)
  }

  function redeemNxlTokens(fare: number): number {
    if (!useNxlTokens) return 0
    const discount = Math.min(nxlTokens, fare)
    setNxlTokens(prev => prev - discount)
    setUseNxlTokens(false)
    return discount
  }

  function completeTrip(summary: TripSummary) {
    setTripSummary(summary)
    setTripSession(previous => ({
      ...previous,
      status: 'completed',
      progress: 100,
      currentSpeed: 0,
      eta: 'Arrived',
      batteryLevel: Math.max(previous.batteryLevel - summary.batteryConsumed, 0),
      distanceCovered: summary.totalDistance,
    }))
    // Automatically award 5% cashback in NXL tokens on completion
    earnNxlTokens(summary.fareAmount)
  }

  function completeSettlement() {
    setInvoiceState(previous => ({
      ...previous,
      settlementComplete: true,
      pendingSettlements: Math.max(previous.pendingSettlements - 1, 0),
    }))
  }

  function resetOperations() {
    setBookingDraftState(initialBookingDraft)
    setAssignmentState({ vehicleId: defaultVehicle.id, driverId: defaultDriver.id })
    setFleetVehicles(seededVehicles)
    setFleetDrivers(seededDrivers)
    setSelectedVehicleForKycId(seededVehicles[0]?.id ?? null)
    setSelectedDriverForKycId(seededDrivers[0]?.id ?? null)
    setTripSession(initialTripSession)
    setTripSummary(null)
    setInvoiceState(initialInvoiceState)
    setUseNxlTokens(false)
  }

  return (
    <FleetOpsContext.Provider
      value={{
        bookingDraft,
        setBookingDraft,
        assignment,
        setAssignment,
        fleetVehicles,
        fleetDrivers,
        selectedVehicleForKycId,
        setSelectedVehicleForKycId,
        selectedDriverForKycId,
        setSelectedDriverForKycId,
        registerVehicle,
        completeVehicleKyc,
        addDriver,
        updateDriver,
        removeDriver,
        assignDriverShift,
        completeDriverKyc,
        getVehicleDrivers,
        dashboardMetrics,
        shiftSlots,
        shiftDurations,
        currentVehicle,
        currentDriver,
        tripSession,
        updateTripSession,
        startTrip,
        completeTrip,
        tripSummary,
        invoiceState,
        completeSettlement,
        resetOperations,
        nxlTokens,
        setNxlTokens,
        useNxlTokens,
        setUseNxlTokens,
        earnNxlTokens,
        redeemNxlTokens,
      }}
    >
      {children}
    </FleetOpsContext.Provider>
  )
}

export function useFleetOps() {
  const context = useContext(FleetOpsContext)
  if (!context) {
    throw new Error('useFleetOps must be used within FleetOpsProvider')
  }
  return context
}

export default function FleetOpsContextRoute() {
  return null
}
