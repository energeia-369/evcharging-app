import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { drivers, vehicles, type Driver, type Vehicle } from '../../lib/mock/fleetData'

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
}

type Assignment = {
  vehicleId: string
  driverId: string
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
}

const defaultVehicle = vehicles.find(vehicle => vehicle.status !== 'maintenance') ?? vehicles[0]
const defaultDriver = drivers.find(driver => driver.availability !== 'off-duty') ?? drivers[0]

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
  const [bookingDraft, setBookingDraftState] = useState<BookingDraft>(initialBookingDraft)
  const [assignment, setAssignmentState] = useState<Assignment>({ vehicleId: defaultVehicle.id, driverId: defaultDriver.id })
  const [tripSession, setTripSession] = useState<TripSession>(initialTripSession)
  const [tripSummary, setTripSummary] = useState<TripSummary | null>(null)
  const [invoiceState, setInvoiceState] = useState<InvoiceState>(initialInvoiceState)

  const currentVehicle = useMemo(() => vehicles.find(vehicle => vehicle.id === assignment.vehicleId) ?? defaultVehicle, [assignment.vehicleId])
  const currentDriver = useMemo(() => drivers.find(driver => driver.id === assignment.driverId) ?? defaultDriver, [assignment.driverId])

  function setBookingDraft(draft: BookingDraft) {
    setBookingDraftState(draft)
  }

  function setAssignment(nextAssignment: Assignment) {
    setAssignmentState(nextAssignment)
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
    setTripSession(initialTripSession)
    setTripSummary(null)
    setInvoiceState(initialInvoiceState)
  }

  return (
    <FleetOpsContext.Provider
      value={{
        bookingDraft,
        setBookingDraft,
        assignment,
        setAssignment,
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
