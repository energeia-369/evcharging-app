export type StaffMember = {
  id: string
  name: string
  role: 'Technician' | 'Sales Manager' | 'Service Advisor' | 'Dispatcher' | 'Admin'
  rating: number
  attendance: 'Present' | 'Absent' | 'On Leave'
  phone: string
  email: string
  performance: number // 0-100
}

export const staff: StaffMember[] = [
  { id: 'stf-01', name: 'Asha Kulkarni', role: 'Technician', rating: 4.9, attendance: 'Present', phone: '+91 90000 11111', email: 'asha.k@energeia.com', performance: 92 },
  { id: 'stf-02', name: 'Ravi Singh', role: 'Technician', rating: 4.7, attendance: 'Present', phone: '+91 90000 22222', email: 'ravi.s@energeia.com', performance: 86 },
  { id: 'stf-03', name: 'Neha Patil', role: 'Sales Manager', rating: 4.8, attendance: 'Present', phone: '+91 90000 33333', email: 'neha.p@energeia.com', performance: 89 },
  { id: 'stf-04', name: 'Sanjay Rao', role: 'Service Advisor', rating: 4.6, attendance: 'On Leave', phone: '+91 90000 44444', email: 'sanjay.r@energeia.com', performance: 78 },
  { id: 'stf-05', name: 'Priya Nair', role: 'Dispatcher', rating: 4.5, attendance: 'Present', phone: '+91 90000 55555', email: 'priya.n@energeia.com', performance: 80 },
  { id: 'stf-06', name: 'Rahul Verma', role: 'Technician', rating: 4.4, attendance: 'Absent', phone: '+91 90000 66666', email: 'rahul.v@energeia.com', performance: 72 },
  { id: 'stf-07', name: 'Maya Sharma', role: 'Sales Manager', rating: 4.9, attendance: 'Present', phone: '+91 90000 77777', email: 'maya.s@energeia.com', performance: 95 },
]
