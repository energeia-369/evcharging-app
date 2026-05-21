import { Stack } from 'expo-router'
import React from 'react'
import { ShowroomProvider } from '../../context/showroom-context'

export default function ShowroomLayout() {
  return (
    <ShowroomProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ShowroomProvider>
  )
}
