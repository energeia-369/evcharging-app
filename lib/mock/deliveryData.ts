export type DeliveryStep = {
  key: string
  title: string
  detail: string
  icon: string
}

export const deliveryTimeline: DeliveryStep[] = [
  { key: 'processing', title: 'Vehicle Processing', detail: 'Assembly and final QA checks underway.', icon: 'cog-outline' },
  { key: 'registered', title: 'Registration Completed', detail: 'Vehicle registration and paperwork completed.', icon: 'file-document-check' },
  { key: 'ready', title: 'Ready For Delivery', detail: 'Vehicle prepared and staged for handover.', icon: 'garage' },
  { key: 'out', title: 'Out For Delivery', detail: 'Delivery executive en route to customer location.', icon: 'truck-fast' },
  { key: 'delivered', title: 'Delivered', detail: 'Vehicle handed over to the customer.', icon: 'check-decagram' },
]

export const initialDeliveryState = {
  currentStep: 0,
  etaMinutes: 42,
  executive: {
    name: 'Rahul Verma',
    phone: '+91 90000 44444',
    vehicle: 'Royal Enfield EV-01',
    avatarColor: '#10B981',
  },
  location: {
    address: 'Plot 12, Palm Street, Mumbai - 400001',
    eta: '42 mins',
  },
}
