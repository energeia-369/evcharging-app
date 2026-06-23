import React, { createContext, useContext, useMemo, useState } from 'react'
import {
    BookingDraft,
    BookingRecord,
    createBookingFromDraft,
    defaultBookingDraft,
    seedHistoryBookings,
} from '../lib/mock/evServiceData'

type BookingContextValue = {
  draft: BookingDraft
  setDraft: React.Dispatch<React.SetStateAction<BookingDraft>>
  bookings: BookingRecord[]
  activeBookingId: string
  setActiveBookingId: React.Dispatch<React.SetStateAction<string>>
  activeBooking: BookingRecord | undefined
  createBooking: (overrides?: Partial<BookingDraft>) => BookingRecord
  updateBooking: (bookingId: string, patch: Partial<BookingRecord>) => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function EvServiceProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(defaultBookingDraft)
  const [bookings, setBookings] = useState<BookingRecord[]>(seedHistoryBookings)
  const [activeBookingId, setActiveBookingId] = useState('')

  const createBooking = (overrides: Partial<BookingDraft> = {}) => {
    const booking = createBookingFromDraft({ ...draft, ...overrides })
    setBookings(previous => [booking, ...previous])
    setActiveBookingId(booking.id)
    return booking
  }

  const updateBooking = (bookingId: string, patch: Partial<BookingRecord>) => {
    setBookings(previous => previous.map(booking => (booking.id === bookingId ? { ...booking, ...patch } : booking)))
  }

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      bookings,
      activeBookingId,
      setActiveBookingId,
      activeBooking: bookings.find(booking => booking.id === activeBookingId),
      createBooking,
      updateBooking,
    }),
    [activeBookingId, bookings, draft]
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useEvServiceBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useEvServiceBooking must be used within EvServiceProvider')
  }
  return context
}
