import { serviceCenters } from '../lib/mock/evServiceData'

export const technicians = serviceCenters.flatMap(center =>
  center.technicians.map(t => ({ ...t, centerId: center.id, centerName: center.name }))
)

export type Technician = typeof technicians[number]
