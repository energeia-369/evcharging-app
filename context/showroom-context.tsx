import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { showroomVehicles } from '../lib/mock/showroomData'

export type BookingDraft = {
  vehicleId: string
  showroomId: string
  date: string
  time: string
  name: string
  phone: string
  address: string
  notes: string
  variant: string
  color: string
  financing: string
  exchangeVehicle: string
  deliveryLocation: string
}

type ShowroomContextValue = {
  selectedVehicleId: string
  setSelectedVehicleId: (id: string) => void
  favorites: string[]
  toggleFavorite: (vehicleId: string) => void
  compareList: string[]
  toggleCompare: (vehicleId: string) => void
  bookingDraft: BookingDraft
  updateBookingDraft: (patch: Partial<BookingDraft>) => void
}

const ShowroomContext = createContext<ShowroomContextValue | undefined>(undefined)

const defaultDraft: BookingDraft = {
  vehicleId: showroomVehicles[0]?.id || '',
  showroomId: 's1',
  date: '',
  time: '',
  name: '',
  phone: '',
  address: '',
  notes: '',
  variant: 'Standard',
  color: 'Forest Green',
  financing: 'Standard EMI',
  exchangeVehicle: 'No',
  deliveryLocation: 'Home Delivery',
}

export function ShowroomProvider({ children }: { children: React.ReactNode }) {
  const [selectedVehicleId, setSelectedVehicleId] = useState(defaultDraft.vehicleId)
  const [favorites, setFavorites] = useState<string[]>([])
  const [compareList, setCompareList] = useState<string[]>([])
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>(defaultDraft)

  const toggleFavorite = useCallback((vehicleId: string) => {
    setFavorites((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]
    )
  }, [])

  const toggleCompare = useCallback((vehicleId: string) => {
    setCompareList((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId].slice(0, 3)
    )
  }, [])

  const updateBookingDraft = useCallback((patch: Partial<BookingDraft>) => {
    setBookingDraft((prev) => ({ ...prev, ...patch }))
  }, [])

  const value = useMemo(
    () => ({
      selectedVehicleId,
      setSelectedVehicleId,
      favorites,
      toggleFavorite,
      compareList,
      toggleCompare,
      bookingDraft,
      updateBookingDraft,
    }),
    [selectedVehicleId, favorites, toggleFavorite, compareList, toggleCompare, bookingDraft, updateBookingDraft]
  )

  return <ShowroomContext.Provider value={value}>{children}</ShowroomContext.Provider>
}

export function useShowroom() {
  const value = useContext(ShowroomContext)
  if (!value) {
    throw new Error('useShowroom must be used within ShowroomProvider')
  }
  return value
}
