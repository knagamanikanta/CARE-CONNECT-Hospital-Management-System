export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Patient extends User {
  dob: string;
  bloodGroup: string;
  address: string;
  medicalHistory: string[];
}

export interface Doctor extends User {
  specialization: string;
  experienceYears: number;
  fee: number;
  availableSlots: string[]; // ISO Date strings or patterns
  bio: string;
  rating: number;
  patientsCount: number;
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DECLINED = 'DECLINED',
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string; // Denormalized for ease
  doctorName: string; // Denormalized for ease
  date: string; // ISO string
  timeSlot: string;
  status: AppointmentStatus;
  type: 'In-Person' | 'Video';
  notes?: string;
  paymentStatus: 'PAID' | 'UNPAID';
  amount: number;
}

export interface ReportStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  revenue: number;
  monthlyData: { name: string; appointments: number; revenue: number }[];
}
