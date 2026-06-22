import React, { createContext, useContext, useState } from 'react'
import { ChargingSession, Driver, Vehicle } from '../lib/mock/fleetData'

type FleetContextValue = {
  selectedVehicle: Vehicle | null
  setSelectedVehicle: (vehicle: Vehicle) => void
  selectedDriver: Driver | null
  setSelectedDriver: (driver: Driver) => void
  activeChargingSession: ChargingSession | null
  setActiveChargingSession: (session: ChargingSession) => void
  trackingVehicleId: string | null
  setTrackingVehicleId: (id: string | null) => void
}

const FleetContext = createContext<FleetContextValue | null>(null)

export function FleetProvider({ children }: { children: React.ReactNode }) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [activeChargingSession, setActiveChargingSession] = useState<ChargingSession | null>(null)
  const [trackingVehicleId, setTrackingVehicleId] = useState<string | null>(null)

  const value = {
    selectedVehicle,
    setSelectedVehicle,
    selectedDriver,
    setSelectedDriver,
    activeChargingSession,
    setActiveChargingSession,
    trackingVehicleId,
    setTrackingVehicleId,
  }

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>
}

export function useFleetContext() {
  const context = useContext(FleetContext)
  if (!context) {
    throw new Error('useFleetContext must be used within FleetProvider')
  }
  return context
}
